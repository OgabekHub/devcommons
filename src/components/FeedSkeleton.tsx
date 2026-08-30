export default function FeedSkeleton() {
  return (
    <div className="space-y-6">
      {/* Tab buttons skeleton */}
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 w-24 rounded-lg bg-ink/5 animate-pulse" />
        ))}
      </div>

      {/* Activity items skeleton */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="flex items-start gap-4">
              {/* Avatar skeleton */}
              <div className="h-10 w-10 rounded-full bg-ink/10" />
              
              <div className="flex-1 space-y-3">
                {/* User info skeleton */}
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 rounded bg-ink/10" />
                  <div className="h-3 w-16 rounded bg-ink/5" />
                </div>
                
                {/* Title skeleton */}
                <div className="h-5 w-3/4 rounded bg-ink/10" />
                
                {/* Description skeleton */}
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-ink/5" />
                  <div className="h-4 w-2/3 rounded bg-ink/5" />
                </div>
                
                {/* Actions skeleton */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="h-8 w-20 rounded-lg bg-ink/5" />
                  <div className="h-8 w-20 rounded-lg bg-ink/5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
