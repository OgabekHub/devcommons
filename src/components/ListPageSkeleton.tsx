import SkeletonCard from "@/components/SkeletonCard";

/**
 * List sahifalari uchun umumiy loading skeleti
 * (route-level loading.tsx fayllarida qayta ishlatiladi).
 */
export default function ListPageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-500 px-4 py-8">
      <div className="mb-8">
        <div className="mb-4 h-10 w-64 rounded-lg bg-ink/10 animate-pulse" />
        <div className="h-5 w-full max-w-xl rounded bg-ink/10 animate-pulse" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
