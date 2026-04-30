"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Download, Trash2, FileText, BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface Stats {
  originalLines: number;
  uniqueLines: number;
  duplicatesRemoved: number;
  emptyLinesRemoved: number;
}

const SAMPLE = `apple\nbanana\napple\ncherry\nbanana\ndate\napple\nelderberry\nfig\nbanana\ngrape\napple\ncherry\ndate\n\nelderberry\nfig\ngrape`;

export default function DuplicateLineRemoverClient() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [preserveEmpty, setPreserveEmpty] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [preserveOrder, setPreserveOrder] = useState(true);

  const processText = useCallback(() => {
    if (!inputText.trim()) { toast.error("Please enter some text"); return; }

    const lines = inputText.split("\n");
    const originalCount = lines.length;
    let emptyRemoved = 0;

    let toProcess = lines.filter((line) => {
      if (line.trim() === "") {
        if (preserveEmpty) return true;
        emptyRemoved++;
        return false;
      }
      return true;
    });

    if (!preserveOrder) {
      toProcess.sort((a, b) => {
        const ak = caseSensitive ? a : a.toLowerCase();
        const bk = caseSensitive ? b : b.toLowerCase();
        return ak.localeCompare(bk);
      });
    }

    const seen = new Set<string>();
    const result = toProcess.filter((line) => {
      if (line.trim() === "") return true; // preserved empty lines pass through
      const key = caseSensitive ? line : line.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const duplicatesRemoved = originalCount - result.length - emptyRemoved;
    setOutputText(result.join("\n"));
    setStats({ originalLines: originalCount, uniqueLines: result.length, duplicatesRemoved, emptyLinesRemoved: emptyRemoved });
    toast.success(`Removed ${duplicatesRemoved} duplicate line(s)${emptyRemoved > 0 ? ` and ${emptyRemoved} empty line(s)` : ""}`);
  }, [inputText, preserveEmpty, caseSensitive, preserveOrder]);

  const download = () => {
    if (!outputText) return;
    const url = URL.createObjectURL(new Blob([outputText], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url; a.download = "processed-text.txt";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  };

  return (
    <ToolLayout toolId="duplicate-line-remover">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Input Text</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
                <div className="text-xs text-muted-foreground">
                  Lines: {inputText ? inputText.split("\n").length : 0} | Characters: {inputText.length}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={processText} disabled={!inputText.trim()} className="flex-1 min-w-[140px]">
                    <Trash2 className="mr-2 h-4 w-4" /> Remove Duplicates
                  </Button>
                  <Button onClick={() => setInputText(SAMPLE)} variant="outline">Load Sample</Button>
                  <Button onClick={() => { setInputText(""); setOutputText(""); setStats(null); }} variant="outline">Clear</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Options</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: "case-sensitive", label: "Case sensitive comparison", checked: caseSensitive, onChange: setCaseSensitive },
                  { id: "preserve-order", label: "Preserve original order", checked: preserveOrder, onChange: setPreserveOrder },
                  { id: "preserve-empty", label: "Keep empty lines", checked: preserveEmpty, onChange: setPreserveEmpty },
                ].map(({ id, label, checked, onChange }) => (
                  <div key={id} className="flex items-center space-x-2">
                    <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} />
                    <Label htmlFor={id} className="font-normal">{label}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Output */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><FileText className="h-5 w-5" /> Processed Text</span>
                  {outputText && (
                    <div className="flex gap-2">
                      <Button onClick={() => { navigator.clipboard.writeText(outputText); toast.success("Copied"); }} size="sm" variant="outline">
                        <Copy className="mr-2 h-4 w-4" /> Copy
                      </Button>
                      <Button onClick={download} size="sm" variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {outputText ? (
                  <>
                    <Textarea value={outputText} readOnly className="min-h-[300px] font-mono text-sm" />
                    <div className="text-xs text-muted-foreground mt-2">
                      Lines: {outputText.split("\n").length} | Characters: {outputText.length}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20 text-muted-foreground">
                    <Trash2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>Processed text will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Original Lines", value: stats.originalLines, color: "text-primary" },
                      { label: "Unique Lines", value: stats.uniqueLines, color: "text-green-600 dark:text-green-400" },
                      { label: "Duplicates Removed", value: stats.duplicatesRemoved, color: "text-red-600 dark:text-red-400" },
                      { label: "Empty Lines Removed", value: stats.emptyLinesRemoved, color: "text-yellow-600 dark:text-yellow-400" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="text-center">
                        <div className={`text-2xl font-bold ${color}`}>{value}</div>
                        <div className="text-sm text-muted-foreground">{label}</div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Reduction:</span>
                      <Badge variant="outline">
                        {(((stats.duplicatesRemoved + stats.emptyLinesRemoved) / stats.originalLines) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Retained:</span>
                      <Badge variant="outline">
                        {((stats.uniqueLines / stats.originalLines) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
