import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const errorParam = requestUrl.searchParams.get("error_description") || requestUrl.searchParams.get("error");

  // Resolve proper origin behind Vercel edge proxy / reverse proxy load balancer
  let origin = requestUrl.origin;
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  if (forwardedHost) {
    origin = `${forwardedProto}://${forwardedHost}`;
  }

  if (code) {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      // Ensure user profile exists in public.users table with GitHub username and avatar
      const user = data.user;
      const githubUsername =
        user.user_metadata?.user_name ||
        user.user_metadata?.preferred_username ||
        user.email?.split("@")[0] ||
        `user_${user.id.substring(0, 6)}`;
      const avatarUrl = user.user_metadata?.avatar_url || null;

      try {
        await supabase.from("users").upsert(
          {
            id: user.id,
            github_username: githubUsername,
            avatar_url: avatarUrl,
          },
          { onConflict: "id" }
        );
      } catch (dbError) {
        console.error("Error upserting user profile:", dbError);
      }

      // Login muvaffaqiyatli — bosh sahifaga qaytarish
      return NextResponse.redirect(`${origin}/uz`);
    } else if (error) {
      console.error("Auth callback exchange error:", error);
      return NextResponse.redirect(
        `${origin}/uz/auth?error=${encodeURIComponent(error.message || "auth_failed")}`
      );
    }
  }

  // Xato bo'lsa auth sahifasiga qaytarish (aniq xato xabarini url parameterida ko'rsatamiz)
  const errorMessage = errorParam || "auth_failed";
  return NextResponse.redirect(`${origin}/uz/auth?error=${encodeURIComponent(errorMessage)}`);
}

