export default function TagsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="text-center space-y-3">
        <div className="mx-auto h-8 w-32 rounded-lg bg-white/10 animate-pulse" />
        <div className="mx-auto h-4 w-64 rounded bg-white/5 animate-pulse" />
      </div>

      {/* Tags grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="space-y-3">
              {/* Tag name skeleton */}
              <div className="h-6 w-24 rounded-lg bg-white/10" />
              
              {/* Stats skeleton */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="h-3 w-12 rounded bg-white/5 mb-1" />
                  <div className="h-5 w-16 rounded bg-white/10" />
                </div>
                <div className="flex-1">
                  <div className="h-3 w-12 rounded bg-white/5 mb-1" />
                  <div className="h-5 w-16 rounded bg-white/10" />
                </div>
              </div>
              
              {/* Total skeleton */}
              <div className="pt-2 border-t border-white/10">
                <div className="h-4 w-20 rounded bg-white/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
