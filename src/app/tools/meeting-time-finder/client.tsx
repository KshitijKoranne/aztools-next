"use client";

import { useMemo, useState } from "react";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { Calendar, Plus, Trash2, Users } from "lucide-react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Participant = { id: string; name: string; zone: string; start: string; end: string };
const zones = Intl.supportedValuesOf("timeZone");

function minutes(value: string) {
  const [hours = "0", mins = "0"] = value.split(":");
  return Number(hours) * 60 + Number(mins);
}

function todayInput() {
  return new Date().toISOString().slice(0, 10);
}

export default function Client() {
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "local", name: "You", zone: localZone, start: "09:00", end: "17:00" },
  ]);
  const [name, setName] = useState("");
  const [zone, setZone] = useState("UTC");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [date, setDate] = useState(todayInput());
  const [duration, setDuration] = useState("60");

  const suggestions = useMemo(() => {
    const meetingMinutes = Math.max(15, Number(duration) || 60);
    return Array.from({ length: 48 }, (_, index) => {
      const localDateTime = `${date}T${String(Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`;
      const utcDate = fromZonedTime(localDateTime, "UTC");
      const rows = participants.map((participant) => {
        const local = formatInTimeZone(utcDate, participant.zone, "HH:mm");
        const localEnd = formatInTimeZone(new Date(utcDate.getTime() + meetingMinutes * 60000), participant.zone, "HH:mm");
        const ok = minutes(local) >= minutes(participant.start) && minutes(localEnd) <= minutes(participant.end);
        return { participant, local, localEnd, ok };
      });
      const score = rows.reduce((sum, row) => sum + (row.ok ? 10 : -4), 0);
      return { utcDate, rows, score };
    }).sort((a, b) => b.score - a.score).slice(0, 10);
  }, [date, duration, participants]);

  const add = () => {
    if (!name.trim()) return;
    setParticipants((current) => [...current, { id: crypto.randomUUID(), name: name.trim(), zone, start, end }]);
    setName("");
  };

  return (
    <ToolLayout toolId="meeting-time-finder">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Participants</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Participant name" /></div>
              <div className="space-y-2"><Label>Time Zone</Label><Select value={zone} onValueChange={setZone}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{zones.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>Start</Label><Input type="time" value={start} onChange={(e) => setStart(e.target.value)} /></div><div className="space-y-2"><Label>End</Label><Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} /></div></div>
              <Button className="w-full" onClick={add}><Plus className="h-4 w-4" />Add Participant</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Meeting Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
              <div className="space-y-2"><Label>Duration (minutes)</Label><Input type="number" min={15} step={15} value={duration} onChange={(e) => setDuration(e.target.value)} /></div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Current Participants</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between gap-3 rounded-lg bg-muted p-3">
                  <div><p className="font-medium">{participant.name}</p><p className="text-sm text-muted-foreground">{participant.zone} · {participant.start}-{participant.end}</p></div>
                  <Button variant="ghost" size="icon" onClick={() => setParticipants((current) => current.filter((item) => item.id !== participant.id))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Best Times</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {suggestions.map((suggestion) => (
                <div key={suggestion.utcDate.toISOString()} className="rounded-lg border p-4">
                  <p className="font-medium">{formatInTimeZone(suggestion.utcDate, "UTC", "HH:mm 'UTC'")}</p>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    {suggestion.rows.map((row) => (
                      <div key={row.participant.id} className={row.ok ? "text-green-600" : "text-muted-foreground"}>
                        {row.participant.name}: {row.local}-{row.localEnd}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
