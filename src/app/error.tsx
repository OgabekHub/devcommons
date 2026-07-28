'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Link } from '@/i18n/routing'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 inline-flex rounded-full bg-red-500/10 p-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        
        <h2 className="mb-4 text-2xl font-bold text-white">
          Xatolik yuz berdi
        </h2>
        
        <p className="mb-8 text-gray-400">
          Kutilmagan xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring yoki bosh sahifaga qayting.
        </p>

        {error.message && (
          <div className="mb-8 rounded-lg bg-red-500/10 border border-red-500/20 p-4">
            <p className="text-sm text-red-400 font-mono">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark"
          >
            <RefreshCw className="h-4 w-4" />
            Qayta urinish
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
          >
            <Home className="h-4 w-4" />
            Bosh sahifa
          </Link>
        </div>
      </div>
    </div>
  )
}
