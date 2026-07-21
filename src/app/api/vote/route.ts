import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { id, type, action = "add" } = await req.json();

    if (!id || !["snippet", "prompt"].includes(type)) {
      return NextResponse.json({ error: "Invalid params" }, { status: 400 });
    }

    const supabase = createSupabaseServer();
    const table = type === "snippet" ? "snippets" : "prompts";

    // O'qish
    const { data: item } = await supabase
      .from(table)
      .select("votes, author_id")
      .eq("id", id)
      .single();

    let newVotes = item?.votes ?? 0;
    if (action === "remove") {
      newVotes = Math.max(0, newVotes - 1);
    } else {
      newVotes = newVotes + 1;
    }

    // Yangilash
    await supabase
      .from(table)
      .update({ votes: newVotes })
      .eq("id", id);

    // Send notification if adding vote
    if (action === "add" && item?.author_id) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id !== item.author_id) {
        await supabase.from("notifications").insert({
          user_id: item.author_id,
          actor_id: user.id,
          type: type === "snippet" ? "vote_snippet" : "vote_prompt",
          snippet_id: type === "snippet" ? id : null,
          prompt_id: type === "prompt" ? id : null,
        });
      }
    }

    return NextResponse.json({ votes: newVotes });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
