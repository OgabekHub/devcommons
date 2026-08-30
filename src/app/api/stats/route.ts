import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit stats tracking: 30 requests per minute per IP
    const clientIp = getClientIp(req);
    const rateLimitResult = checkRateLimit(clientIp, "stats", { maxRequests: 30, windowSeconds: 60 });
    if (!rateLimitResult.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { id, type, metric = "used_count" } = await req.json();

    if (!id || !["snippet", "prompt"].includes(type) || !["used_count", "forks_count"].includes(metric)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Service not configured" },
        { status: 503 }
      );
    }
    const table = type === "snippet" ? "snippets" : "prompts";

    // Use atomic RPC increment to avoid race conditions
    const { error: rpcError } = await supabase.rpc("increment_metric", {
      target_table: table,
      target_column: metric,
      item_id: id,
    });

    if (rpcError) {
      console.error("Stats increment error:", rpcError);
      return NextResponse.json(
        { success: false, error: "Failed to update metric" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Stats API error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
