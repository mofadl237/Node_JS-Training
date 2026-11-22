import CartSkeleton from "@/components/Skelton/CartSkeleton";

export default function CartLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <CartSkeleton />
    </div>
  );
}
