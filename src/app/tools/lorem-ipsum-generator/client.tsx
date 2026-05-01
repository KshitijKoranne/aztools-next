"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, FileText, RefreshCw } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum fugiat nulla pariatur".split(" ");

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)] ?? "lorem";
}

function generateWords(count: number, startWithLorem: boolean) {
  const words = startWithLorem ? ["Lorem", "ipsum", "dolor", "sit", "amet"].slice(0, count) : [];
  while (words.length < count) words.push(randomWord());
  return words.join(" ");
}

function generateSentence(startWithLorem: boolean) {
  const text = generateWords(Math.floor(Math.random() * 10) + 8, startWithLorem);
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}.`;
}

export default function Client() {
  const [mode, setMode] = useState("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");

  function generate() {
    const safeCount = Math.max(1, Math.min(count, 1000));
    if (mode === "words") setOutput(generateWords(safeCount, startWithLorem));
    if (mode === "sentences") setOutput(Array.from({ length: safeCount }, (_, index) => generateSentence(startWithLorem && index === 0)).join(" "));
    if (mode === "paragraphs") setOutput(Array.from({ length: safeCount }, (_, index) => Array.from({ length: 4 }, (_, sentenceIndex) => generateSentence(startWithLorem && index === 0 && sentenceIndex === 0)).join(" ")).join("\n\n"));
    toast.success("Text generated.");
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    toast.success("Copied.");
  }

  return (
    <ToolLayout toolId="lorem-ipsum-generator">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Lorem Ipsum Generator</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={mode} onValueChange={setMode}>
              <TabsList className="grid grid-cols-3"><TabsTrigger value="words">Words</TabsTrigger><TabsTrigger value="sentences">Sentences</TabsTrigger><TabsTrigger value="paragraphs">Paragraphs</TabsTrigger></TabsList>
              <TabsContent value={mode} className="space-y-2"><Label>Number of {mode}</Label><Input type="number" min="1" value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} /></TabsContent>
            </Tabs>
            <div className="flex items-center gap-2"><Checkbox id="lorem-start" checked={startWithLorem} onCheckedChange={(checked) => setStartWithLorem(checked === true)} /><Label htmlFor="lorem-start">Start with Lorem ipsum</Label></div>
            <div className="flex gap-2"><Button className="flex-1" onClick={generate}>Generate Lorem Ipsum</Button><Button variant="outline" size="icon" onClick={() => setOutput("")}><RefreshCw className="h-4 w-4" /></Button></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center justify-between gap-3">Generated Text{output && <Button size="sm" variant="outline" onClick={copy}><Copy className="mr-2 h-4 w-4" />Copy</Button>}</CardTitle></CardHeader>
          <CardContent><Textarea value={output} readOnly placeholder="Generated text will appear here..." className="min-h-[320px]" /></CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
