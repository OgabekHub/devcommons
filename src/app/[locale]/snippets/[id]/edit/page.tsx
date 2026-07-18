"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Code2, Save, Plus, X } from "lucide-react";
import { Link } from "@/i18n/routing";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import CustomSelect from "@/components/CustomSelect";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";

// VS Code theme for editor
import "prismjs/themes/prism-tomorrow.css";

const LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Rust", "Go",
  "Java", "C++", "C#", "PHP", "Ruby", "Swift", "Kotlin",
  "HTML", "CSS", "SQL", "Bash", "YAML", "JSON", "Other"
];

interface Props {
  params: { id: string; locale: string };
}

export default function EditSnippetPage({ params: { id, locale } }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [prismLoaded, setPrismLoaded] = useState(false);
  const router = useRouter();
  const t = useTranslations("NewSnippet");
  const supabase = createSupabaseBrowser();

  // Load language grammars safely in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadLanguages = async () => {
        (window as any).Prism = Prism;
        await import("prismjs/components/prism-javascript");
        await import("prismjs/components/prism-typescript");
        await import("prismjs/components/prism-python");
        await import("prismjs/components/prism-rust");
        await import("prismjs/components/prism-go");
        await import("prismjs/components/prism-java");
        await import("prismjs/components/prism-c");
        await import("prismjs/components/prism-cpp");
        await import("prismjs/components/prism-csharp");
        await import("prismjs/components/prism-php");
        await import("prismjs/components/prism-ruby");
        await import("prismjs/components/prism-sql");
        await import("prismjs/components/prism-bash");
        await import("prismjs/components/prism-yaml");
        await import("prismjs/components/prism-json");
        setPrismLoaded(true);
      };
      loadLanguages();
    }
  }, []);

  // Load snippet data
  useEffect(() => {
    const loadSnippet = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/${locale}/auth`);
        return;
      }

      const { data: snippet, error } = await supabase
        .from("snippets")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !snippet) {
        router.push(`/${locale}/snippets`);
        return;
      }

      if (snippet.author_id !== user.id) {
        router.push(`/${locale}/snippets`);
        return;
      }

      setTitle(snippet.title);
      setDescription(snippet.description || "");
      setCode(snippet.code);
      setLanguage(snippet.language);
      setTags((snippet.tags as string[]) || []);
      setFetching(false);
    };

    loadSnippet();
  }, [id, locale, router, supabase]);

  const highlightCode = (input: string) => {
    if (!input) return "";
    
    const lang = language.toLowerCase();
    
    let grammar = Prism.languages[lang];
    
    if (!grammar) {
      if (lang === "c++") grammar = Prism.languages.cpp;
      else if (lang === "c#") grammar = Prism.languages.csharp;
      else if (lang === "typescript") grammar = Prism.languages.typescript;
    }

    if (!grammar) {
      grammar = Prism.languages.javascript || Prism.languages.clike || Prism.languages.markup;
    }

    try {
      return Prism.highlight(input, grammar, lang);
    } catch (err) {
      console.error("Syntax highlighting error:", err);
      return input;
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !code.trim()) {
      setError(t("error_required"));
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase
        .from("snippets")
        .update({
          title: title.trim(),
          description: description.trim(),
          code: code.trim(),
          language,
          tags,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      router.push(`/${locale}/snippets/${id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Xato yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Back */}
      <Link
        href={`/snippets/${id}`}
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
          <h1 className="text-2xl font-bold">Snippetni tahrirlash</h1>
          <p className="text-sm text-gray-500">Ma'lumotlarni yangilang</p>
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
            <div className="min-h-[350px] font-mono text-sm leading-relaxed">
              <Editor
                value={code}
                onValueChange={(val) => setCode(val)}
                highlight={(val) => highlightCode(val)}
                padding={20}
                placeholder={`// ${language} ${t("field_code_placeholder")}`}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 14,
                  backgroundColor: 'transparent',
                }}
                className="w-full text-gray-100 placeholder-gray-500 focus:outline-none"
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
          <Link href={`/snippets/${id}`} className="btn-secondary flex-1 py-3 text-center">
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
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}
