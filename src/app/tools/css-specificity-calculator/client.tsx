"use client";

import { useMemo, useState } from "react";
import { Code2, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface SpecificityResult {
  selector: string;
  ids: number;
  classes: number;
  elements: number;
  score: string;
}

function splitSelectors(input: string) {
  const selectors: string[] = [];
  let current = "";
  let depth = 0;

  for (const char of input) {
    if (char === "(" || char === "[") depth++;
    if (char === ")" || char === "]") depth = Math.max(0, depth - 1);
    if (char === "," && depth === 0) {
      if (current.trim()) selectors.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) selectors.push(current.trim());
  return selectors;
}

function calculate(selector: string): SpecificityResult {
  const withoutStrings = selector.replace(/"[^"]*"|'[^']*'/g, "");
  const ids = (withoutStrings.match(/#[\w-]+/g) ?? []).length;
  const classes = (withoutStrings.match(/\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+(?:\([^)]*\))?/g) ?? []).length;
  const pseudoElements = (withoutStrings.match(/::[\w-]+/g) ?? []).length;
  const cleaned = withoutStrings
    .replace(/#[\w-]+/g, " ")
    .replace(/\.[\w-]+/g, " ")
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/:{1,2}[\w-]+(?:\([^)]*\))?/g, " ")
    .replace(/[>+~*,]/g, " ");
  const elements = (cleaned.match(/\b[a-zA-Z][\w-]*\b/g) ?? []).length + pseudoElements;

  return {
    selector,
    ids,
    classes,
    elements,
    score: `${ids}-${classes}-${elements}`,
  };
}

export default function CssSpecificityCalculatorClient() {
  const [input, setInput] = useState("nav#main .item.active > a:hover, article.card[data-state='open'] h2::before");
  const results = useMemo(() => splitSelectors(input).map(calculate), [input]);

  async function copyResults() {
    await navigator.clipboard.writeText(JSON.stringify(results, null, 2));
    toast.success("Results copied.");
  }

  return (
    <ToolLayout toolId="css-specificity-calculator">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Code2 className="h-5 w-5" /> CSS Specificity Calculator</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Enter one or more CSS selectors..." className="min-h-40 font-mono text-sm" />
            <div className="flex flex-wrap gap-2">
              <Button onClick={copyResults} disabled={results.length === 0}><Copy className="mr-2 h-4 w-4" />Copy Results</Button>
              <Button variant="outline" size="icon" onClick={() => setInput("")}><RefreshCw className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Specificity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {results.length > 0 ? results.map((result, index) => (
              <div key={`${result.selector}-${index}`} className="grid gap-3 rounded-md border bg-muted/30 p-3 lg:grid-cols-[1fr_6rem_6rem_6rem_7rem] lg:items-center">
                <div className="break-all font-mono text-sm">{result.selector}</div>
                <Metric label="IDs" value={result.ids} />
                <Metric label="Classes" value={result.classes} />
                <Metric label="Elements" value={result.elements} />
                <div className="font-mono text-lg font-bold">{result.score}</div>
              </div>
            )) : <p className="text-sm text-muted-foreground">Enter selectors to calculate specificity.</p>}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
