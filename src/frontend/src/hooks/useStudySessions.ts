import { format, isValid, parseISO, subDays } from "date-fns";
import { useCallback, useMemo } from "react";
import type { StudySession } from "../types";
import { useLocalStorage } from "./useLocalStorage";

const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split("T")[0];

const SEED_SESSIONS: StudySession[] = [
  {
    id: "sess-1",
    date: today,
    subject: "Math",
    topic: "Arithmetic & Number System",
    startTime: "09:00",
    endTime: "10:30",
    totalHours: 1.5,
    notes: "Covered percentages and ratios",
  },
  {
    id: "sess-2",
    date: today,
    subject: "Reasoning",
    topic: "Coding-Decoding",
    startTime: "11:00",
    endTime: "12:00",
    totalHours: 1,
    notes: "",
  },
  {
    id: "sess-3",
    date: yesterday,
    subject: "GK",
    topic: "Current Affairs - January",
    startTime: "08:30",
    endTime: "10:00",
    totalHours: 1.5,
    notes: "Important national events",
  },
  {
    id: "sess-4",
    date: yesterday,
    subject: "English",
    topic: "Vocabulary Building",
    startTime: "15:00",
    endTime: "16:30",
    totalHours: 1.5,
    notes: "",
  },
  {
    id: "sess-5",
    date: twoDaysAgo,
    subject: "Odia",
    topic: "Grammar - Sandhi",
    startTime: "09:00",
    endTime: "10:30",
    totalHours: 1.5,
    notes: "Complex sandhi rules",
  },
  {
    id: "sess-6",
    date: twoDaysAgo,
    subject: "Computer",
    topic: "Operating System Concepts",
    startTime: "14:00",
    endTime: "15:30",
    totalHours: 1.5,
    notes: "",
  },
];

export function useStudySessions() {
  const [sessions, setSessions] = useLocalStorage<StudySession[]>(
    "studypro_sessions",
    SEED_SESSIONS,
  );

  const addSession = useCallback(
    (session: Omit<StudySession, "id">) => {
      const newSession: StudySession = {
        ...session,
        id: `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };
      setSessions((prev) => [newSession, ...prev]);
    },
    [setSessions],
  );

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
    },
    [setSessions],
  );

  const studyStreak = useMemo(() => {
    const sessionDates = new Set(sessions.map((s) => s.date));
    let streak = 0;
    const todayDate = format(new Date(), "yyyy-MM-dd");
    let checkDate = todayDate;

    while (sessionDates.has(checkDate)) {
      streak++;
      const prev = subDays(parseISO(checkDate), 1);
      if (!isValid(prev)) break;
      checkDate = format(prev, "yyyy-MM-dd");
    }

    return streak;
  }, [sessions]);

  const todayHours = useMemo(() => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    return sessions
      .filter((s) => s.date === todayStr)
      .reduce((sum, s) => sum + s.totalHours, 0);
  }, [sessions]);

  return { sessions, addSession, deleteSession, studyStreak, todayHours };
}
