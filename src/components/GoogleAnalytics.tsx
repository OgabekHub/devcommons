'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    gtag?: (..._args: any[]) => void
    dataLayer?: any[]
  }
}

function GoogleAnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  // gtag.js skriptini FAQAT bir marta yuklaymiz (ilgari har navigatsiyada
  // qayta yuklanib, ikki marta sanaydigan edi).
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return
    if (document.getElementById('ga-gtag-script')) return

    const script = document.createElement('script')
    script.id = 'ga-gtag-script'
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    script.async = true
    document.head.appendChild(script)

    window.gtag = window.gtag || function (...args: any[]) {
      (window.dataLayer = window.dataLayer || []).push(args)
    }
    window.gtag('js', new Date())
    // send_page_view: false — sahifa ko'rinishini quyidagi effekt boshqaradi.
    window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })
  }, [GA_MEASUREMENT_ID])

  // Route o'zgarishida bitta page_view yuboramiz.
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return
    const qs = searchParams.toString()
    const url = qs ? `${pathname}?${qs}` : pathname
    window.gtag('event', 'page_view', { page_path: url })
  }, [pathname, searchParams, GA_MEASUREMENT_ID])

  return null
}

export default function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsTracker />
    </Suspense>
  )
}
