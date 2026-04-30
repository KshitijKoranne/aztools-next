"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Database, Download, RefreshCw } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type JsonValue = string | number | boolean | null;

function parseCsv(input: string, delimiter: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const next = input[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i++;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);

  if (inQuotes) throw new Error("Unclosed quoted field.");
  return rows;
}

function parseCell(value: string): JsonValue {
  if (value === "") return "";
  if (/^(true|false)$/i.test(value)) return value.toLowerCase() === "true";
  if (/^null$/i.test(value)) return null;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}

export default function Client() {
  const [csvInput, setCsvInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeaders, setHasHeaders] = useState(true);
  const [prettyPrint, setPrettyPrint] = useState(true);

  function convertCsvToJson() {
    if (!csvInput.trim()) {
      toast.error("Please enter CSV data.");
      return;
    }

    try {
      const rows = parseCsv(csvInput, delimiter);
      if (rows.length === 0) throw new Error("No rows found.");

      const data = hasHeaders
        ? rows.slice(1).map((row) => Object.fromEntries((rows[0] ?? []).map((header, index) => [
          header || `column_${index + 1}`,
          parseCell(row[index] ?? ""),
        ])))
        : rows.map((row) => row.map(parseCell));

      setJsonOutput(JSON.stringify(data, null, prettyPrint ? 2 : 0));
      toast.success(`Converted ${rows.length} row(s).`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to parse CSV.");
    }
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(jsonOutput);
    toast.success("JSON copied.");
  }

  function downloadJson() {
    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "converted-data.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success("JSON downloaded.");
  }

  function loadSample() {
    setCsvInput(`Name,Age,City,Active
John Doe,30,New York,true
Jane Smith,25,Los Angeles,true
Bob Johnson,35,Chicago,false`);
    setHasHeaders(true);
    setDelimiter(",");
  }

  return (
    <ToolLayout toolId="csv-to-json">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              CSV to JSON Converter
            </CardTitle>
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
                <Switch id="headers" checked={hasHeaders} onCheckedChange={setHasHeaders} />
                <Label htmlFor="headers">First row contains headers</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="pretty" checked={prettyPrint} onCheckedChange={setPrettyPrint} />
                <Label htmlFor="pretty">Pretty print JSON</Label>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={convertCsvToJson}>Convert to JSON</Button>
              <Button variant="outline" onClick={loadSample}>Load Sample</Button>
              <Button variant="outline" size="icon" onClick={() => { setCsvInput(""); setJsonOutput(""); }}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>CSV Input</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={csvInput} onChange={(event) => setCsvInput(event.target.value)} placeholder="Paste CSV data here..." className="min-h-[400px] font-mono text-sm" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                JSON Output
                {jsonOutput && (
                  <span className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyOutput}><Copy className="mr-2 h-4 w-4" />Copy</Button>
                    <Button size="sm" variant="outline" onClick={downloadJson}><Download className="mr-2 h-4 w-4" />Download</Button>
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={jsonOutput} readOnly placeholder="JSON output will appear here..." className="min-h-[400px] font-mono text-sm" />
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
