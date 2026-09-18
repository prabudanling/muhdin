/**
 * Task 18 — sitemap.xml. Konten portal memakai hash routing (#/…)
 * sehingga hanya URL root yang dapat diindeks per halaman.
 */
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://muhdin.web.id").replace(/\/+$/, "");
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
