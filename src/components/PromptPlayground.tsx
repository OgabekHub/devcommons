"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Sparkles, Terminal, Copy, Check, Cpu, Zap, Sliders, Layers, RefreshCw, Bookmark } from "lucide-react";
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
- Always validate inputs using robust type checks for {{target_language}}.`);
      setUserQuery("How should I properly type an asynchronous RPC response in our state manager?");
      setVariableValues({ target_language: "TypeScript & Next.js" });
      setModelEngine("Cursor Agent Rules Validator");
    } else if (type === "prompt") {
      setSystemPrompt(`You are an AI Architectural Code Reviewer specializing in {{domain}}. Analyze any submitted patch for memory leaks, O(n^2) loops, and strict interface adherence.`);
      setUserQuery("Review this array processing logic for high-frequency trading latency bottlenecks.");
      setVariableValues({ domain: "React Concurrent Mode & High Performance JS" });
      setModelEngine("Claude 3.5 Sonnet");
    } else if (type === "chain") {
      setSystemPrompt(`[Workflow Chain Step 1: Analyze Input] -> [Step 2: Generate Tests] -> [Step 3: Output Clean Doc]. You are orchestrating a multi-agent cascade for {{task}}.`);
      setUserQuery("Transform our monolitic user authentication router into clean domain micro-services with Jest mock setups.");
      setVariableValues({ task: "Enterprise Auth Migration" });
      setModelEngine("Gemini 1.5 Pro");
    }
  };

  return (
    <div className="w-full space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0A0D14] to-[#121622] p-6 shadow-2xl backdrop-blur-2xl md:p-8">
      {/* Top Header Section */}
      {!isEmbedded && (
        <div className="flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand">
              <Sparkles className="h-4 w-4 text-brand animate-pulse" />
              <span>{t("simulating_badge")}</span>
            </div>
            <h1 className="mt-1 text-2xl font-extrabold text-white md:text-3xl tracking-tight">
              {t("title")}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-400">
              {t("subtitle")}
            </p>
          </div>

          {/* Quick Presets Bar */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset("cursor")}
              className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300 transition hover:bg-blue-500/20"
            >
              ⚡ .cursorrules Preset
            </button>
            <button
              onClick={() => applyPreset("prompt")}
              className="flex items-center gap-1.5 rounded-xl border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 transition hover:bg-purple-500/20"
            >
              🤖 AI Reviewer Preset
            </button>
            <button
              onClick={() => applyPreset("chain")}
              className="flex items-center gap-1.5 rounded-xl border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
            >
              🔗 Workflow Chain Preset
            </button>
          </div>
        </div>
      )}

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Input and Parameters (7 cols) */}
        <div className="space-y-5 lg:col-span-6 xl:col-span-6">
          {/* Model Selection and Tuning Bar */}
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-1">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                <Cpu className="h-3.5 w-3.5 text-indigo-400" />
                <span>{t("model_select")}</span>
              </label>
              <select
                value={modelEngine}
                onChange={(e) => setModelEngine(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0F1420] px-3 py-2 text-sm font-semibold text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="Claude 3.5 Sonnet">🤖 Claude 3.5 Sonnet (Simulated / Anthropic)</option>
                <option value="GPT-4o (OpenAI Engine)">🚀 GPT-4o (Simulated / OpenAI)</option>
                <option value="Gemini 1.5 Pro">💫 Gemini 1.5 Pro (Google AI Engine)</option>
                <option value="Cursor Agent Rules Validator">⚡ Cursor Agent Rules Validator</option>
              </select>
            </div>

            {/* Sliders & Parameters */}
            <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Sliders className="h-3 w-3" /> {t("temperature")}:
                  </span>
                  <span className="font-bold text-brand">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="accent-brand cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-400">{t("max_tokens")}</label>
                <select
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="rounded-xl border border-white/10 bg-[#0F1420] px-2 py-1 text-xs font-semibold text-white focus:border-brand focus:outline-none"
                >
                  <option value="512">512 tokens</option>
                  <option value="1024">1024 tokens</option>
                  <option value="2048">2048 tokens</option>
                </select>
              </div>
            </div>
          </div>

          {/* System Prompt / Agent Config Area */}
          <div>
            <label className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-300">
              <span className="flex items-center gap-1.5 text-purple-300">
                <Layers className="h-4 w-4 text-purple-400" />
                {t("system_prompt")}
              </span>
              <span className="text-[11px] font-normal text-gray-500">Supports {"{{var}}"} syntax</span>
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={5}
              placeholder="Enter your system instructions, .cursorrules, or AI workflow guidelines..."
              className="w-full rounded-2xl border border-white/10 bg-[#070A10] font-mono text-xs leading-relaxed text-gray-200 p-4 transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand shadow-inner"
            />
          </div>

          {/* Detected Variables Bar */}
          {detectedVariables.length > 0 && (
            <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                <Sliders className="h-3.5 w-3.5 text-purple-400 animate-spin" />
                <span>{t("variables_detected")}</span>
              </div>
              <p className="text-xs text-gray-400">{t("fill_variables")}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {detectedVariables.map((varName) => (
                  <div key={varName} className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-gray-300 flex items-center gap-1">
                      <span className="text-purple-400">{`{{${varName}}}`}</span>
                    </label>
                    <input
                      type="text"
                      value={variableValues[varName] || ""}
                      onChange={(e) => handleVariableChange(varName, e.target.value)}
                      placeholder={`Value for ${varName}`}
                      className="rounded-xl border border-white/10 bg-[#0F1422] px-3 py-1.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Test Query */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300">
              <Terminal className="h-4 w-4 text-blue-400" />
              <span>{t("user_message")}</span>
            </label>
            <textarea
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              rows={4}
              placeholder="Write a sample question or coding challenge for your prompt to solve..."
              className="w-full rounded-2xl border border-white/10 bg-[#070A10] font-mono text-xs leading-relaxed text-blue-100 p-4 transition focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 shadow-inner"
            />
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              onClick={handleRunAI}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-all duration-300 hover:scale-[1.02] hover:opacity-90 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin text-white" />
                  <span>{t("running")}</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 text-yellow-300 fill-current" />
                  <span>{t("run_btn")}</span>
                </>
              )}
            </button>

            <Link
              href="/prompts/new"
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-xs font-semibold text-gray-300 hover:border-white/30 hover:bg-white/10 hover:text-white transition"
              title="Save this tested prompt to DevCommons"
            >
              <Bookmark className="h-4 w-4 text-brand" />
              <span className="hidden sm:inline">{t("save_template")}</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Live Output & Simulation Viewer (6 cols) */}
        <div className="flex flex-col rounded-2xl border border-white/10 bg-[#06080D] p-5 shadow-inner lg:col-span-6 xl:col-span-6 min-h-[420px]">
          {/* Header of Response Box */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2 font-semibold text-gray-200 text-sm">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span>{t("response_title")}</span>
            </div>

            {metrics && (
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-emerald-300">
                  ⚡ {metrics.latency} | {metrics.tokens} tokens
                </span>
              </div>
            )}

            {response && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-1 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? t("copied") : t("copy_result")}</span>
              </button>
            )}
          </div>

          {/* Response Output Content */}
          <div className="flex-1 overflow-y-auto prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-gray-300">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400 animate-pulse">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 border border-brand/30">
                  <Sparkles className="h-6 w-6 text-brand animate-spin" />
                </div>
                <p className="font-semibold text-sm">{t("running")}</p>
                <span className="text-xs text-gray-500">Evaluating instructions against {modelEngine}...</span>
              </div>
            ) : response ? (
              <div className="p-2 space-y-3">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {response}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl p-6">
                <Zap className="h-10 w-10 text-gray-600 mb-2 opacity-50" />
                <p className="text-sm font-medium">{t("empty_response")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
