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
import { Switch } from "@/components/ui/switch";
import { useReminders } from "@/hooks/useReminders";
import type { Reminder } from "@/types";
import { DAYS_OF_WEEK, REMINDER_TYPES } from "@/utils/helpers";
import { Bell, Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const defaultForm = {
  name: "",
  time: "07:00",
  type: "Morning" as Reminder["type"],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
};

const typeColors: Record<Reminder["type"], string> = {
  Morning:
    "bg-[oklch(0.75_0.18_65/0.15)] text-[oklch(0.82_0.16_65)] border-[oklch(0.75_0.18_65/0.3)]",
  Evening:
    "bg-[oklch(0.72_0.2_320/0.15)] text-[oklch(0.78_0.18_320)] border-[oklch(0.72_0.2_320/0.3)]",
  Custom:
    "bg-[oklch(0.62_0.22_265/0.15)] text-[oklch(0.78_0.18_265)] border-[oklch(0.62_0.22_265/0.3)]",
};

export function Reminders() {
  const { reminders, addReminder, toggleReminder, deleteReminder } =
    useReminders();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const toggleDay = (day: string) => {
    setForm((p) => ({
      ...p,
      days: p.days.includes(day)
        ? p.days.filter((d) => d !== day)
        : [...p.days, day],
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Please enter a reminder name");
      return;
    }
    if (form.days.length === 0) {
      toast.error("Select at least one day");
      return;
    }
    addReminder({ ...form, active: true });
    toast.success("Reminder added");
    setSheetOpen(false);
    setForm(defaultForm);
  };

  return (
    <div data-ocid="reminders.page" className="space-y-4 pb-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-foreground">
          Reminders
        </h1>
        <Button
          data-ocid="reminders.add_button"
          size="sm"
          onClick={() => setSheetOpen(true)}
          className="bg-[oklch(0.62_0.22_265)] text-white rounded-xl h-8 px-3 gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {reminders.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-sm text-muted-foreground">No reminders yet</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {reminders.map((rem, i) => (
              <motion.div
                key={rem.id}
                data-ocid={`reminders.item.${i + 1}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium border ${typeColors[rem.type]}`}
                      >
                        {rem.type}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {rem.name}
                    </p>
                    <p className="text-2xl font-display font-black text-[oklch(0.78_0.18_265)] mt-1">
                      {rem.time}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {DAYS_OF_WEEK.map((d) => (
                        <span
                          key={d}
                          className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                            rem.days.includes(d)
                              ? "bg-[oklch(0.62_0.22_265/0.2)] text-[oklch(0.78_0.18_265)]"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Switch
                      data-ocid={`reminders.toggle.${i + 1}`}
                      checked={rem.active}
                      onCheckedChange={() => toggleReminder(rem.id)}
                    />
                    <button
                      type="button"
                      data-ocid={`reminders.delete_button.${i + 1}`}
                      onClick={() => {
                        deleteReminder(rem.id);
                        toast.success("Reminder deleted");
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

      {/* Add Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          className="bg-[oklch(0.15_0.02_275)] border-[oklch(0.3_0.025_275)] rounded-t-3xl max-h-[90vh] overflow-y-auto"
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="font-display text-foreground">
              Add Reminder
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 pb-6">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Name</Label>
              <Input
                data-ocid="reminders.name.input"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Morning Study Reminder"
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Time</Label>
              <Input
                data-ocid="reminders.time.input"
                type="time"
                value={form.time}
                onChange={(e) =>
                  setForm((p) => ({ ...p, time: e.target.value }))
                }
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    type: v as Reminder["type"],
                  }))
                }
              >
                <SelectTrigger
                  data-ocid="reminders.type.select"
                  className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[oklch(0.18_0.022_275)] border-[oklch(0.3_0.025_275)]">
                  {REMINDER_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Days</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => toggleDay(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      form.days.includes(d)
                        ? "bg-[oklch(0.62_0.22_265)] text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
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
                data-ocid="reminders.submit_button"
                onClick={handleSubmit}
                className="flex-1 rounded-xl bg-[oklch(0.62_0.22_265)] text-white"
              >
                Add Reminder
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
