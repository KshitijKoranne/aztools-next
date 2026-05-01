"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Heading } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type HeadingItem = {
  level: number;
  text: string;
  line: number;
};

export default function Client() {
  const [html, setHtml] = useState("");
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [issues, setIssues] = useState<string[]>([]);

  function analyze() {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const found = Array.from(doc.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((element) => {
      const textBefore = html.slice(0, html.indexOf(element.outerHTML));
      return {
        level: Number(element.tagName.slice(1)),
        text: element.textContent?.trim() || "(empty heading)",
        line: textBefore ? textBefore.split("\n").length : 1,
      };
    });

    const nextIssues: string[] = [];
    const h1Count = found.filter((item) => item.level === 1).length;
    if (found.length === 0) nextIssues.push("No headings found.");
    if (h1Count === 0) nextIssues.push("No h1 heading found.");
    if (h1Count > 1) nextIssues.push(`Multiple h1 headings found (${h1Count}).`);
    for (let i = 1; i < found.length; i++) {
      const previous = found[i - 1]!;
      const current = found[i]!;
      if (current.level > previous.level + 1) nextIssues.push(`Line ${current.line}: skipped from h${previous.level} to h${current.level}.`);
    }

    setHeadings(found);
    setIssues(nextIssues);
    toast[nextIssues.length ? "error" : "success"](nextIssues.length ? "Heading issues found." : "Heading structure looks good.");
  }

  return (
    <ToolLayout toolId="heading-structure">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Heading className="h-5 w-5" />Heading Structure Analyzer</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <Textarea value={html} onChange={(event) => setHtml(event.target.value)} placeholder="<h1>Main Title</h1>&#10;<h2>Section</h2>" className="min-h-[260px] font-mono text-sm" />
            <Button onClick={analyze}>Analyze Heading Structure</Button>
          </CardContent>
        </Card>
        {(headings.length > 0 || issues.length > 0) && <Card><CardHeader><CardTitle>Analysis Results</CardTitle></CardHeader><CardContent className="space-y-5">{issues.length > 0 && <div className="space-y-2">{issues.map((issue) => <div key={issue} className="flex gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{issue}</div>)}</div>}<div className="space-y-2">{headings.map((heading, index) => <div key={`${heading.line}-${index}`} className="flex items-center gap-3 rounded-md border p-2" style={{ marginLeft: `${(heading.level - 1) * 1.25}rem` }}><Badge variant="outline">h{heading.level}</Badge><span className="text-sm">{heading.text}</span><span className="ml-auto text-xs text-muted-foreground">line {heading.line}</span></div>)}</div></CardContent></Card>}
      </div>
    </ToolLayout>
  );
}
