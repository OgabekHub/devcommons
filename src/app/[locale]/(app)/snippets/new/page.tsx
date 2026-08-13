"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Code2, Save, Plus, X } from "lucide-react";
import { Link } from "@/i18n/routing";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import CustomSelect from "@/components/CustomSelect";
import Editor from "@monaco-editor/react";
import { ALL_SUPPORTED_LANGUAGES as LANGUAGES } from "@/lib/agent-config";

const TEMPLATES = [
  {
    label: "⚡ Cursor Rules (.cursorrules)",
    language: "Cursor Rule",
    tag: "cursorrules",
    title: "Next.js 14 & Tailwind Production .cursorrules",
    description: "Strict TypeScript guidelines and zero layout-shift best practices for AI code generation in Cursor IDE.",
    code: `# Cursor AI Agent Rules for Next.js 14 App Router\n1. Always write concise, modular TypeScript with strict type definitions.\n2. Use vanilla CSS or Tailwind styling without layout-shifting hover effects.\n3. Prioritize functional React components and clean hook separations.\n4. When handling async fetching, leverage React Server Components by default.`
  },
  {
    label: "React Component",
    language: "TypeScript",
    tag: "react",
    title: "React Functional Component with Props",
    description: "Clean functional component pattern using TypeScript interface for props and state hook.",
    code: `import React, { useState } from "react";\n\ninterface Props {\n  title: string;\n  initialCount?: number;\n}\n\nexport const MyComponent: React.FC<Props> = ({ title, initialCount = 0 }) => {\n  const [count, setCount] = useState(initialCount);\n\n  return (\n    <div className="p-4 border rounded-xl">\n      <h2 className="text-xl font-bold">{title}</h2>\n      <p>Current count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n};`
  },
  {
    label: "Next.js API Route",
    language: "TypeScript",
    tag: "nextjs",
    title: "Next.js App Router GET/POST Handler",
    description: "Standard pattern for App Router API route handlers with error wrapping and JSON response.",
    code: `import { NextRequest, NextResponse } from "next/server";\n\nexport async function GET(req: NextRequest) {\n  try {\n    return NextResponse.json({ status: "success", data: "Hello World" });\n  } catch (error) {\n    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });\n  }\n}\n\nexport async function POST(req: NextRequest) {\n  const body = await req.json();\n  return NextResponse.json({ received: body }, { status: 201 });\n}`
  },
  {
    label: "Express REST Router",
    language: "JavaScript",
    tag: "express",
    title: "Express REST Router with Error Handling",
    description: "Modular express router setup with CRUD operations and centralized async handler.",
    code: `const express = require("express");\nconst router = express.Router();\n\n// Async wrapper\nconst asyncHandler = (fn) => (req, res, next) =>\n  Promise.resolve(fn(req, res, next)).catch(next);\n\nrouter.get("/users", asyncHandler(async (req, res) => {\n  const users = [{ id: 1, name: "John Doe" }];\n  res.json({ success: true, data: users });\n}));\n\nmodule.exports = router;`
  },
  {
    label: "Python FastAPI",
    language: "Python",
    tag: "fastapi",
    title: "FastAPI Router with Pydantic Schema",
    description: "Modern Python async API endpoint with type validation using Pydantic.",
    code: `from fastapi import APIRouter, HTTPException\nfrom pydantic import BaseModel\n\nrouter = APIRouter()\n\nclass Item(BaseModel):\n    name: str\n    price: float\n    is_offer: bool = None\n\n@router.post("/items/")\nasync def create_item(item: Item):\n    if item.price <= 0:\n        raise HTTPException(status_code=400, detail="Price must be positive")\n    return {"item_name": item.name, "price_with_tax": item.price * 1.12}`
  },
  {
    label: "SQL Relational Schema",
    language: "SQL",
    tag: "sql",
    title: "PostgreSQL Users & Posts Relational Table Setup",
    description: "Clean SQL schema creation with UUID primary keys, foreign key constraints, and automatic timestamps.",
    code: `CREATE TABLE users (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  username VARCHAR(50) UNIQUE NOT NULL,\n  created_at TIMESTAMPTZ DEFAULT now()\n);\n\nCREATE TABLE posts (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID REFERENCES users(id) ON DELETE CASCADE,\n  title TEXT NOT NULL,\n  content TEXT,\n  created_at TIMESTAMPTZ DEFAULT now()\n);\n\nCREATE INDEX idx_posts_user_id ON posts(user_id);`
  },
  {
    label: "Docker Compose",
    language: "YAML",
    tag: "docker",
    title: "Docker Compose for Node.js + PostgreSQL + Redis",
    description: "Complete multi-container Docker development environment with database volumes and healthchecks.",
    code: `version: '3.8'\nservices:\n  api:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      DATABASE_URL: postgres://user:pass@db:5432/myapp\n    depends_on:\n      - db\n      - redis\n  db:\n    image: postgres:15-alpine\n    restart: always\n    environment:\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: pass\n      POSTGRES_DB: myapp\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n    ports:\n      - "5432:5432"\n  redis:\n    image: redis:7-alpine\n    ports:\n      - "6379:6379"\nvolumes:\n  pgdata:`
  }
];

