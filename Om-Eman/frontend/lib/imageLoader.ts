"use client";

export default function storeImageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}): string {
  const match = src.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(v\d+\/.+)$/);
  if (!match) return src;
  return `${match[1]}c_limit,w_${width},f_auto,q_auto/${match[2]}`;
}
