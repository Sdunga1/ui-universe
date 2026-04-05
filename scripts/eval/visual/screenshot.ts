/**
 * Visual Eval Pipeline
 *
 * Takes AI-generated code from eval results, renders each snippet in
 * a real browser via Vite + Playwright, and captures screenshots.
 *
 * Usage:
 *   pnpm eval:visual                    # screenshots for comparative eval
 *   pnpm eval:visual -- --source=original  # screenshots for original eval
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { chromium } from "playwright";
import { type InlineConfig, type ViteDevServer, createServer } from "vite";

const ROOT = resolve(process.cwd());
const RESULTS_DIR = resolve(ROOT, "scripts/eval/results");
const FIXTURES_DIR = resolve(ROOT, "scripts/eval/fixtures");
const SCREENSHOTS_DIR = resolve(ROOT, "scripts/eval/visual/screenshots");
// Place temp dir at monorepo root so it inherits node_modules resolution
const TEMP_DIR = resolve(ROOT, ".tmp-visual-render");

// ── Helpers ──

function extractCode(output: string): string {
  // The output may contain nested code fences. Find the outermost one.
  const lines = output.split("\n");
  let inBlock = false;
  let lang = "";
  const codeLines: string[] = [];

  for (const line of lines) {
    if (!inBlock && /^```(?:tsx?|jsx?)/.test(line.trim())) {
      inBlock = true;
      lang = line.trim();
      continue;
    }
    if (inBlock && line.trim() === "```") {
      // End of the outermost block
      break;
    }
    if (inBlock) {
      codeLines.push(line);
    }
  }

  if (codeLines.length > 0) {
    return codeLines.join("\n").trim();
  }

  // Fallback: return the whole output
  return output.trim();
}

function slugify(s: string): string {
  return s.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
}

/**
 * Transforms generated code so it works as a renderable module.
 * - Replaces relative component imports with our temp component path
 * - Strips `export default` and wraps in a named export
 * - Handles both `import X from './X'` and `import { X } from '@ui-universe/ui'`
 */
function prepareUsageCode(code: string, componentName: string): string {
  // Replace all import paths that reference the component to use our temp file
  let prepared = code;

  // Handle: import X from './X' or import X from "./X"
  prepared = prepared.replace(
    new RegExp(`from\\s+['"]\\.\\/.*?${componentName}.*?['"]`, "g"),
    `from './Component'`,
  );

  // Handle: import { X } from '@ui-universe/ui'  →  import X from './Component'
  prepared = prepared.replace(
    /import\s*\{[^}]*\}\s*from\s*['"]@ui-universe\/ui['"]/g,
    `import Component from './Component'`,
  );

  // If it still imports the component name from a package, redirect
  prepared = prepared.replace(
    new RegExp(`from\\s+['"][^'"]*${componentName}[^'"]*['"]`, "gi"),
    `from './Component'`,
  );

  return prepared;
}

/**
 * Creates a temporary Vite project that renders a single component.
 */
