"use client";

import { useMemo, useState } from "react";
import { ClipboardCopy } from "lucide-react";
import { toast } from "sonner";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const presets = [
  ["Every minute", "* * * * *"],
  ["Every hour", "0 * * * *"],
  ["Every day at midnight", "0 0 * * *"],
  ["Every weekday at 9 AM", "0 9 * * 1-5"],
  ["Every Sunday at midnight", "0 0 * * 0"],
  ["First day of every month", "0 0 1 * *"],
  ["Every quarter", "0 0 1 1,4,7,10 *"],
  ["Every year", "0 0 1 1 *"],
];

function describe(expr: string) {
  const [m, h, dom, mon, dow] = expr.trim().split(/\s+/);
  if (!dow) return "Use five fields: minute hour day-of-month month day-of-week.";
  if (m === "*" && h === "*") return "Runs every minute.";
  if (m === "0" && h === "*") return "Runs at the start of every hour.";
  if (m === "0" && h === "0" && dom === "*" && mon === "*" && dow === "*") return "Runs every day at midnight.";
  if (m === "0" && h === "9" && dow === "1-5") return "Runs every weekday at 9:00 AM.";
  if (m === "0" && h === "0" && dom === "1") return "Runs at midnight on the first day of matching months.";
  return "Custom schedule. Verify against your scheduler before using in production.";
}

export default function Client() {
  const [expression, setExpression] = useState("* * * * *");
  const parts = useMemo(() => {
    const parsed = expression.trim().split(/\s+/);
    return parsed.length === 5 ? parsed : ["*", "*", "*", "*", "*"];
  }, [expression]);

  const setPart = (index: number, value: string) => {
    const next = [...parts];
    next[index] = value || "*";
    setExpression(next.join(" "));
  };

  const copy = async () => {
    await navigator.clipboard.writeText(expression);
    toast.success("CRON expression copied");
  };

  return (
    <ToolLayout toolId="cron-generator">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader><CardTitle>CRON Expression Generator</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue="builder">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="builder">Builder</TabsTrigger>
                <TabsTrigger value="presets">Presets</TabsTrigger>
              </TabsList>
              <TabsContent value="builder" className="mt-6 space-y-4">
                <div className="grid gap-3 sm:grid-cols-5">
                  {["Minute", "Hour", "Day", "Month", "Weekday"].map((label, index) => (
                    <div key={label} className="space-y-2">
                      <Label>{label}</Label>
                      <Input className="font-mono" value={parts[index]} onChange={(event) => setPart(index, event.target.value)} />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Expression</Label>
                  <div className="flex gap-2">
                    <Input className="font-mono" value={expression} onChange={(event) => setExpression(event.target.value)} />
                    <Button variant="outline" size="icon" onClick={copy} aria-label="Copy expression"><ClipboardCopy className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-4 text-sm">{describe(expression)}</div>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p><span className="font-mono">*</span> any value</p>
                  <p><span className="font-mono">,</span> value list</p>
                  <p><span className="font-mono">-</span> range</p>
                  <p><span className="font-mono">/</span> step values</p>
                </div>
              </TabsContent>
              <TabsContent value="presets" className="mt-6 grid gap-2">
                {presets.map(([label, value]) => (
                  <Button key={value} variant="outline" className="justify-between" onClick={() => setExpression(value)}>
                    <span>{label}</span><span className="font-mono text-muted-foreground">{value}</span>
                  </Button>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
