"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { BarChart3, Copy, Download } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const CODE39: Record<string, string> = {
  "0": "101001101101",
  "1": "110100101011",
  "2": "101100101011",
  "3": "110110010101",
  "4": "101001101011",
  "5": "110100110101",
  "6": "101100110101",
  "7": "101001011011",
  "8": "110100101101",
  "9": "101100101101",
  A: "110101001011",
  B: "101101001011",
  C: "110110100101",
  D: "101011001011",
  E: "110101100101",
  F: "101101100101",
  G: "101010011011",
  H: "110101001101",
  I: "101101001101",
  J: "101011001101",
  K: "110101010011",
  L: "101101010011",
  M: "110110101001",
  N: "101011010011",
  O: "110101101001",
  P: "101101101001",
  Q: "101010110011",
  R: "110101011001",
  S: "101101011001",
  T: "101011011001",
  U: "110010101011",
  V: "100110101011",
  W: "110011010101",
  X: "100101101011",
  Y: "110010110101",
  Z: "100110110101",
  "-": "100101011011",
  ".": "110010101101",
  " ": "100110101101",
  "$": "100100100101",
  "/": "100100101001",
  "+": "100101001001",
  "%": "101001001001",
  "*": "100101101101",
};

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!);
}

function createPattern(value: string) {
  const encoded = `*${value.toUpperCase()}*`;
  return encoded.split("").map((char) => CODE39[char]).join("0");
}

function createSvg(value: string, barWidth: number, barHeight: number, showText: boolean) {
  const pattern = createPattern(value);
  const margin = 24;
  const textHeight = showText ? 32 : 0;
  const width = pattern.length * barWidth + margin * 2;
  const height = barHeight + textHeight + margin * 2;
  const bars = pattern.split("").map((bit, index) => bit === "1"
    ? `<rect x="${margin + index * barWidth}" y="${margin}" width="${barWidth}" height="${barHeight}" />`
    : "").join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="100%" height="100%" fill="#ffffff"/>
<g fill="#000000">${bars}</g>
${showText ? `<text x="${width / 2}" y="${margin + barHeight + 24}" text-anchor="middle" font-family="monospace" font-size="18">${escapeXml(value.toUpperCase())}</text>` : ""}
</svg>`;
}

export default function Client() {
  const [value, setValue] = useState("HELLO-123");
  const [barWidth, setBarWidth] = useState(2);
  const [barHeight, setBarHeight] = useState(100);
  const [showText, setShowText] = useState(true);

  const cleanedValue = value.toUpperCase();
  const isValid = /^[0-9A-Z .\-$\/+%]+$/.test(cleanedValue) && cleanedValue.length > 0;
  const svg = useMemo(() => isValid ? createSvg(cleanedValue, barWidth, barHeight, showText) : "", [barHeight, barWidth, cleanedValue, isValid, showText]);

  function downloadSvg() {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `barcode-code39-${cleanedValue.replace(/\s+/g, "-")}.svg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success("Barcode downloaded.");
  }

  async function copySvg() {
    if (!svg) return;
    await navigator.clipboard.writeText(svg);
    toast.success("SVG copied.");
  }

  return (
    <ToolLayout toolId="barcode-generator">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Barcode Generator</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2"><Label>Code 39 Value</Label><Input value={value} onChange={(event) => setValue(event.target.value)} placeholder="HELLO-123" /><p className="text-xs text-muted-foreground">Supports A-Z, 0-9, space, dash, dot, $, /, +, and %.</p></div>
              <div className="space-y-2"><Label>Bar Width: {barWidth}px</Label><Slider value={[barWidth]} min={1} max={5} step={1} onValueChange={([next]) => setBarWidth(next ?? 2)} /></div>
              <div className="space-y-2"><Label>Bar Height: {barHeight}px</Label><Slider value={[barHeight]} min={60} max={180} step={10} onValueChange={([next]) => setBarHeight(next ?? 100)} /></div>
              <div className="flex items-center gap-2"><Checkbox id="show-text" checked={showText} onCheckedChange={(checked) => setShowText(checked === true)} /><Label htmlFor="show-text">Show human-readable text</Label></div>
              {!isValid && <p className="text-sm text-destructive">Enter a valid Code 39 value.</p>}
              <div className="flex gap-2">
                <Button className="flex-1" onClick={downloadSvg} disabled={!isValid}><Download className="mr-2 h-4 w-4" />Download</Button>
                <Button variant="outline" onClick={copySvg} disabled={!isValid}><Copy className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
            <CardContent>
              <div className="flex min-h-[320px] items-center justify-center overflow-auto rounded-md border bg-white p-6">
                {svg ? <div className="max-w-full" dangerouslySetInnerHTML={{ __html: svg }} /> : <span className="text-sm text-muted-foreground">Barcode preview will appear here.</span>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
