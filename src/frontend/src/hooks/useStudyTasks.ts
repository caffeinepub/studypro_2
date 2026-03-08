import { useCallback } from "react";
import type { StudyTask } from "../types";
import { useLocalStorage } from "./useLocalStorage";

const SEED_TASKS: StudyTask[] = [
  {
    id: "task-1",
    date: new Date().toISOString().split("T")[0],
    subject: "Math",
    topic: "Arithmetic & Number System",
    plannedHours: 2,
    status: "Pending",
  },
  {
    id: "task-2",
    date: new Date().toISOString().split("T")[0],
    subject: "Reasoning",
    topic: "Coding-Decoding",
    plannedHours: 1.5,
    status: "Completed",
  },
  {
    id: "task-3",
    date: new Date().toISOString().split("T")[0],
    subject: "GK",
    topic: "Indian History - Mughal Era",
    plannedHours: 1,
    status: "Pending",
  },
  {
    id: "task-4",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    subject: "English",
    topic: "Comprehension Practice",
    plannedHours: 1.5,
    status: "Completed",
  },
  {
    id: "task-5",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    subject: "Computer",
    topic: "MS Office Basics",
    plannedHours: 1,
    status: "Completed",
  },
];

export function useStudyTasks() {
  const [tasks, setTasks] = useLocalStorage<StudyTask[]>(
    "studypro_tasks",
    SEED_TASKS,
  );

  const addTask = useCallback(
    (task: Omit<StudyTask, "id">) => {
      const newTask: StudyTask = {
        ...task,
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };
      setTasks((prev) => [newTask, ...prev]);
    },
    [setTasks],
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<StudyTask>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      );
    },
    [setTasks],
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [setTasks],
  );

  return { tasks, addTask, updateTask, deleteTask };
}
