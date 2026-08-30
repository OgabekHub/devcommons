import React from "react";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";
import { setRequestLocale } from "next-intl/server";

export default function MarketingLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between">
      <div>
        <MarketingHeader />
        <main className="mx-auto max-w-[1440px] px-4 pt-0 pb-12 md:px-8 lg:px-12">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
