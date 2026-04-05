/**
 * Visual Eval Pipeline
 *
 * Uses a persistent Vite render-app to render AI-generated code snippets
 * and capture screenshots via Playwright.
 *
 * Usage:
 *   pnpm eval:visual                       # screenshots for comparative eval
 *   pnpm eval:visual -- --source=original  # screenshots for original eval
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { type ViteDevServer, createServer } from "vite";

const ROOT = resolve(process.cwd());
const RESULTS_DIR = resolve(ROOT, "scripts/eval/results");
const FIXTURES_DIR = resolve(ROOT, "scripts/eval/fixtures");
const SCREENSHOTS_DIR = resolve(ROOT, "scripts/eval/visual/screenshots");
const RENDER_APP_DIR = resolve(ROOT, "scripts/eval/visual/render-app");
const RENDER_DIR = resolve(RENDER_APP_DIR, "_render");

// ── Helpers ──

function extractCode(output: string): string {
  const lines = output.split("\n");
  let inBlock = false;
  const codeLines: string[] = [];

  for (const line of lines) {
    if (!inBlock && /^```(?:tsx?|jsx?)/.test(line.trim())) {
      inBlock = true;
      continue;
    }
    if (inBlock && line.trim() === "```") {
      break;
    }
    if (inBlock) {
      codeLines.push(line);
    }
  }

  if (codeLines.length > 0) {
    return codeLines.join("\n").trim();
  }

  return output.trim();
}

function slugify(s: string): string {
  return s.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
}

/**
 * Transforms generated code so imports resolve to the _render/Component file.
 */
function prepareUsageCode(code: string, componentName: string): string {
  let prepared = code;

  // import X from './X' → import X from './Component'
  prepared = prepared.replace(
    new RegExp(`from\\s+['"]\\.\\/.*?${componentName}.*?['"]`, "g"),
    `from './Component'`,
  );

  // import { X } from '@ui-universe/ui' → import Component from './Component'
  prepared = prepared.replace(
    /import\s*\{[^}]*\}\s*from\s*['"]@ui-universe\/ui['"]/g,
    `import Component from './Component'`,
  );

  // Any remaining imports of the component name from packages
  prepared = prepared.replace(
    new RegExp(`from\\s+['"][^'"]*${componentName}[^'"]*['"]`, "gi"),
    `from './Component'`,
  );

  return prepared;
}

/** Creates a minimal valid GLB binary that Three.js GLTFLoader can parse. */
function makeMinimalGLB(): Buffer {
  const json = '{"asset":{"version":"2.0"},"scenes":[{"nodes":[]}],"scene":0}';
  const paddedLen = Math.ceil(json.length / 4) * 4;
  const jsonPadded = json.padEnd(paddedLen, " ");
  const jsonBytes = Buffer.from(jsonPadded, "utf-8");
  const totalLen = 12 + 8 + jsonBytes.length;
  const buf = Buffer.alloc(totalLen);
  buf.writeUInt32LE(0x46546c67, 0); // magic "glTF"
  buf.writeUInt32LE(2, 4); // version 2
  buf.writeUInt32LE(totalLen, 8);
  buf.writeUInt32LE(jsonBytes.length, 12);
  buf.writeUInt32LE(0x4e4f534a, 16); // chunk type "JSON"
  jsonBytes.copy(buf, 20);
  return buf;
}

/**
 * Finds the component source file for a given eval result.
 */
function findComponentSource(
  componentName: string,
  sourceType: "comparative" | "original",
): string | null {
  if (sourceType === "comparative") {
    const fixtureSlug = componentName
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .replace(/^-/, "");
    const fixturePath = resolve(FIXTURES_DIR, `${fixtureSlug}.source.tsx`);
    if (existsSync(fixturePath)) {
      return readFileSync(fixturePath, "utf-8");
    }
    return null;
  }

  // Original eval — ui-universe components
  const uiSrc = resolve(ROOT, "packages/ui/src/components");
  const searchDirs = ["animations", "text", "backgrounds", "sections"];
  const slug = componentName
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");

  for (const dir of searchDirs) {
    const candidate = resolve(uiSrc, dir, slug, `${slug}.tsx`);
    if (existsSync(candidate)) {
      return readFileSync(candidate, "utf-8");
    }
  }

  return null;
}

// ── Vite Server ──

async function startRenderAppServer(): Promise<ViteDevServer> {
  const server = await createServer({
    root: RENDER_APP_DIR,
    configFile: resolve(RENDER_APP_DIR, "vite.config.ts"),
  });
  await server.listen();
  return server;
}

// ── Screenshot Pipeline ──

interface EvalResult {
  component: string;
  prompt: string;
  condition: string;
  output: string;
}

