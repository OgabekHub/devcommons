'use client'

// This error boundary is intentionally minimal.
// The main error boundary is at src/app/[locale]/error.tsx
// This file catches errors OUTSIDE the [locale] segment (rare edge cases).

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Something went wrong</h2>
        <button
          onClick={reset}
          style={{ padding: '0.75rem 1.5rem', background: '#6C5CE7', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
