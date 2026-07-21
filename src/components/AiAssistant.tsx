"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bot, X, Maximize2, Minimize2, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

type ChatMessage = { id: string; role: "user" | "assistant"; content: string; };

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname() || "";
  const [contextType, setContextType] = useState("general");
  const [currentCode, setCurrentCode] = useState("");

  useEffect(() => {
    if (pathname.includes("/prompts")) {
      setContextType("prompt");
    } else if (pathname.includes("/snippets")) {
      setContextType("snippet");
    } else {
      setContextType("general");
    }

    setTimeout(() => {
      const codeNodes = document.querySelectorAll("code, pre");
      if (codeNodes.length > 0) {
        let longest = "";
        codeNodes.forEach(node => {
          if ((node.textContent || "").length > longest.length) {
            longest = node.textContent || "";
          }
        });
        setCurrentCode(longest.substring(0, 3000)); 
      } else {
        setCurrentCode("");
      }
    }, 1000);
  }, [pathname, isOpen]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
          data: { contextType, currentCode }
        })
      });

      if (!res.ok) throw new Error("API error");
      if (!res.body) throw new Error("No body");

      const aiMsgId = (Date.now() + 1).toString();
      setMessages(msgs => [...msgs, { id: aiMsgId, role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('0:')) {
             try {
               const chunk = JSON.parse(line.substring(2));
               setMessages(msgs => msgs.map(m => m.id === aiMsgId ? { ...m, content: m.content + chunk } : m));
             } catch(e) {}
          }
        }
      }
    } catch (err) {
      console.error(err);
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
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/20 transition-transform hover:scale-110"
        >
          <Sparkles className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0B] shadow-2xl transition-all ${
            isExpanded ? "h-[80vh] w-[800px]" : "h-[600px] w-[400px]"
          } max-w-[calc(100vw-2rem)]`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-brand" />
              <span className="font-semibold text-white">DevCommons AI</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:block rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                <Sparkles className="mb-4 h-12 w-12 text-brand/20" />
                <p>Salom! Men DevCommons AI yordamchisiman.</p>
                <p className="mt-2 text-sm text-gray-600">Sizga qanday yordam bera olaman?</p>
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
                      : "bg-white/5 text-gray-200 border border-white/10"
                  }`}
                >
                  <div className="prose prose-invert prose-sm max-w-none break-words leading-relaxed">
                    <ReactMarkdown
                      components={{
                        code: ({node, ...props}: any) => (
                          <code className="bg-black/50 text-emerald-400 px-1 py-0.5 rounded text-xs" {...props} />
                        ),
                        pre: ({node, ...props}: any) => (
                          <pre className="bg-black/50 p-3 rounded-lg overflow-x-auto border border-white/10 my-2 text-xs" {...props} />
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
                <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-white/5 text-gray-200 border border-white/10">
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
          <form onSubmit={handleSubmit} className="border-t border-white/5 bg-[#0A0A0B] p-4">
            <div className="relative">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Xabar yozing..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
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
