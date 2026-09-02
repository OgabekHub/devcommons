import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { createSupabaseServer } from '@/lib/supabase-server';

// process.env.GOOGLE_GENERATIVE_AI_API_KEY must be configured in .env.local
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

// Rate limit: 20 requests per minute per IP for unauthenticated, 60 for authenticated
const UNAUTH_LIMIT = { maxRequests: 20, windowSeconds: 60 };
const AUTH_LIMIT = { maxRequests: 60, windowSeconds: 60 };

export async function POST(req: Request) {
  try {
    // Check authentication (optional but gives higher rate limit)
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    const clientIp = getClientIp(req);
    const identifier = user?.id || clientIp;
    const limits = user ? AUTH_LIMIT : UNAUTH_LIMIT;

    const rateLimitResult = await checkRateLimit(identifier, "chat", limits);
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // Kalit sozlanmagan bo'lsa — aniq 503 (client do'stona xabar ko'rsatadi)
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(JSON.stringify({ error: "not_configured" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { messages, data } = await req.json();

    // Basic input validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid request: 'messages' array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // We receive additional context from the client via the 'data' field
    const contextType = data?.contextType || "general";
    const locale = data?.locale || "uz";

    // Kontekst: DOM scraping o'rniga item id bilan server-side yuklaymiz
    // (aniq, to'liq va soxtalashtirib bo'lmaydigan kontekst)
    let currentCode = "";
    const itemId: string = typeof data?.itemId === "string" ? data.itemId : "";
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(itemId);
    if (isUuid && (contextType === "snippet" || contextType === "prompt")) {
      if (contextType === "snippet") {
        const { data: item } = await supabase
          .from("snippets")
          .select("title, description, language, code")
          .eq("id", itemId)
          .maybeSingle();
        if (item) {
          currentCode = `Title: ${item.title}\nLanguage: ${item.language}\n${item.description ? `Description: ${item.description}\n` : ""}\n${(item.code || "").slice(0, 6000)}`;
        }
      } else {
        const { data: item } = await supabase
          .from("prompts")
          .select("title, description, category, content")
          .eq("id", itemId)
          .maybeSingle();
        if (item) {
          currentCode = `Title: ${item.title}\nCategory: ${item.category}\n${item.description ? `Description: ${item.description}\n` : ""}\n${(item.content || "").slice(0, 6000)}`;
        }
      }
    }

    const langName = locale === "uz" ? "O'zbek (Uzbek)" : "Ingliz (English)";
    const languageInstruction = `\n\nMUHIM QOIDA (CRITICAL LANGUAGE RULE): The user is currently browsing the site in ${langName} (${locale}). All explanations, greeting text, code reviews, and advice MUST be provided in ${langName}. If the user asks a question in another language, adapt and respond in the language of their message!`;

    let systemPrompt = `Siz "DevCommons" platformasining rasmiy AI yordamchisisiz. Sizning maqsadingiz dasturchilarga yordam berish.
Siz doimo do'stona, aniq va texnik jihatdan to'g'ri javoblar berasiz. Barcha kod misollarini markdown (\`\`\`) ichida bering.${languageInstruction}`;

    if (contextType === "prompt") {
      systemPrompt = `Siz DevCommons'ning "Prompt Enhancer" (Prompt Yaxshilovchi) sun'iy intellektisiz.
Foydalanuvchi qisqacha nima xohlayotganini yozadi, siz esa unga ChatGPT, Claude yoki Gemini uchun mukammal, to'liq shakllantirilgan promptni yozib berasiz.
Unga promptni qanday ishlatish bo'yicha maslahat ham bering.${
        currentCode ? `\n\nFoydalanuvchi hozir sahifada quyidagi promptni ko'rmoqda:\n\n${currentCode}` : ""
      }${languageInstruction}`;
    } else if (contextType === "snippet") {
      systemPrompt = `Siz DevCommons'ning "Code Reviewer" (Kod tahlilchisi) sun'iy intellektisiz.
Foydalanuvchiga berilgan kodning qanday ishlashini tushuntirasiz, undagi xatolarni yoki xavfsizlik (security) muammolarini topib berasiz.
Agar foydalanuvchi sahifada quyidagi kodni ko'rayotgan bo'lsa, siz u kodni bilasiz deb hisoblang:

\`\`\`
${currentCode}
\`\`\`
${languageInstruction}`;
    }

    const result = await streamText({
      model: google('gemini-1.5-flash'), // Or 'gemini-1.5-pro' for more complex tasks
      system: systemPrompt,
      // Oxirgi 20 ta xabar yetarli — token xarajatini jilovlaymiz
      messages: messages.slice(-20),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI API Error:", error);
    return new Response(JSON.stringify({ error: "AI servisida xatolik yuz berdi" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
