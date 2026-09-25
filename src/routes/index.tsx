import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ListChecks, Mail, MessageSquare, ShieldCheck } from "lucide-react";
import { Card, Disclaimer, PageHeader } from "../components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Turn workplace information into summaries, tasks and professional communication.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Summarise meetings, plan tasks and draft follow-up emails.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/meeting-notes",
    icon: FileText,
    title: "Meeting Notes",
    text: "Turn meeting notes into a concise summary and action items.",
    cta: "Open Meeting Notes",
  },
  {
    to: "/task-planner",
    icon: ListChecks,
    title: "Task Planner",
    text: "Organise meeting action items into a daily or weekly plan.",
    cta: "Open Task Planner",
  },
  {
    to: "/email-generator",
    icon: Mail,
    title: "Email Generator",
    text: "Create a professional follow-up email from your meeting information.",
    cta: "Open Email Generator",
  },
  {
    to: "/chatbot",
    icon: MessageSquare,
    title: "AI Chatbot",
    text: "Ask questions about your meeting notes.",
    cta: "Open AI Chatbot",
  },
] as const;

function Dashboard() {
  return (
    <>
      <PageHeader
        title="AI Workplace Productivity Assistant"
        description="Save time by turning workplace information into summaries, tasks and professional communication."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map(({ to, icon: Icon, title, text, cta }) => (
          <Card key={to} className="flex flex-col">
            <Icon className="h-6 w-6 text-primary" />
            <h2 className="mt-3 text-lg font-semibold text-foreground">{title}</h2>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{text}</p>
            <Link
              to={to}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 sm:w-auto"
            >
              {cta}
            </Link>
          </Card>
        ))}
      </div>

      <Card className="mt-4 flex items-start gap-3 bg-accent">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-foreground" />
        <p className="text-sm text-accent-foreground">
          Responsible AI reminder: never enter confidential or sensitive information, and always
          review AI output before you use it.{" "}
          <Link to="/responsible-ai" className="font-medium underline">
            Learn more
          </Link>
        </p>
      </Card>

      <Disclaimer />
    </>
  );
}
