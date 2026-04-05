export interface ComponentEntry {
  name: string;
  slug: string;
  category: "text" | "backgrounds" | "sections";
}

export const COMPONENTS: ComponentEntry[] = [
  { name: "Counter", slug: "counter", category: "text" },
  { name: "CircularGallery", slug: "circular-gallery", category: "sections" },
  { name: "InfiniteMenu", slug: "infinite-menu", category: "sections" },
  { name: "SoftAurora", slug: "soft-aurora", category: "backgrounds" },
  { name: "FlowingMenu", slug: "flowing-menu", category: "sections" },
  { name: "ShapeGrid", slug: "shape-grid", category: "backgrounds" },
];

export const CATEGORIES = ["text", "backgrounds", "sections"] as const;

export function getComponent(slug: string): ComponentEntry | undefined {
  return COMPONENTS.find((c) => c.slug === slug);
}
