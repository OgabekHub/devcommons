"use client";

import { useState } from "react";
import { MessageSquarePlus, X, Send, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { submitFeedback } from "@/app/actions/feedback";

export default function FeedbackWidget() {
  const t = useTranslations("Feedback");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await submitFeedback(formData);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setIsSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 3000);
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/20 transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-brand/30"
        aria-label={t("btn_open")}
      >
        <MessageSquarePlus className="h-6 w-6" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">{t("title")}</h2>
              <p className="mt-2 text-sm text-gray-400">{t("description")}</p>
            </div>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in">
                <div className="mb-4 rounded-full bg-green-500/10 p-3">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <p className="text-lg font-medium text-white">{t("success")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">
                    Turi
                  </label>
                  <select
                    name="type"
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  >
                    <option value="suggestion">{t("type_suggestion")}</option>
                    <option value="bug">{t("type_bug")}</option>
                    <option value="other">{t("type_other")}</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">
                    Xabaringiz
                  </label>
                  <textarea
                    name="content"
                    required
                    rows={4}
                    placeholder={t("placeholder")}
                    className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {t("btn_cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-dark disabled:opacity-50"
                  >
                    {isSubmitting ? t("btn_submitting") : t("btn_submit")}
                    {!isSubmitting && <Send className="h-4 w-4" />}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
