import TrackSkeleton from "@/components/Skelton/TrackSkeleton";

export default function TrackLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8" aria-hidden="true">
      <TrackSkeleton />
    </div>
  );
}
