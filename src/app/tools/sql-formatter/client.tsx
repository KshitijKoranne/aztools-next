"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, FileDown, Database, AlertCircle, CheckCircle, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "sql-formatter";

const DIALECTS = [
  { value: "sql", label: "Standard SQL" },
  { value: "mysql", label: "MySQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "sqlite", label: "SQLite" },
  { value: "tsql", label: "T-SQL (SQL Server)" },
  { value: "plsql", label: "Oracle PL/SQL" },
] as const;

type Dialect = (typeof DIALECTS)[number]["value"];

const EXAMPLE = `select u.id,u.name,u.email,p.title,p.content,count(c.id) as comment_count from users u inner join posts p on u.id=p.user_id left join comments c on p.id=c.post_id where u.active=1 and p.published_at is not null group by u.id,p.id having count(c.id)>0 order by p.published_at desc;`;

export default function SqlFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [dialect, setDialect] = useState<Dialect>("sql");
  const [indentSize, setIndentSize] = useState(2);
  const [uppercase, setUppercase] = useState(true);
  const [linesBetween, setLinesBetween] = useState(1);

  const isLikelySql = (s: string) =>
    /\b(select|insert|update|delete|create|alter|drop)\b/i.test(s.trim());

  const handleFormat = () => {
    if (!input.trim()) { setError("Please enter a SQL query"); return; }
    try {
      const result = format(input, {
        language: dialect,
        tabWidth: indentSize,
        keywordCase: uppercase ? "upper" : "preserve",
        linesBetweenQueries: linesBetween,
      });
      setOutput(result);
      setError("");
      toast.success("SQL formatted");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to format SQL");
      setOutput("");
    }
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "formatted.sql";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  };

  return (
    <ToolLayout toolId="sql-formatter">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" /> SQL Input</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setInput(EXAMPLE); setError(""); }}>Load Example</Button>
                  <Button variant="outline" size="sm" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</Button>
                </div>
                <div className="relative">
                  <Textarea placeholder="Paste your SQL query here..." value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[200px] font-mono text-sm" />
                  {input && (
                    <div className="absolute top-2 right-2">
                      {isLikelySql(input) ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-yellow-500" />}
                    </div>
                  )}
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 p-3 border border-red-200 dark:border-red-800 rounded-md bg-red-50 dark:bg-red-900/10">
                    <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                  </div>
                )}
                <Button onClick={handleFormat} disabled={!input.trim()} className="w-full" size="lg">
                  <Wand2 className="h-4 w-4 mr-2" /> Format SQL
                </Button>
              </CardContent>
            </Card>

            {output && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Formatted SQL</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}><Copy className="h-4 w-4 mr-1" /> Copy</Button>
                      <Button variant="outline" size="sm" onClick={download}><FileDown className="h-4 w-4 mr-1" /> Download</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm border font-mono">{output}</pre>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="h-fit">
            <CardHeader><CardTitle>Options</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>SQL Dialect</Label>
                <Select value={dialect} onValueChange={(v) => setDialect(v as Dialect)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DIALECTS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Indent Size: {indentSize}</Label>
                <Slider value={[indentSize]} onValueChange={([v]) => setIndentSize(v!)} min={2} max={8} step={1} />
              </div>

              <div className="space-y-2">
                <Label>Lines Between Queries: {linesBetween}</Label>
                <Slider value={[linesBetween]} onValueChange={([v]) => setLinesBetween(v!)} min={1} max={5} step={1} />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="uppercase" checked={uppercase} onCheckedChange={(v) => setUppercase(v === true)} />
                <Label htmlFor="uppercase" className="font-normal text-sm">Uppercase keywords</Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
