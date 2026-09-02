import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { createHash } from "crypto";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const rl = await checkRateLimit(getClientIp(request), "v1", { maxRequests: 60, windowSeconds: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "10") || 10, 1), 50);
  const category = searchParams.get("category");
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json({ error: "Missing x-api-key header" }, { status: 401 });
  }

  // Kalit qidiruvi service_role bilan (api_keys RLS auth.uid()=user_id bilan
  // himoyalangan — CLI so'rovida sessiya bo'lmaydi).
  const admin = createSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Service not configured" }, { status: 503 });
  }

  const keyHash = createHash("sha256").update(apiKey).digest("hex");

  const { data: keyData, error: keyError } = await admin
    .from("api_keys")
    .select("id")
    .eq("key_hash", keyHash)
    .single();

  if (keyError || !keyData) {
    return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
  }

  admin.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", keyData.id).then(({ error: updateError }) => {
    if (updateError) console.error("Failed to update api_key last_used_at:", updateError);
  });

  // Ma'lumotlar anon client orqali — RLS public bo'lmagan kontentni yashiradi.
  const supabase = createSupabaseServer();

  let query = supabase
    .from("prompts")
    .select("id, title, description, category, ai_model, content, tags, view_count, votes, created_at, author:users(github_username)");
  
  if (category) {
    query = query.eq("category", category);
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
