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
import { Textarea } from "@/components/ui/textarea";
import { useStudySessions } from "@/hooks/useStudySessions";
import type { Subject } from "@/types";
import {
  SUBJECTS,
  SUBJECT_COLORS,
  calcHours,
  formatHours,
} from "@/utils/helpers";
import { format, startOfMonth, subDays } from "date-fns";
import { Flame, Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const defaultForm = {
  subject: "Math" as Subject,
  topic: "",
  date: format(new Date(), "yyyy-MM-dd"),
  startTime: "09:00",
  endTime: "10:00",
  notes: "",
};

export function StudyTracker() {
  const { sessions, addSession, deleteSession, studyStreak, todayHours } =
    useStudySessions();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  // Last 7 days chart
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = format(subDays(new Date(), 6 - i), "yyyy-MM-dd");
    const dayHours = sessions
      .filter((s) => s.date === d)
      .reduce((sum, s) => sum + s.totalHours, 0);
    return {
      day: format(new Date(`${d}T00:00:00`), "EEE"),
      hours: Math.round(dayHours * 10) / 10,
    };
  });

  // Monthly subject breakdown
  const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
  const monthSessions = sessions.filter((s) => s.date >= monthStart);
  const subjectTotals = SUBJECTS.map((sub) => ({
    name: sub,
    hours:
      Math.round(
        monthSessions
          .filter((s) => s.subject === sub)
          .reduce((sum, s) => sum + s.totalHours, 0) * 10,
      ) / 10,
    color: SUBJECT_COLORS[sub],
  })).filter((s) => s.hours > 0);

  const handleSubmit = () => {
    if (!form.topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    const totalHours = calcHours(form.startTime, form.endTime);
    if (totalHours <= 0) {
      toast.error("End time must be after start time");
      return;
    }
    addSession({ ...form, totalHours });
    toast.success("Session added");
    setSheetOpen(false);
    setForm(defaultForm);
  };

  return (
    <div data-ocid="tracker.page" className="space-y-4 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-foreground">
          Study Tracker
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[oklch(0.65_0.22_25/0.12)] border border-[oklch(0.65_0.22_25/0.3)] rounded-full px-2.5 py-1">
            <Flame className="w-3.5 h-3.5 text-[oklch(0.82_0.16_65)]" />
            <span className="text-xs font-display font-bold text-[oklch(0.82_0.16_65)]">
              {studyStreak}d
            </span>
          </div>
          <Button
            data-ocid="tracker.add_session_button"
            size="sm"
            onClick={() => setSheetOpen(true)}
            className="bg-[oklch(0.62_0.22_265)] text-white rounded-xl h-8 px-3 gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="glass-card rounded-xl p-3">
          <p className="text-xs text-muted-foreground">Today</p>
          <p className="text-2xl font-display font-bold text-[oklch(0.78_0.18_265)]">
            {formatHours(todayHours)}
          </p>
        </div>
        <div className="glass-card rounded-xl p-3">
          <p className="text-xs text-muted-foreground">This Month</p>
          <p className="text-2xl font-display font-bold text-[oklch(0.78_0.18_155)]">
            {formatHours(
              monthSessions.reduce((s, sess) => s + sess.totalHours, 0),
            )}
          </p>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="glass-card rounded-2xl p-4">
        <h2 className="text-sm font-display font-semibold text-foreground mb-3">
          Last 7 Days
        </h2>
        <ResponsiveContainer width="100%" height={110}>
          <BarChart data={last7}>
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
              formatter={(val: number) => [`${val}h`, "Hours"]}
            />
            <Bar
              dataKey="hours"
              fill="oklch(0.62 0.22 265)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Subject breakdown */}
      {subjectTotals.length > 0 && (
        <div className="glass-card rounded-2xl p-4">
          <h2 className="text-sm font-display font-semibold text-foreground mb-3">
            Monthly by Subject
          </h2>
          <div className="flex items-center gap-4">
            <PieChart width={100} height={100}>
              <Pie
                data={subjectTotals}
                cx={50}
                cy={50}
                innerRadius={30}
                outerRadius={48}
                paddingAngle={2}
                dataKey="hours"
              >
                {subjectTotals.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            <div className="grid grid-cols-2 gap-1.5 flex-1">
              {subjectTotals.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: s.color }}
                  />
                  <span className="text-xs text-muted-foreground truncate">
                    {s.name}: {s.hours}h
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sessions list */}
      <div>
        <h2 className="text-sm font-display font-semibold text-foreground mb-2">
          Sessions ({sessions.length})
        </h2>
        <div className="space-y-2">
          {sessions.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="text-muted-foreground text-sm">No sessions yet</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {sessions.slice(0, 20).map((sess, i) => (
                <motion.div
                  key={sess.id}
                  data-ocid={`tracker.session.item.${i + 1}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card rounded-xl p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <SubjectBadge subject={sess.subject} />
                        <span className="text-xs text-muted-foreground">
                          {sess.date}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">
                        {sess.topic}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {sess.startTime} – {sess.endTime} •{" "}
                        <span className="text-[oklch(0.78_0.18_265)]">
                          {formatHours(sess.totalHours)}
                        </span>
                      </p>
                      {sess.notes && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {sess.notes}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      data-ocid={`tracker.session.delete_button.${i + 1}`}
                      onClick={() => {
                        deleteSession(sess.id);
                        toast.success("Session deleted");
                      }}
                      className="w-8 h-8 rounded-lg bg-[oklch(0.65_0.22_25/0.1)] flex items-center justify-center flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[oklch(0.78_0.2_25)]" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Add Session Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          className="bg-[oklch(0.15_0.02_275)] border-[oklch(0.3_0.025_275)] rounded-t-3xl max-h-[90vh] overflow-y-auto"
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="font-display text-foreground">
              Add Study Session
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
                  data-ocid="tracker.session.subject.select"
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
                data-ocid="tracker.session.form.topic_input"
                value={form.topic}
                onChange={(e) =>
                  setForm((p) => ({ ...p, topic: e.target.value }))
                }
                placeholder="What did you study?"
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Date</Label>
              <Input
                data-ocid="tracker.session.date.input"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Start Time
                </Label>
                <Input
                  data-ocid="tracker.session.start_time.input"
                  type="time"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, startTime: e.target.value }))
                  }
                  className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  End Time
                </Label>
                <Input
                  data-ocid="tracker.session.end_time.input"
                  type="time"
                  value={form.endTime}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, endTime: e.target.value }))
                  }
                  className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
                />
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Duration:{" "}
              <span className="text-[oklch(0.78_0.18_265)] font-medium">
                {formatHours(calcHours(form.startTime, form.endTime))}
              </span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Notes (optional)
              </Label>
              <Textarea
                data-ocid="tracker.session.notes.textarea"
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="What did you cover?"
                rows={2}
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl resize-none"
              />
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
                data-ocid="tracker.session.submit_button"
                onClick={handleSubmit}
                className="flex-1 rounded-xl bg-[oklch(0.62_0.22_265)] text-white"
              >
                Save Session
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
