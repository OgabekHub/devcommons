import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

// used_count'ni service_role orqali oshiradi (RPC anon'dan revoke qilingan).
async function bumpUsedCount(id: string, itemType: "snippet" | "prompt") {
  const admin = createSupabaseAdmin();
  if (!admin) return;
  const { error } = await admin.rpc("increment_used_count", { item_id: id, item_type: itemType });
  if (error) console.error("increment_used_count failed:", error);
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServer();
    const id = params.id;

    // First try snippets
    const { data: snippet } = await supabase
      .from("snippets")
      .select("*")
      .eq("id", id)
      .single();

    if (snippet) {
      await bumpUsedCount(id, "snippet");
      return NextResponse.json({
        success: true,
        type: "snippet",
        data: snippet
      });
    }

    // Then try prompts
    const { data: prompt } = await supabase
      .from("prompts")
      .select("*")
      .eq("id", id)
      .single();

    if (prompt) {
      await bumpUsedCount(id, "prompt");
      return NextResponse.json({
        success: true,
        type: "prompt",
        data: prompt
      });
    }

    // Try skill bundles
    const { data: bundle } = await supabase
      .from("skill_bundles")
      .select("*")
      .eq("id", id)
      .single();

    if (bundle) {
      return NextResponse.json({
        success: true,
        type: "bundle",
        data: bundle
      });
    }

    return NextResponse.json({ success: false, error: "Resource not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
