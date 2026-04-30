"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RefreshCw, User } from "lucide-react";
import { toast } from "sonner";

const ADJ = ["awesome","cool","brilliant","clever","dynamic","epic","fierce","bold","swift","smart","quick","strong","brave","cosmic","neon","quantum","prime","elite","alpha"];
const NOUNS = ["warrior","ninja","wizard","hero","legend","champion","eagle","tiger","wolf","fox","hawk","dragon","phoenix","storm","ghost","pixel","byte","dev","core"];
const TECH = ["dev","code","hack","tech","byte","bit","pixel","data","node","web","app","git","vim","rust","go","ml","ai","cloud","edge"];
const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]!;
const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

function gen(base: string, style: string, numbers: boolean, special: boolean): string {
  const b = base.toLowerCase().replace(/[^a-z0-9]/g, "");
  let u = "";
  if (style === "modern") u = b ? b + (Math.random() > 0.5 ? rand(ADJ) : "") : rand(ADJ) + rand(NOUNS);
  else if (style === "tech") u = b ? b + rand(TECH) : rand(TECH) + rand(NOUNS);
  else if (style === "combination") u = b ? rand(ADJ) + b : rand(ADJ) + rand(NOUNS);
  else u = b || rand(NOUNS);

  if (numbers) {
    const r = Math.random();
    if (r < 0.4) u += rnd(1, 999);
    else if (r < 0.7) u = rnd(1, 99) + u;
    else u += rnd(2000, 2030);
  }
  if (special) {
    const c = rand(["_", "-", "."]);
    const p = Math.random();
    if (p < 0.3) u = c + u;
    else if (p < 0.6) { const m = Math.floor(u.length / 2); u = u.slice(0, m) + c + u.slice(m); }
    else u += c;
  }
  if (Math.random() > 0.7) u = u.charAt(0).toUpperCase() + u.slice(1);
  return u;
}

export default function Client() {
  const [base, setBase] = useState("");
  const [style, setStyle] = useState("modern");
  const [count, setCount] = useState(10);
  const [numbers, setNumbers] = useState(true);
  const [special, setSpecial] = useState(false);
  const [usernames, setUsernames] = useState<string[]>([]);

  const generate = () => {
    const set = new Set<string>();
    let attempts = 0;
    while (set.size < count && attempts < count * 5) {
      const u = gen(base, style, numbers, special);
      if (u.length >= 3 && u.length <= 20) set.add(u);
      attempts++;
    }
    while (set.size < count) set.add(gen(base, style, numbers, special) + rnd(1, 9999));
    setUsernames([...set]);
    toast.success(`Generated ${set.size} usernames`);
  };

  return (
    <ToolLayout toolId="username-generator">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Username Generator</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Base Name (optional)</Label><Input placeholder="e.g., john, sarah" value={base} onChange={(e) => setBase(e.target.value)} /></div>
              <div><Label>Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern (adj + noun)</SelectItem>
                    <SelectItem value="tech">Tech (tech words)</SelectItem>
                    <SelectItem value="combination">Combination</SelectItem>
                    <SelectItem value="simple">Simple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div><Label>Count</Label><Input type="number" min="1" max="50" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 10)} /></div>
              <div className="flex items-center gap-2 pt-6"><Switch id="nums" checked={numbers} onCheckedChange={setNumbers} /><Label htmlFor="nums">Include Numbers</Label></div>
              <div className="flex items-center gap-2 pt-6"><Switch id="spec" checked={special} onCheckedChange={setSpecial} /><Label htmlFor="spec">Special Chars</Label></div>
            </div>
            <div className="flex gap-2">
              <Button onClick={generate} className="flex-1">Generate Usernames</Button>
              <Button variant="outline" onClick={() => setUsernames([])}><RefreshCw className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>

        {usernames.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">Generated Usernames ({usernames.length})
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(usernames.join("\n")); toast.success("All copied"); }}><Copy className="h-4 w-4 mr-1" />Copy All</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {usernames.map((u, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
                    <span className="font-mono text-sm truncate flex-1">{u}</span>
                    <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(u); toast.success("Copied"); }}><Copy className="h-3 w-3" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
