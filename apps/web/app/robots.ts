import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/lab"],
      },
    ],
    sitemap: "https://uiuniverse.dev/sitemap.xml",
  };
}
