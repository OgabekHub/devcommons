import React from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { setRequestLocale } from "next-intl/server";

export default function AppLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <DashboardShell>{children}</DashboardShell>;
}
