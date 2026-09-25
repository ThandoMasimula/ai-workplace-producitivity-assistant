import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AiWarning, Card, Disclaimer, EmptyState, PageHeader } from "../components/AppShell";
import { Button, Input, Label, Select, TextArea } from "../components/ui-kit";
import { generateEmail } from "../lib/ai.functions";
import { KEYS, useLocalState, type EmailDraft, type Summary, type Task } from "../lib/storage";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Email Generator — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Draft a professional follow-up email from your meeting notes and tasks.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Create a professional follow-up email from your meeting information.",
      },
    ],
  }),
  component: EmailGenerator,
});

function EmailGenerator() {
  const run = useServerFn(generateEmail);
  const summary = useLocalState<Summary | null>(KEYS.summary, null);
  const tasks = useLocalState<Task[]>(KEYS.tasks, []);
  const email = useLocalState<EmailDraft | null>(KEYS.email, null);
  const [tone, setTone] = useState<"Formal" | "Friendly" | "Persuasive">("Formal");
  const [loading, setLoading] = useState(false);

  const s = summary.value;
  const hasContext = Boolean(s) || tasks.value.length > 0;

  function buildContext() {
    const parts: string[] = [];
    if (s?.summary) parts.push(`MEETING SUMMARY:\n${s.summary}`);
    if (s?.decisions.length) parts.push(`DECISIONS:\n- ${s.decisions.join("\n- ")}`);
    if (s?.keyInformation.length) parts.push(`KEY INFORMATION:\n- ${s.keyInformation.join("\n- ")}`);
    if (tasks.value.length) {
      parts.push(
        "TASKS:\n" +
          tasks.value
            .map(
              (t) =>
                `- ${t.task}${t.person ? ` | owner: ${t.person}` : ""}${t.deadline ? ` | deadline: ${t.deadline}` : ""}`,
            )
            .join("\n"),
      );
    }
    return parts.join("\n\n");
  }

  async function handleGenerate() {
    const context = buildContext();
    if (!context.trim()) {
      toast.error("Add meeting notes or tasks first.");
      return;
    }
    setLoading(true);
    try {
      const result = await run({ data: { tone, context } });
      email.setValue({ ...result, tone });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate the email.");
    } finally {
      setLoading(false);
    }
  }

  async function copyEmail() {
    if (!email.value) return;
    await navigator.clipboard.writeText(`Subject: ${email.value.subject}\n\n${email.value.message}`);
    toast.success("Email copied to your clipboard.");
  }

  return (
    <>
      <PageHeader
        title="Email Generator"
        description="Create a follow-up email using only your meeting notes and tasks."
      />

      <Card>
        <AiWarning />
        <div className="sm:w-56">
          <Label htmlFor="tone">Email tone</Label>
          <Select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value as typeof tone)}
          >
            <option>Formal</option>
            <option>Friendly</option>
            <option>Persuasive</option>
          </Select>
        </div>
        <Button className="mt-4" onClick={handleGenerate} disabled={loading || !hasContext}>
          {loading ? "Generating..." : "Generate Email"}
        </Button>
        {!hasContext ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No meeting notes or tasks are available yet.
          </p>
        ) : null}
      </Card>

      <div className="mt-4">
        {!email.value ? (
          <EmptyState>No email has been generated.</EmptyState>
        ) : (
          <Card>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={email.value.subject}
              onChange={(e) => email.setValue({ ...email.value!, subject: e.target.value })}
            />
            <div className="mt-4">
              <Label htmlFor="message">Email Message</Label>
              <TextArea
                id="message"
                rows={14}
                value={email.value.message}
                onChange={(e) => email.setValue({ ...email.value!, message: e.target.value })}
              />
            </div>
            <Button className="mt-4" variant="secondary" onClick={copyEmail}>
              Copy Email
            </Button>
          </Card>
        )}
      </div>

      <Disclaimer />
    </>
  );
}
