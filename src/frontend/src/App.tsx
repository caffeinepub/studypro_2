import { Toaster } from "@/components/ui/sonner";
import { format } from "date-fns";
import {
  BarChart2,
  Calendar,
  ChevronLeft,
  Grid3X3,
  Home,
  Timer,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { MoreMenu } from "@/components/MoreMenu";
import { Dashboard } from "@/pages/Dashboard";
import { ExamCountdown } from "@/pages/ExamCountdown";
import { ExpenseManager } from "@/pages/ExpenseManager";
import { HabitTracker } from "@/pages/HabitTracker";
import { Notes } from "@/pages/Notes";
import { Reminders } from "@/pages/Reminders";
import { StudyLibrary } from "@/pages/StudyLibrary";
import { StudyPlanner } from "@/pages/StudyPlanner";
import { StudyTimer } from "@/pages/StudyTimer";
import { StudyTracker } from "@/pages/StudyTracker";

type MainTab = "home" | "planner" | "timer" | "tracker" | "more";
type SubPage =
  | "reminders"
  | "exams"
  | "library"
  | "notes"
  | "expenses"
  | "habits";

const PAGE_TITLES: Record<string, string> = {
  home: "StudyPro",
  planner: "Study Planner",
  timer: "Focus Timer",
  tracker: "Study Tracker",
  reminders: "Reminders",
  exams: "Exam Countdown",
  library: "Study Library",
  notes: "Notes",
  expenses: "Expense Manager",
  habits: "Habit Tracker",
};

const SUB_PAGES: SubPage[] = [
  "reminders",
  "exams",
  "library",
  "notes",
  "expenses",
  "habits",
];

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>("home");
  const [subPage, setSubPage] = useState<SubPage | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  const currentPage = subPage ?? activeTab;

  const handleNavigate = (page: string) => {
    if (SUB_PAGES.includes(page as SubPage)) {
      setSubPage(page as SubPage);
    } else if (["home", "planner", "timer", "tracker"].includes(page)) {
      setActiveTab(page as MainTab);
      setSubPage(null);
    }
  };

  const handleTabPress = (tab: MainTab) => {
    if (tab === "more") {
      setMoreOpen(true);
    } else {
      setActiveTab(tab);
      setSubPage(null);
    }
  };

  const handleBack = () => {
    setSubPage(null);
  };

  const isSubPage = subPage !== null;

  return (
    <div
      className="min-h-screen bg-background font-body"
      style={{ maxWidth: "480px", margin: "0 auto" }}
    >
      {/* Top App Bar */}
      <header
        className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b border-border/30"
        style={{
          background: "oklch(0.11 0.015 275 / 0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        {isSubPage ? (
          <button
            type="button"
            onClick={handleBack}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-[oklch(0.62_0.22_265)] flex items-center justify-center">
            <span className="text-white font-display font-black text-xs">
              SP
            </span>
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-base font-display font-bold text-foreground leading-tight">
            {PAGE_TITLES[currentPage] ?? "StudyPro"}
          </h1>
          {!isSubPage && activeTab === "home" && (
            <p className="text-xs text-muted-foreground">
              {format(new Date(), "EEE, d MMM")}
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-4 pb-nav overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {currentPage === "home" && (
              <Dashboard onNavigate={handleNavigate} />
            )}
            {currentPage === "planner" && <StudyPlanner />}
            {currentPage === "timer" && <StudyTimer />}
            {currentPage === "tracker" && <StudyTracker />}
            {currentPage === "reminders" && <Reminders />}
            {currentPage === "exams" && <ExamCountdown />}
            {currentPage === "library" && <StudyLibrary />}
            {currentPage === "notes" && <Notes />}
            {currentPage === "expenses" && <ExpenseManager />}
            {currentPage === "habits" && <HabitTracker />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 pb-safe"
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          background: "oklch(0.13 0.018 275 / 0.95)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid oklch(0.3 0.025 275 / 0.5)",
        }}
      >
        <div className="flex items-end justify-around px-2 pt-1 pb-1">
          {/* Home */}
          <NavTab
            id="home"
            icon={Home}
            label="Home"
            active={activeTab === "home" && !isSubPage}
            onClick={() => handleTabPress("home")}
          />

          {/* Planner */}
          <NavTab
            id="planner"
            icon={Calendar}
            label="Planner"
            active={activeTab === "planner" && !isSubPage}
            onClick={() => handleTabPress("planner")}
          />

          {/* Timer - center, prominent */}
          <div className="flex flex-col items-center pb-1">
            <button
              type="button"
              onClick={() => handleTabPress("timer")}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-glow -mt-4 ${
                activeTab === "timer" && !isSubPage
                  ? "bg-[oklch(0.62_0.22_265)] scale-105"
                  : "bg-[oklch(0.22_0.04_265)]"
              }`}
            >
              <Timer
                className={`w-6 h-6 ${
                  activeTab === "timer" && !isSubPage
                    ? "text-white"
                    : "text-[oklch(0.62_0.22_265)]"
                }`}
              />
            </button>
            <span
              className={`text-[10px] font-medium mt-0.5 ${
                activeTab === "timer" && !isSubPage
                  ? "text-[oklch(0.72_0.2_265)]"
                  : "text-muted-foreground"
              }`}
            >
              Timer
            </span>
          </div>

          {/* Tracker */}
          <NavTab
            id="tracker"
            icon={BarChart2}
            label="Track"
            active={activeTab === "tracker" && !isSubPage}
            onClick={() => handleTabPress("tracker")}
          />

          {/* More */}
          <NavTab
            id="more"
            icon={Grid3X3}
            label="More"
            active={moreOpen || isSubPage}
            onClick={() => handleTabPress("more")}
          />
        </div>
      </nav>

      {/* More Menu Overlay */}
      <MoreMenu
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "oklch(0.18 0.022 275)",
            border: "1px solid oklch(0.3 0.025 275)",
            color: "oklch(0.96 0.008 265)",
          },
        }}
      />
    </div>
  );
}

interface NavTabProps {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavTab({ icon: Icon, label, active, onClick }: NavTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 px-3 py-1.5 min-w-[48px] transition-all"
    >
      <div
        className={`relative flex items-center justify-center w-6 h-6 transition-all ${active ? "scale-110" : ""}`}
      >
        {active && (
          <div className="absolute inset-0 rounded-full bg-[oklch(0.62_0.22_265/0.15)]" />
        )}
        <Icon
          className={`w-5 h-5 relative z-10 transition-colors ${
            active
              ? "text-[oklch(0.72_0.2_265)]"
              : "text-[oklch(0.55_0.01_265)]"
          }`}
        />
      </div>
      <span
        className={`text-[10px] font-medium transition-colors ${
          active ? "text-[oklch(0.72_0.2_265)]" : "text-[oklch(0.5_0.01_265)]"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
