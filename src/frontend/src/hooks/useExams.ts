import { differenceInDays, parseISO } from "date-fns";
import { useCallback, useMemo } from "react";
import type { Exam } from "../types";
import { useLocalStorage } from "./useLocalStorage";

const SEED_EXAMS: Exam[] = [
  { id: "exam-1", name: "OSSSC RI Exam", examDate: "2026-06-15" },
  { id: "exam-2", name: "OSSSC AMIN Exam", examDate: "2026-07-20" },
  { id: "exam-3", name: "Forest Guard Exam", examDate: "2026-08-10" },
];

export function useExams() {
  const [exams, setExams] = useLocalStorage<Exam[]>(
    "studypro_exams",
    SEED_EXAMS,
  );

  const addExam = useCallback(
    (exam: Omit<Exam, "id">) => {
      const newExam: Exam = {
        ...exam,
        id: `exam-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };
      setExams((prev) =>
        [...prev, newExam].sort((a, b) => a.examDate.localeCompare(b.examDate)),
      );
    },
    [setExams],
  );

  const deleteExam = useCallback(
    (id: string) => {
      setExams((prev) => prev.filter((e) => e.id !== id));
    },
    [setExams],
  );

  const examsWithDays = useMemo(() => {
    const today = new Date();
    return exams
      .map((e) => ({
        ...e,
        daysRemaining: differenceInDays(parseISO(e.examDate), today),
      }))
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [exams]);

  const nearestExam = useMemo(
    () => examsWithDays.find((e) => e.daysRemaining >= 0) ?? null,
    [examsWithDays],
  );

  return { exams: examsWithDays, addExam, deleteExam, nearestExam };
}
