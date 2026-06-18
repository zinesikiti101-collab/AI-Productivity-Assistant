import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { Markdown } from "@/components/markdown";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot · AI Workplace" },
      { name: "description", content: "Conversational AI assistant grounded in your workspace context." },
    ],
  }),
  component: Chat,
});

const SUGGESTIONS = [
  "Summarize my last meeting in 3 bullets",
  "Draft a Slack update for the team about Q3 priorities",
  "What are the risks in my current research brief?",
  "Plan my next 2 hours of deep work",
];

function Chat() {
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;
  const { messages, sendMessage, status } = useChat({ transport });
  const [input, setInput] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [status]);

  const submit = async () => {
    const t = input.trim();
    if (!t || status === "submitted" || status === "streaming") return;
    setInput("");
    await sendMessage({ text: t });
  };

  const loading = status === "submitted" || status === "streaming";

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        eyebrow="Assistant"
        title="Workplace AI Chatbot"
        description="Ask anything about your tasks, meetings, emails or research. Conversation history is kept in this session."
      />
      <Card className="glass border-border/60 flex flex-col h-[68vh] overflow-hidden">
        <div ref={scroller} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="h-14 w-14 rounded-2xl gradient-primary grid place-items-center mb-4 glow">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold text-lg">How can I help today?</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Try one of these or ask your own question.
              </p>
              <div className="grid sm:grid-cols-2 gap-2 mt-5 max-w-xl">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage({ text: s })}
                    className="text-left text-sm rounded-lg border border-border/60 bg-muted/20 hover:bg-primary/10 hover:border-primary/40 transition px-4 py-3"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const text = m.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("");
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser && (
                  <div className="h-8 w-8 rounded-lg gradient-primary grid place-items-center shrink-0 mt-0.5">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className={isUser
                  ? "max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-2.5 gradient-primary text-white text-sm"
                  : "max-w-[85%]"}
                >
                  {isUser ? text : <Markdown>{text}</Markdown>}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-lg gradient-primary grid place-items-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="text-sm text-muted-foreground animate-pulse pt-1.5">Thinking…</div>
            </div>
          )}
        </div>

        <div className="border-t border-border/60 p-3 bg-background/40">
          <div className="flex gap-2 items-end">
            <Textarea
              ref={inputRef}
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
              }}
              placeholder="Ask the workplace AI…"
              className="min-h-[52px] max-h-32 bg-muted/30 border-border/60 resize-none"
            />
            <Button onClick={submit} disabled={loading || !input.trim()} className="h-[52px] w-[52px] p-0 gradient-primary text-white border-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1.5">
            <MessageSquare className="h-3 w-3" /> Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </Card>
    </div>
  );
}
