"use client";

import { useState } from "react";
import { Copy, Download, Type } from "lucide-react";
import { toast } from "sonner";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const lower = "abcdefghijklmnopqrstuvwxyz";
const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nums = "0123456789";
const syms = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const consonants = "bcdfghjklmnpqrstvwxyz";
const vowels = "aeiou";

function pick(text: string) {
  return text[Math.floor(Math.random() * text.length)]!;
}

export default function Client() {
  const [length, setLength] = useState("12");
  const [count, setCount] = useState("10");
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [custom, setCustom] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const charset = `${useLower ? lower : ""}${useUpper ? upper : ""}${useNumbers ? nums : ""}${useSymbols ? syms : ""}${custom}`;

  const generate = (bulk = false) => {
    const len = Math.min(10000, Math.max(1, Number.parseInt(length) || 1));
    const amount = bulk ? Math.min(1000, Math.max(1, Number.parseInt(count) || 1)) : 1;
    if (!charset) return toast.error("Select at least one character set");
    setResults(Array.from({ length: amount }, () => Array.from({ length: len }, () => pick(charset)).join("")));
  };

  const generateWord = () => {
    const len = Math.min(50, Math.max(2, Number.parseInt(length) || 6));
    let vowelNext = Math.random() > 0.5;
    let word = "";
    for (let i = 0; i < len; i += 1) {
      word += pick(vowelNext ? vowels : consonants);
      vowelNext = Math.random() < 0.12 ? vowelNext : !vowelNext;
    }
    setResults([word.charAt(0).toUpperCase() + word.slice(1)]);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(results.join("\n"));
    toast.success("Strings copied");
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([results.join("\n")], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "random-strings.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout toolId="random-string-generator">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Type className="h-5 w-5" />Random String Generator</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Length</Label><Input type="number" value={length} onChange={(e) => setLength(e.target.value)} /></div><div className="space-y-2"><Label>Count</Label><Input type="number" value={count} onChange={(e) => setCount(e.target.value)} /></div></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Lowercase", useLower, setUseLower],
                ["Uppercase", useUpper, setUseUpper],
                ["Numbers", useNumbers, setUseNumbers],
                ["Symbols", useSymbols, setUseSymbols],
              ].map(([label, value, setter]) => <label key={String(label)} className="flex items-center gap-2 text-sm"><Checkbox checked={Boolean(value)} onCheckedChange={setter as (v: boolean) => void} />{String(label)}</label>)}
            </div>
            <div className="space-y-2"><Label>Custom Characters</Label><Input value={custom} onChange={(e) => setCustom(e.target.value)} /></div>
            <Tabs defaultValue="single">
              <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="single">Single</TabsTrigger><TabsTrigger value="bulk">Bulk</TabsTrigger><TabsTrigger value="word">Word-like</TabsTrigger></TabsList>
              <TabsContent value="single" className="mt-4"><Button className="w-full" onClick={() => generate(false)}>Generate String</Button></TabsContent>
              <TabsContent value="bulk" className="mt-4"><Button className="w-full" onClick={() => generate(true)}>Generate Strings</Button></TabsContent>
              <TabsContent value="word" className="mt-4"><Button className="w-full" onClick={generateWord}>Generate Word</Button></TabsContent>
            </Tabs>
            {results.length > 0 && <div className="space-y-3"><pre className="max-h-72 overflow-auto rounded-lg bg-muted p-4 font-mono text-sm">{results.join("\n")}</pre><div className="flex gap-2"><Button variant="outline" onClick={copy}><Copy className="h-4 w-4" />Copy</Button><Button variant="outline" onClick={download}><Download className="h-4 w-4" />Download</Button></div></div>}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
