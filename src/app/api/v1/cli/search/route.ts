import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    
    if (!query) {
      return NextResponse.json({ success: false, error: "Search query required" }, { status: 400 });
    }

    const supabase = createSupabaseServer();

    // Search in snippets
    const { data: snippets } = await supabase
      .from("snippets")
      .select("id, title, language, description, author:users(github_username)")
      .ilike("title", `%${query}%`)
      .limit(5);

    // Search in prompts
    const { data: prompts } = await supabase
      .from("prompts")
      .select("id, title, category, description, author:users(github_username)")
      .ilike("title", `%${query}%`)
      .limit(5);

    // Search in skill bundles
    const { data: bundles } = await supabase
      .from("skill_bundles")
      .select("id, title, description, author:users(github_username)")
      .ilike("title", `%${query}%`)
      .limit(5);

    return NextResponse.json({
      success: true,
      data: {
        snippets: snippets || [],
        prompts: prompts || [],
        bundles: bundles || []
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
