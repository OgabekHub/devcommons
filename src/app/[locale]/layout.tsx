import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DevCommons — Dasturchilar uchun ochiq resurs hub",
  description:
    "Kod snippet'lar, AI prompt'lar va tajriba almashish platformasi. Bepul, ochiq, hammaga.",
};

import InteractiveTour from "@/components/InteractiveTour";
import FeedbackWidget from "@/components/FeedbackWidget";

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} overflow-x-hidden`}>
      <body className={`${inter.className} overflow-x-hidden relative`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <InteractiveTour />
          <Header />
          <main className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 lg:px-12">{children}</main>
          <FeedbackWidget />
          <Footer />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
