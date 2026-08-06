"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, CheckCircle2, Play, Copy, Check, Sparkles, Layers, ShieldCheck } from "lucide-react";

export interface StepItem {
  id: number;
  role: string;
  model: string;
  instruction: string;
  outputPreview?: string;
}

interface PromptChainViewerProps {
  title: string;
  description: string;
  steps?: StepItem[];
}

const DEFAULT_STEPS: StepItem[] = [
  {
    id: 1,
    role: "Architectural & Security Auditor (Claude 3.5 Sonnet)",
    model: "claude-3-5-sonnet",
    instruction: "Analyze the input project structure and codebase for architectural coupling, OWASP vulnerabilities, and type safety issues. Output a strict audit matrix in JSON.",
    outputPreview: `{\n  "vulnerabilities": ["Unprotected API route", "Loose TypeScript any in RPC"],\n  "architectureScore": 82,\n  "recommendedRefactor": "Isolate repository boundary via Interface Injection"\n}`
  },
  {
    id: 2,
    role: "Code Transformer & Refactoring Agent (Gemini 1.5 Pro)",
    model: "gemini-1.5-pro",
    instruction: "Receive the JSON audit matrix from Step 1. Rewrite the problematic modules adopting Clean Architecture principles, strict types, and resilient error handling boundaries.",
    outputPreview: `// Refactored modular layer produced from Step 1 Matrix\nexport interface IAuthService {\n  verifySession(token: string): Promise<SessionResult>;\n}`
  },
  {
    id: 3,
    role: "Verifier & Test Generation Engine (GPT-4o)",
    model: "gpt-4o",
    instruction: "Take the refactored code from Step 2. Automatically construct comprehensive Jest unit tests and generate markdown API documentation for end developers.",
    outputPreview: `describe('IAuthService Execution', () => {\n  it('validates secure session boundaries without leaking tokens', async () => {\n    // Automated test assertions validated\n  });\n});`
  }
];

export default function PromptChainViewer({
  title,
  description,
  steps = DEFAULT_STEPS,
}: PromptChainViewerProps) {
  const t = useTranslations("Workflows");

  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleRunChain = () => {
    setRunning(true);
    setCompleted(false);
    setActiveStep(1);

    // Sequence steps
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setActiveStep(step.id);
        if (idx === steps.length - 1) {
          setTimeout(() => {
            setRunning(false);
            setCompleted(true);
            setActiveStep(null);
          }, 1200);
        }
      }, (idx + 1) * 1500);
    });
  };

  const copyStepPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B0E17] to-[#141A29] p-6 shadow-2xl transition-all hover:border-purple-500/30 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-3 pb-6 md:flex-row md:items-center md:justify-between border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Layers className="h-4 w-4 animate-pulse text-purple-400" />
            <span>Multi-Step Prompt Chain</span>
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-3 w-3" /> {t("verified_badge")}
            </span>
          </div>
          <h3 className="mt-1 text-xl font-black text-white sm:text-2xl">{title}</h3>
          <p className="mt-1 max-w-2xl text-xs sm:text-sm text-gray-400 leading-relaxed">{description}</p>
        </div>

        <button
          onClick={handleRunChain}
          disabled={running}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/30 transition hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <Play className="h-4 w-4 fill-current text-white" />
          <span>{running ? t("chain_progress") : t("run_chain")}</span>
        </button>
      </div>

      {/* Chain Timeline / Visualizer */}
      <div className="mt-8 space-y-6">
        {steps.map((step, idx) => {
          const isCurrent = activeStep === step.id;
          const isPassed = completed || (activeStep && activeStep > step.id);

          return (
            <div key={step.id} className="relative">
              {/* Connector Line between nodes */}
              {idx < steps.length - 1 && (
                <div className="absolute left-6 top-14 h-full w-0.5 bg-gradient-to-b from-purple-500/50 to-indigo-500/20 z-0" />
              )}

              <div
                className={`relative z-10 flex flex-col gap-4 rounded-2xl border p-5 transition-all duration-300 ${
                  isCurrent
                    ? "border-purple-400 bg-purple-500/10 shadow-[0_0_25px_rgba(168,85,247,0.2)] scale-[1.01]"
                    : isPassed
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-white/10 bg-[#090C13] hover:border-white/20"
                }`}
              >
                {/* Step Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl font-black text-xs shadow-md transition ${
                        isCurrent
                          ? "bg-purple-500 text-white animate-bounce"
                          : isPassed
                          ? "bg-emerald-500 text-white"
                          : "bg-white/10 text-gray-400"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="h-5 w-5" /> : `${step.id}`}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base">{step.role}</h4>
                      <span className="text-[11px] font-mono text-gray-500">Model Engine: {step.model}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => copyStepPrompt(step.instruction, idx)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:border-purple-400 hover:text-white transition"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{t("copy_step_prompt")}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instruction Content */}
                <div className="rounded-xl bg-[#06080C] p-4 font-mono text-xs text-gray-300 border border-white/5 leading-relaxed">
                  <span className="text-purple-400 font-semibold">{"// Prompt Instruction:"}</span> {step.instruction}
                </div>

                {/* Output simulation preview if active or completed */}
                {(isCurrent || isPassed) && step.outputPreview && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 font-mono text-xs text-emerald-300 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 pb-1 border-b border-emerald-500/20 mb-2">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Simulated Step Output (Feeds next node in sequence):</span>
                    </div>
                    <pre className="whitespace-pre-wrap overflow-x-auto text-gray-300 text-[11px]">
                      {step.outputPreview}
                    </pre>
                  </div>
                )}
              </div>

              {/* Arrow Indicator */}
              {idx < steps.length - 1 && (
                <div className="my-2 flex justify-center text-purple-400/60">
                  <ArrowRight className="h-5 w-5 rotate-90 animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {completed && (
        <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 p-4 text-emerald-300 font-bold text-sm animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span>{t("chain_success")}</span>
        </div>
      )}
    </div>
  );
}
