import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

// Allowed hosts for redirect (prevent open redirect attacks)
const ALLOWED_HOSTS = new Set([
  "devcommons.uz",
  "www.devcommons.uz",
  "devcommons.vercel.app",
  "localhost",
]);

function getSafeOrigin(request: Request, requestUrl: URL): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";

  if (forwardedHost) {
    // Validate forwarded host against whitelist
    const hostname = forwardedHost.split(":")[0] || ""; // Remove port if present
    if (ALLOWED_HOSTS.has(hostname)) {
      return `${forwardedProto}://${forwardedHost}`;
    }
  }

  return requestUrl.origin;
}

/** Extract locale from the referer URL or default to 'uz' */
function getLocaleFromReferer(request: Request): string {
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const refUrl = new URL(referer);
      const pathSegments = refUrl.pathname.split("/").filter(Boolean);
      const firstSegment = pathSegments[0];
      if (firstSegment === "en" || firstSegment === "uz") {
        return firstSegment;
      }
    } catch {
      // Invalid referer URL, use default
    }
  }
  return "uz";
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next"); // Return URL after login
  const errorParam = requestUrl.searchParams.get("error_description") || requestUrl.searchParams.get("error");

  // Resolve proper origin behind Vercel edge proxy / reverse proxy load balancer
  const origin = getSafeOrigin(request, requestUrl);
  const locale = getLocaleFromReferer(request);

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

      // Redirect to return URL or localized home page
      if (next && next.startsWith("/")) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      return NextResponse.redirect(`${origin}/${locale}`);
    } else if (error) {
      console.error("Auth callback exchange error:", error);
      return NextResponse.redirect(
        `${origin}/${locale}/auth?error=${encodeURIComponent(error.message || "auth_failed")}`
      );
    }
  }

  // Xato bo'lsa auth sahifasiga qaytarish (aniq xato xabarini url parameterida ko'rsatamiz)
  const errorMessage = errorParam || "auth_failed";
  return NextResponse.redirect(`${origin}/${locale}/auth?error=${encodeURIComponent(errorMessage)}`);
}
