import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}

export async function GET() {
  const mcpManifest = {
    schema_version: "2026-08-01",
    server_name: "devcommons-ai-mcp",
    description: "Official DevCommons Model Context Protocol (MCP) Server for Claude Desktop and Claude Code Autonomous Agents.",
    author: "DevCommons Engineering",
    endpoints: {
      search_api: "https://devcommons.uz/api/v1/cli/search",
      pull_api: "https://devcommons.uz/api/v1/cli/pull",
    },
    tools: [
      {
        name: "devcommons_search_rules",
        description: "Search for high-performance AI system prompts, .cursorrules, and CLAUDE.md guidelines across the DevCommons ecosystem.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search term (e.g. 'clean architecture', 'nextjs', 'security')" },
            limit: { type: "integer", default: 5 },
          },
          required: ["query"],
        },
      },
      {
        name: "devcommons_pull_context",
        description: "Retrieve complete file contents for a specific agent configuration or prompt to inject directly into the LLM context or local filesystem.",
        parameters: {
          type: "object",
          properties: {
            slug: { type: "string", description: "Title or slug of the rule/prompt to pull" },
            format: { type: "string", enum: ["json", "raw"], default: "raw" },
          },
          required: ["slug"],
        },
      },
    ],
    claude_desktop_config_snippet: {
      mcpServers: {
        devcommons: {
          command: "npx",
          args: ["-y", "@devcommons/mcp-server@latest"],
          env: {
            DEVCOMMONS_API_ENDPOINT: "https://devcommons.uz/api/v1",
          },
        },
      },
    },
  };

  return NextResponse.json(mcpManifest, { headers: CORS_HEADERS });
}
