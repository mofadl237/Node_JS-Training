import AccountSkeleton from "@/components/Skelton/AccountSkeleton";

export default function AccountLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8" aria-hidden="true">
      <AccountSkeleton />
    </div>
  );
}
