import type { EContentStatus } from "@prisma/client";
export type {
  ICreateStaticPageInput,
  IListStaticPageQuery,
  IUpdateStaticPageInput,
} from "./validation.js";

export interface IStaticPageResponse {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string | null;
  bodyAr: string;
  bodyEn: string | null;
  status: EContentStatus;
  seoTitleAr: string | null;
  seoTitleEn: string | null;
  seoDescriptionAr: string | null;
  seoDescriptionEn: string | null;
  canonicalUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
