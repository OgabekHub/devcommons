"use server";

import { createSupabaseServer } from "@/lib/supabase-server";

export async function submitFeedback(formData: FormData) {
  const type = formData.get("type") as string;
  const content = formData.get("content") as string;

  if (!type || !content || content.trim().length === 0) {
    return { error: "Iltimos, barcha maydonlarni to'ldiring." };
  }

  try {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("feedback").insert({
      type,
      content: content.trim(),
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
