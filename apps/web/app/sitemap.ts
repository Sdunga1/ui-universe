import type { MetadataRoute } from "next";
import { getAllSlugs } from "../lib/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://uiuniverse.dev";

  const componentPages = getAllSlugs().map(({ category, component }) => ({
    url: `${baseUrl}/${category}/${component}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/evals`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/evals/compare`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...componentPages,
  ];
}
