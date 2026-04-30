"use client";
import { useState, useRef } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Copy, RotateCcw, Code, Minimize2 } from "lucide-react";
import { toast } from "sonner";

function beautifyCSS(css: string, indent: number): string {
  const ind = " ".repeat(indent);
  return css
    .replace(/\s+/g, " ")
    .replace(/;\s*/g, ";\n" + ind)
    .replace(/{\s*/g, " {\n" + ind)
    .replace(/}\s*/g, "\n}\n\n")
    .replace(/,\s*/g, ",\n")
    .replace(/([^{]+){/g, (_, sel) => sel.trim() + " {")
    .split("\n").map(l => {
      const t = l.trim();
      if (!t) return "";
      if (t.endsWith("{")) return t;
      if (t === "}") return t;
      if (t.includes(":") && t.endsWith(";")) return ind + t;
      return t;
    }).join("\n")
    .replace(/\n{3,}/g, "\n\n").trim();
}

function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{};:,>+~])\s*/g, "$1")
    .replace(/;}/g, "}").trim();
}

export default function Client() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState("2");
  const [activeTab, setActiveTab] = useState("beautify");
  const fileRef = useRef<HTMLInputElement>(null);

  const process = (mode: string) => {
    if (!input.trim()) { toast.error("Please enter CSS code"); return; }
    try {
      const result = mode === "beautify" ? beautifyCSS(input, parseInt(indent)) : minifyCSS(input);
      setOutput(result);
      if (mode === "minify") {
        const savings = ((1 - result.length / input.length) * 100).toFixed(1);
        toast.success(`Reduced by ${savings}%`);
      } else {
        toast.success("CSS beautified");
      }
    } catch { toast.error("Failed to process CSS"); }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setInput(ev.target?.result as string); toast.success(`${file.name} loaded`); };
    reader.readAsText(file);
  };

  const download = () => {
    if (!output) return;
    const name = activeTab === "beautify" ? "beautified.css" : "minified.css";
    const url = URL.createObjectURL(new Blob([output], { type: "text/css" }));
    const a = document.createElement("a"); a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  };

  return (
    <ToolLayout toolId="css-formatter">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Code className="h-5 w-5" /> CSS Input</span>
                <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-1" /> Upload
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input ref={fileRef} type="file" accept=".css,text/css" onChange={handleFile} className="hidden" />
              <Textarea placeholder="Paste your CSS here..." value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[300px] font-mono text-sm" />

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="beautify" className="gap-1"><Code className="h-3 w-3" /> Beautify</TabsTrigger>
                  <TabsTrigger value="minify" className="gap-1"><Minimize2 className="h-3 w-3" /> Minify</TabsTrigger>
                </TabsList>
                <TabsContent value="beautify" className="mt-3 space-y-3">
                  <div className="flex items-center gap-3">
                    <Label className="shrink-0">Indent</Label>
                    <Select value={indent} onValueChange={setIndent}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["2","4","6","8"].map(v => <SelectItem key={v} value={v}>{v} spaces</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => process("beautify")} className="w-full">Beautify CSS</Button>
                </TabsContent>
                <TabsContent value="minify" className="mt-3">
                  <Button onClick={() => process("minify")} className="w-full">Minify CSS</Button>
                </TabsContent>
              </Tabs>

              <Button variant="outline" onClick={() => { setInput(""); setOutput(""); }} className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" /> Clear
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Output
                {output && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                      <Copy className="h-4 w-4 mr-1" /> Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={download}>
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {output ? (
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">{output}</pre>
              ) : (
                <p className="text-muted-foreground">Output will appear here</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
