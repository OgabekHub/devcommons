import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function GET(
  req: Request,
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
      // Increment used_count for CLI pulls
      await supabase.rpc('increment_used_count', { item_id: id, item_type: 'snippet' }).catch(() => {});
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
      await supabase.rpc('increment_used_count', { item_id: id, item_type: 'prompt' }).catch(() => {});
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
