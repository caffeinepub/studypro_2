export type Subject =
  | "Math"
  | "Reasoning"
  | "GK"
  | "Odia"
  | "English"
  | "Computer";

export type SubjectWithGeneral = Subject | "General";

export interface StudyTask {
  id: string;
  date: string;
  subject: Subject;
  topic: string;
  plannedHours: number;
  status: "Completed" | "Pending";
}

export interface StudySession {
  id: string;
  date: string;
  subject: Subject;
  topic: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  notes: string;
}

export interface Reminder {
  id: string;
  name: string;
  time: string;
  type: "Morning" | "Evening" | "Custom";
  active: boolean;
  days: string[];
}

export interface Exam {
  id: string;
  name: string;
  examDate: string;
}

export interface Note {
  id: string;
  title: string;
  category: "Study" | "Personal" | "Work" | "Ideas";
  description: string;
  date: string;
}

export interface Expense {
  id: string;
  date: string;
  category: "Food" | "Travel" | "Bills" | "Shopping" | "Other";
  amount: number;
  description: string;
}

export interface Habit {
  id: string;
  name: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
}

export interface LibraryFile {
  id: string;
  name: string;
  subject: SubjectWithGeneral;
  description: string;
  dateAdded: string;
  fileKey: string;
  fileType: string;
}
