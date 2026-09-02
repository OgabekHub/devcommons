"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Bot, X, Maximize2, Minimize2, Send, Sparkles, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type ChatMessage = { id: string; role: "user" | "assistant"; content: string; };

const STORAGE_KEY = "ai_chat_v1";
const UUID_RE = /\/(snippets|prompts)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

export default function AiAssistant() {
  const t = useTranslations("AiAssistant");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname() || "";

  // Kontekst: sahifa yo'lidan item id — server kontentni o'zi yuklaydi
  // (avvalgi DOM scraping olib tashlandi)
  const match = pathname.match(UUID_RE);
  const contextType = match
    ? (match[1] === "prompts" ? "prompt" : "snippet")
    : "general";
  const itemId = match?.[2] ?? "";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Suhbatni localStorage'da saqlaymiz (sahifa yangilanishida yo'qolmasin)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {
      // buzilgan/yo'q — bo'sh boshlaymiz
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      // storage to'lgan/yopiq — e'tiborsiz
    }
  }, [messages]);

  const clearChat = () => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // e'tiborsiz
    }
  };

  const pushAssistantError = (text: string) => {
    setMessages((msgs) => [
      ...msgs,
      { id: `${Date.now()}-err`, role: "assistant", content: text },
    ]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { id: Date.now().toString(), role: "user" as const, content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          data: { contextType, itemId, locale }
        })
      });

      if (!res.ok) {
        // Aniq holatlarga do'stona xabar
        if (res.status === 503) pushAssistantError(t("error_no_key"));
        else if (res.status === 429) pushAssistantError(t("error_rate_limit"));
        else pushAssistantError(t("error_generic"));
        return;
      }
      if (!res.body) throw new Error("No body");

      const aiMsgId = (Date.now() + 1).toString();
      setMessages(msgs => [...msgs, { id: aiMsgId, role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // Route `toTextStreamResponse()` bilan oddiy matn oqimini qaytaradi —
      // har bir chunk'ni to'g'ridan-to'g'ri qo'shamiz. `{ stream: true }` ko'p
      // baytli UTF-8 (kirill/o'zbek) belgilarni chunk chegarasida buzmaydi.
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        if (text) {
          setMessages(msgs => msgs.map(m => m.id === aiMsgId ? { ...m, content: m.content + text } : m));
        }
      }
    } catch (err) {
      console.error(err);
      pushAssistantError(t("error_generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/20 transition-transform hover:scale-110"
        >
          <Sparkles className="h-5 w-5" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl transition-all ${
            isExpanded ? "h-[75vh] w-full sm:w-[650px]" : "h-[480px] w-full sm:w-[350px]"
          } max-w-[calc(100vw-2rem)]`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line bg-ink/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-brand" />
              <span className="font-semibold text-fg">DevCommons AI</span>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  aria-label={t("clear_chat")}
                  title={t("clear_chat")}
                  className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-ink/10 hover:text-fg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:block rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-ink/10 hover:text-fg"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-ink/10 hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center text-zinc-500">
                <Sparkles className="mb-4 h-12 w-12 text-brand/20" />
                <p>{t("welcome_title")}</p>
                <p className="mt-2 text-sm text-zinc-600">{t("welcome_subtitle")}</p>
              </div>
            )}
            {messages.map((m: ChatMessage) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                    m.role === "user"
                      ? "bg-brand text-white"
                      : "bg-ink/5 text-zinc-200 border border-line"
                  }`}
                >
                  <div className="prose prose-invert prose-sm max-w-none break-words leading-relaxed">
                    <ReactMarkdown
                      components={{
                        code: ({ node: _node, ...props }: any) => (
                          <code className="bg-black/50 text-emerald-400 px-1 py-0.5 rounded text-xs" {...props} />
                        ),
                        pre: ({ node: _node, ...props }: any) => (
                          <pre className="bg-black/50 p-3 rounded-lg overflow-x-auto border border-line my-2 text-xs" {...props} />
                        ),
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-ink/5 text-zinc-200 border border-line">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-brand"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-brand" style={{ animationDelay: "0.2s" }}></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-brand" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-line bg-surface p-4">
            <div className="relative">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder={t("input_placeholder")}
                className="w-full rounded-xl border border-line bg-ink/5 py-3 pl-4 pr-12 text-sm text-fg placeholder-zinc-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 rounded-lg bg-brand p-1.5 text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