async function screenshotResults(results: EvalResult[], sourceType: "comparative" | "original") {
  console.log(`\n  Visual Eval — Screenshotting ${results.length} results\n`);

  mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  mkdirSync(RENDER_DIR, { recursive: true });

  // 1. Start the persistent render-app Vite server (single cold start)
  console.log("  Starting render-app server...");
  const startTime = Date.now();
  const server = await startRenderAppServer();
  const address = server.httpServer?.address();
  if (!address || typeof address === "string") {
    throw new Error("Could not get render-app server address");
  }
  const baseUrl = `http://127.0.0.1:${(address as { port: number }).port}`;
  console.log(`  Server ready at ${baseUrl} (${Date.now() - startTime}ms)\n`);

  // 2. Launch browser with WebGL support
  const browser = await chromium.launch({
    headless: true,
    args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  });

  // Pre-create a single page with GLB/GLTF route interception
  const page = await context.newPage();
  await page.route("**/*.glb", (route) => {
    route.fulfill({ body: makeMinimalGLB(), contentType: "model/gltf-binary" });
  });
  await page.route("**/*.gltf", (route) => {
    route.fulfill({
      body: JSON.stringify({ asset: { version: "2.0" }, scenes: [{ nodes: [] }], scene: 0 }),
      contentType: "model/gltf+json",
    });
  });

  let success = 0;
  let failed = 0;

  // 3. Loop through results — write files, reload, screenshot
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const code = extractCode(result.output);
    const label = `${result.prompt}-${result.condition}`;
    const screenshotName = `${slugify(result.component)}-${slugify(label)}.png`;
    const screenshotPath = resolve(SCREENSHOTS_DIR, screenshotName);

    if (code.length < 30) {
      console.log(`  [${i + 1}/${results.length}] SKIP ${result.component} / ${label} (too short)`);
      failed++;
      continue;
    }

    console.log(`  [${i + 1}/${results.length}] ${result.component} / ${label}`);

    // Find component source
    const componentSource = findComponentSource(result.component, sourceType);
    if (!componentSource) {
      console.log(`    ⚠ No source found for ${result.component}, skipping`);
      failed++;
      continue;
    }

    try {
      // Write component + usage to _render/
      writeFileSync(resolve(RENDER_DIR, "Component.tsx"), componentSource);
      writeFileSync(resolve(RENDER_DIR, "Usage.tsx"), prepareUsageCode(code, result.component));

      // Invalidate Vite's module graph so it serves fresh files
      server.moduleGraph.invalidateAll();

      // Small delay for file system to settle before navigation
      await new Promise((r) => setTimeout(r, 100));

      // Navigate (full page load picks up the new files)
      await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 25000 });

      // Wait for animations and WebGL to initialize
      await page.waitForTimeout(3000);

      // Check for render errors
      const hasError = await page.evaluate(() => {
        const el = document.querySelector("#root");
        return el?.textContent?.includes("Render Error") ?? false;
      });

      if (hasError) {
        const errorText = await page.evaluate(
          () => document.querySelector("#root")?.textContent ?? "",
        );
        console.log(`    ✗ Render error: ${errorText.slice(0, 100)}`);
      }

      await page.screenshot({ path: screenshotPath, type: "png" });
      console.log(`    ✓ Saved: ${screenshotName}`);
      success++;
    } catch (err) {
      console.log(`    ✗ Failed: ${(err as Error).message.slice(0, 120)}`);
      failed++;
    }
  }

  // 4. Cleanup
  await page.close();
  await context.close();
  await browser.close();
  await server.close();

  console.log(`\n  Done: ${success} screenshots, ${failed} failed`);
  console.log(`  Screenshots: ${SCREENSHOTS_DIR}\n`);
}

// ── Main ──

async function main() {
  const sourceArg = process.argv.find((a) => a.startsWith("--source="))?.split("=")[1];
  const isOriginal = sourceArg === "original";

  if (isOriginal) {
    const files = readdirSync(RESULTS_DIR)
      .filter((f) => f.startsWith("eval-") && f.endsWith(".json") && !f.includes("comparative"))
      .sort()
      .reverse();

    if (files.length === 0) {
      console.error("No original eval results found. Run `pnpm eval` first.");
      process.exit(1);
    }

    const report = JSON.parse(readFileSync(resolve(RESULTS_DIR, files[0]), "utf-8"));
    await screenshotResults(report.results, "original");
  } else {
    const claudeFile = readdirSync(RESULTS_DIR)
      .filter((f) => f.includes("comparative-claude") && f.endsWith(".json"))
      .sort()
      .reverse()[0];

    if (!claudeFile) {
      console.error("No comparative results found. Run `pnpm eval:comparative` first.");
      process.exit(1);
    }

    const report = JSON.parse(readFileSync(resolve(RESULTS_DIR, claudeFile), "utf-8"));

    const filtered = report.results.filter((r: EvalResult) => r.prompt === "basic-usage");

    console.log(`  Screenshotting ${filtered.length} basic-usage results (all components)`);

    await screenshotResults(filtered, "comparative");
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
