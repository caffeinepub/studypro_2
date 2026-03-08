import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStudySessions } from "@/hooks/useStudySessions";
import type { Subject } from "@/types";
import { SUBJECTS, formatHours } from "@/utils/helpers";
import { format } from "date-fns";
import { Brain, Coffee, Pause, Play, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type TimerMode = "focus" | "break";

const FOCUS_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

function playBeep() {
  try {
    const ctx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  } catch {
    // ignore audio errors
  }
}

export function StudyTimer() {
  const { addSession, todayHours, sessions } = useStudySessions();
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [subject, setSubject] = useState<Subject>("Math");
  const [topic, setTopic] = useState("");
  const startTimeRef = useRef<string>("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todaySessionCount = sessions.filter((s) => s.date === todayStr).length;

  const totalDuration = mode === "focus" ? FOCUS_DURATION : BREAK_DURATION;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  const saveSession = useCallback(() => {
    if (mode === "focus" && startTimeRef.current) {
      const endTime = format(new Date(), "HH:mm");
      addSession({
        date: todayStr,
        subject,
        topic: topic || "Focus Session",
        startTime: startTimeRef.current,
        endTime,
        totalHours: 25 / 60,
        notes: "Pomodoro focus session",
      });
      setSessionCount((c) => c + 1);
      toast.success("🎉 Focus session saved! Take a break.");
    }
  }, [mode, addSession, todayStr, subject, topic]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            playBeep();
            saveSession();
            // switch mode
            setMode((m) => {
              const nextMode = m === "focus" ? "break" : "focus";
              setTimeLeft(
                nextMode === "focus" ? FOCUS_DURATION : BREAK_DURATION,
              );
              return nextMode;
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, saveSession]);

  const handleStart = () => {
    if (!isRunning && mode === "focus") {
      startTimeRef.current = format(new Date(), "HH:mm");
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(mode === "focus" ? FOCUS_DURATION : BREAK_DURATION);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const circumference = 2 * Math.PI * 96;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div data-ocid="timer.page" className="space-y-5 pb-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-foreground">
          Focus Timer
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Today:</span>
          <span className="text-sm font-display font-bold text-[oklch(0.78_0.18_265)]">
            {formatHours(todayHours)}
          </span>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 justify-center">
        <button
          type="button"
          onClick={() => {
            setMode("focus");
            setTimeLeft(FOCUS_DURATION);
            setIsRunning(false);
          }}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            mode === "focus"
              ? "bg-[oklch(0.62_0.22_265)] text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          Focus (25m)
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("break");
            setTimeLeft(BREAK_DURATION);
            setIsRunning(false);
          }}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            mode === "break"
              ? "bg-[oklch(0.68_0.18_155)] text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          Break (5m)
        </button>
      </div>

      {/* Circular timer */}
      <div className="flex justify-center">
        <div className="relative w-56 h-56">
          {/* Outer glow ring when running */}
          {isRunning && (
            <div
              className="absolute inset-0 rounded-full animate-pulse-ring"
              style={{
                background:
                  mode === "focus"
                    ? "radial-gradient(circle, oklch(0.62 0.22 265 / 0.15), transparent 70%)"
                    : "radial-gradient(circle, oklch(0.68 0.18 155 / 0.15), transparent 70%)",
              }}
            />
          )}

          <svg
            aria-hidden="true"
            className="w-full h-full -rotate-90"
            viewBox="0 0 220 220"
          >
            {/* Track */}
            <circle
              cx="110"
              cy="110"
              r="96"
              fill="none"
              stroke="oklch(0.2 0.025 275)"
              strokeWidth="8"
            />
            {/* Progress */}
            <circle
              cx="110"
              cy="110"
              r="96"
              fill="none"
              stroke={
                mode === "focus"
                  ? "oklch(0.62 0.22 265)"
                  : "oklch(0.68 0.18 155)"
              }
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>

          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={timeStr}
                initial={{ scale: 0.9, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-display font-black tabular-nums"
                style={{
                  color:
                    mode === "focus"
                      ? "oklch(0.78 0.18 265)"
                      : "oklch(0.78 0.18 155)",
                }}
              >
                {timeStr}
              </motion.p>
            </AnimatePresence>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
              {mode === "focus" ? "Focus" : "Break"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Session #{todaySessionCount + 1}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <button
          type="button"
          data-ocid="timer.reset_button"
          onClick={handleReset}
          className="w-12 h-12 rounded-full bg-muted flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5 text-muted-foreground" />
        </button>

        {isRunning ? (
          <button
            type="button"
            data-ocid="timer.pause_button"
            onClick={handlePause}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-glow"
            style={{
              background:
                mode === "focus"
                  ? "oklch(0.62 0.22 265)"
                  : "oklch(0.68 0.18 155)",
            }}
          >
            <Pause className="w-7 h-7 text-white" />
          </button>
        ) : (
          <button
            type="button"
            data-ocid="timer.start_button"
            onClick={handleStart}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-glow"
            style={{
              background:
                mode === "focus"
                  ? "oklch(0.62 0.22 265)"
                  : "oklch(0.68 0.18 155)",
            }}
          >
            <Play className="w-7 h-7 text-white ml-1" />
          </button>
        )}

        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <span className="text-xs font-display font-bold text-muted-foreground">
            {sessionCount}
          </span>
        </div>
      </div>

      {/* Subject & Topic */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-display font-semibold text-foreground">
          Session Details
        </h2>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Subject</Label>
          <Select
            value={subject}
            onValueChange={(v) => setSubject(v as Subject)}
          >
            <SelectTrigger
              data-ocid="timer.subject.select"
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
            data-ocid="timer.topic.input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What are you studying?"
            className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
          />
        </div>
      </div>

      {/* Today stats */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-[oklch(0.78_0.18_265)]">
              {todaySessionCount}
            </p>
            <p className="text-xs text-muted-foreground">Sessions Today</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-[oklch(0.78_0.18_155)]">
              {formatHours(todayHours)}
            </p>
            <p className="text-xs text-muted-foreground">Total Hours</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-[oklch(0.82_0.16_65)]">
              {sessionCount}
            </p>
            <p className="text-xs text-muted-foreground">This Run</p>
          </div>
        </div>
      </div>
    </div>
  );
}
