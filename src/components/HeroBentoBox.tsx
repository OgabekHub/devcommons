"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Code2, Copy, Loader2, Sparkles, Terminal } from "lucide-react";

// Kod tokenlari — har biri o'z rangi bilan (typewriter'da bosqichma-bosqich ochiladi)
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

// "Verified" ko'rsatilib turadigan pauza (ms) — keyin qaytadan yoziladi
const HOLD_MS = 3500;

export default function HeroBentoBox({ promptText }: { promptText?: string }) {
  const reduce = useReducedMotion();

  // Har token uchun global boshlanish indeksini oldindan hisoblaymiz
  const { lines, total } = useMemo(() => {
    let pos = 0;
    const lines = LINES.map((toks) => {
      const start = pos;
      const tokens = toks.map((t) => {
        const s = pos;
        pos += t.v.length;
        return { ...t, start: s };
      });
      return { tokens, start, end: pos };
    });
    return { lines, total: pos };
  }, []);

  const [count, setCount] = useState(reduce ? total : 0);
  const done = count >= total;

  // Typewriter: har tickda +2 belgi. Reduced-motion'da darhol to'liq ko'rsatiladi.
  useEffect(() => {
    if (reduce) {
      setCount(total);
      return;
    }
    if (done) return;
    const id = setInterval(() => setCount((c) => Math.min(c + 2, total)), 32);
    return () => clearInterval(id);
  }, [reduce, done, total]);

  // Loop: "Verified" biroz turgach tozalab, qaytadan yozamiz
  useEffect(() => {
    if (reduce || !done) return;
    const t = setTimeout(() => setCount(0), HOLD_MS);
    return () => clearTimeout(t);
  }, [reduce, done]);

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Yumshoq nur (glow) — sof CSS pulsatsiya (re-render'ga bog'liq emas) */}
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 animate-glow-pulse rounded-[2.5rem] bg-gradient-to-tr from-brand/30 via-fuchsia-500/10 to-transparent opacity-60 blur-3xl motion-reduce:animate-none"
      />

      {/* Kod kartasi — framer faqat bir martalik kirish uchun; float sof CSS */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="animate-float-slow overflow-hidden rounded-3xl border border-line bg-surface-subtle shadow-2xl shadow-black/40 motion-reduce:animate-none">
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

          {/* Kod — typewriter (token bo'laklari bilan, kam DOM tugun) */}
          <div className="min-h-64 px-4 py-6 font-mono text-xs leading-7 sm:px-6 sm:text-sm">
            {lines.map((line, li) => {
              // Kursor: typing shu qatorda ketyapti, yoki tugagan bo'lsa oxirgi qatorda
              const isCursorLine =
                (!done && count >= line.start && count < line.end) ||
                (done && li === lines.length - 1);
              return (
                <div key={li} className="flex gap-4">
                  <span className="w-4 select-none text-right text-zinc-700">{li + 1}</span>
                  <code className="whitespace-pre">
                    {line.tokens.map((t, ti) => {
                      const vis = Math.max(0, Math.min(count - t.start, t.v.length));
                      if (vis === 0) return null;
                      return (
                        <span key={ti} className={t.c}>
                          {vis === t.v.length ? t.v : t.v.slice(0, vis)}
                        </span>
                      );
                    })}
                    {isCursorLine && (
                      <span className="ml-0.5 inline-block h-4 w-[2px] -mb-0.5 animate-blink bg-brand align-middle motion-reduce:animate-none" />
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
                initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-xs font-medium text-emerald-400"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                <span>Verified</span>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-brand">
                <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                <span>Generating</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* AI prompt kartasi — kirish framer'da, suzish sof CSS'da (boshqa faza) */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: 30, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
        className="relative -mt-3 ml-5 sm:ml-auto sm:mr-6 sm:max-w-sm"
      >
        <div className="animate-float-down rounded-2xl border border-brand/30 bg-surface-overlay/90 p-4 shadow-xl shadow-black/40 backdrop-blur-md motion-reduce:animate-none">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-fg">
              <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" />
              AI prompt
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-brand/10 px-2 py-1 text-[11px] font-medium text-brand">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
              </span>
              Ready to use
            </div>
          </div>
          <p className="text-pretty text-sm leading-relaxed text-zinc-300">
            {promptText ||
              "React.js uchun asinxron ma'lumot yuklaydigan universal custom hook yozib ber."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
