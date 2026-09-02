import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Users, Lock, Terminal, ShieldCheck, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { locale: string };
}

export const metadata: Metadata = {
  title: "Team Workspaces | DevCommons",
  description: "Private AI contexts and role-based access for your team.",
};

// Halol "tez kunda" sahifasi — avvalgi soxta mock dashboard olib tashlandi.
export default async function TeamsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("Teams");

  const FEATURES = [
    { icon: Lock, title: t("feature_1_title"), desc: t("feature_1_desc") },
    { icon: ShieldCheck, title: t("feature_2_title"), desc: t("feature_2_desc") },
    { icon: Terminal, title: t("feature_3_title"), desc: t("feature_3_desc") },
  ];

  return (
    <div className="min-h-screen bg-surface relative pb-24">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-3xl px-4 py-16 md:py-24">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <Users className="h-8 w-8" />
          </div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand/10 border border-brand/20 px-3 py-1 text-xs font-semibold text-brand">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            {t("badge")}
          </div>
          <h1 className="text-3xl font-bold text-fg sm:text-4xl">{t("title")}</h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 text-center">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <f.icon className="h-5 w-5" />
              </div>
              <h2 className="mb-2 text-sm font-semibold text-fg">{f.title}</h2>
              <p className="text-xs leading-relaxed text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-dashed border-line bg-surface-subtle p-6 text-center">
          <p className="text-sm text-zinc-400">{t("waitlist_hint")}</p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="btn-secondary inline-flex">
            <ArrowLeft className="h-4 w-4" />
            {t("back_home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
