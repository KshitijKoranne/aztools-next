"use client";

import { useState } from "react";
import { AlignLeft, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

function sortLines(lines: string[], mode: string, descending: boolean, caseSensitive: boolean) {
  const sorted = [...lines].sort((a, b) => {
    const left = caseSensitive ? a : a.toLowerCase();
    const right = caseSensitive ? b : b.toLowerCase();
    if (mode === "numeric") return (Number.parseFloat(left) || 0) - (Number.parseFloat(right) || 0);
    if (mode === "length") return left.length - right.length;
    return left.localeCompare(right, undefined, { numeric: true });
  });
  return descending ? sorted.reverse() : sorted;
}

export default function ListSorterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("alpha");
  const [descending, setDescending] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [dedupe, setDedupe] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);

  function processList(action: "sort" | "reverse") {
    let lines = input.split(/\r?\n/);
    if (trimLines) lines = lines.map((line) => line.trim());
    if (removeEmpty) lines = lines.filter(Boolean);
    if (dedupe) lines = Array.from(new Set(lines));
    if (action === "sort") lines = sortLines(lines, mode, descending, caseSensitive);
    if (action === "reverse") lines = lines.reverse();
    setOutput(lines.join("\n"));
    toast.success("List processed.");
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    toast.success("List copied.");
  }

  return (
    <ToolLayout toolId="list-sorter">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlignLeft className="h-5 w-5" /> List Sorter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Sort mode</Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alpha">Alphabetical</SelectItem>
                    <SelectItem value="numeric">Numeric</SelectItem>
                    <SelectItem value="length">Line length</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2"><Switch id="desc" checked={descending} onCheckedChange={setDescending} /><Label htmlFor="desc">Descending</Label></div>
              <div className="flex items-center gap-2"><Switch id="case" checked={caseSensitive} onCheckedChange={setCaseSensitive} /><Label htmlFor="case">Case sensitive</Label></div>
              <div className="flex items-center gap-2"><Switch id="trim" checked={trimLines} onCheckedChange={setTrimLines} /><Label htmlFor="trim">Trim lines</Label></div>
              <div className="flex items-center gap-2"><Switch id="empty" checked={removeEmpty} onCheckedChange={setRemoveEmpty} /><Label htmlFor="empty">Remove empty lines</Label></div>
              <div className="flex items-center gap-2"><Switch id="dedupe" checked={dedupe} onCheckedChange={setDedupe} /><Label htmlFor="dedupe">Remove duplicates</Label></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => processList("sort")}>Sort List</Button>
              <Button variant="outline" onClick={() => processList("reverse")}>Reverse</Button>
              <Button variant="outline" onClick={() => setInput("orange\nbanana\napple\nbanana\npear\nkiwi")}>Load Sample</Button>
              <Button variant="outline" size="icon" onClick={() => { setInput(""); setOutput(""); }}><RefreshCw className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Input List</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="One item per line..." className="min-h-[420px] font-mono text-sm" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                Output
                {output && <Button size="sm" variant="outline" onClick={copyOutput}><Copy className="mr-2 h-4 w-4" />Copy</Button>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={output} readOnly placeholder="Processed list will appear here..." className="min-h-[420px] font-mono text-sm" />
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
