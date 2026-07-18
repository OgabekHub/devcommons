"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, Terminal as TerminalIcon, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";

type Token = { text: string; className: string };
type CodeLine = { indent: number; tokens: Token[] };

const CODE_LINES: CodeLine[] = [
  {
    indent: 0,
    tokens: [
      { text: "const ", className: "text-purple-400 font-medium" },
      { text: "fetchData ", className: "text-blue-400" },
      { text: "= ", className: "text-gray-400" },
      { text: "async ", className: "text-purple-400 font-medium" },
      { text: "(", className: "text-yellow-300" },
      { text: "url", className: "text-orange-300" },
      { text: ") ", className: "text-yellow-300" },
      { text: "=> ", className: "text-purple-400 font-medium" },
      { text: "{", className: "text-yellow-300" },
    ],
  },
  {
    indent: 2,
    tokens: [
      { text: "try ", className: "text-purple-400 font-medium" },
      { text: "{", className: "text-yellow-300" },
    ],
  },
  {
    indent: 4,
    tokens: [
      { text: "const ", className: "text-purple-400 font-medium" },
      { text: "res ", className: "text-blue-400" },
      { text: "= ", className: "text-gray-400" },
      { text: "await ", className: "text-purple-400 font-medium" },
      { text: "fetch", className: "text-green-400" },
      { text: "(", className: "text-yellow-300" },
      { text: "url", className: "text-orange-300" },
      { text: ");", className: "text-yellow-300" },
    ],
  },
  {
    indent: 4,
    tokens: [
      { text: "return await ", className: "text-purple-400 font-medium" },
      { text: "res", className: "text-blue-400" },
      { text: ".", className: "text-gray-300" },
      { text: "json", className: "text-green-400" },
      { text: "();", className: "text-yellow-300" },
    ],
  },
  {
    indent: 2,
    tokens: [
      { text: "} ", className: "text-yellow-300" },
      { text: "catch ", className: "text-purple-400 font-medium" },
      { text: "(", className: "text-yellow-300" },
      { text: "err", className: "text-orange-300" },
      { text: ") ", className: "text-yellow-300" },
      { text: "{", className: "text-yellow-300" },
    ],
  },
  {
    indent: 4,
    tokens: [
      { text: "console", className: "text-blue-400" },
      { text: ".", className: "text-gray-300" },
      { text: "error", className: "text-green-400" },
      { text: "(", className: "text-yellow-300" },
      { text: '"Error:"', className: "text-green-300" },
      { text: ", ", className: "text-gray-300" },
      { text: "err", className: "text-orange-300" },
      { text: ");", className: "text-yellow-300" },
    ],
  },
  {
    indent: 2,
    tokens: [{ text: "}", className: "text-yellow-300" }],
  },
  {
    indent: 0,
    tokens: [{ text: "};", className: "text-yellow-300" }],
  },
];

export default function HeroBentoBox({ promptText }: { promptText?: string }) {
  const [visibleChars, setVisibleChars] = useState(0);

  const totalChars = CODE_LINES.reduce(
    (acc, line) => acc + line.tokens.reduce((tAcc, t) => tAcc + t.text.length, 0),
    0
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (visibleChars < totalChars) {
      const delay = Math.random() * 40 + 20;
      timeout = setTimeout(() => {
        setVisibleChars((prev) => prev + 1);
      }, delay);
    } else {
      timeout = setTimeout(() => {
        setVisibleChars(0);
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [visibleChars, totalChars]);

  const renderLine = (lineIndex: number) => {
    let charsBeforeThisLine = 0;
    for (let i = 0; i < lineIndex; i++) {
      charsBeforeThisLine += CODE_LINES[i].tokens.reduce((acc, t) => acc + t.text.length, 0);
    }

    const line = CODE_LINES[lineIndex];
    let remainingCharsInLine = Math.max(0, visibleChars - charsBeforeThisLine);

    if (remainingCharsInLine === 0) return null;

    const renderedTokens = [];
    let isLastRendered = false;

    for (let i = 0; i < line.tokens.length; i++) {
      const token = line.tokens[i];
      if (remainingCharsInLine >= token.text.length) {
        renderedTokens.push(
          <span key={i} className={token.className}>
            {token.text}
          </span>
        );
        remainingCharsInLine -= token.text.length;
      } else if (remainingCharsInLine > 0) {
        renderedTokens.push(
          <span key={i} className={token.className}>
            {token.text.substring(0, remainingCharsInLine)}
          </span>
        );
        remainingCharsInLine = 0;
        isLastRendered = true;
      } else {
        break;
      }
    }

    const isCurrentLine = remainingCharsInLine === 0 && (isLastRendered || visibleChars === charsBeforeThisLine + line.tokens.reduce((acc, t) => acc + t.text.length, 0));
    const showCursor = visibleChars > charsBeforeThisLine && isCurrentLine && visibleChars < totalChars;

    return (
      <div key={lineIndex} className="flex gap-3">
        <span className="select-none text-white/20 w-4 text-right shrink-0">{lineIndex + 1}</span>
        <div
          className="text-gray-300 relative whitespace-pre"
          style={{ paddingLeft: `${line.indent * 0.5}rem` }}
        >
          {renderedTokens}
          {showCursor && (
            <span className="inline-block w-2 h-4 bg-brand animate-pulse ml-0.5 align-middle" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[450px] lg:mt-0 mt-12 perspective-1000">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 via-purple-500/10 to-transparent blur-[80px] -z-10" />

      {/* Main Panel: Code Snippet */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 top-10 left-4 right-12 z-10"
      >
        <div
          className="h-full rounded-2xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col animate-float-slow"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-brand" />
              <span className="text-xs font-medium text-gray-300">fetchData.ts</span>
            </div>
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            </div>
          </div>
          {/* Body */}
          <div className="p-5 font-mono text-[13px] sm:text-sm leading-relaxed overflow-hidden">
            <div className="space-y-1 relative">
              {CODE_LINES.map((_, i) => renderLine(i))}
              {visibleChars === totalChars && (
                <span className="absolute bottom-0 inline-block w-2 h-4 bg-brand animate-pulse ml-0.5" />
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Top Right Panel: AI Prompt */}
      <motion.div
        initial={{ opacity: 0, x: 40, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="absolute -top-4 right-0 w-64 z-20"
      >
        <div
          className="rounded-xl border border-purple-500/30 bg-[#1A1525]/90 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.4)] p-4 animate-float"
          style={{ animationDelay: "1s" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-white">AI Prompt</span>
          </div>
          <p className="text-xs text-purple-200/70 leading-relaxed">
            {promptText || "\"React.js uchun asinxron ma'lumot yuklaydigan universal custom hook yozib ber.\""}
          </p>
        </motion.div>
      </motion.div>

      {/* Bottom Left Panel: Terminal */}
      <motion.div
        initial={{ opacity: 0, x: -40, y: 40 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="absolute -bottom-6 -left-6 w-72 z-30"
      >
        <div
          className="rounded-xl border border-white/10 bg-[#050505]/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-float-slower"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 border-b border-white/5">
            <TerminalIcon className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs font-mono text-gray-400">bash</span>
          </div>
          <div className="p-4 font-mono text-xs space-y-2">
            <div className="flex items-center gap-2 text-gray-300">
              <ChevronRight className="h-3 w-3 text-brand" />
              <span>npm run test</span>
            </div>
            <div className="flex items-center gap-2 text-green-400 pl-5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>All 24 tests passed!</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
