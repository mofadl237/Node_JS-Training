import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/ar`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      alternates: { languages: { en: `${SITE_URL}/en` } },
    },
  ];
}
