import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

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
    const rl = await checkRateLimit(getClientIp(request), "v1", { maxRequests: 60, windowSeconds: 60 });
    if (!rl.allowed) {
      return NextResponse.json(
        { status: "error", message: "Too many requests" },
        { status: 429, headers: CORS_HEADERS }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug") || searchParams.get("name");
    const format = searchParams.get("format") || "json"; // 'json' | 'raw'

    if (!id && !slug) {
      return NextResponse.json(
        { status: "error", message: "Missing required parameter: either 'id' or 'slug/name' must be specified." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const supabase = createSupabaseServer();
    let content = "";
    let filename = ".cursorrules";
    let title = "";
    let type = "rule";

    // Try finding in snippets table
    let snippetQuery = supabase.from("snippets").select("id, title, code, language, view_count");
    if (id) snippetQuery = snippetQuery.eq("id", id);
    else if (slug) snippetQuery = snippetQuery.ilike("title", `%${slug}%`);

    const { data: snippets } = await snippetQuery.limit(1);
    if (snippets && snippets[0]) {
      const found = snippets[0];
      content = found.code || "";
      title = found.title;
      type = found.language || "typescript";

      if (title.toLowerCase().includes("cursor") || type === ".cursorrules") filename = ".cursorrules";
      else if (title.toLowerCase().includes("claude") || type === "claude") filename = "CLAUDE.md";
      else if (title.toLowerCase().includes("windsurf")) filename = ".windsurfrules";
      else filename = `${title.toLowerCase().replace(/[^a-z0-9]/gi, "_")}.ts`;

      // Increment view/used count asynchronously
      const newCount = (found.view_count || 0) + 1;
      await supabase.from("snippets").update({ view_count: newCount }).eq("id", found.id);
    } else {
      // If not in snippets, check prompts table
      let promptQuery = supabase.from("prompts").select("id, title, content, category, view_count");
      if (id) promptQuery = promptQuery.eq("id", id);
      else if (slug) promptQuery = promptQuery.ilike("title", `%${slug}%`);

      const { data: prompts } = await promptQuery.limit(1);
      if (prompts && prompts[0]) {
        const found = prompts[0];
        content = found.content || "";
        title = found.title;
        type = "prompt";
        filename = `${title.toLowerCase().replace(/[^a-z0-9]/gi, "_")}_prompt.md`;

        const newCount = (found.view_count || 0) + 1;
        await supabase.from("prompts").update({ view_count: newCount }).eq("id", found.id);
      } else {
        // Fallback for demo / standard presets if specific DB ID not found
        title = slug || id || "Standard AI Rule";
        content = `# DevCommons AI Protocol: ${title}\n- Adhere to strict type boundaries and clean modular architectural isolation.\n- Always output verified, production-grade solutions without visual shifts or layout breaks.\n- Maintain robust error boundaries and complete documentation.`;
        filename = ".cursorrules";
      }
    }

    if (format === "raw" || format === "text") {
      return new NextResponse(content, {
        headers: { ...CORS_HEADERS, "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    return NextResponse.json(
      {
        status: "success",
        data: {
          id: id || slug,
          title,
          target_filename: filename,
          type,
          content,
          cli_instruction: `Saved automatically to ./${filename} via DevCommons Agent Engine!`,
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error?.message || "Failed to pull configuration from DevCommons." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
