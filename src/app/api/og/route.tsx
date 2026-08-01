import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title")?.slice(0, 80) || "DevCommons AI Workflow";
    const category = searchParams.get("category")?.slice(0, 30) || "AI & Code Hub";
    const badge = searchParams.get("badge")?.slice(0, 40) || "✨ Shared Workflow";
    const author = searchParams.get("author")?.slice(0, 40) || "DevCommons Community";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#0B0F19",
            backgroundImage: "radial-gradient(circle at 80% 20%, rgba(124, 92, 252, 0.25) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)",
            padding: "60px",
            fontFamily: "sans-serif",
            border: "2px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "#7c5cfc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  color: "#ffffff",
                  fontWeight: "bold",
                }}
              >
                D
              </div>
              <span style={{ fontSize: "32px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>
                DevCommons
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 20px",
                borderRadius: "9999px",
                backgroundColor: "rgba(124, 92, 252, 0.15)",
                border: "1px solid rgba(124, 92, 252, 0.3)",
                color: "#a78bfa",
                fontSize: "22px",
                fontWeight: 600,
              }}
            >
              {badge}
            </div>
          </div>

          {/* Main Title & Category */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "950px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#38bdf8",
                fontSize: "24px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <span>#{category}</span>
            </div>
            <div
              style={{
                fontSize: "64px",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                wordBreak: "break-word",
              }}
            >
              {title}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "30px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#9ca3af", fontSize: "24px" }}>
              <span>By {author}</span>
            </div>
            <div style={{ color: "#6b7280", fontSize: "22px", fontWeight: 500 }}>
              Shared library for code, prompts & AI workflows
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (_e) {
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
