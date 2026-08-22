import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createHash } from "crypto";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "10") || 10, 1), 50);
  const language = searchParams.get("language");
  const apiKey = request.headers.get("x-api-key");
  
  if (!apiKey) {
    return NextResponse.json({ error: "Missing x-api-key header" }, { status: 401 });
  }

  const supabase = createSupabaseServer();
  
  // Hash the API key before comparing to stored hash
  const keyHash = createHash("sha256").update(apiKey).digest("hex");

  // Validate API key
  const { data: keyData, error: keyError } = await supabase
    .from("api_keys")
    .select("id")
    .eq("key_hash", keyHash)
    .single();

  if (keyError || !keyData) {
    return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
  }

  // Update last used asynchronously with error handling
  supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", keyData.id).then().catch((err) => {
    console.error("Failed to update api_key last_used_at:", err);
  });
  
  let query = supabase
    .from("snippets")
    .select("id, title, description, language, code, tags, view_count, votes, created_at, author:users(github_username)");
  
  if (language) {
    query = query.eq("language", language);
  }
  
  const { data, error } = await query.order("created_at", { ascending: false }).limit(limit);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({
    data,
    meta: { count: data.length, limit }
  });
}
