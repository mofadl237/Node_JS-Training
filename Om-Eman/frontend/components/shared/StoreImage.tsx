"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface IProps {
  src: string | null;
  alt: string;
  sizes: string;
  className?: string;
  preload?: boolean;
}

export const StoreImage = ({ src, alt, sizes, className, preload }: IProps) => {
  // 1- state
  const [hasError, setHasError] = useState(false);

  // 3- render
  if (!src || hasError) {
    return (
      <div className={cn("absolute inset-0 flex items-center justify-center bg-surface-2", className)}>
        <ImageOff aria-hidden="true" className="size-8 text-ink-soft" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};
