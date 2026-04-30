"use client";
import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, FileDown, Settings, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Options { interfaceName: string; makeOptional: boolean; useUnknown: boolean; sortKeys: boolean; includeDescription: boolean; }

function getType(value: unknown, useUnknown: boolean): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  const t = typeof value;
  if (t === "object") {
    if (Array.isArray(value)) {
      if (value.length === 0) return "any[]";
      const types = [...new Set(value.map(i => getType(i, useUnknown)))];
      if (types.length === 1) return types[0].includes("{") ? `(${types[0]})[]` : `${types[0]}[]`;
      return `(${types.join(" | ")})[]`;
    }
    const entries = Object.entries(value as Record<string, unknown>);
    if (!entries.length) return "{}";
    return `{\n${entries.map(([k, v]) => `  ${/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`}: ${getType(v, useUnknown)};`).join("\n")}\n}`;
  }
  if (t === "string") return "string";
  if (t === "number") return "number";
  if (t === "boolean") return "boolean";
  return useUnknown ? "unknown" : "any";
}

function convert(json: string, opts: Options): string {
  const parsed = JSON.parse(json);
  if (typeof parsed !== "object" || parsed === null) throw new Error("Input must be a JSON object or array");
  let decl: string;
  if (Array.isArray(parsed)) {
    if (!parsed.length) return `export type ${opts.interfaceName} = any[];`;
    const merged = parsed.reduce((a, i) => typeof i === "object" && i && !Array.isArray(i) ? { ...a, ...i } : a, {});
    if (Object.keys(merged).length) {
      const props = Object.entries(merged).map(([k, v]) => `  ${/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`}: ${getType(v, opts.useUnknown)};`);
      decl = `export interface ${opts.interfaceName} {\n${props.join("\n")}\n}`;
    } else {
      decl = `export type ${opts.interfaceName} = ${getType(parsed[0], opts.useUnknown)}[];`;
    }
  } else {
    let entries = Object.entries(parsed);
    if (opts.sortKeys) entries.sort(([a], [b]) => a.localeCompare(b));
    const opt = opts.makeOptional ? "?" : "";
    const props = entries.map(([k, v]) => `  ${/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`}${opt}: ${getType(v, opts.useUnknown)};`);
    decl = `export interface ${opts.interfaceName} {\n${props.join("\n")}\n}`;
  }
  if (opts.includeDescription) {
    decl = `/**\n * Generated TypeScript interface from JSON\n * @generated ${new Date().toISOString()}\n */\n` + decl;
  }
  return decl;
}

const EXAMPLE = JSON.stringify({ id: 1, name: "John Doe", email: "john@example.com", isActive: true, profile: { age: 30, avatar: "https://example.com/avatar.jpg" }, tags: ["developer","typescript"], metadata: null }, null, 2);

export default function Client() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [opts, setOpts] = useState<Options>({ interfaceName: "GeneratedInterface", makeOptional: false, useUnknown: false, sortKeys: true, includeDescription: true });

  const isValid = (s: string) => { try { JSON.parse(s); return true; } catch { return false; } };

  const doConvert = () => {
    if (!input.trim()) { setError("Please enter JSON data"); return; }
    try { const r = convert(input, opts); setOutput(r); setError(""); toast.success("Converted successfully"); }
    catch (e) { setError((e as Error).message); setOutput(""); }
  };

  const download = () => {
    if (!output) return;
    const url = URL.createObjectURL(new Blob([output], { type: "text/typescript" }));
    const a = document.createElement("a"); a.href = url; a.download = `${opts.interfaceName}.ts`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  };

  const CHECKBOXES: [keyof Options, string][] = [
    ["makeOptional","Make properties optional"],["useUnknown","Use 'unknown' instead of 'any'"],
    ["sortKeys","Sort properties alphabetically"],["includeDescription","Include generated comment"],
  ];

  return (
    <ToolLayout toolId="json-to-typescript">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader><CardTitle>JSON Input</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setInput(EXAMPLE)}>Load Example</Button>
                  <Button variant="outline" size="sm" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</Button>
                </div>
                <div className="relative">
                  <Textarea placeholder="Paste your JSON here..." value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[300px] font-mono text-sm" />
                  {input && (
                    <div className="absolute top-2 right-2">
                      {isValid(input) ? <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" /> : <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />}
                    </div>
                  )}
                </div>
                {error && <div className="p-3 bg-red-500/10 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400">{error}</div>}
                <Button onClick={doConvert} disabled={!input.trim()} className="w-full">Convert to TypeScript</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-4 w-4" /> Options</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Interface Name</Label>
                <Input value={opts.interfaceName} onChange={(e) => setOpts(p => ({ ...p, interfaceName: e.target.value }))} placeholder="InterfaceName" />
              </div>
              {CHECKBOXES.map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox id={key} checked={opts[key] as boolean} onCheckedChange={(v) => setOpts(p => ({ ...p, [key]: !!v }))} />
                  <Label htmlFor={key} className="text-sm font-normal">{label}</Label>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {output && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                TypeScript Interface
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}><Copy className="h-4 w-4 mr-2" /> Copy</Button>
                  <Button variant="outline" size="sm" onClick={download}><FileDown className="h-4 w-4 mr-2" /> Download</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm"><code>{output}</code></pre>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
