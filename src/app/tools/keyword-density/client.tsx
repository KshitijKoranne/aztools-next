"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Result = {
  totalWords: number;
  keywordCount: number;
  density: number;
  topKeywords: { word: string; count: number; density: number }[];
};

const STOP_WORDS = new Set(["the", "and", "for", "are", "but", "not", "you", "your", "with", "this", "that", "from", "have", "has", "was", "were"]);

function densityLabel(density: number) {
  if (density < 0.5) return "Too Low";
  if (density < 1) return "Low";
  if (density < 2.5) return "Good";
  if (density < 4) return "High";
  return "Too High";
}

export default function Client() {
  const [content, setContent] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function analyze() {
    const words = content.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((word) => word.length > 2);
    const totalWords = words.length;
    const target = targetKeyword.trim().toLowerCase();
    const keywordCount = target ? (content.toLowerCase().match(new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length : 0;
    const counts = new Map<string, number>();

    for (const word of words) {
      if (!STOP_WORDS.has(word)) counts.set(word, (counts.get(word) ?? 0) + 1);
    }

    setResult({
      totalWords,
      keywordCount,
      density: totalWords ? (keywordCount / totalWords) * 100 : 0,
      topKeywords: Array.from(counts.entries()).map(([word, count]) => ({ word, count, density: totalWords ? (count / totalWords) * 100 : 0 })).sort((a, b) => b.count - a.count).slice(0, 20),
    });
  }

  return (
    <ToolLayout toolId="keyword-density">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" />Content Analysis</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Target Keyword/Phrase</Label><Input value={targetKeyword} onChange={(event) => setTargetKeyword(event.target.value)} placeholder="Enter target keyword" /></div>
            <div className="space-y-2"><Label>Content</Label><Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Paste content here..." className="min-h-[320px]" /></div>
            <Button className="w-full" onClick={analyze}>Analyze Keyword Density</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Analysis Results</CardTitle></CardHeader>
          <CardContent>
            {result ? <div className="space-y-6">{targetKeyword && <div className="grid grid-cols-2 gap-4"><div><Label className="text-muted-foreground">Count</Label><div className="text-2xl font-bold">{result.keywordCount}</div></div><div><Label className="text-muted-foreground">Density</Label><div className="flex items-center gap-2"><span className="text-2xl font-bold">{result.density.toFixed(2)}%</span><Badge>{densityLabel(result.density)}</Badge></div></div></div>}<div className="border-t pt-4 text-sm text-muted-foreground">Total Words: {result.totalWords}</div><div className="space-y-2">{result.topKeywords.map((item) => <div key={item.word} className="flex items-center justify-between rounded-md border p-2"><span className="font-medium">{item.word}</span><span className="flex gap-2"><Badge variant="outline">{item.count}</Badge><Badge variant="secondary">{item.density.toFixed(1)}%</Badge></span></div>)}</div></div> : <p className="text-sm text-muted-foreground">Enter content and click Analyze.</p>}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
