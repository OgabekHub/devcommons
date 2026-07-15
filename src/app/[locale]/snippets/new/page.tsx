"use client";

import { useState } from "react";
import { ArrowLeft, Code2, Save, Plus, X } from "lucide-react";
import { Link } from "@/i18n/routing";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

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
  const supabase = createSupabaseBrowser();

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
      setError("Sarlavha va kod majburiy!");
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
        Snippets'ga qaytish
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark shadow-sm">
          <Code2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Snippet qo'shish</h1>
          <p className="text-sm text-gray-500">Kodingizni hamjamiyat bilan ulashing</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Sarlavha <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masalan: Array deduplication with Set"
            maxLength={100}
            className="input w-full"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Tavsif
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Bu snippet nima qiladi? Qachon ishlatiladi?"
            rows={3}
            maxLength={500}
            className="input w-full resize-none"
          />
        </div>

        {/* Language */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Dasturlash tili <span className="text-red-500">*</span>
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input w-full"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {/* Code */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Kod <span className="text-red-500">*</span>
          </label>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-900 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
              <span className="text-xs font-medium text-gray-400">{language}</span>
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// ${language} kodingizni shu yerga yozing...`}
              rows={14}
              spellCheck={false}
              className="w-full bg-transparent p-4 font-mono text-sm text-gray-100 placeholder-gray-600 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Teglar <span className="text-gray-400 font-normal">(max 5)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="react, hooks, performance..."
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
            Bekor qilish
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
            {loading ? "Saqlanmoqda..." : "Snippet saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}
