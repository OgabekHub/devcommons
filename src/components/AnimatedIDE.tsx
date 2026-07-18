"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, Code2, ChevronRight, Terminal as TerminalIcon } from "lucide-react";

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
      { text: '"Xato:"', className: "text-green-300" },
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

export default function AnimatedIDE() {
  const [visibleChars, setVisibleChars] = useState(0);
  const [phase, setPhase] = useState<"typing" | "running" | "done">("typing");

  const totalChars = CODE_LINES.reduce(
    (acc, line) => acc + line.tokens.reduce((tAcc, t) => tAcc + t.text.length, 0),
    0
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (phase === "typing") {
      if (visibleChars < totalChars) {
        // Random typing speed between 30ms and 80ms
        const delay = Math.random() * 50 + 30;
        timeout = setTimeout(() => {
          setVisibleChars((prev) => prev + 1);
        }, delay);
      } else {
        // Wait a bit before running terminal
        timeout = setTimeout(() => setPhase("running"), 600);
      }
    } else if (phase === "running") {
      // Terminal runs for 1.5 seconds
      timeout = setTimeout(() => setPhase("done"), 1500);
    } else if (phase === "done") {
      // Restart loop after 4 seconds
      timeout = setTimeout(() => {
        setVisibleChars(0);
        setPhase("typing");
      }, 4000);
    }

    return () => clearTimeout(timeout);
  }, [visibleChars, phase, totalChars]);

  // Helper to slice tokens based on global char index
  const renderLine = (lineIndex: number) => {
    let charsBeforeThisLine = 0;
    for (let i = 0; i < lineIndex; i++) {
      charsBeforeThisLine += CODE_LINES[i].tokens.reduce((acc, t) => acc + t.text.length, 0);
    }

    const line = CODE_LINES[lineIndex];
    let remainingCharsInLine = Math.max(0, visibleChars - charsBeforeThisLine);

    if (remainingCharsInLine === 0) return null; // Not reached yet

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

    // Check if cursor should be on this line
    const isCurrentLine = remainingCharsInLine === 0 && (isLastRendered || visibleChars === charsBeforeThisLine + line.tokens.reduce((acc, t) => acc + t.text.length, 0));
    
    // We only show cursor during typing phase and at the very tip
    const showCursor = phase === "typing" && visibleChars > charsBeforeThisLine && isCurrentLine && visibleChars < totalChars;

    return (
      <div key={lineIndex} className="flex gap-4">
        <span className="select-none text-gray-600 w-4 text-right shrink-0">{lineIndex + 1}</span>
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
    <div
      className="relative lg:mt-0 mt-8 w-full max-w-xl mx-auto"
      style={{ perspective: "1200px" }}
    >
      {/* Massive Glow Behind IDE */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-brand/30 via-purple-500/20 to-cyan-400/20 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 30, rotateY: -12, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateY: -12, rotateX: 8 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="group relative w-full transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_0_80px_rgba(124,92,252,0.4)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Computer Screen Frame (Monitor Mockup) */}
        <div className="relative rounded-xl border-[8px] border-[#181a1f] bg-black shadow-[0_0_50px_rgba(124,92,252,0.2)] flex flex-col overflow-hidden">
          
          {/* Glare effect on screen */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-br from-white/[0.03] to-transparent" />

          {/* IDE Chrome / Header */}
          <div className="flex items-center justify-between border-b border-gray-800/60 bg-[#161224] px-4 py-3 relative z-10 mt-2">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              <div className="h-3 w-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            </div>
            <div className="flex items-center gap-2 rounded-md bg-[#221C38] px-3 py-1 text-[11px] text-gray-400 border border-gray-700/50 font-sans tracking-wide">
              <Search className="h-3 w-3" />
              devcommons / snippet.js
            </div>
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-transparent" />
            </div>
          </div>

          {/* IDE Body */}
          <div className="flex relative z-10 min-h-[320px] bg-[#0B0914]">
            {/* Sidebar */}
            <div className="hidden w-12 flex-col items-center gap-4 border-r border-gray-800/60 py-4 sm:flex bg-[#0B0914]">
              <Code2 className="h-5 w-5 text-brand" />
              <Search className="h-5 w-5 text-gray-600 hover:text-gray-400 transition-colors" />
              <Globe className="h-5 w-5 text-gray-600 hover:text-gray-400 transition-colors" />
            </div>

            {/* Code Content */}
            <div className="flex-1 p-5 font-mono text-[13px] sm:text-sm leading-loose overflow-hidden">
              <div className="space-y-1 relative">
                {CODE_LINES.map((_, i) => renderLine(i))}
                {phase === "typing" && visibleChars === totalChars && (
                  <span className="absolute bottom-0 inline-block w-2 h-4 bg-brand animate-pulse ml-0.5" />
                )}
              </div>
            </div>
          </div>

          {/* Terminal Window (Animated) */}
          <AnimatePresence>
            {(phase === "running" || phase === "done") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 border-t border-gray-800/60 bg-[#0A0812] overflow-hidden z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]"
              >
                <div className="px-4 py-2 flex items-center gap-2 border-b border-gray-800/40 bg-[#110D1A]">
                  <TerminalIcon className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-xs text-gray-400 font-sans">Terminal</span>
                </div>
                <div className="p-4 font-mono text-xs sm:text-sm space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <ChevronRight className="h-4 w-4 text-brand" />
                    <span>node snippet.js</span>
                  </div>
                  {phase === "done" && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-400 pl-6 flex items-center gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      Success! Data fetched: 200 OK
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Monitor Stand */}
        <div className="flex flex-col items-center relative z-0">
          {/* Neck */}
          <div className="h-12 w-16 bg-gradient-to-b from-[#181a1f] to-[#0a0b0d] border-l border-r border-gray-800/80 shadow-inner" />
          {/* Base Plate */}
          <div className="h-3 w-48 bg-gradient-to-b from-[#2a2d35] to-[#121418] rounded-t-md border-t border-gray-600/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)]" />
        </div>
        
        {/* Glow directly under the monitor base */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-4 bg-brand/30 blur-[20px]" />
      </motion.div>
    </div>
  );
}
