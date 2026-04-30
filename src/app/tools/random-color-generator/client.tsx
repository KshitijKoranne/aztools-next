"use client";

import { useState } from "react";
import { Copy, Palette, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Color = { hex: string; rgb: string; hsl: string; h: number; s: number; l: number };

function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
}

function makeColor(h = Math.floor(Math.random() * 360), s = 45 + Math.floor(Math.random() * 45), l = 35 + Math.floor(Math.random() * 35)): Color {
  const [r, g, b] = hslToRgb(h, s, l);
  const hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  return { hex, rgb: `rgb(${r}, ${g}, ${b})`, hsl: `hsl(${h}, ${s}%, ${l}%)`, h, s, l };
}

function ColorBlock({ color, onCopy }: { color: Color; onCopy: (value: string) => void }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="h-28" style={{ backgroundColor: color.hex }} />
      <div className="space-y-2 p-3 text-sm">
        {[color.hex, color.rgb, color.hsl].map((value) => (
          <button key={value} className="block w-full truncate rounded text-left font-mono hover:text-primary" onClick={() => onCopy(value)}>
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Client() {
  const [single, setSingle] = useState<Color>(() => makeColor());
  const [count, setCount] = useState("5");
  const [harmony, setHarmony] = useState("random");
  const [palette, setPalette] = useState<Color[]>([]);

  const generatePalette = () => {
    const amount = Math.min(20, Math.max(2, Number.parseInt(count) || 5));
    const base = makeColor();
    const colors = Array.from({ length: amount }, (_, index) => {
      if (index === 0) return base;
      if (harmony === "complementary") return makeColor((base.h + 180 + index * 12) % 360, base.s, base.l);
      if (harmony === "triadic") return makeColor((base.h + index * 120) % 360, base.s, base.l);
      if (harmony === "analogous") return makeColor((base.h + (index - Math.floor(amount / 2)) * 24 + 360) % 360, base.s, base.l);
      return makeColor();
    });
    setPalette(colors);
  };

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    toast.success("Color copied");
  };

  return (
    <ToolLayout toolId="random-color-generator">
      <div className="mx-auto max-w-5xl">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" />Random Color Generator</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue="single">
              <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="single">Single Color</TabsTrigger><TabsTrigger value="palette">Palette</TabsTrigger></TabsList>
              <TabsContent value="single" className="mt-6 space-y-4">
                <ColorBlock color={single} onCopy={copy} />
                <Button className="w-full" onClick={() => setSingle(makeColor())}><Shuffle className="h-4 w-4" />Generate Color</Button>
              </TabsContent>
              <TabsContent value="palette" className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label>Count</Label><Input type="number" min={2} max={20} value={count} onChange={(e) => setCount(e.target.value)} /></div>
                  <div className="space-y-2">
                    <Label>Harmony</Label>
                    <Select value={harmony} onValueChange={setHarmony}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">Random</SelectItem>
                        <SelectItem value="analogous">Analogous</SelectItem>
                        <SelectItem value="complementary">Complementary</SelectItem>
                        <SelectItem value="triadic">Triadic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full" onClick={generatePalette}><Shuffle className="h-4 w-4" />Generate Palette</Button>
                {palette.length > 0 && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{palette.map((color) => <ColorBlock key={color.hex} color={color} onCopy={copy} />)}</div>
                    <Button variant="outline" onClick={() => copy(palette.map((color) => color.hex).join("\n"))}><Copy className="h-4 w-4" />Copy HEX Palette</Button>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
