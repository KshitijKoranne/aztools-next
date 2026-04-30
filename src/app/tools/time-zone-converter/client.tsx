"use client";

import { useMemo, useState } from "react";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { Clock, Copy } from "lucide-react";
import { toast } from "sonner";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const zones = Intl.supportedValuesOf("timeZone");

function localInputValue(date = new Date()) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export default function Client() {
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [fromZone, setFromZone] = useState(localZone);
  const [toZone, setToZone] = useState("UTC");
  const [dateTime, setDateTime] = useState(localInputValue());

  const converted = useMemo(() => {
    const utcDate = fromZonedTime(dateTime, fromZone);
    return {
      input: formatInTimeZone(utcDate, fromZone, "PPpp zzz"),
      output: formatInTimeZone(utcDate, toZone, "PPpp zzz"),
      iso: utcDate.toISOString(),
    };
  }, [dateTime, fromZone, toZone]);

  const copy = async () => {
    await navigator.clipboard.writeText(converted.output);
    toast.success("Converted time copied");
  };

  return (
    <ToolLayout toolId="time-zone-converter">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Time Zone Conversion</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>From Time Zone</Label><Select value={fromZone} onValueChange={setFromZone}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{zones.map((zone) => <SelectItem key={zone} value={zone}>{zone}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>To Time Zone</Label><Select value={toZone} onValueChange={setToZone}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{zones.map((zone) => <SelectItem key={zone} value={zone}>{zone}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Date and Time</Label><Input type="datetime-local" value={dateTime} onChange={(event) => setDateTime(event.target.value)} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Converted Time</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4"><p className="text-sm text-muted-foreground">Source</p><p className="font-mono text-sm">{converted.input}</p></div>
            <div className="rounded-lg bg-muted p-4"><p className="text-sm text-muted-foreground">Converted</p><p className="font-mono text-lg font-bold">{converted.output}</p></div>
            <div className="rounded-lg bg-muted p-4"><p className="text-sm text-muted-foreground">UTC ISO</p><p className="font-mono text-sm break-all">{converted.iso}</p></div>
            <Button variant="outline" onClick={copy} className="w-full"><Copy className="h-4 w-4" />Copy Result</Button>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
