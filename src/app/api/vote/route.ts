import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { id, type } = await req.json();

    if (!id || !["snippet", "prompt"].includes(type)) {
      return NextResponse.json({ error: "Invalid params" }, { status: 400 });
    }

    const supabase = createSupabaseServer();
    const table = type === "snippet" ? "snippets" : "prompts";

    const { data, error } = await supabase.rpc("increment_votes", {
      row_id: id,
      table_name: table,
    });

    if (error) {
      // RPC yo'q bo'lsa, oddiy update
      const { data: item } = await supabase
        .from(table)
        .select("votes")
        .eq("id", id)
        .single();

      const newVotes = (item?.votes ?? 0) + 1;

      await supabase
        .from(table)
        .update({ votes: newVotes })
        .eq("id", id);

      return NextResponse.json({ votes: newVotes });
    }

    return NextResponse.json({ votes: data });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
