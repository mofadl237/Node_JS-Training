import CheckoutSuccessSkeleton from "@/components/Skelton/CheckoutSuccessSkeleton";

export default function CheckoutSuccessLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8" aria-hidden="true">
      <CheckoutSuccessSkeleton />
    </div>
  );
}
