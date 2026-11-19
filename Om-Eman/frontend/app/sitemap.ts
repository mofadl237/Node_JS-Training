import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { ar: `${SITE_URL}/ar`, en: `${SITE_URL}/en` };

  return [
    {
      url: `${SITE_URL}/ar`,
      changeFrequency: "daily",
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${SITE_URL}/en`,
      changeFrequency: "daily",
      priority: 1,
      alternates: { languages },
    },
  ];
}
