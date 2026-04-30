"use client";
import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { toast } from "sonner";

export default function Client() {
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const swRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [timerInput, setTimerInput] = useState(60);
  const [timerTime, setTimerTime] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (swRunning) {
      swRef.current = setInterval(() => setSwTime((t) => t + 10), 10);
    } else {
      if (swRef.current) clearInterval(swRef.current);
    }
    return () => { if (swRef.current) clearInterval(swRef.current); };
  }, [swRunning]);

  useEffect(() => {
    if (timerRunning && timerTime > 0) {
      timerRef.current = setInterval(() => setTimerTime((t) => t - 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timerRunning && timerTime === 0) {
        setTimerRunning(false);
        toast.success("Timer complete!");
      }
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning, timerTime]);

  const fmtSw = (ms: number) => {
    const cs = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    const s = String(Math.floor((ms / 1000) % 60)).padStart(2, "0");
    const m = String(Math.floor(ms / 60000)).padStart(2, "0");
    return `${m}:${s}:${cs}`;
  };

  const fmtTimer = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <ToolLayout toolId="stopwatch">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Stopwatch</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="text-5xl font-mono text-center py-4">{fmtSw(swTime)}</div>
            <div className="flex justify-center gap-2">
              <Button onClick={() => setSwRunning(!swRunning)}>{swRunning ? "Pause" : "Start"}</Button>
              <Button variant="outline" onClick={() => { setSwTime(0); setSwRunning(false); }}>Reset</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Timer</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="text-5xl font-mono text-center py-4">{fmtTimer(timerTime)}</div>
            <div className="flex items-center gap-2 justify-center">
              <Label className="shrink-0">Seconds</Label>
              <Input type="number" value={timerInput} onChange={(e) => setTimerInput(Number(e.target.value))} className="w-24" />
              <Button variant="outline" onClick={() => { setTimerTime(timerInput); setTimerRunning(false); }}>Set</Button>
            </div>
            <div className="flex justify-center gap-2">
              <Button onClick={() => setTimerRunning(!timerRunning)}>{timerRunning ? "Pause" : "Start"}</Button>
              <Button variant="outline" onClick={() => { setTimerTime(timerInput); setTimerRunning(false); }}>Reset</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
