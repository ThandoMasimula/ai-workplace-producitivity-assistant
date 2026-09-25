import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, Disclaimer, PageHeader } from "../components/AppShell";
import { Button } from "../components/ui-kit";
import { KEYS } from "../lib/storage";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Workplace Productivity Assistant" },
      { name: "description", content: "Manage the information saved on your device." },
      { property: "og:title", content: "Settings" },
      { property: "og:description", content: "Clear saved meeting notes, tasks and drafts." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  function clear(keys: string[], message: string) {
    keys.forEach((k) => window.localStorage.removeItem(k));
    toast.success(message);
    window.location.reload();
  }

  return (
    <>
      <PageHeader title="Settings" description="Everything is stored on your own device." />

      <Card>
        <h2 className="text-lg font-semibold">Saved Data</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This application saves your meeting notes, summary, tasks and email draft in your
          browser's local storage. Nothing is stored in an account or database.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            variant="secondary"
            onClick={() => clear([KEYS.notes, KEYS.summary], "Meeting notes cleared.")}
          >
            Clear Meeting Notes
          </Button>
          <Button variant="secondary" onClick={() => clear([KEYS.tasks], "Tasks cleared.")}>
            Clear Tasks
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm("Clear all saved data? This cannot be undone.")) {
                clear(Object.values(KEYS), "All saved data cleared.");
              }
            }}
          >
            Clear All Saved Data
          </Button>
        </div>
      </Card>

      <Disclaimer />
    </>
  );
}
