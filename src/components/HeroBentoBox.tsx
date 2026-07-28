"use client";

import {
  Check,
  Code2,
  Copy,
  Search,
  Sparkles,
  Terminal,
} from "lucide-react";

const code = [
  ["const", "useResource", "= async (url) => {"],
  ["  const", "response", "= await fetch(url)"],
  ["  if", "(!response.ok) throw new Error()"],
  ["  return", "response.json()"],
  ["}", "", ""],
];

export default function HeroBentoBox({ promptText }: { promptText?: string }) {
  return (
    <div className="relative mx-auto w-full max-w-xl animate-fade-in-up">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111] shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/15 text-brand">
              <Code2 className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">useResource.ts</p>
              <p className="text-xs text-gray-500">Community snippet</p>
            </div>
          </div>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Copy code snippet"
          >
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            Copy
          </button>
        </div>

        <div className="min-h-64 px-4 py-6 font-mono text-xs leading-7 sm:px-6 sm:text-sm">
          {code.map((line, index) => (
            <div key={index} className="flex gap-4">
              <span className="w-4 select-none text-right text-gray-700">{index + 1}</span>
              <code className="text-gray-300">
                <span className="text-brand">{line[0]}</span>{" "}
                <span className="text-emerald-400">{line[1]}</span>{" "}
                <span>{line[2]}</span>
              </code>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 bg-black/20 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Terminal className="h-4 w-4" aria-hidden="true" />
            <span>TypeScript</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
            <Check className="h-4 w-4" aria-hidden="true" />
            <span>Verified</span>
          </div>
        </div>
      </div>

      <div className="relative -mt-5 ml-5 rounded-2xl border border-brand/30 bg-[#17151f] p-4 shadow-xl shadow-black/40 sm:ml-auto sm:mr-6 sm:max-w-sm animate-slide-in-right">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" />
            AI prompt
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-brand/10 px-2 py-1 text-[11px] font-medium text-brand">
            <Search className="h-3 w-3" aria-hidden="true" />
            Ready to use
          </div>
        </div>
        <p className="text-pretty text-sm leading-relaxed text-gray-300">
          {promptText ||
            "React.js uchun asinxron ma’lumot yuklaydigan universal custom hook yozib ber."}
        </p>
      </div>
    </div>
  );
}
