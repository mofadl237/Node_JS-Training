import { BrandLoader } from "@/components/shared/BrandLoader";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 py-16">
      <BrandLoader />
    </div>
  );
}
