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
import HeroBentoBox from "@/components/HeroBentoBox";
import BackgroundBeams from "@/components/BackgroundBeams";
import Logo from "@/components/Logo";
import GitHubLoginButton from "@/components/GitHubLoginButton";
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from "next-intl";

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations("Index");

  return (
    <div className="space-y-16 pb-16">
      {/* ========================================
          HERO SECTION (Redesigned 2-Column Premium UI)
          ======================================== */}
      <section className="relative pt-8 sm:pt-12 lg:pt-16 pb-6">
        {/* Full-width Background decorations with premium fade masks */}
        <div 
          className="pointer-events-none absolute left-1/2 top-[-120px] -z-10 h-[calc(100%+120px)] w-[100vw] -translate-x-1/2 overflow-hidden"
          style={{ maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)" }}
        >
          {/* Background decorations */}
        <BackgroundBeams />
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Dot grid */}
          <div className="absolute inset-0 bg-dot-pattern bg-dot-md opacity-20" />
        </div>
        </div>

        <div className="relative mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">

            {/* Left Column - Text Content */}
            <div className="space-y-6 text-left max-w-2xl">
              {/* Badge */}
              <div className="animate-fade-in-down inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-sm font-semibold text-brand shadow-[0_0_15px_rgba(124,92,252,0.15)] backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
                </span>
                {t("badge")}
              </div>

              {/* Main Headline */}
              <h1 className="animate-fade-in-up text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {t("title_start")}
                <span className="text-gradient-animated bg-clip-text text-transparent bg-[length:200%_auto] block mt-1 mb-1 drop-shadow-[0_0_20px_rgba(124,92,252,0.3)]">
                  {t("title_highlight")}
                </span>
                {t("title_end")}
              </h1>

              {/* Typewriter subheadline */}
              <div className="animate-fade-in-up text-base leading-relaxed text-gray-400 sm:text-lg" style={{ animationDelay: "0.15s" }}>
                <p>
                  {t("subtitle")}
                </p>
                <p className="mt-2 text-sm text-gray-500 font-medium">
                  {t("no_barrier")}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="animate-fade-in-up flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.3s" }}>
                <a href="/snippets" className="btn-primary group text-base px-6 py-3 shadow-[0_0_20px_rgba(124,92,252,0.4)]">
                  <Code2 className="h-4 w-4" />
                  {t("btn_snippets")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 " />
                </a>
                <a href="/prompts" className="btn-secondary text-base px-6 py-3 bg-[#111]/50 backdrop-blur-sm border-white/10 hover:border-brand/40 hover:bg-brand/10 text-gray-300 hover:text-white">
                  <Sparkles className="h-4 w-4 text-brand" />
                  {t("btn_prompts")}
                </a>
              </div>

              {/* Trust badges */}
              <div className="animate-fade-in flex flex-wrap items-center gap-4 pt-4 text-xs font-medium text-gray-500" style={{ animationDelay: "0.45s" }}>
                <span className="flex items-center gap-2 transition-colors hover:text-gray-300">
                  <Globe className="h-4 w-4" />
                  {t("trust_open_source")}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-gray-700" />
                <span className="flex items-center gap-2 transition-colors hover:text-gray-300">
                  <Heart className="h-4 w-4 text-red-400/70" />
                  {t("trust_community")}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-gray-700" />
                <span className="flex items-center gap-2 transition-colors hover:text-gray-300">
                  <Zap className="h-4 w-4 text-amber-400/70" />
                  {t("trust_free")}
                </span>
              </div>
            </div>

            {/* Right Column - Hero Bento Box */}
            <div className="relative mt-12 lg:mt-0 w-full flex justify-center perspective-1000">
              <HeroBentoBox promptText={t("bento_ai_prompt")} />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          FEATURES SECTION
          ======================================== */}
      <section className="space-y-8">
        <Reveal>
          <div className="text-center">
            <span className="mb-2 inline-block rounded-full bg-brand/10 border border-brand/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
              {t("feat_badge")}
            </span>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {t("feat_title_start")}<span className="text-gradient">DevCommons</span>{t("feat_title_end")}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-400">
              {t("feat_desc")}
            </p>
          </div>
        </Reveal>

        <Reveal stagger>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group relative overflow-hidden rounded-2xl bg-[#111] p-6 shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/5 hover:border-brand/30">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand/10 blur-3xl transition-all duration-500 group-hover:bg-brand/20" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-3 shadow-lg shadow-brand/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{t("feat1_title")}</h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {t("feat1_desc")}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-xl bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">JavaScript</span>
                  <span className="rounded-xl bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-400 border border-green-500/20">Python</span>
                  <span className="rounded-xl bg-orange-500/10 px-2 py-1 text-xs font-semibold text-orange-400 border border-orange-500/20">React</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden rounded-2xl bg-[#111] p-6 shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/5 hover:border-purple-500/30">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl transition-all duration-500 group-hover:bg-purple-500/20" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-3 shadow-lg shadow-purple-500/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{t("feat2_title")}</h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {t("feat2_desc")}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-xl bg-violet-500/10 px-2 py-1 text-xs font-semibold text-violet-400 border border-violet-500/20">ChatGPT</span>
                  <span className="rounded-xl bg-sky-500/10 px-2 py-1 text-xs font-semibold text-sky-400 border border-sky-500/20">Claude</span>
                  <span className="rounded-xl bg-indigo-500/10 px-2 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">Gemini</span>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden rounded-2xl bg-[#111] p-6 shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/5 hover:border-emerald-500/30 sm:col-span-2 lg:col-span-1">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl transition-all duration-500 group-hover:bg-emerald-500/20" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-3 shadow-lg shadow-emerald-500/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{t("feat3_title")}</h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {t("feat3_desc")}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-xl bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">{t("tag_open")}</span>
                  <span className="rounded-xl bg-amber-500/10 px-2 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">{t("tag_free")}</span>
                  <span className="rounded-xl bg-rose-500/10 px-2 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20">{t("tag_all")}</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ========================================
          HOW IT WORKS
          ======================================== */}
      <section className="space-y-8">
        <Reveal>
          <div className="text-center">
            <span className="mb-2 inline-block rounded-full bg-brand/10 border border-brand/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
              {t("how_badge")}
            </span>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {t("how_title")}
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-3">
          <Reveal delay={0}>
            <div className="relative text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark text-lg font-bold text-white shadow-[0_0_15px_rgba(124,92,252,0.3)]">
                1
              </div>
              <h3 className="mb-1 text-base font-bold text-white">{t("how1_title")}</h3>
              <p className="text-xs text-gray-400">
                {t("how1_desc")}
              </p>
              <Search className="mx-auto mt-2 h-4 w-4 text-brand/60" />
              {/* Connector line */}
              <div className="absolute right-0 top-6 hidden h-0.5 w-8 bg-gradient-to-r from-brand/50 to-transparent sm:block" style={{ right: "-16px" }} />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-lg font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                2
              </div>
              <h3 className="mb-1 text-base font-bold text-white">{t("how2_title")}</h3>
              <p className="text-xs text-gray-400">
                {t("how2_desc")}
              </p>
              <Copy className="mx-auto mt-2 h-4 w-4 text-purple-400/60" />
              <div className="absolute right-0 top-6 hidden h-0.5 w-8 bg-gradient-to-r from-purple-400/50 to-transparent sm:block" style={{ right: "-16px" }} />
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-lg font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                3
              </div>
              <h3 className="mb-1 text-base font-bold text-white">{t("how3_title")}</h3>
              <p className="text-xs text-gray-400">
                {t("how3_desc")}
              </p>
              <Heart className="mx-auto mt-2 h-4 w-4 text-emerald-400/60" />
            </div>
          </Reveal>
        </div>
      </section>


      {/* ========================================
          TECH STACK SECTION
          ======================================== */}
      <section className="space-y-10">
        <Reveal>
          <div className="text-center">
            <span className="mb-3 inline-block rounded-full bg-brand/10 border border-brand/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
              {t("tech_badge")}
            </span>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              {t("tech_title")}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-gray-400">
              {t("tech_desc")}
            </p>
          </div>
        </Reveal>

        <Reveal stagger>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { name: "JavaScript", icon: Braces, color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:border-yellow-500/50 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]" },
              { name: "TypeScript", icon: Code2, color: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]" },
              { name: "Python", icon: Terminal, color: "bg-green-500/10 text-green-400 border-green-500/20 hover:border-green-500/50 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]" },
              { name: "React", icon: Cpu, color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]" },
              { name: "Go", icon: Zap, color: "bg-sky-500/10 text-sky-400 border-sky-500/20 hover:border-sky-500/50 hover:shadow-[0_0_15px_rgba(14,165,233,0.2)]" },
              { name: "Rust", icon: Terminal, color: "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:border-orange-500/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]" },
            ].map((tech) => (
              <div
                key={tech.name}
                className={`inline-flex items-center gap-2.5 rounded-xl border px-5 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-1 ${tech.color}`}
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
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111] px-8 py-16 text-center shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {/* Decorations */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-brand/20 blur-[60px]" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-purple-500/20 blur-[60px]" />

          <div className="relative mx-auto max-w-lg space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center animate-bounce-subtle">
              <Logo className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              {t("cta_title_start")}
              <span className="text-gradient">{t("cta_title_highlight")}</span>{" "}
              {t("cta_title_end")}
            </h2>
            <p className="text-gray-400">
              {t("cta_desc")}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="/snippets" className="btn-primary text-lg shadow-[0_0_20px_rgba(124,92,252,0.3)]">
                {t("cta_btn_start")}
                <ArrowRight className="h-5 w-5" />
              </a>
              <GitHubLoginButton 
                text={t("cta_btn_login")} 
                className="btn-ghost text-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white flex items-center justify-center" 
              />
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
