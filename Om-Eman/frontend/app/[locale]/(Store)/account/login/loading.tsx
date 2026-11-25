import AccountSkeleton from "@/components/Skelton/AccountSkeleton";

export default function LoginLoading() {
  return (
    <div className="mx-auto max-w-xl px-4 py-8" aria-hidden="true">
      <AccountSkeleton />
    </div>
  );
}
