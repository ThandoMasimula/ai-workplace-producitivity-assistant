import { createFileRoute } from "@tanstack/react-router";
import { Card, Disclaimer, PageHeader } from "../components/AppShell";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Privacy, accuracy, bias and human review when using AI at work.",
      },
      { property: "og:title", content: "Responsible AI" },
      { property: "og:description", content: "How to use AI safely and sensibly at work." },
    ],
  }),
  component: ResponsibleAi,
});

const TOPICS = [
  {
    title: "Privacy",
    text: "Do not enter confidential or sensitive workplace information.",
  },
  {
    title: "Accuracy",
    text: "AI can make mistakes, so generated information should always be checked.",
  },
  { title: "Bias", text: "AI outputs can contain bias and should be reviewed critically." },
  {
    title: "Human Review",
    text: "AI should assist people, not replace human judgment. Important workplace information should be checked before being used.",
  },
] as const;

function ResponsibleAi() {
  return (
    <>
      <PageHeader title="Responsible AI" description="A few things to keep in mind when using AI." />
      <div className="grid gap-4 sm:grid-cols-2">
        {TOPICS.map((t) => (
          <Card key={t.title}>
            <h2 className="text-lg font-semibold">{t.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
          </Card>
        ))}
      </div>
      <Disclaimer />
    </>
  );
}
