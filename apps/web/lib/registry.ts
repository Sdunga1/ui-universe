import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import fg from "fast-glob";

export interface ComponentDescriptor {
  name: string;
  slug: string;
  description: string;
  category: string;
  tags?: string[];
  since?: string;
  props: Record<
    string,
    {
      type: string;
      required?: boolean;
      default?: unknown;
      description: string;
      enum?: string[];
      min?: number;
      max?: number;
    }
  >;
  variants?: Record<string, unknown>;
  motionPreset?: string;
  dependencies?: {
    runtime?: string[];
    peer?: string[];
    optional?: string[];
  };
  recommendedWith?: string[];
  aiPromptHint?: string;
  examples?: Array<{
    title: string;
    code: string;
    description?: string;
  }>;
}

interface RegistryEntry {
  descriptor: ComponentDescriptor;
  filePath: string;
}

const UI_PACKAGE_PATH = resolve(process.cwd(), "../../packages/ui/src");

function loadDescriptors(): RegistryEntry[] {
  const pattern = `${UI_PACKAGE_PATH}/components/**/*.descriptor.json`;
  const files = fg.sync(pattern);

  return files.map((filePath) => {
    const content = readFileSync(filePath, "utf-8");
    const descriptor = JSON.parse(content) as ComponentDescriptor;
    return { descriptor, filePath };
  });
}

let cachedRegistry: RegistryEntry[] | null = null;

export function getRegistry(): RegistryEntry[] {
  if (!cachedRegistry) {
    cachedRegistry = loadDescriptors();
  }
  return cachedRegistry;
}

export function getRegistryByCategory(): Record<string, ComponentDescriptor[]> {
  const entries = getRegistry();
  const byCategory: Record<string, ComponentDescriptor[]> = {};

  for (const entry of entries) {
    const cat = entry.descriptor.category;
    if (!byCategory[cat]) {
      byCategory[cat] = [];
    }
    byCategory[cat].push(entry.descriptor);
  }

  return byCategory;
}

export function getComponentBySlug(
  category: string,
  slug: string,
): ComponentDescriptor | undefined {
  const entries = getRegistry();
  return entries.find((e) => e.descriptor.category === category && e.descriptor.slug === slug)
    ?.descriptor;
}

export function getAllSlugs(): Array<{ category: string; component: string }> {
  return getRegistry().map((e) => ({
    category: e.descriptor.category,
    component: e.descriptor.slug,
  }));
}
