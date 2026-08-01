import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

// CORS Headers for terminal and IDE extension access
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-DevCommons-Version",
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || searchParams.get("query") || "";
    const type = searchParams.get("type") || "all"; // 'all' | 'rules' | 'prompts'
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const supabase = createSupabaseServer();

    let results: Array<{ id: string; title: string; type: string; category: string; downloads: number }> = [];

    if (type === "all" || type === "rules" || type === "snippets") {
      let snippetQuery = supabase.from("snippets").select("id, title, language, view_count, votes").limit(limit);
      if (query) {
        snippetQuery = snippetQuery.ilike("title", `%${query}%`);
      }
      const { data: snippets } = await snippetQuery;
      if (snippets) {
        snippets.forEach((s) => {
          results.push({
            id: s.id,
            title: s.title,
            type: s.language || "rule",
            category: "Agent Rule / Snippet",
            downloads: s.view_count || s.votes || 12,
          });
        });
      }
    }

    if (type === "all" || type === "prompts") {
      let promptQuery = supabase.from("prompts").select("id, title, category, view_count, votes").limit(limit);
      if (query) {
        promptQuery = promptQuery.ilike("title", `%${query}%`);
      }
      const { data: prompts } = await promptQuery;
      if (prompts) {
        prompts.forEach((p) => {
          results.push({
            id: p.id,
            title: p.title,
            type: "prompt",
            category: p.category || "Workflow",
            downloads: p.view_count || p.votes || 25,
          });
        });
      }
    }

    // Sort by downloads / prominence
    results = results.sort((a, b) => b.downloads - a.downloads);

    return NextResponse.json(
      {
        status: "success",
        query,
        count: results.length,
        items: results,
        usage_hint: "Run 'devcommons pull <id>' in your terminal to import any rule into your workspace.",
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error?.message || "Failed to search DevCommons CLI index." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
