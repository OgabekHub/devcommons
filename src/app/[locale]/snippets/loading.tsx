import SkeletonCard from "@/components/SkeletonCard";
import { Search, Plus } from "lucide-react";

export default function SnippetsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-500">
      <div className="mb-8 md:mb-12">
        <div className="mb-4 inline-flex items-center rounded-full border border-white/5 bg-white/5 px-3 py-1">
          <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
        </div>
        <div className="mb-4 h-12 w-3/4 rounded-lg bg-white/10 animate-pulse md:h-14 lg:h-16" />
        <div className="space-y-2">
          <div className="h-5 w-full max-w-2xl rounded bg-white/10 animate-pulse" />
          <div className="h-5 w-2/3 max-w-xl rounded bg-white/10 animate-pulse" />
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <div className="h-11 w-full rounded-xl border border-white/10 bg-white/5" />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="h-11 w-32 rounded-xl border border-white/10 bg-white/5" />
          <div className="h-11 w-40 rounded-xl bg-brand/50" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
