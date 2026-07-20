import { Github, Heart, ArrowUpRight } from "lucide-react";
import Logo from "@/components/Logo";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="relative mt-20 border-t border-white/5 bg-[#0A0A0A] noise">
      {/* Top decoration */}
      <div className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />

      <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <Logo className="h-12 w-12" />
              <span className="text-xl font-bold tracking-tight text-white">
                Dev<span className="text-brand">Commons</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              {t("description")}
            </p>
          </div>

          {/* Sahifalar */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t("pages")}
            </h3>
            <nav className="flex flex-col gap-3 text-sm">
              <Link
                href="/snippets"
                className="group inline-flex items-center gap-1 text-gray-400 transition-colors hover:text-brand"
              >
                Snippets
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
              </Link>
              <Link
                href="/prompts"
                className="group inline-flex items-center gap-1 text-gray-400 transition-colors hover:text-brand"
              >
                Prompts
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
              </Link>
              <Link
                href="/auth"
                className="group inline-flex items-center gap-1 text-gray-400 transition-colors hover:text-brand"
              >
                {t("login")}
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
              </Link>
            </nav>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Community
            </h3>
            <nav className="flex flex-col gap-3 text-sm">
              <a
                href="https://github.com/OgabekHub/devcommons"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-brand"
              >
                <Github className="h-4 w-4" />
                GitHub
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
              </a>
            </nav>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t("status")}
            </h3>
            <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {t("all_systems")}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} DevCommons. {t("open_source")}
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-gray-500">
            <Heart className="h-3.5 w-3.5 text-red-400 animate-bounce-subtle" />
            {t("made_with_love")}
          </p>
        </div>
      </div>
    </footer>
  );
}
