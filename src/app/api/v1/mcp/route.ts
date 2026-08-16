import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

// Basic MCP (Model Context Protocol) REST Endpoint Implementation
// This enables Claude Desktop and Cursor to pull tools and context from DevCommons directly.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { method, params } = body;

    const supabase = createSupabaseServer();

    // Handling typical MCP Methods
    switch (method) {
      case "mcp.listTools":
        return NextResponse.json({
          jsonrpc: "2.0",
          result: {
            tools: [
              {
                name: "devcommons_pull",
                description: "Pull an AI workflow, prompt, or code snippet from DevCommons by ID",
                inputSchema: {
                  type: "object",
                  properties: {
                    id: { type: "string", description: "The UUID of the snippet, prompt, or bundle to pull" }
                  },
                  required: ["id"]
                }
              },
              {
                name: "devcommons_search",
                description: "Search for AI workflows, rules, and prompts on DevCommons",
                inputSchema: {
                  type: "object",
                  properties: {
                    query: { type: "string", description: "Search query" }
                  },
                  required: ["query"]
                }
              }
            ]
          }
        });

      case "mcp.callTool":
        if (params?.name === "devcommons_pull") {
          const id = params.arguments?.id;
          
          // Try pulling bundle first
          let { data: bundle } = await supabase.from("skill_bundles").select("*").eq("id", id).single();
          if (bundle) {
            return NextResponse.json({
              jsonrpc: "2.0",
              result: { content: [{ type: "text", text: JSON.stringify(bundle.items, null, 2) }] }
            });
          }

          // Then snippet
          let { data: snippet } = await supabase.from("snippets").select("*").eq("id", id).single();
          if (snippet) {
            return NextResponse.json({
              jsonrpc: "2.0",
              result: { content: [{ type: "text", text: snippet.code }] }
            });
          }

          // Then prompt
          let { data: prompt } = await supabase.from("prompts").select("*").eq("id", id).single();
          if (prompt) {
            return NextResponse.json({
              jsonrpc: "2.0",
              result: { content: [{ type: "text", text: prompt.content }] }
            });
          }

          return NextResponse.json({ jsonrpc: "2.0", error: { code: -32602, message: "Resource not found" } });
        }
        
        if (params?.name === "devcommons_search") {
          const query = params.arguments?.query;
          const { data: snippets } = await supabase.from("snippets").select("id, title").ilike("title", `%${query}%`).limit(3);
          const { data: prompts } = await supabase.from("prompts").select("id, title").ilike("title", `%${query}%`).limit(3);
          
          return NextResponse.json({
            jsonrpc: "2.0",
            result: { 
              content: [{ 
                type: "text", 
                text: JSON.stringify({ snippets, prompts }, null, 2) 
              }] 
            }
          });
        }
        break;

      default:
        return NextResponse.json({ jsonrpc: "2.0", error: { code: -32601, message: "Method not found" } });
    }

  } catch (error) {
    return NextResponse.json({ jsonrpc: "2.0", error: { code: -32603, message: "Internal error" } });
  }
}
