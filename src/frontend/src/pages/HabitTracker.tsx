import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useHabits } from "@/hooks/useHabits";
import { Check, Flame, Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const HABIT_EMOJIS: Record<string, string> = {
  Study: "📚",
  Exercise: "💪",
  Reading: "📖",
  Meditation: "🧘",
};

function getHabitEmoji(name: string): string {
  return HABIT_EMOJIS[name] ?? "✨";
}

const HABIT_ACCENT_CLASSES = [
  {
    done: "bg-[oklch(0.62_0.22_265/0.2)] border-[oklch(0.62_0.22_265/0.4)]",
    btn: "bg-[oklch(0.62_0.22_265)]",
    check: "text-[oklch(0.78_0.18_265)]",
  },
  {
    done: "bg-[oklch(0.68_0.18_155/0.2)] border-[oklch(0.68_0.18_155/0.4)]",
    btn: "bg-[oklch(0.68_0.18_155)]",
    check: "text-[oklch(0.78_0.18_155)]",
  },
  {
    done: "bg-[oklch(0.75_0.18_65/0.2)] border-[oklch(0.75_0.18_65/0.4)]",
    btn: "bg-[oklch(0.75_0.18_65)]",
    check: "text-[oklch(0.82_0.16_65)]",
  },
  {
    done: "bg-[oklch(0.72_0.2_320/0.2)] border-[oklch(0.72_0.2_320/0.4)]",
    btn: "bg-[oklch(0.65_0.2_300)]",
    check: "text-[oklch(0.78_0.18_320)]",
  },
];

export function HabitTracker() {
  const { habits, addHabit, deleteHabit, toggleHabitToday } = useHabits();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  const totalDoneToday = habits.filter((h) => h.doneToday).length;

  const handleAdd = () => {
    if (!newHabitName.trim()) {
      toast.error("Please enter a habit name");
      return;
    }
    addHabit(newHabitName.trim());
    toast.success("Habit added");
    setNewHabitName("");
    setSheetOpen(false);
  };

  return (
    <div data-ocid="habits.page" className="space-y-4 pb-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-foreground">
          Habit Tracker
        </h1>
        <Button
          data-ocid="habits.add_button"
          size="sm"
          onClick={() => setSheetOpen(true)}
          className="bg-[oklch(0.62_0.22_265)] text-white rounded-xl h-8 px-3 gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {/* Today's progress */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Today's Progress</p>
            <p className="text-2xl font-display font-bold text-foreground mt-0.5">
              {totalDoneToday} / {habits.length}
            </p>
          </div>
          <div className="text-4xl">
            {totalDoneToday === habits.length && habits.length > 0
              ? "🎉"
              : "💪"}
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-[oklch(0.68_0.18_155)] transition-all duration-500"
            style={{
              width:
                habits.length > 0
                  ? `${(totalDoneToday / habits.length) * 100}%`
                  : "0%",
            }}
          />
        </div>
      </div>

      {/* Habits grid */}
      {habits.length === 0 ? (
        <div
          data-ocid="habits.empty_state"
          className="glass-card rounded-2xl p-8 text-center"
        >
          <p className="text-3xl mb-3">✨</p>
          <p className="text-sm text-muted-foreground">
            No habits yet. Add your first habit!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <AnimatePresence mode="popLayout">
            {habits.map((habit, i) => {
              const accent =
                HABIT_ACCENT_CLASSES[i % HABIT_ACCENT_CLASSES.length];
              return (
                <motion.div
                  key={habit.id}
                  data-ocid={`habits.habit.item.${i + 1}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`relative rounded-2xl p-4 border transition-all ${
                    habit.doneToday
                      ? `${accent.done} border-opacity-60`
                      : "glass-card border-border"
                  }`}
                >
                  {/* Delete button */}
                  <button
                    type="button"
                    data-ocid={`habits.habit.delete_button.${i + 1}`}
                    onClick={() => {
                      deleteHabit(habit.id);
                      toast.success("Habit removed");
                    }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/20 flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>

                  <div className="text-2xl mb-2">
                    {getHabitEmoji(habit.name)}
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {habit.name}
                  </p>

                  {/* Streak */}
                  {habit.streak > 0 && (
                    <div className="flex items-center gap-1 mb-3">
                      <Flame className="w-3 h-3 text-[oklch(0.82_0.16_65)]" />
                      <span className="text-xs font-display font-bold text-[oklch(0.82_0.16_65)]">
                        {habit.streak}d streak
                      </span>
                    </div>
                  )}

                  {/* Check button */}
                  <button
                    type="button"
                    data-ocid={`habits.habit.checkbox.${i + 1}`}
                    onClick={() => toggleHabitToday(habit.id)}
                    className={`w-full h-10 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                      habit.doneToday
                        ? `${accent.btn} text-white`
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {habit.doneToday ? (
                      <>
                        <Check className="w-4 h-4" />
                        Done
                      </>
                    ) : (
                      "Mark Done"
                    )}
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add Habit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          className="bg-[oklch(0.15_0.02_275)] border-[oklch(0.3_0.025_275)] rounded-t-3xl"
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="font-display text-foreground">
              Add Habit
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 pb-6">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Habit Name
              </Label>
              <Input
                data-ocid="habits.name.input"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                }}
                placeholder="e.g. Morning Walk"
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
                data-ocid="habits.submit_button"
                onClick={handleAdd}
                className="flex-1 rounded-xl bg-[oklch(0.62_0.22_265)] text-white"
              >
                Add Habit
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
