"use client";
import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Copy, RefreshCw, Eye, EyeOff, Check, Shield } from "lucide-react";
import { toast } from "sonner";

const UC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LC = "abcdefghijklmnopqrstuvwxyz";
const NUM = "0123456789";
const SYM = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
const SIMILAR = "il1Lo0O";
const AMBIG = "{}[]()/\\'\"`,;:.<>";

function strength(pwd: string) {
  let s = 0;
  if (pwd.length >= 8) s += 2; if (pwd.length >= 12) s += 1;
  if (/[A-Z]/.test(pwd)) s += 1; if (/[a-z]/.test(pwd)) s += 1;
  if (/\d/.test(pwd)) s += 1; if (/[^A-Za-z0-9]/.test(pwd)) s += 2;
  if (/(.)(\1{2,})/.test(pwd)) s -= 1;
  if (/12345|qwerty|password/i.test(pwd)) s -= 2;
  s = Math.max(0, Math.min(5, s));
  const labels = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong", "Very Strong"];
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-500", "bg-emerald-500"];
  return { score: s, label: labels[s]!, color: colors[s]! };
}

export default function Client() {
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [nums, setNums] = useState(true);
  const [syms, setSyms] = useState(true);
  const [noSimilar, setNoSimilar] = useState(false);
  const [noAmbig, setNoAmbig] = useState(false);

  const generate = () => {
    let charset = "";
    if (upper) charset += UC;
    if (lower) charset += LC;
    if (nums) charset += NUM;
    if (syms) charset += SYM;
    if (!charset) { toast.error("Select at least one character type"); return; }
    if (noSimilar) SIMILAR.split("").forEach((c) => { charset = charset.replaceAll(c, ""); });
    if (noAmbig) AMBIG.split("").forEach((c) => { charset = charset.replace(new RegExp("\\" + c, "g"), ""); });
    if (!charset) { toast.error("No characters left after filters"); return; }
    let result = "";
    for (let i = 0; i < len; i++) result += charset[Math.floor(Math.random() * charset.length)];
    setPwd(result);
    setCopied(false);
    toast.success("Password generated");
  };

  useEffect(() => { generate(); }, []);

  const s = pwd ? strength(pwd) : null;

  return (
    <ToolLayout toolId="password-generator">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-muted p-4 rounded-md space-y-4">
          <div className="relative">
            <Input type={show ? "text" : "password"} value={pwd} readOnly className="pr-20 font-mono text-lg h-12" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShow(!show)}>{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { navigator.clipboard.writeText(pwd); setCopied(true); toast.success("Copied!"); setTimeout(() => setCopied(false), 2000); }}>{copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}</Button>
            </div>
          </div>
          {s && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm"><span>Strength</span><span className="font-medium">{s.label}</span></div>
              <div className="w-full bg-muted-foreground/20 rounded-full h-2"><div className={`h-full rounded-full ${s.color}`} style={{ width: `${(s.score / 5) * 100}%` }} /></div>
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={generate} className="flex-1 gap-2"><RefreshCw className="h-4 w-4" />Generate</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Length: {len}</Label>
              <Slider min={4} max={64} step={1} value={[len]} onValueChange={([v]) => setLen(v!)} />
            </div>
            <div className="space-y-3">
              <p className="font-medium text-sm">Character Sets</p>
              {[
                { label: "Uppercase (A-Z)", val: upper, set: setUpper },
                { label: "Lowercase (a-z)", val: lower, set: setLower },
                { label: "Numbers (0-9)", val: nums, set: setNums },
                { label: "Symbols (!@#$...)", val: syms, set: setSyms },
              ].map(({ label, val, set }) => (
                <div key={label} className="flex items-center justify-between">
                  <Label className="cursor-pointer">{label}</Label>
                  <Switch checked={val} onCheckedChange={set} />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <p className="font-medium text-sm">Additional Options</p>
              <div className="flex items-center justify-between">
                <div><Label>Exclude Similar</Label><p className="text-xs text-muted-foreground">i, l, 1, L, o, 0, O</p></div>
                <Switch checked={noSimilar} onCheckedChange={setNoSimilar} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Exclude Ambiguous</Label><p className="text-xs text-muted-foreground">{`{}, [], (), /\\`}</p></div>
                <Switch checked={noAmbig} onCheckedChange={setNoAmbig} />
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-md space-y-2">
            <h3 className="font-medium flex items-center gap-2 text-sm"><Shield className="h-4 w-4" />Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
              <li>Use a unique password for each account</li>
              <li>Aim for at least 12 characters</li>
              <li>Avoid personal information</li>
              <li>Use a password manager to store passwords</li>
              <li>Enable two-factor authentication</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
