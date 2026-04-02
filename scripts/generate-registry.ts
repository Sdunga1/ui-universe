import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import fg from "fast-glob";

interface Descriptor {
  name: string;
  slug: string;
  description: string;
  category: string;
  tags?: string[];
  props: Record<string, unknown>;
  aiPromptHint?: string;
  examples?: Array<{ title: string; code: string }>;
  recommendedWith?: string[];
}

const UI_SRC = resolve(process.cwd(), "packages/ui/src");
const OUT_DIR = resolve(process.cwd(), "apps/web/public");

function main() {
  console.log("\n  ui-universe — Registry Generator\n");

  const files = fg.sync(`${UI_SRC}/components/**/*.descriptor.json`);
  console.log(`  Found ${files.length} component descriptor(s)\n`);

  const descriptors: Descriptor[] = files.map((f) => {
    const content = readFileSync(f, "utf-8");
    return JSON.parse(content) as Descriptor;
  });

  // Generate registry.json — full index of all components
  const registry = descriptors.map((d) => ({
    name: d.name,
    slug: d.slug,
    description: d.description,
    category: d.category,
    tags: d.tags ?? [],
  }));

  writeFileSync(`${OUT_DIR}/registry.json`, `${JSON.stringify(registry, null, 2)}\n`);
  console.log(`  Written: ${OUT_DIR}/registry.json`);

  // Generate llms.txt — optimized for LLM context windows
  const llmsLines: string[] = [
    "# ui-universe Component Registry",
    `# Generated: ${new Date().toISOString()}`,
    `# Components: ${descriptors.length}`,
    "",
  ];

  for (const d of descriptors) {
    llmsLines.push(`## ${d.name} (${d.category}/${d.slug})`);
    llmsLines.push(d.description);
    if (d.aiPromptHint) {
      llmsLines.push(`AI Hint: ${d.aiPromptHint}`);
    }
    if (d.recommendedWith && d.recommendedWith.length > 0) {
      llmsLines.push(`Recommended with: ${d.recommendedWith.join(", ")}`);
    }
    if (d.props) {
      const propNames = Object.keys(d.props).join(", ");
      llmsLines.push(`Props: ${propNames}`);
    }
    if (d.examples && d.examples.length > 0) {
      for (const ex of d.examples) {
        llmsLines.push(`Example (${ex.title}):`);
        llmsLines.push(ex.code);
      }
    }
    llmsLines.push("");
  }

  writeFileSync(`${OUT_DIR}/llms.txt`, llmsLines.join("\n"));
  console.log(`  Written: ${OUT_DIR}/llms.txt`);
  console.log("");
}

main();
