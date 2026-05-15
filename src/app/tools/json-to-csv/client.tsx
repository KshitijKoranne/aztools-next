"use client";

import { useState } from "react";
import { Copy, Database, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type JsonRecord = Record<string, unknown>;

function flattenObject(value: JsonRecord, prefix = ""): JsonRecord {
  return Object.entries(value).reduce<JsonRecord>((acc, [key, entry]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      Object.assign(acc, flattenObject(entry as JsonRecord, path));
    } else {
      acc[path] = entry;
    }
    return acc;
  }, {});
}

function stringifyCell(value: unknown, delimiter: string) {
  const text = value === null || value === undefined ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
  const escaped = text.replace(/"/g, '""');
  return escaped.includes(delimiter) || escaped.includes("\n") || escaped.includes('"') ? `"${escaped}"` : escaped;
}

function toCsv(input: unknown, delimiter: string, includeHeaders: boolean, flattenNested: boolean) {
  const rows = Array.isArray(input) ? input : [input];
  if (rows.length === 0) return "";

  const records: JsonRecord[] = rows.map((row) => {
    if (row && typeof row === "object" && !Array.isArray(row)) {
      return flattenNested ? flattenObject(row as JsonRecord) : (row as JsonRecord);
    }
    return { value: row } as JsonRecord;
  });

  const headers = Array.from(new Set(records.flatMap((record) => Object.keys(record))));
  const lines = records.map((record) => headers.map((header) => stringifyCell(record[header], delimiter)).join(delimiter));
  return includeHeaders ? [headers.map((header) => stringifyCell(header, delimiter)).join(delimiter), ...lines].join("\n") : lines.join("\n");
}

export default function JsonToCsvClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [flattenNested, setFlattenNested] = useState(true);

  function convert() {
    if (!input.trim()) {
      toast.error("Paste JSON first.");
      return;
    }

    try {
      const parsed = JSON.parse(input) as unknown;
      const csv = toCsv(parsed, delimiter, includeHeaders, flattenNested);
      setOutput(csv);
      toast.success("JSON converted to CSV.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid JSON.");
    }
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    toast.success("CSV copied.");
  }

  function downloadCsv() {
    const blob = new Blob([output], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "converted-data.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function loadSample() {
    setInput(JSON.stringify([
      { name: "John Doe", age: 30, city: "New York", active: true, profile: { role: "Admin" } },
      { name: "Jane Smith", age: 25, city: "Los Angeles", active: true, profile: { role: "Editor" } },
    ], null, 2));
  }

  return (
    <ToolLayout toolId="json-to-csv">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" /> JSON to CSV Converter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Delimiter</Label>
                <Select value={delimiter} onValueChange={setDelimiter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",">Comma (,)</SelectItem>
                    <SelectItem value=";">Semicolon (;)</SelectItem>
                    <SelectItem value="	">Tab</SelectItem>
                    <SelectItem value="|">Pipe (|)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="headers" checked={includeHeaders} onCheckedChange={setIncludeHeaders} />
                <Label htmlFor="headers">Include header row</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="flatten" checked={flattenNested} onCheckedChange={setFlattenNested} />
                <Label htmlFor="flatten">Flatten nested objects</Label>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={convert}>Convert to CSV</Button>
              <Button variant="outline" onClick={loadSample}>Load Sample</Button>
              <Button variant="outline" size="icon" onClick={() => { setInput(""); setOutput(""); }}><RefreshCw className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>JSON Input</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste JSON here..." className="min-h-[420px] font-mono text-sm" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                CSV Output
                {output && (
                  <span className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyOutput}><Copy className="mr-2 h-4 w-4" />Copy</Button>
                    <Button size="sm" variant="outline" onClick={downloadCsv}><Download className="mr-2 h-4 w-4" />Download</Button>
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={output} readOnly placeholder="CSV output will appear here..." className="min-h-[420px] font-mono text-sm" />
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
