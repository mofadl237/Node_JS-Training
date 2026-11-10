export type {
  ICreateBannerInput,
  IListBannerQuery,
  IUpdateBannerInput,
} from "./validation.js";

export interface IBannerResponse {
  id: string;
  titleAr: string;
  titleEn: string | null;
  imageUrl: string;
  mobileImageUrl: string | null;
  linkUrl: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
