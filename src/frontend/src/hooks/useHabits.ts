import { format, parseISO, subDays } from "date-fns";
import { useCallback, useMemo } from "react";
import type { Habit, HabitLog } from "../types";
import { useLocalStorage } from "./useLocalStorage";

const SEED_HABITS: Habit[] = [
  { id: "habit-1", name: "Study" },
  { id: "habit-2", name: "Exercise" },
  { id: "habit-3", name: "Reading" },
  { id: "habit-4", name: "Meditation" },
];

const buildSeedLogs = (): HabitLog[] => {
  const logs: HabitLog[] = [];
  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const twoDaysAgo = format(subDays(new Date(), 2), "yyyy-MM-dd");

  // Study - 3 day streak
  logs.push(
    { id: "hl-1", habitId: "habit-1", date: today },
    { id: "hl-2", habitId: "habit-1", date: yesterday },
    { id: "hl-3", habitId: "habit-1", date: twoDaysAgo },
  );
  // Exercise - 2 day streak
  logs.push(
    { id: "hl-4", habitId: "habit-2", date: today },
    { id: "hl-5", habitId: "habit-2", date: yesterday },
  );
  // Reading - today
  logs.push({ id: "hl-6", habitId: "habit-3", date: today });
  // Meditation - 1 day ago
  logs.push({ id: "hl-7", habitId: "habit-4", date: yesterday });

  return logs;
};

export function useHabits() {
  const [habits, setHabits] = useLocalStorage<Habit[]>(
    "studypro_habits",
    SEED_HABITS,
  );
  const [habitLogs, setHabitLogs] = useLocalStorage<HabitLog[]>(
    "studypro_habit_logs",
    buildSeedLogs(),
  );

  const addHabit = useCallback(
    (name: string) => {
      const newHabit: Habit = {
        id: `habit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name,
      };
      setHabits((prev) => [...prev, newHabit]);
    },
    [setHabits],
  );

  const deleteHabit = useCallback(
    (id: string) => {
      setHabits((prev) => prev.filter((h) => h.id !== id));
      setHabitLogs((prev) => prev.filter((l) => l.habitId !== id));
    },
    [setHabits, setHabitLogs],
  );

  const toggleHabitToday = useCallback(
    (habitId: string) => {
      const todayStr = format(new Date(), "yyyy-MM-dd");
      const existing = habitLogs.find(
        (l) => l.habitId === habitId && l.date === todayStr,
      );
      if (existing) {
        setHabitLogs((prev) => prev.filter((l) => l.id !== existing.id));
      } else {
        const newLog: HabitLog = {
          id: `hl-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          habitId,
          date: todayStr,
        };
        setHabitLogs((prev) => [...prev, newLog]);
      }
    },
    [habitLogs, setHabitLogs],
  );

  const isHabitDoneToday = useCallback(
    (habitId: string) => {
      const todayStr = format(new Date(), "yyyy-MM-dd");
      return habitLogs.some(
        (l) => l.habitId === habitId && l.date === todayStr,
      );
    },
    [habitLogs],
  );

  const getHabitStreak = useCallback(
    (habitId: string) => {
      const logDates = new Set(
        habitLogs.filter((l) => l.habitId === habitId).map((l) => l.date),
      );
      let streak = 0;
      let checkDate = format(new Date(), "yyyy-MM-dd");
      while (logDates.has(checkDate)) {
        streak++;
        const prev = subDays(parseISO(checkDate), 1);
        checkDate = format(prev, "yyyy-MM-dd");
      }
      return streak;
    },
    [habitLogs],
  );

  const habitsWithStats = useMemo(
    () =>
      habits.map((h) => ({
        ...h,
        doneToday: isHabitDoneToday(h.id),
        streak: getHabitStreak(h.id),
      })),
    [habits, isHabitDoneToday, getHabitStreak],
  );

  return {
    habits: habitsWithStats,
    addHabit,
    deleteHabit,
    toggleHabitToday,
  };
}
