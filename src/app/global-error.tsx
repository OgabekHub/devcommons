'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the critical error to console and potentially to an error reporting service
    console.error('Global critical error:', error)
  }, [error])

  return (
    <html lang="uz">
      <body style={{
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A0A0A',
        padding: '1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{ maxWidth: '28rem', width: '100%', textAlign: 'center' }}>
          <div style={{
            marginBottom: '2rem',
            display: 'inline-flex',
            borderRadius: '9999px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            padding: '1rem',
          }}>
            <svg
              style={{ height: '3rem', width: '3rem', color: '#ef4444' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h2 style={{
            marginBottom: '1rem',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#ffffff',
          }}>
            Kritik xatolik
          </h2>

          <p style={{
            marginBottom: '2rem',
            color: '#9ca3af',
            lineHeight: 1.6,
          }}>
            Ilova ishlashni to&apos;xtatdi. Iltimos, sahifani yangilang yoki administrator bilan bog&apos;laning.
          </p>

          {error.digest && (
            <p style={{
              marginBottom: '1.5rem',
              fontSize: '0.75rem',
              color: '#6b7280',
              fontFamily: 'monospace',
            }}>
              Error ID: {error.digest}
            </p>
          )}

          <button
            onClick={() => reset()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              borderRadius: '0.75rem',
              backgroundColor: '#6C5CE7',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#5A4BD1')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#6C5CE7')}
          >
            Sahifani yangilash
          </button>
        </div>
      </body>
    </html>
  )
}
