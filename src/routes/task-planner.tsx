import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, Disclaimer, EmptyState, PageHeader } from "../components/AppShell";
import { Button, Input, Label, Select } from "../components/ui-kit";
import { KEYS, newId, useLocalState, type Priority, type Task } from "../lib/storage";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "Task Planner — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Organise meeting action items into a daily or weekly plan by priority.",
      },
      { property: "og:title", content: "AI Task Planner" },
      { property: "og:description", content: "Plan, prioritise and track your meeting actions." },
    ],
  }),
  component: TaskPlanner,
});

const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

function TaskPlanner() {
  const navigate = useNavigate();
  const tasks = useLocalState<Task[]>(KEYS.tasks, []);
  const planType = useLocalState<"Daily" | "Weekly">(KEYS.planType, "Daily");

  function update(id: string, patch: Partial<Task>) {
    tasks.setValue(tasks.value.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function addTask() {
    tasks.setValue([
      ...tasks.value,
      {
        id: newId(),
        task: "",
        person: "",
        deadline: "",
        priority: "Medium",
        suggestedDate: "",
        done: false,
      },
    ]);
  }

  return (
    <>
      <PageHeader
        title="Task Planner"
        description="Action items from your meeting notes, organised by priority."
      />

      <Card className="mb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="sm:w-48">
            <Label htmlFor="plan">Plan type</Label>
            <Select
              id="plan"
              value={planType.value}
              onChange={(e) => planType.setValue(e.target.value as "Daily" | "Weekly")}
            >
              <option>Daily</option>
              <option>Weekly</option>
            </Select>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" onClick={addTask}>
              Add Task
            </Button>
            <Button
              onClick={() => {
                if (tasks.value.length === 0) {
                  toast.error("There are no tasks to send.");
                  return;
                }
                navigate({ to: "/email-generator" });
              }}
            >
              Send Tasks to Email Generator
            </Button>
          </div>
        </div>
      </Card>

      {tasks.value.length === 0 ? (
        <EmptyState>No tasks have been added.</EmptyState>
      ) : (
        <div className="space-y-6">
          {PRIORITIES.map((priority) => {
            const group = tasks.value.filter((t) => t.priority === priority);
            if (group.length === 0) return null;
            return (
              <div key={priority}>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {priority} priority
                </h2>
                <div className="space-y-3">
                  {group.map((t) => (
                    <Card key={t.id}>
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          aria-label="Mark task complete"
                          checked={t.done}
                          onChange={(e) => update(t.id, { done: e.target.checked })}
                          className="mt-3 h-4 w-4 accent-[oklch(0.63_0.21_2)]"
                        />
                        <div className="grid flex-1 gap-2 sm:grid-cols-2">
                          <Input
                            aria-label="Task"
                            placeholder="Task"
                            value={t.task}
                            onChange={(e) => update(t.id, { task: e.target.value })}
                            className={t.done ? "line-through opacity-60" : ""}
                          />
                          <Input
                            aria-label="Responsible person"
                            placeholder="Responsible person"
                            value={t.person}
                            onChange={(e) => update(t.id, { person: e.target.value })}
                          />
                          <Input
                            aria-label="Deadline"
                            placeholder="Deadline"
                            value={t.deadline}
                            onChange={(e) => update(t.id, { deadline: e.target.value })}
                          />
                          <Input
                            aria-label="Suggested date"
                            placeholder="Suggested date"
                            value={t.suggestedDate}
                            onChange={(e) => update(t.id, { suggestedDate: e.target.value })}
                          />
                          <Select
                            aria-label="Priority"
                            value={t.priority}
                            onChange={(e) => update(t.id, { priority: e.target.value as Priority })}
                          >
                            {PRIORITIES.map((p) => (
                              <option key={p}>{p}</option>
                            ))}
                          </Select>
                        </div>
                        <button
                          type="button"
                          aria-label="Delete task"
                          onClick={() => tasks.setValue(tasks.value.filter((x) => x.id !== t.id))}
                          className="mt-2 rounded-lg p-2 text-muted-foreground hover:bg-secondary"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Disclaimer />
    </>
  );
}
