"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, FileText, ArrowDownToLine } from "lucide-react";
import { toast } from "sonner";

type DiffLine = { type: "added" | "removed" | "unchanged"; text: string };

function computeDiff(text1: string, text2: string): DiffLine[] {
  const a = text1.split("\n");
  const b = text2.split("\n");
  const m = a.length;
  const n = b.length;

  // LCS via DP
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        dp[i][j] = 1 + dp[i + 1][j + 1];
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Traceback
  const result: DiffLine[] = [];
  let i = 0,
    j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      result.push({ type: "unchanged", text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: "removed", text: a[i] });
      i++;
    } else {
      result.push({ type: "added", text: b[j] });
      j++;
    }
  }
  while (i < m) {
    result.push({ type: "removed", text: a[i++] });
  }
  while (j < n) {
    result.push({ type: "added", text: b[j++] });
  }
  return result;
}

export default function TextDiffClient() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diff, setDiff] = useState<DiffLine[] | null>(null);

  const handleCompare = () => {
    const result = computeDiff(text1, text2);
    setDiff(result);
    const added = result.filter((l) => l.type === "added").length;
    const removed = result.filter((l) => l.type === "removed").length;
    toast.success(`${added} addition(s), ${removed} removal(s)`);
  };

  const copyAll = () => {
    if (!diff) return;
    const text = diff
      .map((l) =>
        l.type === "added" ? `+ ${l.text}` : l.type === "removed" ? `- ${l.text}` : `  ${l.text}`
      )
      .join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const downloadDiff = () => {
    if (!diff) return;
    const added = diff.filter((l) => l.type === "added").map((l) => l.text);
    const removed = diff.filter((l) => l.type === "removed").map((l) => l.text);
    const unchanged = diff.filter((l) => l.type === "unchanged").map((l) => l.text);
    const content = [
      "=== DIFF RESULT ===",
      "",
      "=== ADDED ===",
      ...added,
      "",
      "=== REMOVED ===",
      ...removed,
      "",
      "=== UNCHANGED ===",
      ...unchanged,
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "text-diff-result.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  };

  const added = diff?.filter((l) => l.type === "added") ?? [];
  const removed = diff?.filter((l) => l.type === "removed") ?? [];
  const unchanged = diff?.filter((l) => l.type === "unchanged") ?? [];

  return (
    <ToolLayout toolId="text-diff">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Original Text</h3>
            <Textarea
              placeholder="Paste your original text here..."
              className="min-h-[200px] font-mono text-sm"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Modified Text</h3>
            <Textarea
              placeholder="Paste your modified text here..."
              className="min-h-[200px] font-mono text-sm"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <Button
            onClick={handleCompare}
            disabled={!text1.trim() || !text2.trim()}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Compare Texts
          </Button>
        </div>

        {diff && (
          <Card className="p-4">
            <div className="flex justify-between mb-4">
              <h3 className="font-medium">Comparison Results</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={copyAll}>
                  <Copy className="h-3 w-3" />
                  Copy All
                </Button>
                <Button variant="outline" size="sm" className="gap-1" onClick={downloadDiff}>
                  <ArrowDownToLine className="h-3 w-3" />
                  Download
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Changes</TabsTrigger>
                <TabsTrigger value="added">Added ({added.length})</TabsTrigger>
                <TabsTrigger value="removed">Removed ({removed.length})</TabsTrigger>
                <TabsTrigger value="unchanged">Unchanged ({unchanged.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="border rounded-md p-2">
                <div className="h-[300px] overflow-y-auto space-y-0.5 font-mono text-xs">
                  {diff.map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.type === "added"
                          ? "bg-green-500/10 text-green-700 dark:text-green-400 py-0.5 pl-2 border-l-2 border-green-500"
                          : line.type === "removed"
                          ? "bg-red-500/10 text-red-700 dark:text-red-400 py-0.5 pl-2 border-l-2 border-red-500"
                          : "py-0.5 pl-2 border-l-2 border-transparent"
                      }
                    >
                      {line.type === "added" ? "+ " : line.type === "removed" ? "- " : "  "}
                      {line.text}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="added" className="border rounded-md p-2">
                <div className="h-[300px] overflow-y-auto font-mono text-xs space-y-0.5">
                  {added.length === 0 ? (
                    <p className="text-muted-foreground p-2">No additions</p>
                  ) : (
                    added.map((line, i) => (
                      <div key={i} className="bg-green-500/10 text-green-700 dark:text-green-400 py-0.5 pl-2 border-l-2 border-green-500">
                        + {line.text}
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="removed" className="border rounded-md p-2">
                <div className="h-[300px] overflow-y-auto font-mono text-xs space-y-0.5">
                  {removed.length === 0 ? (
                    <p className="text-muted-foreground p-2">No removals</p>
                  ) : (
                    removed.map((line, i) => (
                      <div key={i} className="bg-red-500/10 text-red-700 dark:text-red-400 py-0.5 pl-2 border-l-2 border-red-500">
                        - {line.text}
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="unchanged" className="border rounded-md p-2">
                <div className="h-[300px] overflow-y-auto font-mono text-xs space-y-0.5">
                  {unchanged.length === 0 ? (
                    <p className="text-muted-foreground p-2">No unchanged lines</p>
                  ) : (
                    unchanged.map((line, i) => (
                      <div key={i} className="py-0.5 pl-2">
                        {line.text}
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
