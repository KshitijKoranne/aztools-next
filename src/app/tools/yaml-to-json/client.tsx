"use client";

import { useState } from "react";
import yaml from "js-yaml";
import { Copy, FileCode, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function YamlToJsonClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [pretty, setPretty] = useState(true);

  function convert() {
    if (!input.trim()) {
      toast.error("Paste YAML first.");
      return;
    }

    try {
      const documents: unknown[] = [];
      yaml.loadAll(input, (doc) => documents.push(doc));
      const value = documents.length === 1 ? documents[0] : documents;
      setOutput(JSON.stringify(value, null, pretty ? 2 : 0));
      toast.success("YAML converted to JSON.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid YAML.");
    }
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    toast.success("JSON copied.");
  }

  function loadSample() {
    setInput(`name: AZ Tools
category: utilities
features:
  - fast
  - free
  - browser-based
published: true`);
  }

  return (
    <ToolLayout toolId="yaml-to-json">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileCode className="h-5 w-5" /> YAML to JSON Converter</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch id="pretty-json" checked={pretty} onCheckedChange={setPretty} />
              <Label htmlFor="pretty-json">Pretty print JSON</Label>
            </div>
            <Button onClick={convert}>Convert</Button>
            <Button variant="outline" onClick={loadSample}>Load Sample</Button>
            <Button variant="outline" size="icon" onClick={() => { setInput(""); setOutput(""); }}><RefreshCw className="h-4 w-4" /></Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>YAML Input</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste YAML here..." className="min-h-[420px] font-mono text-sm" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                JSON Output
                {output && <Button size="sm" variant="outline" onClick={copyOutput}><Copy className="mr-2 h-4 w-4" />Copy</Button>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={output} readOnly placeholder="JSON output will appear here..." className="min-h-[420px] font-mono text-sm" />
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
