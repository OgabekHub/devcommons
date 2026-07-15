import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Login muvaffaqiyatli — bosh sahifaga qaytarish
      return NextResponse.redirect(`${origin}/uz`);
    }
  }

  // Xato bo'lsa auth sahifasiga qaytarish
  return NextResponse.redirect(`${origin}/uz/auth?error=auth_failed`);
}

