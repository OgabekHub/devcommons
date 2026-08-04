"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Sparkles, Terminal, Copy, Check, Cpu, Zap, Sliders, Layers, RefreshCw, Bookmark, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "@/i18n/routing";

interface PromptPlaygroundProps {
  initialSystemPrompt?: string;
  initialUserQuery?: string;
  initialModel?: string;
  isEmbedded?: boolean;
}

export default function PromptPlayground({
  initialSystemPrompt = "Siz tajiribali Senior AI & Fullstack (Next.js + TypeScript) Dasturchi va Mentor sifatida javob berishingiz kerak.\n\nQoidalar:\n1. Hamma kodlarni Clean Architecture asosida yozing.\n2. Faqatgina qisqa va tez yechimlarga fokus qilib, foydalanuvchining {{framework}} bo'yicha savoli uchun ideal proompt tajiribasini kafolatlang.",
  initialUserQuery = "Batafsil ma'lumot qidiruvi va filtr tizimi uchun eng maqbul asinxron custom hook tuzib, qanday ishlatilishini namunasi bn tushuntirib bering.",
  initialModel = "Claude 3.5 Sonnet",
  isEmbedded = false,
}: PromptPlaygroundProps) {
  const t = useTranslations("Playground");

  const [systemPrompt, setSystemPrompt] = useState(initialSystemPrompt);
  const [userQuery, setUserQuery] = useState(initialUserQuery);
  const [modelEngine, setModelEngine] = useState(initialModel);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  
  // Variables management
  const [variableValues, setVariableValues] = useState<Record<string, string>>({
    framework: "Next.js 14",
  });

  // Execution state
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [metrics, setMetrics] = useState<{ latency?: string; tokens?: number; modelUsed?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-detect {{variable}} from systemPrompt and userQuery
  const detectedVariables = useMemo(() => {
    const regex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
    const matches = new Set<string>();
    let match;
    while ((match = regex.exec(systemPrompt)) !== null) {
      if (match[1]) matches.add(match[1]);
    }
    while ((match = regex.exec(userQuery)) !== null) {
      if (match[1]) matches.add(match[1]);
    }
    return Array.from(matches);
  }, [systemPrompt, userQuery]);

  // Update variables object when new detection occurs
  useEffect(() => {
    setVariableValues((prev) => {
      const updated = { ...prev };
      for (const v of detectedVariables) {
        if (!(v in updated)) updated[v] = "";
      }
      return updated;
    });
  }, [detectedVariables]);

  const handleVariableChange = (varName: string, val: string) => {
    setVariableValues((prev) => ({ ...prev, [varName]: val }));
  };

  const handleRunAI = async () => {
    if (!systemPrompt && !userQuery) return;
    setLoading(true);
    setResponse("");
    setMetrics(null);

    try {
      const res = await fetch("/api/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt,
          userQuery,
          variables: variableValues,
          model: modelEngine,
          temperature,
          maxTokens,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResponse(data.result);
        setMetrics({
          latency: data.latency,
          tokens: data.tokens,
          modelUsed: data.modelUsed,
        });
      } else {
        setResponse(`❌ Error: ${data.error || "Execution failed"}`);
      }
    } catch (err) {
      setResponse("❌ Server connection failure. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (type: "cursor" | "prompt" | "chain") => {
    if (type === "cursor") {
      setSystemPrompt(`# .cursorrules — DevCommons Strict TypeScript & Architecture
- Maintain documentation integrity and cleanly separated component layers.
- Avoid using floating utility classes without consistent token definitions.
- Always use rigorous error boundary handling and strictly typed TypeScript with interfaces.`);
      setUserQuery("How should I structure my Next.js state management with Zustand and Supabase in this project?");
    } else if (type === "prompt") {
      setSystemPrompt(`You are an Expert Senior AI Code Reviewer. Analyze the provided snippet for vulnerability, complexity (Big-O), and adherence to SOLID principles.`);
      setUserQuery(`function fetchUsers(data) {\n  return data.map(u => ({ id: u.id, name: u.name })).filter(u => u.name != '');\n}`);
    } else if (type === "chain") {
      setSystemPrompt(`Act as an automated Workflow Chain orchestrator. Given an input tool requirement, output a valid JSON Schema defining the MCP server execution inputs and expected outputs.`);
      setUserQuery(`Create a tool schema for taking a GitHub PR URL and automatically commenting a review summary.`);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Studio Header Bar */}
      {!isEmbedded && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
              <span className="inline-block h-2 w-2 rounded-full bg-brand animate-ping" />
              <span>AI LABORATORY & PROMPT STUDIO</span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              {t("title")}
            </h1>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              {t("subtitle")}
            </p>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-gray-500 mr-1">Templates:</span>
            <button
              onClick={() => applyPreset("cursor")}
              className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 hover:border-blue-500 transition-all"
            >
              ⚡ .cursorrules
            </button>
            <button
              onClick={() => applyPreset("prompt")}
              className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 hover:border-purple-500 transition-all"
            >
              🤖 AI Reviewer
            </button>
            <button
              onClick={() => applyPreset("chain")}
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500 transition-all"
            >
              🔗 MCP Workflow
            </button>
          </div>
        </div>
      )}

      {/* Top Configuration Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#10131B] border border-white/10 rounded-2xl p-4 items-center shadow-lg">
        <div className="md:col-span-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 shrink-0">
            <Cpu className="h-4 w-4" />
            <span>MODEL ENGINE:</span>
          </div>
          <select
            value={modelEngine}
            onChange={(e) => setModelEngine(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-[#080B11] px-3 py-2 text-xs md:text-sm font-semibold text-white focus:border-brand focus:outline-none"
          >
            <option value="Claude 3.5 Sonnet">🤖 Claude 3.5 Sonnet (Anthropic)</option>
            <option value="GPT-4o (OpenAI Engine)">🚀 GPT-4o (OpenAI Engine)</option>
            <option value="Gemini 1.5 Pro">💫 Gemini 1.5 Pro (Google AI)</option>
            <option value="Cursor Agent Rules Validator">⚡ Cursor Rules Validator</option>
          </select>
        </div>

        <div className="md:col-span-7 flex flex-wrap items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 flex items-center gap-1 font-semibold">
              <Sliders className="h-3.5 w-3.5 text-brand" /> {t("temperature")}: <strong className="text-white">{temperature}</strong>
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="accent-brand cursor-pointer w-24 sm:w-32"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-semibold">{t("max_tokens")}:</span>
            <select
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="rounded-xl border border-white/15 bg-[#080B11] px-2.5 py-1.5 text-xs font-semibold text-white focus:border-brand focus:outline-none"
            >
              <option value="512">512 tokens</option>
              <option value="1024">1024 tokens</option>
              <option value="2048">2048 tokens</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Studio Workspace - Split Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Instructions & Variables (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {/* System Prompt Box */}
          <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0C0F17] shadow-xl overflow-hidden">
            <div className="flex items-center justify-between bg-[#131722] px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300">
                <Layers className="h-4 w-4 text-purple-400" />
                <span>{t("system_prompt")}</span>
              </div>
              <span className="text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono">
                Supports {"{{var}}"} syntax
              </span>
            </div>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={7}
              placeholder="Enter system rules, agent personality, or constraints..."
              className="w-full bg-transparent font-mono text-xs leading-relaxed text-gray-200 p-4 focus:outline-none resize-y"
            />
          </div>

          {/* Detected Variables Panel */}
          {detectedVariables.length > 0 && (
            <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-900/10 via-[#10131E] to-transparent p-4 space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Sliders className="h-3.5 w-3.5 text-purple-400" />
                <span>{t("variables_detected")}</span>
              </div>
              <p className="text-xs text-gray-400">{t("fill_variables")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {detectedVariables.map((varName) => (
                  <div key={varName} className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-gray-300 flex items-center gap-1">
                      <span className="text-purple-400 font-mono">{`{{${varName}}}`}</span>
                    </label>
                    <input
                      type="text"
                      value={variableValues[varName] || ""}
                      onChange={(e) => handleVariableChange(varName, e.target.value)}
                      placeholder={`Value for ${varName}`}
                      className="rounded-xl border border-white/15 bg-[#090C12] px-3 py-2 text-xs font-medium text-white focus:border-purple-400 focus:outline-none shadow-inner"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Test Message */}
          <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0C0F17] shadow-xl overflow-hidden">
            <div className="flex items-center justify-between bg-[#131722] px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300">
                <Terminal className="h-4 w-4 text-blue-400" />
                <span>{t("user_message")}</span>
              </div>
              <span className="text-[10px] text-gray-400">Sample Query</span>
            </div>
            <textarea
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              rows={5}
              placeholder="Write a test challenge or prompt query to test against your system instructions..."
              className="w-full bg-transparent font-mono text-xs leading-relaxed text-blue-100 p-4 focus:outline-none resize-y"
            />
          </div>

          {/* Action Footer Button Bar */}
          <div className="flex items-center gap-4 pt-1">
            <button
              onClick={handleRunAI}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-brand via-indigo-600 to-purple-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-brand/25 transition-all hover:scale-[1.01] hover:opacity-95 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin text-white" />
                  <span>{t("running")}</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-current text-white" />
                  <span>{t("run_btn")}</span>
                </>
              )}
            </button>

            <Link
              href="/prompts/new"
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-[#121622] px-5 py-4 text-xs font-bold text-gray-200 hover:border-brand/40 hover:bg-white/10 hover:text-white transition-all shadow-md"
              title="Save to DevCommons Library"
            >
              <Bookmark className="h-4 w-4 text-brand" />
              <span className="hidden sm:inline">{t("save_template")}</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Live Output & Simulation Viewer (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col rounded-2xl border border-white/10 bg-[#080B12] shadow-2xl overflow-hidden min-h-[560px] h-full">
          {/* Response Box Header */}
          <div className="flex items-center justify-between bg-[#111622] px-5 py-3.5 border-b border-white/10">
            <div className="flex items-center gap-2 font-bold text-gray-100 text-xs uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>{t("response_title")}</span>
            </div>

            <div className="flex items-center gap-3">
              {metrics && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 font-mono text-[11px] text-emerald-300 font-semibold">
                  ⚡ {metrics.latency} | {metrics.tokens} tokens
                </span>
              )}

              {response && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg bg-white/10 border border-white/15 px-3 py-1 text-xs font-semibold text-white hover:bg-white/20 transition-all"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? t("copied") : t("copy_result")}</span>
                </button>
              )}
            </div>
          </div>

          {/* Response Body Area */}
          <div className="flex-1 p-6 overflow-y-auto prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-gray-200">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-80 gap-4 text-gray-400 animate-pulse">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/15 border border-brand/40 shadow-lg shadow-brand/20">
                  <Sparkles className="h-7 w-7 text-brand animate-spin" />
                </div>
                <p className="font-bold text-sm text-white">{t("running")}</p>
                <span className="text-xs font-mono text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  Simulating ({modelEngine})...
                </span>
              </div>
            ) : response ? (
              <div className="space-y-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {response}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-center text-gray-500 p-6">
                <div className="h-16 w-16 rounded-2xl bg-white/[0.02] border border-dashed border-white/15 flex items-center justify-center mb-3">
                  <Zap className="h-8 w-8 text-gray-600" />
                </div>
                <p className="text-sm font-semibold text-gray-300">{t("empty_response")}</p>
                <p className="text-xs text-gray-500 max-w-sm mt-1">
                  Configure your model parameters and hit &quot;{t("run_btn")}&quot; to test prompt responses instantly in your browser.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
