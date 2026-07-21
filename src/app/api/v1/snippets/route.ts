import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
  const language = searchParams.get("language");
  const apiKey = request.headers.get("x-api-key");
  
  if (!apiKey) {
    return NextResponse.json({ error: "Missing x-api-key header" }, { status: 401 });
  }

  const supabase = createSupabaseServer();
  
  // Validate API key
  const { data: keyData, error: keyError } = await supabase
    .from("api_keys")
    .select("id")
    .eq("key_hash", apiKey)
    .single();

  if (keyError || !keyData) {
    return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
  }

  // Update last used asynchronously
  supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", keyData.id).then();
  
  let query = supabase
    .from("snippets")
    .select("id, title, description, language, code, tags, view_count, votes, created_at, author:users(username)");
  
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
