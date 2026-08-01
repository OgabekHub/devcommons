import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { id, type, metric = "used_count" } = await req.json();

    if (!id || !["snippet", "prompt"].includes(type) || !["used_count", "forks_count"].includes(metric)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const supabase = createSupabaseServer();
    const table = type === "snippet" ? "snippets" : "prompts";

    // Attempt atomic RPC increment if available
    const { error: rpcError } = await supabase.rpc("increment_metric", {
      target_table: table,
      target_column: metric,
      item_id: id,
    });

    // Fallback if RPC function is not installed yet
    if (rpcError) {
      const { data: currentItem } = await supabase
        .from(table)
        .select(metric)
        .eq("id", id)
        .maybeSingle();

      if (currentItem && typeof currentItem[metric] === "number") {
        await supabase
          .from(table)
          .update({ [metric]: currentItem[metric] + 1 })
          .eq("id", id);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, note: "Gracefully handled stats tracking error" }, { status: 200 });
  }
}
