import {
  Bell,
  BookOpen,
  CalendarDays,
  DollarSign,
  Flame,
  StickyNote,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface MoreMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

const MORE_ITEMS = [
  {
    id: "reminders",
    icon: Bell,
    label: "Reminders",
    desc: "Study alerts",
    color: "text-[oklch(0.82_0.16_65)]",
    bg: "bg-[oklch(0.75_0.18_65/0.12)]",
    border: "border-[oklch(0.75_0.18_65/0.2)]",
  },
  {
    id: "exams",
    icon: CalendarDays,
    label: "Exam Countdown",
    desc: "Track exam dates",
    color: "text-[oklch(0.78_0.2_25)]",
    bg: "bg-[oklch(0.65_0.22_25/0.12)]",
    border: "border-[oklch(0.65_0.22_25/0.2)]",
  },
  {
    id: "library",
    icon: BookOpen,
    label: "Study Library",
    desc: "Books & documents",
    color: "text-[oklch(0.78_0.14_200)]",
    bg: "bg-[oklch(0.72_0.15_200/0.12)]",
    border: "border-[oklch(0.72_0.15_200/0.2)]",
  },
  {
    id: "notes",
    icon: StickyNote,
    label: "Notes",
    desc: "Ideas & specs",
    color: "text-[oklch(0.78_0.18_320)]",
    bg: "bg-[oklch(0.72_0.2_320/0.12)]",
    border: "border-[oklch(0.72_0.2_320/0.2)]",
  },
  {
    id: "expenses",
    icon: DollarSign,
    label: "Expenses",
    desc: "Track spending",
    color: "text-[oklch(0.82_0.16_65)]",
    bg: "bg-[oklch(0.75_0.18_65/0.12)]",
    border: "border-[oklch(0.75_0.18_65/0.2)]",
  },
  {
    id: "habits",
    icon: Flame,
    label: "Habits",
    desc: "Daily streaks",
    color: "text-[oklch(0.78_0.18_155)]",
    bg: "bg-[oklch(0.68_0.18_155/0.12)]",
    border: "border-[oklch(0.68_0.18_155/0.2)]",
  },
];

export function MoreMenu({ open, onClose, onNavigate }: MoreMenuProps) {
  const handleNav = (id: string) => {
    onNavigate(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-[480px] mx-auto"
          >
            <div
              className="rounded-t-3xl p-5 pb-8"
              style={{
                background: "oklch(0.13 0.018 275)",
                border: "1px solid oklch(0.3 0.025 275)",
                borderBottom: "none",
              }}
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-bold text-foreground">
                  More
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {MORE_ITEMS.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleNav(item.id)}
                    className={`${item.bg} border ${item.border} rounded-2xl p-4 text-left flex items-start gap-3`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.bg}`}
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
