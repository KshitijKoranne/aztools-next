"use client";

import { useState } from "react";
import { Copy, Download, Hash } from "lucide-react";
import { toast } from "sonner";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Client() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("10");
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [decimals, setDecimals] = useState("2");
  const [result, setResult] = useState<string[]>([]);

  const generateIntegers = (multiple = false) => {
    const lo = Number.parseInt(min);
    const hi = Number.parseInt(max);
    const amount = multiple ? Math.min(10000, Math.max(1, Number.parseInt(count) || 1)) : 1;
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo > hi) return toast.error("Enter a valid range");
    if (!allowDuplicates && amount > hi - lo + 1) return toast.error("Count exceeds unique range");
    const values: number[] = [];
    while (values.length < amount) {
      const next = randInt(lo, hi);
      if (allowDuplicates || !values.includes(next)) values.push(next);
    }
    setResult(values.map(String));
  };

  const generateDecimal = () => {
    const lo = Number.parseFloat(min);
    const hi = Number.parseFloat(max);
    const places = Math.min(10, Math.max(0, Number.parseInt(decimals) || 0));
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo > hi) return toast.error("Enter a valid range");
    setResult([(Math.random() * (hi - lo) + lo).toFixed(places)]);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result.join("\n"));
    toast.success("Numbers copied");
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([result.join("\n")], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "random-numbers.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout toolId="random-number-generator">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Hash className="h-5 w-5" />Random Number Generator</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue="single">
              <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="single">Single</TabsTrigger><TabsTrigger value="multiple">Multiple</TabsTrigger><TabsTrigger value="decimal">Decimal</TabsTrigger></TabsList>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Minimum</Label><Input type="number" value={min} onChange={(e) => setMin(e.target.value)} /></div>
                <div className="space-y-2"><Label>Maximum</Label><Input type="number" value={max} onChange={(e) => setMax(e.target.value)} /></div>
              </div>
              <TabsContent value="single" className="mt-4"><Button className="w-full" onClick={() => generateIntegers(false)}>Generate Number</Button></TabsContent>
              <TabsContent value="multiple" className="mt-4 space-y-4">
                <div className="space-y-2"><Label>Count</Label><Input type="number" value={count} onChange={(e) => setCount(e.target.value)} /></div>
                <label className="flex items-center gap-2 text-sm"><Checkbox checked={allowDuplicates} onCheckedChange={(v) => setAllowDuplicates(Boolean(v))} />Allow duplicates</label>
                <Button className="w-full" onClick={() => generateIntegers(true)}>Generate Numbers</Button>
              </TabsContent>
              <TabsContent value="decimal" className="mt-4 space-y-4">
                <div className="space-y-2"><Label>Decimal Places</Label><Input type="number" value={decimals} onChange={(e) => setDecimals(e.target.value)} /></div>
                <Button className="w-full" onClick={generateDecimal}>Generate Decimal</Button>
              </TabsContent>
            </Tabs>
            {result.length > 0 && (
              <div className="mt-6 space-y-3">
                <pre className="max-h-72 overflow-auto rounded-lg bg-muted p-4 font-mono text-sm">{result.join("\n")}</pre>
                <div className="flex gap-2"><Button variant="outline" onClick={copy}><Copy className="h-4 w-4" />Copy</Button><Button variant="outline" onClick={download}><Download className="h-4 w-4" />Download</Button></div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
