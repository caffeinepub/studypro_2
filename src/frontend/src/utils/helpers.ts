import type { Subject, SubjectWithGeneral } from "../types";

export const SUBJECTS: Subject[] = [
  "Math",
  "Reasoning",
  "GK",
  "Odia",
  "English",
  "Computer",
];

export const SUBJECTS_WITH_GENERAL: SubjectWithGeneral[] = [
  ...SUBJECTS,
  "General",
];

export const SUBJECT_CLASS_MAP: Record<SubjectWithGeneral, string> = {
  Math: "subject-math",
  Reasoning: "subject-reasoning",
  GK: "subject-gk",
  Odia: "subject-odia",
  English: "subject-english",
  Computer: "subject-computer",
  General: "subject-general",
};

export const SUBJECT_COLORS: Record<SubjectWithGeneral, string> = {
  Math: "#818cf8",
  Reasoning: "#34d399",
  GK: "#fbbf24",
  Odia: "#c084fc",
  English: "#22d3ee",
  Computer: "#f87171",
  General: "#94a3b8",
};

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "#f87171",
  Travel: "#60a5fa",
  Bills: "#fbbf24",
  Shopping: "#a78bfa",
  Other: "#94a3b8",
};

export function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function calcHours(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const start = sh * 60 + sm;
  const end = eh * 60 + em;
  const diff = end - start;
  return diff > 0 ? Math.round((diff / 60) * 100) / 100 : 0;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const NOTE_CATEGORIES = ["Study", "Personal", "Work", "Ideas"] as const;
export const EXPENSE_CATEGORIES = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Other",
] as const;
export const REMINDER_TYPES = ["Morning", "Evening", "Custom"] as const;
