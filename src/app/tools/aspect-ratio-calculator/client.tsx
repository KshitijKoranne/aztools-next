"use client";

import { useMemo, useState } from "react";
import { Copy, Ruler } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : Math.abs(a);
}

export default function Client() {
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const [known, setKnown] = useState("width");
  const [target, setTarget] = useState("1280");

  const result = useMemo(() => {
    const w = Number(width), h = Number(height), t = Number(target);
    if (![w, h, t].every((value) => Number.isFinite(value) && value > 0)) return null;
    const divisor = gcd(w, h);
    const ratioW = w / divisor, ratioH = h / divisor;
    const computed = known === "width" ? Math.round((t * ratioH / ratioW) * 100) / 100 : Math.round((t * ratioW / ratioH) * 100) / 100;
    return { ratio: `${ratioW}:${ratioH}`, css: `${ratioW} / ${ratioH}`, computed };
  }, [height, known, target, width]);

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    toast.success("Copied.");
  }

  return (
    <ToolLayout toolId="aspect-ratio-calculator">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Ruler className="h-5 w-5" />Aspect Ratio Calculator</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Original width</Label><Input type="number" value={width} onChange={(event) => setWidth(event.target.value)} /></div>
            <div className="space-y-2"><Label>Original height</Label><Input type="number" value={height} onChange={(event) => setHeight(event.target.value)} /></div>
            <div className="space-y-2">
              <Label>Known target dimension</Label>
              <Select value={known} onValueChange={setKnown}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="width">Width</SelectItem><SelectItem value="height">Height</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Target {known}</Label><Input type="number" value={target} onChange={(event) => setTarget(event.target.value)} /></div>
          </CardContent>
        </Card>
        {result ? (
          <div className="grid gap-3 md:grid-cols-3">
            <Card><CardContent className="pt-6"><div className="text-sm text-muted-foreground">Simplified ratio</div><div className="text-2xl font-semibold">{result.ratio}</div><Button variant="outline" size="sm" className="mt-4" onClick={() => copy(result.ratio)}><Copy className="mr-2 h-4 w-4" />Copy</Button></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="text-sm text-muted-foreground">CSS aspect-ratio</div><div className="font-mono text-2xl font-semibold">{result.css}</div><Button variant="outline" size="sm" className="mt-4" onClick={() => copy(result.css)}><Copy className="mr-2 h-4 w-4" />Copy</Button></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="text-sm text-muted-foreground">Missing {known === "width" ? "height" : "width"}</div><div className="text-2xl font-semibold">{result.computed}px</div><Button variant="outline" size="sm" className="mt-4" onClick={() => copy(String(result.computed))}><Copy className="mr-2 h-4 w-4" />Copy</Button></CardContent></Card>
          </div>
        ) : (
          <Card><CardContent className="pt-6 text-sm text-destructive">Enter positive numeric dimensions.</CardContent></Card>
        )}
      </div>
    </ToolLayout>
  );
}
