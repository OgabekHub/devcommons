import { createSupabaseBrowser } from "@/lib/supabase";

export type NotificationType = 
  | "vote_snippet" 
  | "vote_prompt" 
  | "comment_snippet" 
  | "comment_prompt" 
  | "follow";

interface CreateNotificationParams {
  userId: string; // Receiver
  type: NotificationType;
  snippetId?: string;
  promptId?: string;
}

export async function sendNotification({ userId, type, snippetId, promptId }: CreateNotificationParams) {
  const supabase = createSupabaseBrowser();
  const { data: { user } } = await supabase.auth.getUser();

  // O'ziga o'zi bildirishnoma yubormaydi
  if (!user || user.id === userId) return;

  try {
    await supabase.from("notifications").insert({
      user_id: userId,
      actor_id: user.id,
      type,
      snippet_id: snippetId || null,
      prompt_id: promptId || null,
    });
  } catch (err) {
    console.error("Failed to send notification:", err);
  }
}