export default function NewSnippetPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("NewSnippet");
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("devcommons_fork_item");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.content) setCode(parsed.content);
        if (parsed.languageOrCategory) setLanguage(parsed.languageOrCategory);
        if (parsed.parent_id) setDescription(`Forked derived revision from resource #${parsed.parent_id.slice(0, 8)}`);
        sessionStorage.removeItem("devcommons_fork_item");
      }
    } catch {
      // Ignore sessionStorage parsing errors
    }
  }, []);

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const applyTemplate = (tpl: (typeof TEMPLATES)[number]) => {
    setTitle(tpl.title);
    setDescription(tpl.description);
    setLanguage(tpl.language);
    setCode(tpl.code);
    if (tpl.tag && !tags.includes(tpl.tag)) {
      setTags([...tags, tpl.tag].slice(0, 5));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !code.trim()) {
      setError(t("error_required"));
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error: insertError } = await supabase
        .from("snippets")
        .insert({
          title: title.trim(),
          description: description.trim(),
          code: code.trim(),
          language,
          author_id: user?.id ?? null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      router.push(`/${locale}/snippets`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Xato yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Back */}
      <Link
        href="/snippets"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4 transition-transform " />
        {t("back")}
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark shadow-sm">
          <Code2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-gray-500">{t("subtitle")}</p>
        </div>
      </div>

      {/* Templates Selection Box */}
      <div className="mb-8 rounded-2xl border border-brand/20 bg-brand/5 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-white">
            <span className="text-brand">⚡</span>
            <span>Tayyor shablonlar (Quick Templates)</span>
          </div>
          <span className="text-xs text-gray-400">Bosing va avtomatik to'ldiring</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {TEMPLATES.map((tpl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyTemplate(tpl)}
              className="flex flex-col items-start rounded-xl border border-white/10 bg-[#111] p-3 text-left transition-colors duration-200 hover:border-brand/50 hover:bg-white/5 group"
            >
              <span className="text-xs font-semibold text-brand transition-colors group-hover:text-brand-light">{tpl.language}</span>
              <span className="mt-1 text-sm font-medium text-white line-clamp-1">{tpl.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">
            {t("field_title")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("field_title_placeholder")}
            maxLength={100}
            className="input w-full"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">
            {t("field_desc")}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("field_desc_placeholder")}
            rows={3}
            maxLength={500}
            className="input w-full resize-none"
          />
        </div>

        {/* Language */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">
            {t("field_lang")} <span className="text-red-500">*</span>
          </label>
          <CustomSelect
            options={LANGUAGES}
            value={language}
            onChange={(val) => setLanguage(val)}
          />
        </div>

        {/* Code */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">
            {t("field_code")} <span className="text-red-500">*</span>
          </label>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0F0A1F] shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-2">
              <span className="text-xs font-medium text-gray-400">{language}</span>
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
              </div>
            </div>
            <div className="h-[400px] w-full pt-2">
              <Editor
                height="100%"
                language={language.toLowerCase() === "c++" ? "cpp" : language.toLowerCase() === "c#" ? "csharp" : language.toLowerCase()}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: '"Fira Code", monospace',
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                }}
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">
            {t("field_tags")} <span className="text-gray-400 font-normal">(max 5)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder={t("field_tags_placeholder")}
              maxLength={20}
              className="input flex-1"
            />
            <button
              type="button"
              onClick={addTag}
              disabled={tags.length >= 5}
              className="btn-secondary px-3"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1 text-sm font-medium text-brand"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-brand-dark"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Link href="/snippets" className="btn-secondary flex-1 py-3 text-center">
            {t("btn_cancel")}
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex flex-1 items-center justify-center gap-2 py-3 disabled:opacity-70"
          >
            {loading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Save className="h-4 w-4" />
            )}
            {loading ? t("saving") : t("btn_save")}
          </button>
        </div>
      </form>
    </div>
  );
}
