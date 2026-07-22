import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// Lazy-load heavy client components that are NOT needed for initial paint
const InteractiveTour = dynamic(() => import("@/components/InteractiveTour"), { ssr: false });
const FeedbackWidget  = dynamic(() => import("@/components/FeedbackWidget"),  { ssr: false });
const AiAssistant     = dynamic(() => import("@/components/AiAssistant"),     { ssr: false });

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",        // Prevents layout shift from font loading
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "arial"],  // Fallback reduces CLS
});

export const metadata: Metadata = {
  title: "DevCommons — Dasturchilar uchun ochiq resurs hub",
  description:
    "Kod snippet'lar, AI prompt'lar va tajriba almashish platformasi. Bepul, ochiq, hammaga.",
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} overflow-x-hidden`}>
      <head>
        {/* Preconnect to critical third-party domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
      </head>
      <body className={`${inter.className} overflow-x-hidden relative`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 lg:px-12">{children}</main>
          <Footer />
          {/* Deferred components — loaded after main content */}
          <InteractiveTour />
          <FeedbackWidget />
          <AiAssistant />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
