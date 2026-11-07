import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sajjadzx.github.io/VERTEX";
  const locales = ["en", "fa"];
  const routes = [
    "",
    "/elevators",
    "/escalators",
    "/configurator",
    "/engineering",
    "/projects",
    "/maintenance",
    "/about",
    "/contact",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  return entries;
}
