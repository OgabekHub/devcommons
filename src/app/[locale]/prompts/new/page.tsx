"use client";

import { useState } from "react";
import { ArrowLeft, Sparkles, Save, Plus, X } from "lucide-react";
import { Link } from "@/i18n/routing";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import CustomSelect from "@/components/CustomSelect";

const CATEGORIES = [
  "Coding", "Writing", "Analysis", "Marketing",
  "Education", "Business", "Creative", "Research",
  "Translation", "Summarization", "Other"
];

const AI_MODELS = ["ChatGPT", "Claude", "Gemini", "Llama", "Mistral", "Any"];

export default function NewPromptPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Coding");
  const [aiModel, setAiModel] = useState("Any");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("NewPrompt");
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

    if (!title.trim() || !content.trim()) {
      setError(t("error_required"));
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error: insertError } = await supabase
        .from("prompts")
        .insert({
          title: title.trim(),
          content: content.trim(),
          category,
          author_id: user?.id ?? null,
        });

      if (insertError) throw insertError;

      router.push(`/${locale}/prompts`);
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
        href="/prompts"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        {t("back")}
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm">
          <Sparkles className="h-5 w-5 text-white" />
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
            className="input w-full"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">{t("field_desc")}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("field_desc_placeholder")}
            rows={3}
            maxLength={500}
            className="input w-full resize-none"
          />
        </div>

        {/* Category + AI Model */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("field_category")}</label>
            <CustomSelect
              options={CATEGORIES}
              value={category}
              onChange={(val) => setCategory(val)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("field_model")}</label>
            <CustomSelect
              options={AI_MODELS}
              value={aiModel}
              onChange={(val) => setAiModel(val)}
            />
          </div>
        </div>

        {/* Prompt Content */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            {t("field_content")} <span className="text-red-500">*</span>
          </label>
          <div className="overflow-hidden rounded-xl border border-white/10 shadow-sm bg-[#111111]">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
              <span className="text-xs font-medium text-gray-500">✨ Prompt</span>
              <span className="text-xs text-gray-400">{content.length} / 5000</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("field_content_placeholder")}
              rows={12}
              maxLength={5000}
              className="w-full bg-transparent p-4 text-sm text-gray-100 placeholder-gray-500 focus:outline-none resize-none"
            />
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
                  className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1 text-sm font-medium text-violet-600"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-violet-800"
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
          <Link href="/prompts" className="btn-secondary flex-1 py-3 text-center">
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
