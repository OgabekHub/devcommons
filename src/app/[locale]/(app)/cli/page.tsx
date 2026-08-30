import React from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import CLIEmulator from "@/components/CLIEmulator";
import { Terminal, Cpu, ShieldCheck, Zap, ArrowRight, Layers } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  setRequestLocale(locale);
  const title = "DevCommons CLI, IDE Extensions & MCP Server | DevCommons";
  const description = "Bring decentralized AI context directly into your command line, Cursor, VS Code, and Claude Desktop via the Model Context Protocol (MCP)!";

  const ogUrl = new URL("https://devcommons.uz/api/og");
  ogUrl.searchParams.set("title", "CLI & IDE Integrations");
  ogUrl.searchParams.set("category", "Agent Terminal Hub");
  ogUrl.searchParams.set("badge", "⚡ Model Context Protocol (MCP)");
  ogUrl.searchParams.set("author", "DevCommons CLI");

  return {
    title,
    description,
    keywords: ["CLI", "Cursor Extension", "VS Code", "MCP Server", "Model Context Protocol", "Claude Code", "DevCommons", "Agent Infrastructure"],
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://devcommons.uz/cli",
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
  };
}

export default async function CLIPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("CLI");

  return (
    <div className="container mx-auto max-w-[1380px] px-4 py-12 pb-24 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="mb-14 text-center">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-4 py-2 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-cyan-400">
          <Terminal className="h-4 w-4 text-cyan-400 animate-bounce" />
          <span>Autonomous Agent Terminal & IDE Integration</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-fg sm:text-5xl lg:text-6xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base md:text-lg">
          {t("subtitle")}
        </p>

        {/* Feature Pill Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-zinc-300">
          <span className="flex items-center gap-1.5 rounded-xl bg-ink/5 px-3 py-2 border border-line">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>1-Click Terminal Synchronization</span>
          </span>
          <span className="flex items-center gap-1.5 rounded-xl bg-ink/5 px-3 py-2 border border-line">
            <Cpu className="h-4 w-4 text-purple-400" />
            <span>Cursor & VS Code Command Palette</span>
          </span>
          <span className="flex items-center gap-1.5 rounded-xl bg-ink/5 px-3 py-2 border border-line">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>Claude Desktop MCP Protocol</span>
          </span>
          <span className="flex items-center gap-1.5 rounded-xl bg-ink/5 px-3 py-2 border border-line">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Zero Hallucinated Boilerplate</span>
          </span>
        </div>
      </div>

      {/* Interactive CLI Emulator & Configuration Center */}
      <CLIEmulator />

      {/* Deep Dive Cards into Core Integrations */}
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <div className="rounded-3xl border border-line bg-gradient-to-b from-[#0A0D16] to-[#07090E] p-7 shadow-xl hover:border-cyan-500/40 transition">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-5">
            <Terminal className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-fg">{t("card_cli_title")}</h3>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {t("card_cli_desc")}
          </p>
          <div className="mt-5 font-mono text-xs text-cyan-300 bg-ink/5 p-3 rounded-xl border border-line">
            $ npx -y @devcommons/cli pull clean-arch
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-gradient-to-b from-[#0A0D16] to-[#07090E] p-7 shadow-xl hover:border-purple-500/40 transition">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-5">
            <Cpu className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-fg">{t("card_ide_title")}</h3>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {t("card_ide_desc")}
          </p>
          <div className="mt-5 flex items-center justify-between text-xs text-purple-300 font-bold bg-ink/5 p-3 rounded-xl border border-line">
            <span>VS Code / Cursor Extension</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-gradient-to-b from-[#0A0D16] to-[#07090E] p-7 shadow-xl hover:border-emerald-500/40 transition">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-5">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-fg">{t("card_mcp_title")}</h3>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {t("card_mcp_desc")}
          </p>
          <div className="mt-5 font-mono text-[11px] text-emerald-300 bg-ink/5 p-3 rounded-xl border border-line truncate">
            https://devcommons.uz/api/v1/mcp
          </div>
        </div>
      </div>
    </div>
  );
}
