import { setRequestLocale } from "next-intl/server";
import TeamDashboard from "@/components/TeamDashboard";
import type { Metadata } from "next";

interface Props {
  params: { locale: string };
}

export const metadata: Metadata = {
  title: "Team Workspaces | DevCommons",
  description: "Private AI contexts and role-based access for your team.",
};

export default function TeamsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative pb-24">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <TeamDashboard />
      </div>
    </div>
  );
}
