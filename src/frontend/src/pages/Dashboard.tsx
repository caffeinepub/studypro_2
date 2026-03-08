import { SubjectBadge } from "@/components/SubjectBadge";
import { useExams } from "@/hooks/useExams";
import { useExpenses } from "@/hooks/useExpenses";
import { useStudySessions } from "@/hooks/useStudySessions";
import { useStudyTasks } from "@/hooks/useStudyTasks";
import { formatCurrency, formatHours } from "@/utils/helpers";
import { format } from "date-fns";
import {
  BarChart2,
  BookOpen,
  CheckSquare,
  Clock,
  DollarSign,
  PlusCircle,
  StickyNote,
  Timer,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { tasks, updateTask } = useStudyTasks();
  const { todayHours, studyStreak } = useStudySessions();
  const { todayExpenses } = useExpenses();
  const { nearestExam } = useExams();

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayTasks = tasks.filter((t) => t.date === todayStr);
  const todayExpAmt = todayExpenses(todayStr);

  const quickActions = [
    {
      id: "start_timer",
      icon: Timer,
      label: "Start Timer",
      color: "text-[oklch(0.72_0.2_265)]",
      bg: "bg-[oklch(0.62_0.22_265/0.12)]",
      border: "border-[oklch(0.62_0.22_265/0.2)]",
      action: "timer",
      ocid: "dashboard.start_timer_button",
    },
    {
      id: "add_session",
      icon: BarChart2,
      label: "Add Session",
      color: "text-[oklch(0.78_0.18_155)]",
      bg: "bg-[oklch(0.68_0.18_155/0.12)]",
      border: "border-[oklch(0.68_0.18_155/0.2)]",
      action: "tracker",
      ocid: "dashboard.add_session_button",
    },
    {
      id: "add_task",
      icon: CheckSquare,
      label: "Add Task",
      color: "text-[oklch(0.72_0.2_265)]",
      bg: "bg-[oklch(0.62_0.22_265/0.12)]",
      border: "border-[oklch(0.62_0.22_265/0.2)]",
      action: "planner",
      ocid: "dashboard.add_task_button",
    },
    {
      id: "add_expense",
      icon: DollarSign,
      label: "Add Expense",
      color: "text-[oklch(0.82_0.16_65)]",
      bg: "bg-[oklch(0.75_0.18_65/0.12)]",
      border: "border-[oklch(0.75_0.18_65/0.2)]",
      action: "expenses",
      ocid: "dashboard.add_expense_button",
    },
    {
      id: "add_note",
      icon: StickyNote,
      label: "Add Note",
      color: "text-[oklch(0.78_0.18_320)]",
      bg: "bg-[oklch(0.72_0.2_320/0.12)]",
      border: "border-[oklch(0.72_0.2_320/0.2)]",
      action: "notes",
      ocid: "dashboard.add_note_button",
    },
    {
      id: "library",
      icon: BookOpen,
      label: "Study Library",
      color: "text-[oklch(0.78_0.14_200)]",
      bg: "bg-[oklch(0.72_0.15_200/0.12)]",
      border: "border-[oklch(0.72_0.15_200/0.2)]",
      action: "library",
      ocid: "dashboard.library_button",
    },
  ];

  return (
    <div data-ocid="dashboard.page" className="space-y-5 pb-2">
      {/* Date header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-1"
      >
        <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
          {format(new Date(), "EEEE")}
        </p>
        <h1 className="text-3xl font-display font-bold text-foreground">
          {format(new Date(), "d MMM yyyy")}
        </h1>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-2"
      >
        <div className="glass-card rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-3.5 h-3.5 text-[oklch(0.72_0.2_265)]" />
            <span className="text-xs text-muted-foreground">Study</span>
          </div>
          <p className="text-lg font-display font-bold text-[oklch(0.78_0.18_265)]">
            {formatHours(todayHours)}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-[oklch(0.82_0.16_65)]" />
            <span className="text-xs text-muted-foreground">Spent</span>
          </div>
          <p className="text-lg font-display font-bold text-[oklch(0.82_0.16_65)]">
            {formatCurrency(todayExpAmt)}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-[oklch(0.78_0.18_155)]" />
            <span className="text-xs text-muted-foreground">Streak</span>
          </div>
          <p className="text-lg font-display font-bold text-[oklch(0.78_0.18_155)]">
            {studyStreak}d 🔥
          </p>
        </div>
      </motion.div>

      {/* Exam countdown */}
      {nearestExam && nearestExam.daysRemaining >= 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden rounded-2xl p-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.22 0.06 265) 0%, oklch(0.18 0.04 280) 100%)",
            border: "1px solid oklch(0.62 0.22 265 / 0.3)",
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(circle at top right, oklch(0.62 0.22 265), transparent 60%)",
            }}
          />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs text-[oklch(0.72_0.2_265)] font-medium uppercase tracking-wider">
                Next Exam
              </p>
              <p className="text-base font-display font-semibold text-foreground mt-0.5">
                {nearestExam.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {format(
                  new Date(`${nearestExam.examDate}T00:00:00`),
                  "d MMM yyyy",
                )}
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-display font-black text-[oklch(0.78_0.18_265)]">
                {nearestExam.daysRemaining}
              </p>
              <p className="text-xs text-muted-foreground">days left</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Today's tasks */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-display font-semibold text-foreground">
            Today's Tasks
          </h2>
          <button
            type="button"
            onClick={() => onNavigate("planner")}
            className="text-xs text-[oklch(0.72_0.2_265)] font-medium"
          >
            View all
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 text-center">
            <CheckSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-sm text-muted-foreground">
              No tasks for today. Add some!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((task, i) => (
              <motion.div
                key={task.id}
                data-ocid={`dashboard.task.item.${i + 1}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="glass-card rounded-xl p-3 flex items-center gap-3"
              >
                <button
                  type="button"
                  onClick={() =>
                    updateTask(task.id, {
                      status:
                        task.status === "Completed" ? "Pending" : "Completed",
                    })
                  }
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${
                    task.status === "Completed"
                      ? "bg-[oklch(0.68_0.18_155)] border-[oklch(0.68_0.18_155)]"
                      : "border-muted-foreground"
                  }`}
                >
                  {task.status === "Completed" && (
                    <svg
                      aria-hidden="true"
                      className="w-3 h-3 text-white mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${task.status === "Completed" ? "line-through text-muted-foreground" : "text-foreground"}`}
                  >
                    {task.topic}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <SubjectBadge subject={task.subject} />
                    <span className="text-xs text-muted-foreground">
                      {formatHours(task.plannedHours)}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    task.status === "Completed"
                      ? "bg-[oklch(0.68_0.18_155/0.15)] text-[oklch(0.78_0.18_155)]"
                      : "bg-[oklch(0.75_0.18_65/0.15)] text-[oklch(0.82_0.16_65)]"
                  }`}
                >
                  {task.status}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-sm font-display font-semibold text-foreground mb-2">
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.id}
              data-ocid={action.ocid}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(action.action)}
              className={`${action.bg} border ${action.border} rounded-2xl p-3 flex flex-col items-center gap-2 transition-all active:opacity-80`}
            >
              <action.icon className={`w-5 h-5 ${action.color}`} />
              <span className="text-xs font-medium text-foreground/80">
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
