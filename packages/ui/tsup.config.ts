import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    animations: "src/components/animations/index.ts",
    backgrounds: "src/components/backgrounds/index.ts",
    sections: "src/components/sections/index.ts",
    text: "src/components/text/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom", "motion", "tailwindcss"],
  banner: {
    js: '"use client";',
  },
});
