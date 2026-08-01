import React from "react";
import { setRequestLocale } from "next-intl/server";
import PromptPlayground from "@/components/PromptPlayground";
import type { Metadata } from "next";

interface Props {
  params: { locale: string };
  searchParams: { prompt_id?: string; snippet_id?: string };
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  setRequestLocale(locale);
  const title = "Prompt Playground & AI Laboratory | DevCommons";
  const description = "Test how your prompts, .cursorrules, and AI agent instructions perform with real-time LLM simulation right inside DevCommons without leaving the browser!";

  const ogUrl = new URL("https://devcommons.uz/api/og");
  ogUrl.searchParams.set("title", "Prompt Playground & AI Studio");
  ogUrl.searchParams.set("category", "AI Laboratory");
  ogUrl.searchParams.set("badge", "🧪 Live AI Simulator");
  ogUrl.searchParams.set("author", "DevCommons Infrastructure");

  return {
    title,
    description,
    keywords: ["Prompt Playground", "AI Simulator", "Cursor Rules", "DevCommons", "LLM Testing", "Prompt Engineering"],
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://devcommons.uz/playground",
      siteName: "DevCommons",
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl.toString()],
    },
  };
}

export default function PlaygroundPage({ params: { locale } }: Props) {
  setRequestLocale(locale);

  return (
    <div className="container mx-auto max-w-[1440px] px-4 py-8 pb-20 md:px-8 lg:px-12">
      <PromptPlayground />
    </div>
  );
}
