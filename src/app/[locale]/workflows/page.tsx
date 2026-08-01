import React from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import PromptChainViewer, { StepItem } from "@/components/PromptChainViewer";
import SkillBundleCard, { BundleItem } from "@/components/SkillBundleCard";
import { Layers, Package, Sparkles, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  setRequestLocale(locale);
  const title = "AI Workflows, Prompt Chains & Skill Bundles | DevCommons";
  const description = "Explore multi-step cascading AI workflows and install bundled agent context packages (.cursorrules, system rules, reference code) for high-performance vibe coding!";

  const ogUrl = new URL("https://devcommons.uz/api/og");
  ogUrl.searchParams.set("title", "AI Workflows & Skill Bundles");
  ogUrl.searchParams.set("category", "Context Architecture Hub");
  ogUrl.searchParams.set("badge", "📦 Verified Agent Bundles");
  ogUrl.searchParams.set("author", "DevCommons Community");

  return {
    title,
    description,
    keywords: ["Prompt Chains", "Skill Bundles", "AI Workflows", "Cursor Rules", "Claude Code", "DevCommons", "Agent Infrastructure"],
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://devcommons.uz/workflows",
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

const ADVANCED_CHAIN_STEPS: StepItem[] = [
  {
    id: 1,
    role: "Database Schema & Index Analyzer (Claude 3.5 Sonnet)",
    model: "claude-3-5-sonnet",
    instruction: "Analyze proposed Supabase PostgreSQL DDL migrations for missing indexes, foreign key cascading issues, and Row-Level Security (RLS) leaks.",
    outputPreview: `// Analysis Output: Missing index on user_id col; RLS policy open for public SELECT.`
  },
  {
    id: 2,
    role: "RLS & Migration Remediation Agent (Gemini 1.5 Pro)",
    model: "gemini-1.5-pro",
    instruction: "Generate highly optmized PostgreSQL SQL fixes enforcing strict authenticated Supabase auth.uid() matching and multi-column composite indexing.",
    outputPreview: `CREATE POLICY "Enable read access for authenticated users only" ON prompts FOR SELECT USING (auth.role() = 'authenticated');`
  },
  {
    id: 3,
    role: "TypeScript Interface Generator (GPT-4o)",
    model: "gpt-4o",
    instruction: "Compile exact strict TypeScript interface definitions representing the updated SQL database schema with null-safe optional boundaries.",
    outputPreview: `export interface DatabaseSchema {\n  public: {\n    Tables: {\n      prompts: {\n        Row: { id: string; author_id: string; content: string; created_at: string; };\n      };\n    };\n  };\n}`
  }
];

const SECOND_BUNDLE_ITEMS: BundleItem[] = [
  {
    filename: "CLAUDE.md",
    type: "rule",
    content: `# Claude Code Protocol — DevCommons Backend Standard
- Always validate incoming Next.js route handlers using Zod validation schemas.
- Respond with standard JSON structures containing { success, data, error }.
- Never output raw unhandled try/catch errors to client responses.`
  },
  {
    filename: "SecurityAuditPrompt.md",
    type: "prompt",
    content: `You are an OWASP Top 10 Security Specialist AI. Scan all authentication routes and API route handlers for injection flaws, unverified JWT payloads, and Rate Limit evasion vulnerabilities.`
  },
  {
    filename: "ZodRouteValidator.ts",
    type: "code",
    content: `import { z } from 'zod';\nimport { NextResponse } from 'next/server';\n\nexport const userCreateSchema = z.object({\n  email: z.string().email(),\n  githubUsername: z.string().min(2),\n});\n\nexport function validatePayload<T>(schema: z.Schema<T>, data: unknown) {\n  return schema.safeParse(data);\n}`
  }
];

export default async function WorkflowsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("Workflows");

  return (
    <div className="container mx-auto max-w-[1400px] px-4 py-12 pb-24 sm:px-6 lg:px-8">
      {/* Hero Title Section */}
      <div className="mb-14 text-center">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 px-4 py-2 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-purple-400">
          <Sparkles className="h-4 w-4 animate-spin text-purple-400" />
          <span>Next-Gen Agent Architecture Hub</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-gray-400 sm:text-base md:text-lg">
          {t("subtitle")}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/playground"
            className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-6 py-3 text-sm font-semibold text-gray-200 transition hover:border-brand hover:bg-white/10 hover:text-white"
          >
            <span>🧪 Open Interactive Simulator</span>
            <ArrowUpRight className="h-4 w-4 text-brand" />
          </Link>
          <Link
            href="/prompts"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:scale-105"
          >
            <span>Browse All Prompts</span>
          </Link>
        </div>
      </div>

      {/* Section 1: Prompt Chains */}
      <div className="mb-16 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-sm">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white sm:text-3xl">{t("tab_chains")}</h2>
              <p className="text-xs sm:text-sm text-gray-400">Multi-stage autonomous prompt sequences producing verified engineering outcomes.</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
            ⚡ Interactive Live Execution
          </span>
        </div>

        <div className="space-y-8">
          <PromptChainViewer
            title="Clean Architecture & Security Refactoring Chain"
            description={t("chain_desc_1")}
          />
          
          <PromptChainViewer
            title="Supabase RLS & PostgreSQL Strict Migration Cascade"
            description="A specialized database modeling sequence that checks schema health, generates foolproof Row Level Security policies, and outputs strict TypeScript types."
            steps={ADVANCED_CHAIN_STEPS}
          />
        </div>
      </div>

      {/* Section 2: Skill Bundles */}
      <div className="space-y-6 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-sm">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white sm:text-3xl">{t("tab_bundles")}</h2>
              <p className="text-xs sm:text-sm text-gray-400">Pre-packaged agent context kits combining rules (.cursorrules, CLAUDE.md), prompts, and reference code.</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>{t("verified_badge")}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <SkillBundleCard
            title="Next.js 14 + TS Enterprise Clean Architecture Pack"
            description={t("bundle_desc_1")}
            category="Full-Stack Web"
            author="DevCommons Core Team"
          />

          <SkillBundleCard
            title="Claude Code API Security & Zod Validation Kit"
            description="An essential backend security bundle explicitly tailored for Claude Code and Anthropic agent workflows with automated payload parsing."
            category="Backend & Security"
            author="OWASP Working Group"
            items={SECOND_BUNDLE_ITEMS}
          />
        </div>
      </div>
    </div>
  );
}
