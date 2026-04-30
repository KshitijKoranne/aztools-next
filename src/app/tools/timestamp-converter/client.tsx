"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar, Clock, Copy, RefreshCw } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COMMON_TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "local", label: "Local Time" },
  { value: "America/New_York", label: "Eastern (New York)" },
  { value: "America/Chicago", label: "Central (Chicago)" },
  { value: "America/Los_Angeles", label: "Pacific (Los Angeles)" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "Asia/Kolkata", label: "India" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Australia/Sydney", label: "Sydney" },
];

function currentUnixTimestamp() {
  return Math.floor(Date.now() / 1000).toString();
}

function normalizeTimestamp(value: string) {
  if (!/^-?\d+$/.test(value.trim())) throw new Error("Timestamp must be numeric.");
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) throw new Error("Timestamp is too large.");
  return Math.abs(parsed) > 99_999_999_999 ? Math.floor(parsed / 1000) : parsed;
}

function relativeTime(timestamp: string) {
  try {
    const diff = Math.floor(Date.now() / 1000) - normalizeTimestamp(timestamp);
    const abs = Math.abs(diff);
    if (abs < 60) return "Just now";
    if (abs < 3600) return `${Math.floor(abs / 60)} minute(s) ${diff > 0 ? "ago" : "from now"}`;
    if (abs < 86400) return `${Math.floor(abs / 3600)} hour(s) ${diff > 0 ? "ago" : "from now"}`;
    return `${Math.floor(abs / 86400)} day(s) ${diff > 0 ? "ago" : "from now"}`;
  } catch {
    return "";
  }
}

export default function Client() {
  const [timestamp, setTimestamp] = useState("");
  const [humanDate, setHumanDate] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [currentTimestamp, setCurrentTimestamp] = useState(currentUnixTimestamp);
  const [activeTab, setActiveTab] = useState("to-human");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTimestamp(currentUnixTimestamp());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  function convertToHuman() {
    try {
      const seconds = normalizeTimestamp(timestamp);
      const date = new Date(seconds * 1000);
      if (Number.isNaN(date.getTime())) throw new Error("Invalid timestamp value.");

      const formatted = timezone === "UTC"
        ? date.toISOString().replace("T", " ").replace("Z", " UTC")
        : date.toLocaleString("en-US", timezone === "local" ? undefined : {
          timeZone: timezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

      setHumanDate(`${formatted}${timezone !== "UTC" && timezone !== "local" ? ` (${timezone})` : ""}`);
      toast.success("Timestamp converted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to convert timestamp.");
    }
  }

  function convertToTimestamp() {
    const date = new Date(humanDate);
    if (Number.isNaN(date.getTime())) {
      toast.error("Invalid date format.");
      return;
    }

    setTimestamp(Math.floor(date.getTime() / 1000).toString());
    toast.success("Date converted.");
  }

  async function copyValue(value: string) {
    await navigator.clipboard.writeText(value);
    toast.success("Copied.");
  }

  return (
    <ToolLayout toolId="timestamp-converter">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timestamp Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border bg-muted p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">Current Unix Timestamp</div>
                  <div className="font-mono text-lg">{currentTimestamp}</div>
                </div>
                <Button size="sm" onClick={() => setTimestamp(currentTimestamp)}>Use Current</Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="to-human">Timestamp to Human</TabsTrigger>
                <TabsTrigger value="to-timestamp">Human to Timestamp</TabsTrigger>
              </TabsList>

              <TabsContent value="to-human" className="space-y-4">
                <div className="space-y-2">
                  <Label>Unix Timestamp</Label>
                  <div className="flex gap-2">
                    <Input value={timestamp} onChange={(event) => setTimestamp(event.target.value)} placeholder="1640995200 or 1640995200000" className="font-mono" />
                    <Button onClick={convertToHuman}>Convert</Button>
                  </div>
                  {timestamp && <p className="text-xs text-muted-foreground">{relativeTime(timestamp)}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {COMMON_TIMEZONES.map((zone) => <SelectItem key={zone.value} value={zone.value}>{zone.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {humanDate && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm text-muted-foreground">Human Readable</div>
                          <div className="break-all font-mono text-lg">{humanDate}</div>
                        </div>
                        <Button size="icon" variant="outline" onClick={() => copyValue(humanDate)}><Copy className="h-4 w-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="to-timestamp" className="space-y-4">
                <div className="space-y-2">
                  <Label>Date/Time</Label>
                  <div className="flex gap-2">
                    <Input value={humanDate} onChange={(event) => setHumanDate(event.target.value)} placeholder="2024-01-01 12:00:00" />
                    <Button onClick={convertToTimestamp}>Convert</Button>
                  </div>
                </div>
                {timestamp && (
                  <Card>
                    <CardContent className="space-y-4 pt-6">
                      {[
                        ["Unix Timestamp (seconds)", timestamp],
                        ["Unix Timestamp (milliseconds)", `${timestamp}000`],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm text-muted-foreground">{label}</div>
                            <div className="font-mono text-lg">{value}</div>
                          </div>
                          <Button size="icon" variant="outline" onClick={() => copyValue(value)}><Copy className="h-4 w-4" /></Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            <Button variant="outline" onClick={() => { setTimestamp(""); setHumanDate(""); }}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              Timestamp Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
            <p>Unix timestamps count seconds since January 1, 1970 at 00:00:00 UTC.</p>
            <p>JavaScript timestamps commonly use milliseconds, so 13-digit values are handled automatically.</p>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
