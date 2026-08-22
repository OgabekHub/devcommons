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

    // Ensure atomicity: record the vote FIRST, then update the counter.
    // If the record insert fails (e.g., duplicate), the counter stays consistent.
    if (action === "add") {
      // Record the vote first
      const { error: insertError } = await supabase.from(voteTable).insert({ user_id: user.id, [voteColumn]: id });
      if (insertError) {
        // If insert fails (likely duplicate), don't increment
        const { data: item } = await supabase.from(table).select("votes").eq("id", id).single();
        return NextResponse.json({ votes: item?.votes ?? 0, error: "Vote record failed" });
      }
      // Then increment the counter
      await supabase.rpc("increment_votes", { table_name: table, item_id: id });
    } else {
      // Remove vote record first
      const { error: deleteError } = await supabase.from(voteTable).delete().eq("user_id", user.id).eq(voteColumn, id);
      if (deleteError) {
        const { data: item } = await supabase.from(table).select("votes").eq("id", id).single();
        return NextResponse.json({ votes: item?.votes ?? 0, error: "Vote removal failed" });
      }
      // Then decrement the counter
      await supabase.rpc("decrement_votes", { table_name: table, item_id: id });
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
