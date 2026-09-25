import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  FileText,
  ListChecks,
  Mail,
  MessageSquare,
  Settings as SettingsIcon,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/meeting-notes", label: "Meeting Notes", icon: FileText },
  { to: "/task-planner", label: "Task Planner", icon: ListChecks },
  { to: "/email-generator", label: "Email Generator", icon: Mail },
  { to: "/chatbot", label: "AI Chatbot", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
  { to: "/responsible-ai", label: "Responsible AI", icon: ShieldCheck },
] as const;

export function AiWarning() {
  return (
    <p className="mb-2 rounded-lg bg-warning px-3 py-2 text-sm text-warning-foreground">
      Please do not enter confidential or sensitive information.
    </p>
  );
}

export function Disclaimer() {
  return (
    <p className="mt-10 border-t border-border pt-4 text-xs text-muted-foreground">
      AI can make mistakes. Always review AI-generated information before using it for important
      decisions or workplace communication.
    </p>
  );
}

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
    </header>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-border bg-card p-5 shadow-card ${className}`}>
      {children}
    </section>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          activeProps={{
            className:
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary",
          }}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-sidebar p-4 lg:flex">
        <div className="mb-6 px-2">
          <p className="text-sm font-semibold text-sidebar-foreground">AI Workplace</p>
          <p className="text-xs text-sidebar-foreground/60">Productivity Assistant</p>
        </div>
        <NavLinks />
      </aside>

      <div className="flex items-center justify-between bg-sidebar px-4 py-3 lg:hidden">
        <p className="text-sm font-semibold text-sidebar-foreground">AI Workplace Assistant</p>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="bg-sidebar px-4 pb-4 lg:hidden">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      ) : null}

      <main className="px-4 py-6 sm:px-8 lg:ml-64 lg:py-10">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
