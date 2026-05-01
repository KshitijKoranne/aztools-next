"use client";

import { useMemo, useState } from "react";
import { Copy, Code2 } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function round(value: number) {
  return Math.round(value * 10000) / 10000;
}

export default function Client() {
  const [minSize, setMinSize] = useState("16");
  const [maxSize, setMaxSize] = useState("32");
  const [minViewport, setMinViewport] = useState("375");
  const [maxViewport, setMaxViewport] = useState("1440");

  const result = useMemo(() => {
    const min = Number(minSize), max = Number(maxSize), minVw = Number(minViewport), maxVw = Number(maxViewport);
    if (![min, max, minVw, maxVw].every(Number.isFinite) || minVw >= maxVw) return null;
    const slope = (max - min) / (maxVw - minVw);
    const intercept = min - slope * minVw;
    return `clamp(${round(min / 16)}rem, ${round(intercept / 16)}rem + ${round(slope * 100)}vw, ${round(max / 16)}rem)`;
  }, [maxSize, maxViewport, minSize, minViewport]);

  async function copy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    toast.success("Copied.");
  }

  return (
    <ToolLayout toolId="css-clamp-generator">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Code2 className="h-5 w-5" />CSS Clamp Generator</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Minimum size (px)</Label><Input type="number" value={minSize} onChange={(event) => setMinSize(event.target.value)} /></div>
            <div className="space-y-2"><Label>Maximum size (px)</Label><Input type="number" value={maxSize} onChange={(event) => setMaxSize(event.target.value)} /></div>
            <div className="space-y-2"><Label>Minimum viewport (px)</Label><Input type="number" value={minViewport} onChange={(event) => setMinViewport(event.target.value)} /></div>
            <div className="space-y-2"><Label>Maximum viewport (px)</Label><Input type="number" value={maxViewport} onChange={(event) => setMaxViewport(event.target.value)} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Generated CSS</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm"><code>{result ? `font-size: ${result};` : "Enter valid values."}</code></pre>
            <Button variant="outline" onClick={copy} disabled={!result}><Copy className="mr-2 h-4 w-4" />Copy clamp()</Button>
            {result && <div className="rounded-md border p-6" style={{ fontSize: result }}>Responsive preview text</div>}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
