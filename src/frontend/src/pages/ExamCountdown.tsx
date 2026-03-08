import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useExams } from "@/hooks/useExams";
import { format } from "date-fns";
import { CalendarDays, Plus, Trash2, Trophy, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const defaultForm = {
  name: "",
  examDate: format(new Date(Date.now() + 30 * 86400000), "yyyy-MM-dd"),
};

export function ExamCountdown() {
  const { exams, addExam, deleteExam } = useExams();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Please enter exam name");
      return;
    }
    if (!form.examDate) {
      toast.error("Please select exam date");
      return;
    }
    addExam(form);
    toast.success("Exam added");
    setSheetOpen(false);
    setForm(defaultForm);
  };

  const getUrgencyStyle = (days: number) => {
    if (days < 0)
      return { bg: "bg-muted", text: "text-muted-foreground", label: "Past" };
    if (days <= 30)
      return {
        bg: "bg-[oklch(0.65_0.22_25/0.12)]",
        text: "text-[oklch(0.78_0.2_25)]",
        border: "border-[oklch(0.65_0.22_25/0.3)]",
        label: "⚡ Soon",
      };
    if (days <= 90)
      return {
        bg: "bg-[oklch(0.75_0.18_65/0.12)]",
        text: "text-[oklch(0.82_0.16_65)]",
        border: "border-[oklch(0.75_0.18_65/0.3)]",
        label: "📅 Upcoming",
      };
    return {
      bg: "bg-[oklch(0.62_0.22_265/0.08)]",
      text: "text-[oklch(0.78_0.18_265)]",
      border: "border-[oklch(0.62_0.22_265/0.2)]",
      label: "📚 Planned",
    };
  };

  return (
    <div data-ocid="exams.page" className="space-y-4 pb-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-foreground">
          Exam Countdown
        </h1>
        <Button
          data-ocid="exams.add_button"
          size="sm"
          onClick={() => setSheetOpen(true)}
          className="bg-[oklch(0.62_0.22_265)] text-white rounded-xl h-8 px-3 gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {exams.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <CalendarDays className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm text-muted-foreground">No exams added yet</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {exams.map((exam, i) => {
            const style = getUrgencyStyle(exam.daysRemaining);
            const isPinned = i === 0 && exam.daysRemaining >= 0;

            return (
              <motion.div
                key={exam.id}
                data-ocid={`exams.item.${i + 1}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`relative overflow-hidden rounded-2xl p-4 border ${style.border ?? "border-border"} ${style.bg}`}
              >
                {isPinned && (
                  <div className="absolute top-3 right-3">
                    <Trophy className="w-4 h-4 text-[oklch(0.82_0.16_65)]" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-8">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full bg-foreground/5 ${style.text}`}
                    >
                      {style.label}
                    </span>
                    <h3 className="text-base font-display font-bold text-foreground mt-1.5 leading-tight">
                      {exam.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(
                        new Date(`${exam.examDate}T00:00:00`),
                        "d MMM yyyy",
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-5xl font-display font-black leading-none ${style.text}`}
                    >
                      {exam.daysRemaining < 0 ? "—" : exam.daysRemaining}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {exam.daysRemaining < 0 ? "past" : "days left"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  data-ocid={`exams.delete_button.${i + 1}`}
                  onClick={() => {
                    deleteExam(exam.id);
                    toast.success("Exam removed");
                  }}
                  className="absolute bottom-3 right-3 w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center"
                >
                  <Trash2 className="w-3 h-3 text-muted-foreground" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}

      {/* Add Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          className="bg-[oklch(0.15_0.02_275)] border-[oklch(0.3_0.025_275)] rounded-t-3xl"
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="font-display text-foreground">
              Add Exam
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 pb-6">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Exam Name</Label>
              <Input
                data-ocid="exams.name.input"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="OSSSC RI Exam"
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Exam Date</Label>
              <Input
                data-ocid="exams.date.input"
                type="date"
                value={form.examDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, examDate: e.target.value }))
                }
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
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
                data-ocid="exams.submit_button"
                onClick={handleSubmit}
                className="flex-1 rounded-xl bg-[oklch(0.62_0.22_265)] text-white"
              >
                Add Exam
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
