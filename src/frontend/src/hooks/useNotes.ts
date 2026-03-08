import { format } from "date-fns";
import { useCallback } from "react";
import type { Note } from "../types";
import { useLocalStorage } from "./useLocalStorage";

const today = format(new Date(), "yyyy-MM-dd");
const SEED_NOTES: Note[] = [
  {
    id: "note-1",
    title: "OSSSC RI Syllabus Key Points",
    category: "Study",
    description:
      "Important topics: Odia Language, GK (Odisha focus), Arithmetic, Reasoning. Exam pattern: 200 marks, 2 hours. Focus more on Odia section as it carries 50 marks.",
    date: today,
  },
  {
    id: "note-2",
    title: "Study Schedule Template",
    category: "Study",
    description:
      "Morning 7-9: Math. Break. 10-12: Reasoning. Lunch. 2-4: GK/Odia. Evening 6-8: English/Computer. Revision before sleep.",
    date: today,
  },
  {
    id: "note-3",
    title: "Exam Day Checklist",
    category: "Personal",
    description:
      "Admit card, ID proof, pen, pencil, eraser, water bottle, watch. Reach venue 30 minutes early. Stay calm and read instructions carefully.",
    date: today,
  },
  {
    id: "note-4",
    title: "Weak Areas to Focus",
    category: "Ideas",
    description:
      "Need to improve: Speed in arithmetic calculations, Odia grammar (Sandhi-Samaas), Current affairs after 2023. Plan: 30 min daily for each weak area.",
    date: today,
  },
];

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Note[]>(
    "studypro_notes",
    SEED_NOTES,
  );

  const addNote = useCallback(
    (note: Omit<Note, "id">) => {
      const newNote: Note = {
        ...note,
        id: `note-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };
      setNotes((prev) => [newNote, ...prev]);
    },
    [setNotes],
  );

  const updateNote = useCallback(
    (id: string, updates: Partial<Note>) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...updates } : n)),
      );
    },
    [setNotes],
  );

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotes],
  );

  return { notes, addNote, updateNote, deleteNote };
}
