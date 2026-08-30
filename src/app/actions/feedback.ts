"use server";

import { createSupabaseServer } from "@/lib/supabase-server";

// DB CHECK constraint (migration_v4_feedback.sql) va FeedbackWidget UI bilan mos:
const ALLOWED_TYPES = ["bug", "suggestion", "other"] as const;
const MAX_CONTENT_LENGTH = 5000; // Maximum characters for feedback content

export async function submitFeedback(formData: FormData) {
  const type = formData.get("type") as string;
  const content = formData.get("content") as string;

  // Validate required fields
  if (!type || !content || content.trim().length === 0) {
    return { error: "Iltimos, barcha maydonlarni to'ldiring." };
  }

  // Validate feedback type
  if (!ALLOWED_TYPES.includes(type as typeof ALLOWED_TYPES[number])) {
    return { error: "Noto'g'ri feedback turi. Faqat: bug, suggestion, other." };
  }

  // Validate content length
  const trimmedContent = content.trim();
  if (trimmedContent.length < 10) {
    return { error: "Feedback kamida 10 ta belgidan iborat bo'lishi kerak." };
  }
  if (trimmedContent.length > MAX_CONTENT_LENGTH) {
    return { error: `Feedback ${MAX_CONTENT_LENGTH} ta belgidan oshmasligi kerak.` };
  }

  try {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("feedback").insert({
      type,
      content: trimmedContent,
      user_id: user?.id || null,
    });

    if (error) {
      console.error("Feedback insert error:", error);
      return { error: "Xatolik yuz berdi. Iltimos qayta urinib ko'ring." };
    }

    return { success: true };
  } catch (err) {
    console.error("Feedback action error:", err);
    return { error: "Noma'lum xatolik yuz berdi." };
  }
}
