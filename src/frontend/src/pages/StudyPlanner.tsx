import { SubjectBadge } from "@/components/SubjectBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useStudyTasks } from "@/hooks/useStudyTasks";
import type { StudyTask, Subject } from "@/types";
import { SUBJECTS, formatHours } from "@/utils/helpers";
import { addDays, format, startOfWeek } from "date-fns";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

type FilterType = "today" | "week" | "all";

const defaultForm = {
  subject: "Math" as Subject,
  topic: "",
  date: format(new Date(), "yyyy-MM-dd"),
  plannedHours: 1,
  status: "Pending" as "Completed" | "Pending",
};

export function StudyPlanner() {
  const { tasks, addTask, updateTask, deleteTask } = useStudyTasks();
  const [filter, setFilter] = useState<FilterType>("today");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) =>
    format(addDays(weekStart, i), "yyyy-MM-dd"),
  );

  const filteredTasks = tasks.filter((t) => {
    if (filter === "today") return t.date === todayStr;
    if (filter === "week") return weekDates.includes(t.date);
    return true;
  });

  const weeklyData = weekDates.map((d) => {
    const dayTasks = tasks.filter((t) => t.date === d);
    return {
      day: format(new Date(`${d}T00:00:00`), "EEE"),
      planned: dayTasks.reduce((sum, t) => sum + t.plannedHours, 0),
      completed: dayTasks
        .filter((t) => t.status === "Completed")
        .reduce((sum, t) => sum + t.plannedHours, 0),
    };
  });

  const monthTasks = tasks.filter((t) =>
    t.date.startsWith(format(new Date(), "yyyy-MM")),
  );
  const completedCount = monthTasks.filter(
    (t) => t.status === "Completed",
  ).length;
  const pendingCount = monthTasks.filter((t) => t.status === "Pending").length;

  const openAdd = () => {
    setEditId(null);
    setForm(defaultForm);
    setSheetOpen(true);
  };

  const openEdit = (task: StudyTask) => {
    setEditId(task.id);
    setForm({
      subject: task.subject,
      topic: task.topic,
      date: task.date,
      plannedHours: task.plannedHours,
      status: task.status,
    });
    setSheetOpen(true);
  };

  const handleSubmit = () => {
    if (!form.topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    if (editId) {
      updateTask(editId, form);
      toast.success("Task updated");
    } else {
      addTask(form);
      toast.success("Task added");
    }
    setSheetOpen(false);
  };

  return (
    <div data-ocid="planner.page" className="space-y-4 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-foreground">
          Study Planner
        </h1>
        <Button
          data-ocid="planner.add_task_button"
          size="sm"
          onClick={openAdd}
          className="bg-[oklch(0.62_0.22_265)] text-white rounded-xl h-8 px-3 gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {/* Filter tabs */}
      <div
        data-ocid="planner.filter.tab"
        className="flex gap-1 bg-[oklch(0.15_0.02_275)] rounded-xl p-1"
      >
        {(["today", "week", "all"] as FilterType[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all capitalize ${
              filter === f
                ? "bg-[oklch(0.62_0.22_265)] text-white"
                : "text-muted-foreground"
            }`}
          >
            {f === "today" ? "Today" : f === "week" ? "This Week" : "All"}
          </button>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="glass-card rounded-2xl p-4">
        <h2 className="text-sm font-display font-semibold text-foreground mb-3">
          Weekly Progress
        </h2>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={weeklyData} barGap={2}>
            <XAxis
              dataKey="day"
              tick={{ fill: "oklch(0.6 0.01 265)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: "oklch(0.18 0.022 275)",
                border: "1px solid oklch(0.3 0.025 275)",
                borderRadius: "8px",
                color: "oklch(0.96 0.008 265)",
                fontSize: 12,
              }}
              formatter={(val: number) => [`${val}h`, ""]}
            />
            <Bar
              dataKey="planned"
              name="Planned"
              fill="oklch(0.62 0.22 265 / 0.4)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="completed"
              name="Done"
              fill="oklch(0.68 0.18 155)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[oklch(0.62_0.22_265/0.4)]" />
            <span className="text-xs text-muted-foreground">Planned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[oklch(0.68_0.18_155)]" />
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
        </div>
      </div>

      {/* Monthly summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="text-2xl font-display font-bold text-foreground">
            {monthTasks.length}
          </p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="text-2xl font-display font-bold text-[oklch(0.78_0.18_155)]">
            {completedCount}
          </p>
          <p className="text-xs text-muted-foreground">Done</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="text-2xl font-display font-bold text-[oklch(0.82_0.16_65)]">
            {pendingCount}
          </p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-muted-foreground text-sm">No tasks found</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task, i) => (
              <motion.div
                key={task.id}
                data-ocid={`planner.task.item.${i + 1}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-xl p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <SubjectBadge subject={task.subject} />
                      <span className="text-xs text-muted-foreground">
                        {task.date}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">
                      {task.topic}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatHours(task.plannedHours)}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                          task.status === "Completed"
                            ? "bg-[oklch(0.68_0.18_155/0.15)] text-[oklch(0.78_0.18_155)]"
                            : "bg-[oklch(0.75_0.18_65/0.15)] text-[oklch(0.82_0.16_65)]"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(task)}
                      className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button
                      type="button"
                      data-ocid={`planner.task.delete_button.${i + 1}`}
                      onClick={() => {
                        deleteTask(task.id);
                        toast.success("Task deleted");
                      }}
                      className="w-8 h-8 rounded-lg bg-[oklch(0.65_0.22_25/0.1)] flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[oklch(0.78_0.2_25)]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Add/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          className="bg-[oklch(0.15_0.02_275)] border-[oklch(0.3_0.025_275)] rounded-t-3xl max-h-[85vh] overflow-y-auto"
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="font-display text-foreground">
              {editId ? "Edit Task" : "Add Study Task"}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4 pb-6">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Subject</Label>
              <Select
                value={form.subject}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, subject: v as Subject }))
                }
              >
                <SelectTrigger
                  data-ocid="planner.task.subject.select"
                  className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[oklch(0.18_0.022_275)] border-[oklch(0.3_0.025_275)]">
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Topic</Label>
              <Input
                data-ocid="planner.task.form.input"
                value={form.topic}
                onChange={(e) =>
                  setForm((p) => ({ ...p, topic: e.target.value }))
                }
                placeholder="Enter topic name"
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Date</Label>
              <Input
                data-ocid="planner.task.date.input"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Planned Hours
              </Label>
              <Input
                data-ocid="planner.task.hours.input"
                type="number"
                min={0.5}
                max={12}
                step={0.5}
                value={form.plannedHours}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    plannedHours: Number.parseFloat(e.target.value) || 1,
                  }))
                }
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    status: v as "Completed" | "Pending",
                  }))
                }
              >
                <SelectTrigger
                  data-ocid="planner.task.status.select"
                  className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[oklch(0.18_0.022_275)] border-[oklch(0.3_0.025_275)]">
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setSheetOpen(false)}
                className="flex-1 rounded-xl border-[oklch(0.3_0.025_275)]"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                data-ocid="planner.task.submit_button"
                onClick={handleSubmit}
                className="flex-1 rounded-xl bg-[oklch(0.62_0.22_265)] text-white"
              >
                {editId ? "Update" : "Add Task"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
