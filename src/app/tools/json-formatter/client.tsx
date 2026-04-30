"use client";
import { useState, useRef } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Braces, Copy, Download, Upload } from "lucide-react";
import { toast } from "sonner";

export default function JsonFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState("2");
  const [activeTab, setActiveTab] = useState("beautify");
  const fileRef = useRef<HTMLInputElement>(null);

  const process = (tab = activeTab) => {
    if (!input.trim()) { toast.error("Please enter JSON input"); return; }
    try {
      const parsed = JSON.parse(input);
      if (tab === "beautify") setOutput(JSON.stringify(parsed, null, parseInt(indent)));
      else if (tab === "minify") setOutput(JSON.stringify(parsed));
      else { setOutput("JSON is valid"); toast.success("JSON is valid"); return; }
      toast.success(tab === "beautify" ? "JSON formatted" : "JSON minified");
    } catch (e) {
      setOutput(`Error: ${(e as Error).message}`);
      toast.error(`Invalid JSON: ${(e as Error).message}`);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("File must be under 10MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { setInput(ev.target?.result as string); toast.success(`${file.name} loaded`); };
    reader.readAsText(file);
  };

  const download = () => {
    if (!output) return;
    const url = URL.createObjectURL(new Blob([output], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "formatted.json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  };

  return (
    <ToolLayout toolId="json-formatter">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Braces className="h-5 w-5" /> JSON Formatter</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>JSON Input</Label>
              <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4 mr-1" /> Upload JSON
              </Button>
            </div>
            <input ref={fileRef} type="file" accept=".json,application/json,text/plain" onChange={handleFile} className="hidden" />
            <Textarea placeholder="Paste your JSON here..." value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[200px] font-mono text-sm" />

            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setOutput(""); }}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="beautify">Beautify</TabsTrigger>
                <TabsTrigger value="minify">Minify</TabsTrigger>
                <TabsTrigger value="validate">Validate</TabsTrigger>
              </TabsList>
              <TabsContent value="beautify" className="pt-3">
                <div className="flex items-center gap-4">
                  <Label className="shrink-0">Indent size</Label>
                  <Select value={indent} onValueChange={setIndent}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["2","4","6","8"].map(v => <SelectItem key={v} value={v}>{v} spaces</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => process("beautify")} className="ml-auto">Format</Button>
                </div>
              </TabsContent>
              <TabsContent value="minify" className="pt-3">
                <Button onClick={() => process("minify")}>Minify</Button>
              </TabsContent>
              <TabsContent value="validate" className="pt-3">
                <Button onClick={() => process("validate")}>Validate</Button>
              </TabsContent>
            </Tabs>

            {output && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Output</Label>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                      <Copy className="h-4 w-4 mr-1" /> Copy
                    </Button>
                    {activeTab !== "validate" && (
                      <Button size="sm" variant="outline" onClick={download}>
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
                    )}
                  </div>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">{output}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
