"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Code2, Copy, Loader2, Sparkles, Terminal } from "lucide-react";

// Kod tokenlari — har biri o'z rangi bilan (typewriter'da harflarga bo'linadi)
type Tok = { v: string; c: string };
const LINES: Tok[][] = [
  [
    { v: "const", c: "text-brand" },
    { v: " useResource ", c: "text-emerald-400" },
    { v: "= ", c: "text-zinc-500" },
    { v: "async", c: "text-brand" },
    { v: " (url) => {", c: "text-zinc-300" },
  ],
  [
    { v: "  const", c: "text-brand" },
    { v: " response ", c: "text-zinc-300" },
    { v: "= ", c: "text-zinc-500" },
    { v: "await", c: "text-brand" },
    { v: " fetch", c: "text-emerald-400" },
    { v: "(url)", c: "text-zinc-300" },
  ],
  [
    { v: "  if", c: "text-brand" },
    { v: " (!response.ok) ", c: "text-zinc-300" },
    { v: "throw", c: "text-brand" },
    { v: " new", c: "text-brand" },
    { v: " Error", c: "text-emerald-400" },
    { v: "()", c: "text-zinc-300" },
  ],
  [
    { v: "  return", c: "text-brand" },
    { v: " response", c: "text-zinc-300" },
    { v: ".json", c: "text-emerald-400" },
    { v: "()", c: "text-zinc-300" },
  ],
  [{ v: "}", c: "text-zinc-300" }],
];

export default function HeroBentoBox({ promptText }: { promptText?: string }) {
  const reduce = useReducedMotion();

  // Har bir belgini global indeks + qator raqami bilan tekislaymiz
  const { chars, lineOffsets, total } = useMemo(() => {
    const chars: { ch: string; c: string; li: number }[] = [];
    const lineOffsets: number[] = [];
    LINES.forEach((toks, li) => {
      lineOffsets[li] = chars.length;
      toks.forEach((tok) => {
        for (const ch of tok.v) chars.push({ ch, c: tok.c, li });
      });
    });
    return { chars, lineOffsets, total: chars.length };
  }, []);

  // Typewriter: belgilarni bosqichma-bosqich ochamiz
  const [count, setCount] = useState(reduce ? total : 0);
  const done = count >= total;

  useEffect(() => {
    if (reduce) {
      setCount(total);
      return;
    }
    setCount(0);
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= total) {
          clearInterval(id);
          return c;
        }
        return c + 2; // yumshoq, lekin tez
      });
    }, 32);
    return () => clearInterval(id);
  }, [reduce, total]);

  const floatA = reduce ? {} : { y: [0, -12, 0] };
  const floatB = reduce ? {} : { y: [0, 10, 0] };

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Yumshoq nur (glow) — kartani orqasidan */}
      <motion.div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-brand/30 via-fuchsia-500/10 to-transparent blur-3xl"
        animate={reduce ? {} : { opacity: [0.45, 0.8, 0.45], scale: [1, 1.06, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Kod kartasi — asosiy "model" */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          animate={floatA}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="overflow-hidden rounded-3xl border border-line bg-surface-subtle shadow-2xl shadow-black/40"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/15 text-brand">
                <Code2 className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-fg">useResource.ts</p>
                <p className="text-xs text-zinc-500">Community snippet</p>
              </div>
            </div>
            <button
              type="button"
              className="flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-xs font-medium text-zinc-300 transition-colors hover:bg-ink/5 hover:text-fg focus:outline-none focus:ring-2 focus:ring-brand"
              aria-label="Copy code snippet"
            >
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              Copy
            </button>
          </div>

          {/* Kod — typewriter */}
          <div className="min-h-64 px-4 py-6 font-mono text-xs leading-7 sm:px-6 sm:text-sm">
            {LINES.map((_, li) => {
              const start = lineOffsets[li]!;
              const end = (lineOffsets[li + 1] ?? total);
              const revealed = Math.max(0, Math.min(count, end) - start);
              const lineChars = chars.slice(start, start + revealed);
              // Kursor shu qatorda: agar typing shu qatorga yetgan bo'lsa yoki
              // hammasi tugab, bu oxirgi qator bo'lsa
              const isCursorLine =
                (!done && count >= start && count < end) ||
                (done && li === LINES.length - 1);
              return (
                <div key={li} className="flex gap-4">
                  <span className="w-4 select-none text-right text-zinc-700">{li + 1}</span>
                  <code className="whitespace-pre">
                    {lineChars.map((c, i) => (
                      <span key={i} className={c.c}>
                        {c.ch}
                      </span>
                    ))}
                    {isCursorLine && (
                      <span className="ml-0.5 inline-block h-4 w-[2px] -mb-0.5 animate-blink bg-brand align-middle" />
                    )}
                  </code>
                </div>
              );
            })}
          </div>

          {/* Footer — typing paytida "Generating", tugagach "Verified" */}
          <div className="flex items-center justify-between border-t border-line bg-ink/5 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Terminal className="h-4 w-4" aria-hidden="true" />
              <span>TypeScript</span>
            </div>
            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-xs font-medium text-emerald-400"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                <span>Verified</span>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-brand">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Generating</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* AI prompt kartasi — suzuvchi, boshqa faza bilan */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
        className="relative -mt-6 ml-5 sm:ml-auto sm:mr-6 sm:max-w-sm"
      >
        <motion.div
          animate={floatB}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-2xl border border-brand/30 bg-surface-overlay/90 p-4 shadow-xl shadow-black/40 backdrop-blur-md"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-fg">
              <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" />
              AI prompt
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-brand/10 px-2 py-1 text-[11px] font-medium text-brand">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
              </span>
              Ready to use
            </div>
          </div>
          <p className="text-pretty text-sm leading-relaxed text-zinc-300">
            {promptText ||
              "React.js uchun asinxron ma'lumot yuklaydigan universal custom hook yozib ber."}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
