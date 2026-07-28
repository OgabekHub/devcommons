'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8 inline-flex rounded-full bg-red-500/10 p-4">
              <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h2 className="mb-4 text-2xl font-bold text-white">
              Kritik xatolik
            </h2>
            
            <p className="mb-8 text-gray-400">
              Ilova ishlashni to'xtatdi. Iltimos, sahifani yangilang yoki administrator bilan bog'laning.
            </p>

            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark"
            >
              Sahifani yangilash
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
