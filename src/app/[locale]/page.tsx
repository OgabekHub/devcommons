import {
  Code2,
  Sparkles,
  Users,
  ArrowRight,
  Zap,
  Globe,
  Search,
  Copy,
  Heart,
  Terminal,
  Braces,
  Cpu,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Typewriter from "@/components/Typewriter";
import AnimatedCounter from "@/components/AnimatedCounter";
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from "next-intl";

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations("Index");

  return (
    <div className="space-y-28 pb-20">
      {/* ========================================
          HERO SECTION (Redesigned 2-Column Premium UI)
          ======================================== */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 lg:pt-28 pb-10">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          {/* Main glow - positioned towards top left */}
          <div className="absolute left-0 top-0 h-[800px] w-[800px] -translate-x-1/4 -translate-y-1/4 rounded-full bg-gradient-radial from-brand/15 via-brand/5 to-transparent blur-[100px]" />
          {/* Side accents */}
          <div className="absolute right-0 top-1/4 h-[600px] w-[600px] translate-x-1/4 rounded-full bg-blue-300/10 blur-[100px] animate-float-slower" />
          {/* Dot grid */}
          <div className="absolute inset-0 bg-dot-pattern bg-dot-md opacity-30" />
        </div>

        <div className="relative mx-auto max-w-[1440px]">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            
            {/* Left Column - Text Content */}
            <div className="space-y-8 text-left max-w-2xl">
              {/* Badge */}
              <div className="animate-fade-in-down inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white/60 px-4 py-2 text-sm font-semibold text-brand shadow-sm backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
                </span>
                {t("badge")}
              </div>

              {/* Main Headline */}
              <h1 className="animate-fade-in-up text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
                {t("title_start")}
                <span className="text-gradient-animated bg-clip-text text-transparent bg-[length:200%_auto] block mt-2 mb-2">
                  {t("title_highlight")}
                </span>
                {t("title_end")}
              </h1>

              {/* Typewriter subheadline */}
              <div className="animate-fade-in-up text-lg leading-relaxed text-gray-500 sm:text-xl" style={{ animationDelay: "0.15s" }}>
                <p>
                  {t("subtitle")}
                </p>
                <p className="mt-3 text-base text-gray-400 font-medium">
                  {t("no_barrier")}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="animate-fade-in-up flex flex-col gap-4 sm:flex-row" style={{ animationDelay: "0.3s" }}>
                <a href="/snippets" className="btn-primary group text-lg px-8 py-4 shadow-brand/25">
                  <Code2 className="h-5 w-5" />
                  {t("btn_snippets")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <a href="/prompts" className="btn-secondary text-lg px-8 py-4 bg-white/50 backdrop-blur-sm border-gray-200 hover:border-brand/30">
                  <Sparkles className="h-5 w-5 text-brand" />
                  {t("btn_prompts")}
                </a>
              </div>

              {/* Trust badges */}
              <div className="animate-fade-in flex flex-wrap items-center gap-6 pt-6 text-sm font-medium text-gray-400" style={{ animationDelay: "0.45s" }}>
                <span className="flex items-center gap-2 transition-colors hover:text-gray-700">
                  <Globe className="h-4 w-4" />
                  {t("trust_open_source")}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                <span className="flex items-center gap-2 transition-colors hover:text-gray-700">
                  <Heart className="h-4 w-4 text-red-400/70" />
                  {t("trust_community")}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                <span className="flex items-center gap-2 transition-colors hover:text-gray-700">
                  <Zap className="h-4 w-4 text-amber-400/70" />
                  {t("trust_free")}
                </span>
              </div>
            </div>

            {/* Right Column - Premium IDE Mockup */}
            <Reveal className="relative lg:mt-0 mt-12" delay={300}>
              {/* Massive Glow Behind IDE */}
              <div className="absolute left-1/2 top-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-brand/20 via-purple-400/10 to-blue-400/20 blur-[80px]" />
              
              <div className="group relative mx-auto w-full max-w-2xl rounded-2xl border border-gray-700/50 bg-[#0B0914]/90 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-brand/20 hover:border-brand/40">
                {/* IDE Chrome / Header */}
                <div className="flex items-center justify-between border-b border-gray-800/60 bg-[#161224]/80 px-4 py-3 rounded-t-2xl">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  </div>
                  <div className="flex items-center gap-2 rounded-md bg-[#221C38] px-3 py-1 text-xs text-gray-400 border border-gray-700/50">
                    <Search className="h-3 w-3" />
                    devcommons / snippet.js
                  </div>
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-transparent" />
                  </div>
                </div>

                <div className="flex">
                  {/* IDE Sidebar (Hidden on small screens) */}
                  <div className="hidden w-12 flex-col items-center gap-4 border-r border-gray-800/60 py-4 sm:flex">
                    <Code2 className="h-5 w-5 text-brand" />
                    <Search className="h-5 w-5 text-gray-600 hover:text-gray-400 cursor-pointer transition-colors" />
                    <Globe className="h-5 w-5 text-gray-600 hover:text-gray-400 cursor-pointer transition-colors" />
                  </div>

                  {/* IDE Content */}
                  <div className="flex-1 p-5 font-mono text-sm leading-loose">
                    <div className="space-y-1">
                      <div className="flex gap-4">
                        <span className="select-none text-gray-600">1</span>
                        <div className="text-gray-300">
                          <span className="text-purple-400 font-medium">const</span>{" "}
                          <span className="text-blue-400">fetchData</span>{" "}
                          <span className="text-gray-400">=</span>{" "}
                          <span className="text-purple-400 font-medium">async</span>{" "}
                          <span className="text-yellow-300">(</span>
                          <span className="text-orange-300">url</span>
                          <span className="text-yellow-300">)</span>{" "}
                          <span className="text-purple-400 font-medium">=&gt;</span>{" "}
                          <span className="text-yellow-300">{"{"}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <span className="select-none text-gray-600">2</span>
                        <div className="pl-4 text-gray-300">
                          <span className="text-purple-400 font-medium">try</span>{" "}
                          <span className="text-yellow-300">{"{"}</span>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <span className="select-none text-gray-600">3</span>
                        <div className="pl-8 text-gray-300">
                          <span className="text-purple-400 font-medium">const</span>{" "}
                          <span className="text-blue-400">res</span>{" "}
                          <span className="text-gray-400">=</span>{" "}
                          <span className="text-purple-400 font-medium">await</span>{" "}
                          <span className="text-green-400">fetch</span>
                          <span className="text-yellow-300">(</span>
                          <span className="text-orange-300">url</span>
                          <span className="text-yellow-300">)</span>;
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <span className="select-none text-gray-600">4</span>
                        <div className="pl-8 text-gray-300">
                          <span className="text-purple-400 font-medium">return await</span>{" "}
                          <span className="text-blue-400">res</span>.
                          <span className="text-green-400">json</span>
                          <span className="text-yellow-300">()</span>;
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <span className="select-none text-gray-600">5</span>
                        <div className="pl-4 text-gray-300">
                          <span className="text-yellow-300">{"}"}</span>{" "}
                          <span className="text-purple-400 font-medium">catch</span>{" "}
                          <span className="text-yellow-300">(</span>
                          <span className="text-orange-300">err</span>
                          <span className="text-yellow-300">)</span>{" "}
                          <span className="text-yellow-300">{"{"}</span>
                        </div>
                      </div>

                      <div className="flex gap-4 bg-red-900/20 border-l-2 border-red-500/50 -ml-5 pl-5 w-[calc(100%+1.25rem)]">
                        <span className="select-none text-gray-600 w-3 relative -left-1">6</span>
                        <div className="pl-5 text-gray-300">
                          <span className="text-blue-400">console</span>.
                          <span className="text-red-400">error</span>
                          <span className="text-yellow-300">(</span>
                          <span className="text-green-400">&quot;{t("preview_error")}&quot;</span>,{" "}
                          <span className="text-orange-300">err</span>
                          <span className="text-yellow-300">)</span>;
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <span className="select-none text-gray-600">7</span>
                        <div className="pl-4 text-gray-300">
                          <span className="text-yellow-300">{"}"}</span>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <span className="select-none text-gray-600">8</span>
                        <div className="text-gray-300">
                          <span className="text-yellow-300">{"}"}</span>;
                        </div>
                      </div>
                      
                      {/* Typing cursor line */}
                      <div className="flex gap-4 mt-2">
                        <span className="select-none text-gray-600">9</span>
                        <div className="text-gray-300 flex items-center">
                          <span className="h-4 w-2 bg-brand/80 animate-pulse block"></span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-6 flex justify-end pt-4 border-t border-gray-800/60">
                      <button className="group/btn inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-xs font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white hover:border-brand/30 hover:shadow-[0_0_15px_rgba(124,92,252,0.2)]">
                        <Copy className="h-3.5 w-3.5 group-hover/btn:scale-110 transition-transform" />
                        {t("preview_copy")}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Decorative floating icons */}
                <div className="absolute -right-4 -top-4 rounded-xl bg-yellow-400/10 p-3 shadow-lg backdrop-blur-md border border-yellow-400/20 animate-float">
                  <Braces className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="absolute -bottom-6 -left-6 rounded-xl bg-blue-400/10 p-3 shadow-lg backdrop-blur-md border border-blue-400/20 animate-float" style={{ animationDelay: "1.5s" }}>
                  <Terminal className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ========================================
          FEATURES SECTION
          ======================================== */}
      <section className="space-y-12">
        <Reveal>
          <div className="text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
              {t("feat_badge")}
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl">
              {t("feat_title_start")}<span className="text-gradient">DevCommons</span>{t("feat_title_end")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-500">
              {t("feat_desc")}
            </p>
          </div>
        </Reveal>

        <Reveal stagger>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(124,92,252,0.1)] border border-gray-100">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand/5 blur-3xl transition-all duration-500 group-hover:bg-brand/10" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-4 shadow-lg shadow-brand/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Code2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">{t("feat1_title")}</h3>
                <p className="text-base leading-relaxed text-gray-500">
                  {t("feat1_desc")}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-xl bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-100/50 backdrop-blur-sm">JavaScript</span>
                  <span className="rounded-xl bg-green-50/80 px-3 py-1.5 text-xs font-semibold text-green-600 border border-green-100/50 backdrop-blur-sm">Python</span>
                  <span className="rounded-xl bg-orange-50/80 px-3 py-1.5 text-xs font-semibold text-orange-600 border border-orange-100/50 backdrop-blur-sm">React</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(168,85,247,0.1)] border border-gray-100">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-purple-500/5 blur-3xl transition-all duration-500 group-hover:bg-purple-500/10" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-4 shadow-lg shadow-purple-500/30 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">{t("feat2_title")}</h3>
                <p className="text-base leading-relaxed text-gray-500">
                  {t("feat2_desc")}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-xl bg-violet-50/80 px-3 py-1.5 text-xs font-semibold text-violet-600 border border-violet-100/50 backdrop-blur-sm">ChatGPT</span>
                  <span className="rounded-xl bg-sky-50/80 px-3 py-1.5 text-xs font-semibold text-sky-600 border border-sky-100/50 backdrop-blur-sm">Claude</span>
                  <span className="rounded-xl bg-indigo-50/80 px-3 py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-100/50 backdrop-blur-sm">Gemini</span>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)] border border-gray-100 sm:col-span-2 lg:col-span-1">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl transition-all duration-500 group-hover:bg-emerald-500/10" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 shadow-lg shadow-emerald-500/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">{t("feat3_title")}</h3>
                <p className="text-base leading-relaxed text-gray-500">
                  {t("feat3_desc")}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-xl bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-emerald-600 border border-emerald-100/50 backdrop-blur-sm">{t("tag_open")}</span>
                  <span className="rounded-xl bg-amber-50/80 px-3 py-1.5 text-xs font-semibold text-amber-600 border border-amber-100/50 backdrop-blur-sm">{t("tag_free")}</span>
                  <span className="rounded-xl bg-rose-50/80 px-3 py-1.5 text-xs font-semibold text-rose-600 border border-rose-100/50 backdrop-blur-sm">{t("tag_all")}</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ========================================
          HOW IT WORKS
          ======================================== */}
      <section className="space-y-12">
        <Reveal>
          <div className="text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
              {t("how_badge")}
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl">
              {t("how_title")}
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-3">
          <Reveal delay={0}>
            <div className="relative text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-xl font-bold text-white shadow-brand">
                1
              </div>
              <h3 className="mb-2 text-lg font-bold">{t("how1_title")}</h3>
              <p className="text-sm text-gray-500">
                {t("how1_desc")}
              </p>
              <Search className="mx-auto mt-3 h-5 w-5 text-brand/40" />
              {/* Connector line */}
              <div className="absolute right-0 top-7 hidden h-0.5 w-8 bg-gradient-to-r from-brand/30 to-transparent sm:block" style={{ right: "-16px" }} />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-xl font-bold text-white shadow-lg shadow-purple-500/25">
                2
              </div>
              <h3 className="mb-2 text-lg font-bold">{t("how2_title")}</h3>
              <p className="text-sm text-gray-500">
                {t("how2_desc")}
              </p>
              <Copy className="mx-auto mt-3 h-5 w-5 text-purple-400/40" />
              <div className="absolute right-0 top-7 hidden h-0.5 w-8 bg-gradient-to-r from-purple-400/30 to-transparent sm:block" style={{ right: "-16px" }} />
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-xl font-bold text-white shadow-lg shadow-emerald-500/25">
                3
              </div>
              <h3 className="mb-2 text-lg font-bold">{t("how3_title")}</h3>
              <p className="text-sm text-gray-500">
                {t("how3_desc")}
              </p>
              <Heart className="mx-auto mt-3 h-5 w-5 text-emerald-400/40" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================
          STATS SECTION
          ======================================== */}
      <Reveal>
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-dark via-brand-900 to-surface-dark px-8 py-16 noise">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/20 blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/15 blur-[100px]" />
          </div>

          <div className="relative">
            <h2 className="mb-10 text-center text-2xl font-bold text-white sm:text-3xl">
              {t("stats_title")}
            </h2>
            <div className="grid gap-10 sm:grid-cols-3">
              <AnimatedCounter end={100} suffix="%" label={t("stat1_label")} />
              <AnimatedCounter end={0} suffix={t("stat2_suffix")} label={t("stat2_label")} />
              <AnimatedCounter end={24} suffix="/7" label={t("stat3_label")} />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ========================================
          TECH STACK SECTION
          ======================================== */}
      <section className="space-y-10">
        <Reveal>
          <div className="text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
              {t("tech_badge")}
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl">
              {t("tech_title")}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-gray-500">
              {t("tech_desc")}
            </p>
          </div>
        </Reveal>

        <Reveal stagger>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { name: "JavaScript", icon: Braces, color: "bg-yellow-50 text-yellow-600 border-yellow-100" },
              { name: "TypeScript", icon: Code2, color: "bg-blue-50 text-blue-600 border-blue-100" },
              { name: "Python", icon: Terminal, color: "bg-green-50 text-green-600 border-green-100" },
              { name: "React", icon: Cpu, color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
              { name: "Go", icon: Zap, color: "bg-sky-50 text-sky-600 border-sky-100" },
              { name: "Rust", icon: Terminal, color: "bg-orange-50 text-orange-600 border-orange-100" },
            ].map((tech) => (
              <div
                key={tech.name}
                className={`inline-flex items-center gap-2.5 rounded-xl border px-5 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${tech.color}`}
              >
                <tech.icon className="h-4 w-4" />
                {tech.name}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ========================================
          BOTTOM CTA
          ======================================== */}
      <Reveal>
        <section className="relative overflow-hidden rounded-3xl border border-brand/10 bg-gradient-to-br from-brand-50 via-white to-purple-50 px-8 py-16 text-center">
          {/* Decorations */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-brand/10 blur-[60px]" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-purple-400/10 blur-[60px]" />

          <div className="relative mx-auto max-w-lg space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark shadow-brand animate-bounce-subtle">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl">
              {t("cta_title_start")}
              <span className="text-gradient">{t("cta_title_highlight")}</span>{" "}
              {t("cta_title_end")}
            </h2>
            <p className="text-gray-500">
              {t("cta_desc")}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="/snippets" className="btn-primary text-lg">
                {t("cta_btn_start")}
                <ArrowRight className="h-5 w-5" />
              </a>
              <a href="/auth" className="btn-ghost text-lg">
                {t("cta_btn_login")}
              </a>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
