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
          HERO SECTION
          ======================================== */}
      <section className="relative overflow-hidden pt-16 text-center sm:pt-24">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          {/* Main glow */}
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-gradient-radial from-brand/20 via-brand/5 to-transparent blur-[80px]" />
          {/* Side accents */}
          <div className="absolute -left-32 top-48 h-64 w-64 rounded-full bg-purple-300/10 blur-[80px] animate-float-slow" />
          <div className="absolute -right-32 top-32 h-72 w-72 rounded-full bg-blue-300/10 blur-[80px] animate-float-slower" />
          {/* Dot grid */}
          <div className="absolute inset-0 bg-dot-pattern bg-dot-md opacity-40" />
        </div>

        <div className="relative space-y-8">
          {/* Badge */}
          <div className="animate-fade-in-down inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white/80 px-5 py-2 text-sm font-medium text-brand shadow-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            {t("badge")}
          </div>

          {/* Main Headline */}
          <h1 className="animate-fade-in-up mx-auto max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            {t("title_start")}
            <span className="text-gradient-animated">
              {t("title_highlight")}
            </span>
            <br className="hidden sm:block" />
            {t("title_end")}
          </h1>

          {/* Typewriter subheadline */}
          <div className="animate-fade-in-up mx-auto max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl" style={{ animationDelay: "0.15s" }}>
            <p>
              {t("subtitle")}
            </p>
            <p className="mt-2 text-base text-gray-400">
              {t("no_barrier")}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: "0.3s" }}>
            <a href="/snippets" className="btn-primary group text-lg">
              <Code2 className="h-5 w-5" />
              {t("btn_snippets")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="/prompts" className="btn-secondary text-lg">
              <Sparkles className="h-5 w-5" />
              {t("btn_prompts")}
            </a>
          </div>

          {/* Trust badges */}
          <div className="animate-fade-in flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-gray-400" style={{ animationDelay: "0.45s" }}>
            <span className="flex items-center gap-1.5">
              <Globe className="h-4 w-4" />
              {t("trust_open_source")}
            </span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" />
              {t("trust_community")}
            </span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              {t("trust_free")}
            </span>
          </div>
        </div>

        {/* Fake code preview card */}
        <Reveal className="mt-16" delay={400}>
          <div className="mx-auto max-w-3xl">
            <div className="card-shine rounded-2xl border border-gray-200/60 bg-white p-1 shadow-card-hover">
              {/* Window chrome */}
              <div className="flex items-center gap-2 rounded-t-xl bg-gray-50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="ml-4 flex-1 rounded-lg bg-gray-100 px-3 py-1 text-xs text-gray-400">
                  devcommons.uz/snippets
                </div>
              </div>
              {/* Fake code content */}
              <div className="code-block rounded-t-none rounded-b-xl">
                <div className="space-y-2 text-xs sm:text-sm">
                  <div>
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-blue-300">fetchData</span>{" "}
                    <span className="text-gray-400">=</span>{" "}
                    <span className="text-purple-400">async</span>{" "}
                    <span className="text-yellow-300">(</span>
                    <span className="text-orange-300">url</span>
                    <span className="text-yellow-300">)</span>{" "}
                    <span className="text-purple-400">=&gt;</span>{" "}
                    <span className="text-yellow-300">{"{"}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-purple-400">try</span>{" "}
                    <span className="text-yellow-300">{"{"}</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-blue-300">res</span>{" "}
                    <span className="text-gray-400">=</span>{" "}
                    <span className="text-purple-400">await</span>{" "}
                    <span className="text-green-300">fetch</span>
                    <span className="text-yellow-300">(</span>
                    <span className="text-orange-300">url</span>
                    <span className="text-yellow-300">)</span>;
                  </div>
                  <div className="pl-8">
                    <span className="text-purple-400">return await</span>{" "}
                    <span className="text-blue-300">res</span>.
                    <span className="text-green-300">json</span>
                    <span className="text-yellow-300">()</span>;
                  </div>
                  <div className="pl-4">
                    <span className="text-yellow-300">{"}"}</span>{" "}
                    <span className="text-purple-400">catch</span>{" "}
                    <span className="text-yellow-300">(</span>
                    <span className="text-orange-300">err</span>
                    <span className="text-yellow-300">)</span>{" "}
                    <span className="text-yellow-300">{"{"}</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-blue-300">console</span>.
                    <span className="text-red-400">error</span>
                    <span className="text-yellow-300">(</span>
                    <span className="text-green-300">&quot;Xato:&quot;</span>,{" "}
                    <span className="text-orange-300">err</span>
                    <span className="text-yellow-300">)</span>;
                  </div>
                  <div className="pl-4">
                    <span className="text-yellow-300">{"}"}</span>
                  </div>
                  <div>
                    <span className="text-yellow-300">{"}"}</span>;
                  </div>
                </div>
                {/* Copy button */}
                <div className="mt-3 flex justify-end">
                  <button className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-gray-400 transition-all hover:bg-white/20 hover:text-white">
                    <Copy className="h-3.5 w-3.5" />
                    Nusxalash
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ========================================
          FEATURES SECTION
          ======================================== */}
      <section className="space-y-12">
        <Reveal>
          <div className="text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
              Imkoniyatlar
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Nima uchun <span className="text-gradient">DevCommons</span>?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-500">
              Bilimni ochiq qiling. Community bilan birga o&apos;sing.
              Har bir dasturchi uchun kerakli vositalar.
            </p>
          </div>
        </Reveal>

        <Reveal stagger>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="card card-shine group">
              <div className="mb-5 inline-flex rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 p-3.5 transition-transform duration-300 group-hover:scale-110">
                <Code2 className="h-6 w-6 text-brand" />
              </div>
              <h3 className="mb-2 text-lg font-bold">Kod Snippet&apos;lar</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Real loyihalardan tayyor yechimlar. Nusxalang, ishlating,
                vaqt tejang. Har bir snippet — sinab ko&apos;rilgan kod.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">JavaScript</span>
                <span className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">Python</span>
                <span className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600">React</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card card-shine group">
              <div className="mb-5 inline-flex rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-3.5 transition-transform duration-300 group-hover:scale-110">
                <Sparkles className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="mb-2 text-lg font-bold">AI Prompt&apos;lar</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                ChatGPT, Claude, Gemini uchun ishlaydigan prompt&apos;lar
                to&apos;plami. O&apos;z prompt&apos;ingizni ham ulashing.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600">ChatGPT</span>
                <span className="rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-600">Claude</span>
                <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">Gemini</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card card-shine group">
              <div className="mb-5 inline-flex rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-3.5 transition-transform duration-300 group-hover:scale-110">
                <Users className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="mb-2 text-lg font-bold">Ochiq Community</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Hamma uchun, hammaga. Junior yoki senior — bilim
                darajangiz muhim emas, hissangiz muhim.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">Ochiq</span>
                <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">Bepul</span>
                <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600">Hammaga</span>
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
              Qanday ishlaydi
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl">
              3 oddiy qadam
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-3">
          <Reveal delay={0}>
            <div className="relative text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-xl font-bold text-white shadow-brand">
                1
              </div>
              <h3 className="mb-2 text-lg font-bold">Qidiring</h3>
              <p className="text-sm text-gray-500">
                Kerakli snippet yoki prompt&apos;ni tezkor qidiruv orqali toping
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
              <h3 className="mb-2 text-lg font-bold">Nusxalang</h3>
              <p className="text-sm text-gray-500">
                Bir tugma bilan kodni nusxalab, loyihangizga qo&apos;shing
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
              <h3 className="mb-2 text-lg font-bold">Ulashing</h3>
              <p className="text-sm text-gray-500">
                O&apos;z yechimlaringizni qo&apos;shing — community baholaydi
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
              Raqamlar gapiradi
            </h2>
            <div className="grid gap-10 sm:grid-cols-3">
              <AnimatedCounter end={100} suffix="%" label="Bepul va ochiq" />
              <AnimatedCounter end={0} suffix=" so'm" label="Hech qachon to'lov yo'q" />
              <AnimatedCounter end={24} suffix="/7" label="Doim ochiq" />
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
              Tillar
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Barcha tillar uchun
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-gray-500">
              JavaScript, Python, Go, Rust va boshqa tillardagi snippet&apos;lar
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
              Bilimingizni ulashing.{" "}
              <span className="text-gradient">Bepul.</span>{" "}
              Hoziroq.
            </h2>
            <p className="text-gray-500">
              Birinchi snippet yoki prompt&apos;ingizni qo&apos;shing va
              global dasturchilar community&apos;siga qo&apos;shiling.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="/snippets" className="btn-primary text-lg">
                Boshlash
                <ArrowRight className="h-5 w-5" />
              </a>
              <a href="/auth" className="btn-ghost text-lg">
                GitHub bilan kirish
              </a>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
