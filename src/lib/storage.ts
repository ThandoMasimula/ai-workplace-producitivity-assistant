import { useCallback, useEffect, useState } from "react";

export type ActionItem = { task: string; person: string; deadline: string };

export type Summary = {
  summary: string;
  decisions: string[];
  actionItems: ActionItem[];
  keyInformation: string[];
};

export type Priority = "High" | "Medium" | "Low";

export type Task = {
  id: string;
  task: string;
  person: string;
  deadline: string;
  priority: Priority;
  suggestedDate: string;
  done: boolean;
};

export type EmailDraft = { subject: string; message: string; tone: string };

export const KEYS = {
  notes: "awpa.notes",
  summary: "awpa.summary",
  tasks: "awpa.tasks",
  email: "awpa.email",
  planType: "awpa.planType",
} as const;

export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // ignore unreadable storage
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage write failures
    }
  }, [key, value, loaded]);

  const clear = useCallback(() => {
    window.localStorage.removeItem(key);
    setValue(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { value, setValue, loaded, clear };
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}
