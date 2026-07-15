import { Code2, Github, Heart, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="relative mt-20 border-t border-gray-100 bg-white noise">
      {/* Top decoration */}
      <div className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark shadow-sm">
                <Code2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Dev<span className="text-brand">Commons</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              {t("description")}
            </p>
          </div>

          {/* Sahifalar */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("pages")}
            </h3>
            <nav className="flex flex-col gap-3 text-sm">
              <Link
                href="/snippets"
                className="group inline-flex items-center gap-1 text-gray-600 transition-colors hover:text-brand"
              >
                Snippets
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
              </Link>
              <Link
                href="/prompts"
                className="group inline-flex items-center gap-1 text-gray-600 transition-colors hover:text-brand"
              >
                Prompts
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
              </Link>
              <Link
                href="/auth"
                className="group inline-flex items-center gap-1 text-gray-600 transition-colors hover:text-brand"
              >
                {t("login")}
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
              </Link>
            </nav>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Community
            </h3>
            <nav className="flex flex-col gap-3 text-sm">
              <a
                href="https://github.com/OgabekHub/devcommons"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-brand"
              >
                <Github className="h-4 w-4" />
                GitHub
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
              </a>
            </nav>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("status")}
            </h3>
            <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-600">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {t("all_systems")}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} DevCommons. {t("open_source")}
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-gray-400">
            <Heart className="h-3.5 w-3.5 text-red-400 animate-bounce-subtle" />
            {t("made_with_love")}
          </p>
        </div>
      </div>
    </footer>
  );
}
