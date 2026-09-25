import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AiWarning, Card, Disclaimer, EmptyState, PageHeader } from "../components/AppShell";
import { Button, Input, Label } from "../components/ui-kit";
import { askChatbot } from "../lib/ai.functions";
import { KEYS, useLocalState } from "../lib/storage";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — AI Workplace Productivity Assistant" },
      { name: "description", content: "Ask questions answered only from your saved meeting notes." },
      { property: "og:title", content: "AI Chatbot" },
      { property: "og:description", content: "Ask questions about your meeting notes." },
    ],
  }),
  component: Chatbot,
});

type Message = { role: "user" | "ai"; text: string };

function Chatbot() {
  const run = useServerFn(askChatbot);
  const notes = useLocalState<string>(KEYS.notes, "");
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q) return;
    if (!notes.value.trim()) {
      toast.error("No meeting notes are available for the chatbot.");
      return;
    }
    setMessages((m) => [...m, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);
    try {
      const result = await run({ data: { notes: notes.value, question: q } });
      setMessages((m) => [...m, { role: "ai", text: result.answer }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not answer right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="AI Chatbot"
        description="Answers come only from the meeting notes you saved."
      />

      <Card>
        {!notes.value.trim() ? (
          <EmptyState>No meeting notes are available for the chatbot.</EmptyState>
        ) : messages.length === 0 ? (
          <EmptyState>No questions asked yet.</EmptyState>
        ) : (
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
                <p
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                      : "max-w-[85%] rounded-2xl bg-secondary px-4 py-2.5 text-sm text-secondary-foreground"
                  }
                >
                  {m.text}
                </p>
              </div>
            ))}
            {loading ? <p className="text-sm text-muted-foreground">Thinking...</p> : null}
          </div>
        )}

        <form onSubmit={send} className="mt-5">
          <Label htmlFor="question">Your question</Label>
          <AiWarning />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about your meeting notes..."
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Asking..." : "Ask"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setMessages([])}>
              Clear Chat
            </Button>
          </div>
        </form>
      </Card>

      <Disclaimer />
    </>
  );
}
