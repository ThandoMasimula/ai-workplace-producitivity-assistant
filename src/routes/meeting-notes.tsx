import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AiWarning, Card, Disclaimer, EmptyState, PageHeader } from "../components/AppShell";
import { Button, Input, Label, TextArea } from "../components/ui-kit";
import { summarizeNotes } from "../lib/ai.functions";
import { KEYS, newId, useLocalState, type Summary, type Task } from "../lib/storage";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Paste meeting notes and get a summary, decisions and action items.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Turn meeting notes into a concise summary and action items.",
      },
    ],
  }),
  component: MeetingNotes,
});

function MeetingNotes() {
  const navigate = useNavigate();
  const run = useServerFn(summarizeNotes);
  const notes = useLocalState<string>(KEYS.notes, "");
  const summary = useLocalState<Summary | null>(KEYS.summary, null);
  const [loading, setLoading] = useState(false);

  const s = summary.value;

  async function handleSummarize() {
    if (!notes.value.trim()) {
      toast.error("Please paste your meeting notes first.");
      return;
    }
    setLoading(true);
    try {
      const result = await run({ data: { notes: notes.value } });
      summary.setValue(result);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not summarize the notes.");
    } finally {
      setLoading(false);
    }
  }

  function update(patch: Partial<Summary>) {
    if (!s) return;
    summary.setValue({ ...s, ...patch });
  }

  function sendToPlanner() {
    if (!s || s.actionItems.length === 0) return;
    let existing: Task[] = [];
    try {
      existing = JSON.parse(window.localStorage.getItem(KEYS.tasks) ?? "[]") as Task[];
    } catch {
      existing = [];
    }
    const added: Task[] = s.actionItems.map((item) => ({
      id: newId(),
      task: item.task,
      person: item.person,
      deadline: item.deadline,
      priority: "Medium",
      suggestedDate: "",
      done: false,
    }));
    window.localStorage.setItem(KEYS.tasks, JSON.stringify([...existing, ...added]));
    toast.success(`${added.length} action item(s) sent to Task Planner.`);
    navigate({ to: "/task-planner" });
  }

  return (
    <>
      <PageHeader
        title="Meeting Notes"
        description="Paste your notes and turn them into a summary, decisions and action items."
      />

      <Card>
        <Label htmlFor="notes">Paste your meeting notes</Label>
        <AiWarning />
        <TextArea
          id="notes"
          rows={10}
          value={notes.value}
          onChange={(e) => notes.setValue(e.target.value)}
          placeholder="Paste your meeting notes here..."
        />
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button onClick={handleSummarize} disabled={loading}>
            {loading ? "Summarizing..." : "Summarize Notes"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              notes.setValue("");
              summary.setValue(null);
            }}
          >
            Clear
          </Button>
        </div>
      </Card>

      <div className="mt-4 space-y-4">
        {!s ? (
          <EmptyState>No summary yet. Paste your notes and select Summarize Notes.</EmptyState>
        ) : (
          <>
            <Card>
              <h2 className="mb-2 text-lg font-semibold">Summary</h2>
              <TextArea
                rows={4}
                value={s.summary}
                onChange={(e) => update({ summary: e.target.value })}
              />
            </Card>

            <Card>
              <h2 className="mb-2 text-lg font-semibold">Main Decisions</h2>
              {s.decisions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No decisions were stated.</p>
              ) : (
                <div className="space-y-2">
                  {s.decisions.map((d, i) => (
                    <Input
                      key={i}
                      value={d}
                      onChange={(e) => {
                        const next = [...s.decisions];
                        next[i] = e.target.value;
                        update({ decisions: next });
                      }}
                    />
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <h2 className="mb-2 text-lg font-semibold">Action Items</h2>
              {s.actionItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No action items were stated.</p>
              ) : (
                <div className="space-y-3">
                  {s.actionItems.map((item, i) => (
                    <div key={i} className="grid gap-2 sm:grid-cols-3">
                      <Input
                        aria-label="Task"
                        placeholder="Task"
                        value={item.task}
                        onChange={(e) => {
                          const next = [...s.actionItems];
                          next[i] = { ...item, task: e.target.value };
                          update({ actionItems: next });
                        }}
                      />
                      <Input
                        aria-label="Responsible person"
                        placeholder="Responsible person"
                        value={item.person}
                        onChange={(e) => {
                          const next = [...s.actionItems];
                          next[i] = { ...item, person: e.target.value };
                          update({ actionItems: next });
                        }}
                      />
                      <Input
                        aria-label="Deadline"
                        placeholder="Deadline"
                        value={item.deadline}
                        onChange={(e) => {
                          const next = [...s.actionItems];
                          next[i] = { ...item, deadline: e.target.value };
                          update({ actionItems: next });
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <Button
                className="mt-4"
                onClick={sendToPlanner}
                disabled={s.actionItems.length === 0}
              >
                Send Action Items to Task Planner
              </Button>
            </Card>

            <Card>
              <h2 className="mb-2 text-lg font-semibold">Key Information</h2>
              {s.keyInformation.length === 0 ? (
                <p className="text-sm text-muted-foreground">No other key information.</p>
              ) : (
                <div className="space-y-2">
                  {s.keyInformation.map((k, i) => (
                    <Input
                      key={i}
                      value={k}
                      onChange={(e) => {
                        const next = [...s.keyInformation];
                        next[i] = e.target.value;
                        update({ keyInformation: next });
                      }}
                    />
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>

      <Disclaimer />
    </>
  );
}
