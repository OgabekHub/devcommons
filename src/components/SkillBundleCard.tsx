"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Package, Copy, Check, Download, ShieldCheck, FileText, Code2, Sparkles, FolderOpen } from "lucide-react";

export interface BundleItem {
  filename: string;
  type: "rule" | "prompt" | "code";
  content: string;
}

interface SkillBundleCardProps {
  title: string;
  description: string;
  category: string;
  author: string;
  items?: BundleItem[];
}

const DEFAULT_ITEMS: BundleItem[] = [
  {
    filename: ".cursorrules",
    type: "rule",
    content: `# DevCommons Strict Typescript & Architecture Rules
- Use Server Components by default unless interactive browser state is strictly required.
- Enable strict null checks and avoid floating Promises.
- Organize database accesses cleanly inside the repository/service folder layer.`
  },
  {
    filename: "SystemPrompt.md",
    type: "prompt",
    content: `You are a Senior Fullstack Architect assigned to enhance a production Next.js 14 web application. When responding to user queries, adhere strictly to the .cursorrules file in the working root and prioritize performance, accessibility (a11y), and zero visual shift layouts.`
  },
  {
    filename: "ApiResponseHelper.ts",
    type: "code",
    content: `export interface ApiResult<T> {\n  success: boolean;\n  data?: T;\n  error?: string;\n  timestamp: number;\n}\n\nexport function sendSuccess<T>(data: T): ApiResult<T> {\n  return { success: true, data, timestamp: Date.now() };\n}`
  }
];

export default function SkillBundleCard({
  title,
  description,
  category,
  author,
  items = DEFAULT_ITEMS,
}: SkillBundleCardProps) {
  const t = useTranslations("Workflows");
  const [selectedItemIdx, setSelectedItemIdx] = useState(0);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSingle, setCopiedSingle] = useState(false);

  const selectedItem = items[selectedItemIdx] || items[0];

  const handleCopyAll = () => {
    const allContent = items
      .map((item) => `=== [ FILE: ${item.filename} (${item.type.toUpperCase()}) ] ===\n${item.content}\n`)
      .join("\n\n");
    navigator.clipboard.writeText(allContent);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleCopySingle = () => {
    if (!selectedItem) return;
    navigator.clipboard.writeText(selectedItem.content);
    setCopiedSingle(true);
    setTimeout(() => setCopiedSingle(false), 2000);
  };

  const handleDownloadSim = () => {
    const allContent = items
      .map((item) => `=== [ FILE: ${item.filename} ] ===\n${item.content}\n`)
      .join("\n\n");
    const blob = new Blob([allContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/gi, "_")}_bundle.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B0D14] via-[#0F1420] to-[#121929] p-6 shadow-2xl transition-all duration-300 hover:border-cyan-500/30 md:p-8">
      {/* Top Details */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
              <Package className="h-3.5 w-3.5" />
              <span>Skill Bundle</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{t("verified_badge")}</span>
            </span>
            <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-gray-400">
              {category}
            </span>
          </div>

          <h3 className="mt-3 text-xl font-extrabold text-white sm:text-2xl">{title}</h3>
          <p className="mt-1 max-w-2xl text-xs sm:text-sm text-gray-300 leading-relaxed">{description}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <span>Curated by <strong className="text-white font-medium">{author}</strong></span>
            <span>•</span>
            <span className="text-cyan-400 font-semibold">{items.length} Bundled Context Files</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-105 active:scale-95"
          >
            {copiedAll ? (
              <>
                <Check className="h-4 w-4 text-white" />
                <span>{t("bundle_copied")}</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>{t("copy_bundle_all")}</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleDownloadSim}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
            title="Download all bundle files"
          >
            <Download className="h-4 w-4 text-cyan-400" />
            <span className="hidden sm:inline">{t("download_bundle")}</span>
          </button>
        </div>
      </div>

      {/* File Explorer & Preview Section */}
      <div className="mt-6 flex flex-col gap-4 lg:flex-row">
        {/* File Sidebar */}
        <div className="flex flex-row overflow-x-auto gap-2 border-b border-white/10 pb-3 lg:flex-col lg:w-64 lg:overflow-x-visible lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4 shrink-0">
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            <FolderOpen className="h-3.5 w-3.5 text-cyan-400" />
            <span>{t("bundle_items")}</span>
          </div>
          {items.map((item, idx) => (
            <button
              key={item.filename}
              onClick={() => setSelectedItemIdx(idx)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-left transition-all shrink-0 ${
                selectedItemIdx === idx
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent"
              }`}
            >
              {item.type === "rule" && <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />}
              {item.type === "prompt" && <FileText className="h-4 w-4 text-yellow-400 shrink-0" />}
              {item.type === "code" && <Code2 className="h-4 w-4 text-emerald-400 shrink-0" />}
              <span className="truncate">{item.filename}</span>
            </button>
          ))}
        </div>

        {/* Content Viewer */}
        <div className="flex flex-1 flex-col rounded-2xl border border-white/10 bg-[#06080D] p-4 shadow-inner min-w-0">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-200">
              <span className="text-cyan-400">📄 {selectedItem?.filename}</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-gray-400">
                {selectedItem?.type}
              </span>
            </div>
            <button
              onClick={handleCopySingle}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-300 hover:text-white hover:bg-white/10 transition"
            >
              {copiedSingle ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
              <span>{copiedSingle ? "Copied!" : "Copy file"}</span>
            </button>
          </div>

          <pre className="overflow-x-auto font-mono text-xs sm:text-sm text-gray-300 leading-relaxed p-2">
            {selectedItem?.content}
          </pre>
        </div>
      </div>
    </div>
  );
}
