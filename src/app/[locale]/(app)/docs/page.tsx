import { useTranslations } from "next-intl";
import { BookOpen, Code2, Users, MessageSquare, Terminal, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function DocsPage() {
  const t = useTranslations("Docs");

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn pb-24">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-brand/10 rounded-2xl mb-4">
          <BookOpen className="h-8 w-8 text-brand" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
          {t("title")}
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* Intro Section */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">👋</span> {t("intro_title")}
        </h2>
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <p>{t("intro_p1")}</p>
          <p>{t("intro_p2")}</p>
        </div>
      </section>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Snippets */}
        <div className="bg-[#0f0f11] border border-white/5 rounded-2xl p-6 hover:border-brand/30 transition-colors group">
          <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Code2 className="h-5 w-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t("feat_snippets_title")}</h3>
          <p className="text-sm text-gray-400 mb-4 line-clamp-3">
            {t("feat_snippets_desc")}
          </p>
          <Link href="/snippets" className="inline-flex items-center text-sm font-medium text-brand hover:text-brand-light">
            {t("go_to_snippets")} <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {/* AI Prompts */}
        <div className="bg-[#0f0f11] border border-white/5 rounded-2xl p-6 hover:border-brand/30 transition-colors group">
          <div className="h-10 w-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare className="h-5 w-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t("feat_prompts_title")}</h3>
          <p className="text-sm text-gray-400 mb-4 line-clamp-3">
            {t("feat_prompts_desc")}
          </p>
          <Link href="/prompts" className="inline-flex items-center text-sm font-medium text-brand hover:text-brand-light">
            {t("go_to_prompts")} <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {/* Teams */}
        <div className="bg-[#0f0f11] border border-white/5 rounded-2xl p-6 hover:border-brand/30 transition-colors group">
          <div className="h-10 w-10 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="h-5 w-5 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t("feat_teams_title")}</h3>
          <p className="text-sm text-gray-400 mb-4 line-clamp-3">
            {t("feat_teams_desc")}
          </p>
          <Link href="/teams" className="inline-flex items-center text-sm font-medium text-brand hover:text-brand-light">
            {t("go_to_teams")} <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {/* CLI */}
        <div className="bg-[#0f0f11] border border-white/5 rounded-2xl p-6 hover:border-brand/30 transition-colors group">
          <div className="h-10 w-10 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Terminal className="h-5 w-5 text-cyan-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t("feat_cli_title")}</h3>
          <p className="text-sm text-gray-400 mb-4 line-clamp-3">
            {t("feat_cli_desc")}
          </p>
          <Link href="/cli" className="inline-flex items-center text-sm font-medium text-brand hover:text-brand-light">
            {t("go_to_cli")} <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Getting Started CTA */}
      <div className="bg-gradient-to-br from-brand/20 via-brand/5 to-transparent border border-brand/20 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">{t("ready_title")}</h2>
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          {t("ready_desc")}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/snippets/new"
            className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-light transition-colors"
          >
            {t("create_first")}
          </Link>
          <Link
            href="/feed"
            className="rounded-lg bg-white/5 border border-white/10 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            {t("explore_feed")}
          </Link>
        </div>
      </div>
    </div>
  );
}
