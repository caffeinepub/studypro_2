# StudyPro - Personal Productivity & Study Management App

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add

**Dashboard (Home)**
- Display today's date
- Today's study tasks list (from planner)
- Total study hours today (from tracker)
- Today's total expenses
- Upcoming exam countdown (nearest exam)
- Quick action buttons: Start Study Timer, Add Study Session, Add Expense, Add Note, Open Study Library

**Study Planner**
- CRUD study tasks with fields: Date, Subject (Math/Reasoning/GK/Odia/English/Computer), Topic, Planned Study Hours, Status (Completed/Pending)
- Daily tasks view
- Weekly progress bar chart (hours per subject)
- Monthly summary (total tasks, completed, pending)

**Study Tracker**
- CRUD study sessions with fields: Date, Subject, Topic, Start Time, End Time, Total Hours (auto-calculated), Notes
- Weekly study hours bar chart
- Monthly analytics (total hours per subject)
- Study streak counter (consecutive days with at least one session)

**Study Timer (Focus Timer)**
- Pomodoro-style: 25-minute focus / 5-minute break
- Start / Pause / Reset controls
- Auto-save completed session to Study Tracker on focus completion
- Display total study time accumulated today

**Study Reminders**
- Add/edit reminders with: Name, Time, Type (Morning/Evening/Custom), Days of Week toggle
- List of active reminders
- In-app notification simulation (since push notifications are not supported)
- Pre-seeded examples: Morning Study Reminder, Evening Revision Reminder

**Exam Countdown**
- CRUD exams with fields: Exam Name, Exam Date
- Display countdown in days remaining
- Highlight the nearest upcoming exam
- Pre-seeded examples: OSSSC RI Exam, OSSSC AMIN Exam, Forest Guard Exam

**Study Library**
- Upload and store files (PDF, images, documents) via blob-storage
- Fields: File Name, Subject, Description, Date Added
- Open/preview files inline
- Filter by subject
- Quick search by name

**Notes**
- CRUD notes with fields: Title, Category (Study/Personal/Work/Ideas), Description, Date
- Filter/search by category

**Expense Manager**
- CRUD expenses with fields: Date, Category (Food/Travel/Bills/Shopping/Other), Amount, Description
- Monthly total display
- Expense breakdown donut/bar chart

**Habit Tracker**
- Default habits: Study, Exercise, Reading, Meditation
- Add custom habits
- Daily checkbox to mark habits done
- Streak counter per habit

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan

**Backend (Motoko)**
- StudyPlanner: addTask, updateTask, deleteTask, getTasks, getTasksByDate
- StudyTracker: addSession, updateSession, deleteSession, getSessions, getSessionsByDateRange
- StudyTimer: saveTimerSession (auto-save from timer)
- Reminders: addReminder, updateReminder, deleteReminder, getReminders
- ExamCountdown: addExam, updateExam, deleteExam, getExams
- Notes: addNote, updateNote, deleteNote, getNotes
- Expenses: addExpense, updateExpense, deleteExpense, getExpenses, getExpensesByMonth
- HabitTracker: addHabit, deleteHabit, markHabitDone, unmarkHabitDone, getHabits, getHabitLogs

**Components**
- blob-storage: file upload in Study Library

**Frontend**
- Bottom navigation: Dashboard, Planner, Tracker, Timer, More (expands to: Reminders, Exams, Library, Notes, Expenses, Habits)
- Dark mode design throughout
- Charts: recharts library for study hours and expenses
- Mobile-first layout (max-width container, touch-friendly buttons)
- All sections accessible from bottom nav or dashboard quick actions
