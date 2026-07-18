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
      .select("votes")
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

    return NextResponse.json({ votes: newVotes });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
