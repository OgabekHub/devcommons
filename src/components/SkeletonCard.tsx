export default function SkeletonCard() {
  return (
    <div className="card p-5 border border-white/5 bg-white/5">
      <div className="mb-3 flex items-start justify-between">
        <div className="h-6 w-3/4 rounded-lg bg-white/10 animate-pulse" />
        <div className="h-6 w-16 rounded-lg bg-white/10 animate-pulse" />
      </div>
      <div className="mb-4 space-y-2">
        <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
        <div className="h-4 w-2/3 rounded bg-white/10 animate-pulse" />
      </div>
      <div className="mb-3 flex gap-2">
        <div className="h-5 w-16 rounded-md bg-white/10 animate-pulse" />
        <div className="h-5 w-16 rounded-md bg-white/10 animate-pulse" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-4 w-20 rounded bg-white/10 animate-pulse" />
        <div className="h-8 w-8 rounded-lg bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}
