"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Coffee,
  Pause,
  Play,
  RotateCcw,
  Settings,
  Target,
  Timer,
  TrendingUp,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

type SessionType = "work" | "short" | "long";
type TimerState = "idle" | "running" | "paused";

type Session = {
  id: string;
  type: SessionType;
  task: string;
  duration: number;
  timestamp: number;
};

const labels: Record<SessionType, string> = {
  work: "Work Session",
  short: "Short Break",
  long: "Long Break",
};

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function clampMinutes(value: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(1, Math.min(180, Math.round(value)));
}

function beep() {
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = 880;
  gain.gain.value = 0.08;
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.22);
}

export default function Client() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [shortMinutes, setShortMinutes] = useState(5);
  const [longMinutes, setLongMinutes] = useState(15);
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(4);
  const [sessionType, setSessionType] = useState<SessionType>("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [workSessionCount, setWorkSessionCount] = useState(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [task, setTask] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentDuration = sessionType === "work" ? workMinutes : sessionType === "short" ? shortMinutes : longMinutes;
  const totalSeconds = currentDuration * 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  const nextSessionType = useMemo<SessionType>(() => {
    if (sessionType !== "work") return "work";
    return (workSessionCount + 1) % sessionsUntilLongBreak === 0 ? "long" : "short";
  }, [sessionType, sessionsUntilLongBreak, workSessionCount]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const workSessions = sessions.filter((session) => session.type === "work");
    return {
      today: sessions.filter((session) => new Date(session.timestamp).toDateString() === today).length,
      work: workSessions.length,
      focusMinutes: workSessions.reduce((sum, session) => sum + session.duration, 0),
      streak: workSessionCount,
    };
  }, [sessions, workSessionCount]);

  const completeSession = useCallback(() => {
    setTimerState("idle");
    setSessions((current) => [
      {
        id: crypto.randomUUID(),
        type: sessionType,
        task: sessionType === "work" ? task.trim() : "",
        duration: currentDuration,
        timestamp: Date.now(),
      },
      ...current.slice(0, 49),
    ]);
    if (sessionType === "work") setWorkSessionCount((count) => count + 1);
    if (soundEnabled) beep();
    toast.success(`${labels[sessionType]} complete`);
    const nextType = nextSessionType;
    setSessionType(nextType);
    setTimeLeft((nextType === "work" ? workMinutes : nextType === "short" ? shortMinutes : longMinutes) * 60);
  }, [
    currentDuration,
    longMinutes,
    nextSessionType,
    sessionType,
    shortMinutes,
    soundEnabled,
    task,
    workMinutes,
  ]);

  useEffect(() => {
    if (timerState !== "running") return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          completeSession();
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [completeSession, timerState]);

  const resetCurrent = () => {
    setTimerState("idle");
    setTimeLeft(currentDuration * 60);
  };

  const resetCycle = () => {
    setTimerState("idle");
    setSessionType("work");
    setTimeLeft(workMinutes * 60);
    setWorkSessionCount(0);
  };

  const updateDuration = (type: SessionType, value: number) => {
    const minutes = clampMinutes(value, type === "work" ? 25 : type === "short" ? 5 : 15);
    if (type === "work") setWorkMinutes(minutes);
    if (type === "short") setShortMinutes(minutes);
    if (type === "long") setLongMinutes(minutes);
    if (timerState === "idle" && sessionType === type) setTimeLeft(minutes * 60);
  };

  return (
    <ToolLayout toolId="pomodoro-timer">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Pomodoro Timer
              </span>
              <span className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setSoundEnabled((value) => !value)} aria-label="Toggle sound">
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings((value) => !value)} aria-label="Settings">
                  <Settings className="h-4 w-4" />
                </Button>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="flex justify-center">
              <Badge variant="outline" className="gap-2">
                {sessionType === "work" ? <Target className="h-4 w-4" /> : <Coffee className="h-4 w-4" />}
                {labels[sessionType]}
              </Badge>
            </div>
            <div className="space-y-4">
              <div className="font-mono text-6xl font-bold text-primary md:text-8xl">{formatTime(timeLeft)}</div>
              <Progress value={progress} className="h-3" />
            </div>
            <div className="mx-auto max-w-md space-y-2 text-left">
              <Label htmlFor="task">Current Task</Label>
              <Input id="task" placeholder="What are you focusing on?" value={task} onChange={(event) => setTask(event.target.value)} />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {timerState === "running" ? (
                <Button size="lg" onClick={() => setTimerState("paused")}>
                  <Pause className="h-5 w-5" />
                  Pause
                </Button>
              ) : (
                <Button size="lg" onClick={() => setTimerState("running")}>
                  <Play className="h-5 w-5" />
                  {timerState === "paused" ? "Resume" : "Start"}
                </Button>
              )}
              <Button size="lg" variant="outline" onClick={resetCurrent}>
                <RotateCcw className="h-5 w-5" />
                Reset
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Session {workSessionCount + 1} · Next: {labels[nextSessionType]}
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {showSettings && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="work-minutes">Work Minutes</Label>
                    <Input id="work-minutes" type="number" min={1} value={workMinutes} onChange={(event) => updateDuration("work", Number(event.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="short-minutes">Short Break</Label>
                    <Input id="short-minutes" type="number" min={1} value={shortMinutes} onChange={(event) => updateDuration("short", Number(event.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="long-minutes">Long Break</Label>
                    <Input id="long-minutes" type="number" min={1} value={longMinutes} onChange={(event) => updateDuration("long", Number(event.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="long-break-after">Long Break After</Label>
                    <Input
                      id="long-break-after"
                      type="number"
                      min={2}
                      value={sessionsUntilLongBreak}
                      onChange={(event) => setSessionsUntilLongBreak(Math.max(2, Math.round(Number(event.target.value) || 4)))}
                    />
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={resetCycle}>
                  <RotateCcw className="h-4 w-4" />
                  Reset Cycle
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-2xl font-bold">{stats.today}</p>
                <p className="text-sm text-muted-foreground">Today</p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-2xl font-bold">{stats.work}</p>
                <p className="text-sm text-muted-foreground">Work Sessions</p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-2xl font-bold">{Math.round(stats.focusMinutes / 60)}h</p>
                <p className="text-sm text-muted-foreground">Focus Time</p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-2xl font-bold">{stats.streak}</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sessions.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No completed sessions yet.</div>
            ) : (
              sessions.slice(0, 10).map((session) => (
                <div key={session.id} className="flex items-center justify-between gap-4 rounded-lg bg-muted p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {session.type === "work" ? <Target className="h-4 w-4 shrink-0" /> : <Coffee className="h-4 w-4 shrink-0" />}
                    <div className="min-w-0">
                      <p className="font-medium">{labels[session.type]}</p>
                      <p className="truncate text-sm text-muted-foreground">{session.task || new Date(session.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{session.duration} min</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
