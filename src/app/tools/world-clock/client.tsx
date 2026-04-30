"use client";

import { useEffect, useMemo, useState } from "react";
import { Globe, Plus, Trash2 } from "lucide-react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ClockZone = { id: string; name: string; zone: string };

const defaults: ClockZone[] = [
  { id: "ny", name: "New York", zone: "America/New_York" },
  { id: "london", name: "London", zone: "Europe/London" },
  { id: "mumbai", name: "Mumbai", zone: "Asia/Kolkata" },
  { id: "tokyo", name: "Tokyo", zone: "Asia/Tokyo" },
];

const zones = Intl.supportedValuesOf("timeZone");

function getParts(date: Date, zone: string) {
  const time = new Intl.DateTimeFormat("en-US", { timeZone: zone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }).format(date);
  const day = new Intl.DateTimeFormat("en-US", { timeZone: zone, weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(date);
  const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone: zone, hour: "2-digit", hour12: false }).format(date));
  const offset = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "shortOffset" }).formatToParts(date).find((part) => part.type === "timeZoneName")?.value ?? "";
  return { time, day, offset, daytime: hour >= 6 && hour < 18 };
}

export default function Client() {
  const [now, setNow] = useState(new Date());
  const [clocks, setClocks] = useState<ClockZone[]>(defaults);
  const [zone, setZone] = useState("UTC");
  const [name, setName] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const rows = useMemo(() => clocks.map((clock) => ({ ...clock, ...getParts(now, clock.zone) })), [clocks, now]);

  const add = () => {
    if (clocks.some((clock) => clock.zone === zone)) return;
    setClocks((current) => [...current, { id: crypto.randomUUID(), name: name.trim() || zone.split("/").at(-1)?.replaceAll("_", " ") || zone, zone }]);
    setName("");
  };

  return (
    <ToolLayout toolId="world-clock">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />World Clock</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <div className="space-y-2"><Label>Time Zone</Label><Select value={zone} onValueChange={setZone}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{zones.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Display Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" /></div>
            <Button className="self-end" onClick={add}><Plus className="h-4 w-4" />Add</Button>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((clock) => (
            <Card key={clock.id}>
              <CardHeader><CardTitle className="flex items-center justify-between gap-4"><span>{clock.name}</span><Button variant="ghost" size="icon" onClick={() => setClocks((current) => current.filter((item) => item.id !== clock.id))}><Trash2 className="h-4 w-4" /></Button></CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <p className="font-mono text-4xl font-bold">{clock.time}</p>
                <p className="text-sm text-muted-foreground">{clock.day}</p>
                <p className="text-sm text-muted-foreground">{clock.zone} · {clock.offset} · {clock.daytime ? "Day" : "Night"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
