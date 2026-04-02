import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import * as readline from "node:readline";

const CATEGORIES = ["animations", "backgrounds", "sections", "text"] as const;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

function toPascalCase(str: string): string {
  return str
    .split(/[-\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

async function main() {
  console.log("\n  ui-universe — New Component Generator\n");

  const rawName = await ask("  Component name (PascalCase, e.g., GlowCard): ");
  const name = toPascalCase(rawName);
  const slug = toKebabCase(rawName);

  console.log(`\n  Categories: ${CATEGORIES.join(", ")}`);
  const category = (await ask("  Category: ")) as (typeof CATEGORIES)[number];

  if (!CATEGORIES.includes(category)) {
    console.error(`  Invalid category. Must be one of: ${CATEGORIES.join(", ")}`);
    process.exit(1);
  }

  const description = await ask("  Description (one line): ");

  rl.close();

  const dir = resolve(process.cwd(), `packages/ui/src/components/${category}/${slug}`);
  mkdirSync(dir, { recursive: true });

  // Component file
  const componentContent = `"use client";

import type { MotionPresetName } from "@ui-universe/tokens";
import { motion } from "motion/react";
import { type ComponentPropsWithoutRef, forwardRef, useRef } from "react";
import { useInView } from "../../../hooks/use-in-view";
import { useMotionPreset } from "../../../hooks/use-motion-preset";
import { cn } from "../../../lib/utils";

export interface ${name}Props extends ComponentPropsWithoutRef<"div"> {
  /** Motion preset from the token system. */
  preset?: MotionPresetName;
  /** Custom delay in milliseconds. */
  delay?: number;
  /** Animate when element enters viewport. Defaults to true. */
  triggerOnView?: boolean;
  /** Fraction of element visible before triggering (0-1). */
  viewThreshold?: number;
}

export const ${name} = forwardRef<HTMLDivElement, ${name}Props>(
  (
    {
      preset = "fadeUp",
      delay,
      triggerOnView = true,
      viewThreshold = 0.2,
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) ?? internalRef;

    const isInView = useInView(ref, { threshold: viewThreshold, once: true });
    const motionValues = useMotionPreset({ preset, delay });

    const shouldAnimate = triggerOnView ? isInView : true;

    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        initial={motionValues.initial}
        animate={shouldAnimate ? motionValues.animate : motionValues.initial}
        transition={motionValues.transition}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

${name}.displayName = "${name}";
`;

  // Descriptor file
  const descriptorContent = {
    $schema: "../../../schemas/component-descriptor.schema.json",
    name,
    slug,
    description,
    category,
    tags: [],
    since: "0.1.0",
    props: {
      children: {
        type: "ReactNode",
        required: true,
        description: "Content to render",
      },
      preset: {
        type: "MotionPresetName",
        required: false,
        default: "fadeUp",
        description: "Motion preset from the token system",
      },
      delay: {
        type: "number",
        required: false,
        description: "Custom delay in milliseconds",
      },
      triggerOnView: {
        type: "boolean",
        required: false,
        default: true,
        description: "Animate when element enters viewport",
      },
      viewThreshold: {
        type: "number",
        required: false,
        default: 0.2,
        min: 0,
        max: 1,
        description: "Fraction of element visible before triggering",
      },
      className: {
        type: "string",
        required: false,
        description: "Additional Tailwind classes",
      },
    },
    variants: {},
    motionPreset: "fadeUp",
    dependencies: {
      runtime: ["motion/react", "@ui-universe/tokens"],
      peer: ["react", "react-dom"],
    },
    recommendedWith: [],
    aiPromptHint: `Use ${name} for ...`,
    examples: [
      {
        title: "Basic usage",
        code: `<${name}>\n  <div>Your content here</div>\n</${name}>`,
      },
    ],
  };

  // Test file
  const testContent = `import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ${name} } from "./${slug}";

vi.mock("motion/react", () => ({
  motion: {
    div: vi.fn().mockImplementation(({ children, ...props }) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    )),
  },
}));

describe("${name}", () => {
  it("renders children", () => {
    render(
      <${name} triggerOnView={false}>
        <span>Hello</span>
      </${name}>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <${name} triggerOnView={false} className="mt-8">
        <span>Content</span>
      </${name}>,
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper.className).toContain("mt-8");
  });
});
`;

  // Index file
  const indexContent = `export { ${name}, type ${name}Props } from "./${slug}";\n`;

  writeFileSync(`${dir}/${slug}.tsx`, componentContent);
  writeFileSync(
    `${dir}/${slug}.descriptor.json`,
    `${JSON.stringify(descriptorContent, null, 2)}\n`,
  );
  writeFileSync(`${dir}/${slug}.test.tsx`, testContent);
  writeFileSync(`${dir}/index.ts`, indexContent);

  console.log(`\n  Created ${name} component at:`);
  console.log(`  ${dir}/`);
  console.log(`    ├── ${slug}.tsx`);
  console.log(`    ├── ${slug}.descriptor.json`);
  console.log(`    ├── ${slug}.test.tsx`);
  console.log("    └── index.ts");
  console.log(
    `\n  Don't forget to add the export to packages/ui/src/components/${category}/index.ts\n`,
  );
}

main();
