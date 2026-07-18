"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase";

interface GitHubLoginButtonProps {
  text: string;
  className?: string;
}

export default function GitHubLoginButton({ text, className }: GitHubLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseBrowser();

  const handleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button onClick={handleLogin} disabled={loading} className={className}>
      {loading ? (
        <svg className="mr-2 h-5 w-5 animate-spin inline" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {loading ? "..." : text}
    </button>
  );
}