function writeRenderProject(
  componentName: string,
  componentSource: string,
  usageCode: string,
  label: string,
): string {
  const projectDir = resolve(TEMP_DIR, slugify(`${componentName}-${label}`));
  if (existsSync(projectDir)) rmSync(projectDir, { recursive: true });
  mkdirSync(projectDir, { recursive: true });

  // 1. Component source file
  writeFileSync(resolve(projectDir, "Component.tsx"), componentSource);

  // 2. Usage code (the AI-generated snippet)
  const preparedUsage = prepareUsageCode(usageCode, componentName);
  writeFileSync(resolve(projectDir, "Usage.tsx"), preparedUsage);

  // 3. Entry point that renders the usage
  const entryCode = `
import React from 'react';
import { createRoot } from 'react-dom/client';

// Error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error: error.message };
  }
  render() {
    if (this.state.error) {
      return React.createElement('div', {
        style: {
          padding: '2rem',
          color: '#ef4444',
          fontFamily: 'monospace',
          fontSize: '14px',
          background: '#0a0a0a',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }
      }, 'Render Error: ' + this.state.error);
    }
    return this.props.children;
  }
}

// Dynamic import of the usage code
const UsageModule = await import('./Usage.tsx');
const UsageComponent = UsageModule.default || UsageModule.Example || (() => React.createElement('div', null, 'No default export found'));

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  React.createElement(ErrorBoundary, null,
    React.createElement('div', {
      style: {
        background: '#0a0a0a',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        color: '#e5e5e5',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }
    },
      React.createElement('div', {
        style: { width: '100%', maxWidth: '800px' }
      },
        React.createElement(UsageComponent)
      )
    )
  )
);

// Signal to Playwright that rendering is done
window.__RENDER_DONE__ = true;
`;

  writeFileSync(resolve(projectDir, "main.jsx"), entryCode);

  // 4. index.html
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${componentName} - ${label}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0a; color: #e5e5e5; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./main.jsx"></script>
</body>
</html>`;

  writeFileSync(resolve(projectDir, "index.html"), html);

  return projectDir;
}

// ── Vite Server ──

async function startViteServer(projectDir: string): Promise<ViteDevServer> {
  const config: InlineConfig = {
    root: projectDir,
    configFile: false,
    plugins: [react()],
    server: {
      port: 0, // random available port
      strictPort: false,
      host: "127.0.0.1",
      hmr: false,
    },
    logLevel: "silent",
  };

  const server = await createServer(config);
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
  mkdirSync(TEMP_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2,
  });

  let success = 0;
  let failed = 0;

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const code = extractCode(result.output);
    const label = `${result.prompt}-${result.condition}`;
    const screenshotName = `${slugify(result.component)}-${slugify(label)}.png`;
    const screenshotPath = resolve(SCREENSHOTS_DIR, screenshotName);

    // Skip if code is too short (likely truncated/invalid)
    if (code.length < 30) {
      console.log(`  [${i + 1}/${results.length}] SKIP ${result.component} / ${label} (too short)`);
      failed++;
      continue;
    }

    console.log(`  [${i + 1}/${results.length}] ${result.component} / ${label}`);

    // Find component source
    let componentSource = "";
    if (sourceType === "comparative") {
      // Map component name to fixture slug (e.g. "ShapeGrid" → "shape-grid")
      const fixtureSlug = result.component
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/^-/, "");
      const fixturePath = resolve(FIXTURES_DIR, `${fixtureSlug}.source.tsx`);
      if (existsSync(fixturePath)) {
        componentSource = readFileSync(fixturePath, "utf-8");
      } else {
        console.log(`    ⚠ No fixture found for ${result.component}, skipping`);
        failed++;
        continue;
      }
    } else {
      // Original eval — our ui-universe components
      const uiSrc = resolve(ROOT, "packages/ui/src/components");
      // Try to find the component source
      const searchDirs = ["animations", "text", "backgrounds", "sections"];
      for (const dir of searchDirs) {
        const slug = result.component
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase()
          .replace(/^-/, "");
        const candidate = resolve(uiSrc, dir, slug, `${slug}.tsx`);
        if (existsSync(candidate)) {
          componentSource = readFileSync(candidate, "utf-8");
          break;
        }
      }
      if (!componentSource) {
        console.log(`    ⚠ Could not find source for ${result.component}, skipping`);
        failed++;
        continue;
      }
    }

    let server: ViteDevServer | null = null;
    try {
      const projectDir = writeRenderProject(result.component, componentSource, code, label);
      server = await startViteServer(projectDir);

      const address = server.httpServer?.address();
      if (!address || typeof address === "string") {
        throw new Error("Could not get server address");
      }
      const url = `http://127.0.0.1:${address.port}`;

      const page = await context.newPage();

      // Navigate and wait for render
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });

      // Wait a bit for animations to settle
      await page.waitForTimeout(1500);

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
      await page.close();

      console.log(`    ✓ Saved: ${screenshotName}`);
      success++;
    } catch (err) {
      console.log(`    ✗ Failed: ${(err as Error).message.slice(0, 120)}`);
      failed++;
    } finally {
      if (server) {
        await server.close();
      }
    }
  }

  // Cleanup temp directory
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true });
  }

  await context.close();
  await browser.close();

  console.log(`\n  Done: ${success} screenshots, ${failed} failed`);
  console.log(`  Screenshots: ${SCREENSHOTS_DIR}\n`);
}

// ── Main ──

async function main() {
  const sourceArg = process.argv.find((a) => a.startsWith("--source="))?.split("=")[1];
  const isOriginal = sourceArg === "original";

  if (isOriginal) {
    // Screenshot the original eval (ui-universe components)
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
    // Screenshot the comparative eval (external components)
    const claudeFile = readdirSync(RESULTS_DIR)
      .filter((f) => f.includes("comparative-claude") && f.endsWith(".json"))
      .sort()
      .reverse()[0];

    if (!claudeFile) {
      console.error("No comparative results found. Run `pnpm eval:comparative` first.");
      process.exit(1);
    }

    const report = JSON.parse(readFileSync(resolve(RESULTS_DIR, claudeFile), "utf-8"));

    // Filter to components most likely to render successfully
    // Counter + ShapeGrid are pure React/Canvas, no WebGL deps
    const renderableComponents = ["Counter", "ShapeGrid", "SoftAurora"];
    const filtered = report.results.filter(
      (r: EvalResult) => renderableComponents.includes(r.component) && r.prompt === "basic-usage",
    );

    console.log(
      `  Filtering to ${filtered.length} renderable results (${renderableComponents.join(", ")}, basic-usage only)`,
    );

    await screenshotResults(filtered, "comparative");
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
