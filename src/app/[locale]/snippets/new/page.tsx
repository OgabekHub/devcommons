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

  // Load language grammars safely in the browser (prevents SSR crash)
  useEffect(() => {
    if (typeof window !== "undefined") {
      require("prismjs/components/prism-javascript");
      require("prismjs/components/prism-typescript");
      require("prismjs/components/prism-python");
      require("prismjs/components/prism-rust");
      require("prismjs/components/prism-go");
      require("prismjs/components/prism-java");
      require("prismjs/components/prism-c");
      require("prismjs/components/prism-cpp");
      require("prismjs/components/prism-csharp");
      require("prismjs/components/prism-php");
      require("prismjs/components/prism-ruby");
      require("prismjs/components/prism-sql");
      require("prismjs/components/prism-bash");
      require("prismjs/components/prism-yaml");
      require("prismjs/components/prism-json");
    }
  }, []);

  const highlightCode = (input: string) => {
    if (!input) return "";
    
    const lang = language.toLowerCase();
    
    // Prism.languages'dan kerakli til gramatika qoidasini xavfsiz qidirish
    let grammar = Prism.languages[lang];
    
    if (!grammar) {
      // Ba'zi tillar uchun maxsus nomlar xaritasi
      if (lang === "c++") grammar = Prism.languages.cpp;
      else if (lang === "c#") grammar = Prism.languages.csharp;
      else if (lang === "typescript") grammar = Prism.languages.typescript;
    }

    // Agar tanlangan til hali yuklanmagan yoki mavjud bo'lmasa, fallback
    if (!grammar) {
      grammar = Prism.languages.javascript || Prism.languages.clike || Prism.languages.markup;
    }

    try {
      return Prism.highlight(input, grammar, lang);
    } catch (err) {
      console.error("Syntax highlighting error:", err);
      return input; // Xatolik yuz bersa, kodni shunchaki oddiy matn sifatida qaytaramiz (qulamasligi uchun)
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
      const { data: { user } } = await supabase.auth.getUser();

      const { error: insertError } = await supabase
        .from("snippets")
        .insert({
          title: title.trim(),
          description: description.trim(),
          code: code.trim(),
          language,
          tags,
          user_id: user?.id ?? null,
          author_name: user?.user_metadata?.user_name ?? "Anonymous",
          author_avatar: user?.user_metadata?.avatar_url ?? null,
        });

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
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            {t("field_title")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("field_title_placeholder")}
            maxLength={100}
            className="input w-full bg-white text-gray-900"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            {t("field_desc")}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("field_desc_placeholder")}
            rows={3}
            maxLength={500}
            className="input w-full resize-none bg-white text-gray-900"
          />
        </div>

        {/* Language */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
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
          <label className="text-sm font-semibold text-gray-700">
            {t("field_code")} <span className="text-red-500">*</span>
          </label>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-[#0F0A1F] shadow-sm">
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
          <label className="text-sm font-semibold text-gray-700">
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
              className="input flex-1 bg-white text-gray-900"
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
