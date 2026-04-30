"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Eye, EyeOff, RefreshCw, Shield } from "lucide-react";
import { toast } from "sonner";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const sets = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
};
const similar = "il1Lo0O";
const ambiguous = "{}[]()/\\'\"`,;:.<>";

function randomIndex(max: number) {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0]! % max;
}

function makePassword(length: number, charset: string) {
  return Array.from({ length }, () => charset[randomIndex(charset.length)]).join("");
}

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong", "Very Strong"];
  return { score: Math.min(6, score), label: labels[Math.min(6, score)]! };
}

export default function Client() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const charset = useMemo(() => {
    let value = "";
    if (upper) value += sets.upper;
    if (lower) value += sets.lower;
    if (numbers) value += sets.numbers;
    if (symbols) value += sets.symbols;
    if (excludeSimilar) value = value.split("").filter((char) => !similar.includes(char)).join("");
    if (excludeAmbiguous) value = value.split("").filter((char) => !ambiguous.includes(char)).join("");
    return value;
  }, [excludeAmbiguous, excludeSimilar, lower, numbers, symbols, upper]);

  const [password, setPassword] = useState(() => makePassword(16, sets.upper + sets.lower + sets.numbers + sets.symbols));
  const strength = getStrength(password);

  const generate = () => {
    if (!charset) return toast.error("Select at least one character type");
    setPassword(makePassword(length, charset));
    setCopied(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Password copied");
  };

  return (
    <ToolLayout toolId="password-generator">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Password Generator</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="flex gap-2 rounded-lg bg-muted p-3">
              <input readOnly type={show ? "text" : "password"} value={password} className="min-w-0 flex-1 bg-transparent font-mono text-lg outline-none" />
              <Button variant="ghost" size="icon" onClick={() => setShow((value) => !value)}>{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
              <Button variant="ghost" size="icon" onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm"><span>Strength</span><span>{strength.label}</span></div>
              <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${(strength.score / 6) * 100}%` }} /></div>
            </div>
            <div className="space-y-2">
              <Label>Length: {length}</Label>
              <Slider min={4} max={64} step={1} value={[length]} onValueChange={([value]) => setLength(value ?? 16)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Uppercase", upper, setUpper],
                ["Lowercase", lower, setLower],
                ["Numbers", numbers, setNumbers],
                ["Symbols", symbols, setSymbols],
                ["Exclude similar", excludeSimilar, setExcludeSimilar],
                ["Exclude ambiguous", excludeAmbiguous, setExcludeAmbiguous],
              ].map(([label, value, setter]) => (
                <div key={String(label)} className="flex items-center justify-between rounded-lg border p-3">
                  <Label>{String(label)}</Label>
                  <Switch checked={Boolean(value)} onCheckedChange={setter as (value: boolean) => void} />
                </div>
              ))}
            </div>
            <Button onClick={generate} className="w-full"><RefreshCw className="h-4 w-4" />Generate</Button>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
