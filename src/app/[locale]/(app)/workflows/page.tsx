import React from "react";
import { createSupabaseServer } from "@/lib/supabase-server";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { StepItem } from "@/components/PromptChainViewer";
import { BundleItem } from "@/components/SkillBundleCard";
import WorkflowsDashboard from "@/components/WorkflowsDashboard";
import { Sparkles, ArrowUpRight } from "lucide-react";
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
  const supabase = createSupabaseServer();

  const { data: bundlesRaw } = await supabase
    .from("skill_bundles")
    .select("*, author:users(github_username)")
    .order("votes", { ascending: false });

  return (
    <div className="container mx-auto max-w-[1400px] px-2 md:px-6 py-6 pb-20">
      {/* Compact Hero Section */}
      <div className="mb-10 text-center md:text-left bg-gradient-to-r from-purple-900/20 via-[#101422] to-indigo-950/20 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-300 mb-3">
            <Sparkles className="h-3.5 w-3.5 animate-spin text-purple-400" />
            <span>Next-Gen Agent Architecture Hub</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-gray-400">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap md:flex-col shrink-0 gap-3 justify-center">
          <Link
            href="/playground"
            className="flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/15 px-5 py-3 text-xs sm:text-sm font-bold text-white transition hover:border-brand hover:bg-white/20 shadow-md"
          >
            <span>🧪 Open Live Simulator</span>
            <ArrowUpRight className="h-4 w-4 text-brand" />
          </Link>
          <Link
            href="/prompts"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-purple-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:opacity-95"
          >
            <span>Browse All Prompts</span>
          </Link>
        </div>
      </div>

      {/* Interactive Workflows Dashboard (Tabs & Views) */}
      <WorkflowsDashboard
        advancedChainSteps={ADVANCED_CHAIN_STEPS}
        skillBundles={bundlesRaw || []}
      />
    </div>
  );
}
