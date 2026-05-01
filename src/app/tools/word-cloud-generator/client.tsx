"use client";

import { useRef, useState } from "react";
import { Download } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const STOP = new Set(["the", "and", "for", "are", "but", "with", "you", "your", "this", "that", "from", "have"]);

export default function Client() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("SEO tools content writing keywords website traffic growth analytics");

  function generate() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.width = 1000;
    canvas.height = 600;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const counts = new Map<string, number>();
    for (const word of text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/)) {
      if (word.length > 2 && !STOP.has(word)) counts.set(word, (counts.get(word) ?? 0) + 1);
    }
    const words = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 60);
    words.forEach(([word, count], index) => {
      const size = Math.max(16, Math.min(72, 16 + count * 12));
      ctx.font = `700 ${size}px Arial`;
      ctx.fillStyle = `hsl(${(index * 47) % 360} 70% 38%)`;
      ctx.fillText(word, 40 + ((index * 173) % 760), 70 + ((index * 89) % 480));
    });
  }

  function download() {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = "word-cloud.png";
    link.click();
  }

  return (
    <ToolLayout toolId="word-cloud-generator">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card><CardHeader><CardTitle>Word Cloud Generator</CardTitle></CardHeader><CardContent className="space-y-4"><Textarea value={text} onChange={(event) => setText(event.target.value)} className="min-h-[180px]" /><div className="flex gap-2"><Button onClick={generate}>Generate</Button><Button variant="outline" onClick={download}><Download className="mr-2 h-4 w-4" />Download</Button></div></CardContent></Card>
        <Card><CardContent className="pt-6"><canvas ref={canvasRef} className="max-w-full rounded-md border" /></CardContent></Card>
      </div>
    </ToolLayout>
  );
}
