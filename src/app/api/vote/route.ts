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

    // Check authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already voted (deduplication)
    const voteTable = type === "snippet" ? "snippet_votes" : "prompt_votes";
    const voteColumn = type === "snippet" ? "snippet_id" : "prompt_id";

    const { data: existingVote } = await supabase
      .from(voteTable)
      .select("id")
      .eq("user_id", user.id)
      .eq(voteColumn, id)
      .maybeSingle();

    if (action === "add" && existingVote) {
      // Already voted — return current votes without change
      const { data: item } = await supabase.from(table).select("votes").eq("id", id).single();
      return NextResponse.json({ votes: item?.votes ?? 0, already_voted: true });
    }

    if (action === "remove" && !existingVote) {
      const { data: item } = await supabase.from(table).select("votes").eq("id", id).single();
      return NextResponse.json({ votes: item?.votes ?? 0 });
    }

    // Use the atomic RPC function to update votes (bypasses RLS correctly)
    if (action === "add") {
      await supabase.rpc("increment_votes", { table_name: table, item_id: id });
      // Record the vote
      await supabase.from(voteTable).insert({ user_id: user.id, [voteColumn]: id });
    } else {
      await supabase.rpc("decrement_votes", { table_name: table, item_id: id });
      // Remove vote record
      await supabase.from(voteTable).delete().eq("user_id", user.id).eq(voteColumn, id);
    }

    // Get new votes count
    const { data: item } = await supabase.from(table).select("votes, author_id").eq("id", id).single();
    const newVotes = item?.votes ?? 0;

    // Send notification if adding vote (not self-vote)
    if (action === "add" && item?.author_id && user.id !== item.author_id) {
      await supabase.from("notifications").insert({
        user_id: item.author_id,
        actor_id: user.id,
        type: type === "snippet" ? "vote_snippet" : "vote_prompt",
        snippet_id: type === "snippet" ? id : null,
        prompt_id: type === "prompt" ? id : null,
      });
    }

    return NextResponse.json({ votes: newVotes });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
