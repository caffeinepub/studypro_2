import { useCallback } from "react";
import type { Reminder } from "../types";
import { useLocalStorage } from "./useLocalStorage";

const SEED_REMINDERS: Reminder[] = [
  {
    id: "rem-1",
    name: "Morning Study Reminder",
    time: "07:00",
    type: "Morning",
    active: true,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    id: "rem-2",
    name: "Evening Revision Reminder",
    time: "19:00",
    type: "Evening",
    active: true,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
];

export function useReminders() {
  const [reminders, setReminders] = useLocalStorage<Reminder[]>(
    "studypro_reminders",
    SEED_REMINDERS,
  );

  const addReminder = useCallback(
    (reminder: Omit<Reminder, "id">) => {
      const newReminder: Reminder = {
        ...reminder,
        id: `rem-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };
      setReminders((prev) => [...prev, newReminder]);
    },
    [setReminders],
  );

  const toggleReminder = useCallback(
    (id: string) => {
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)),
      );
    },
    [setReminders],
  );

  const deleteReminder = useCallback(
    (id: string) => {
      setReminders((prev) => prev.filter((r) => r.id !== id));
    },
    [setReminders],
  );

  return { reminders, addReminder, toggleReminder, deleteReminder };
}
