"use client";
import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, Copy, RotateCcw, FileText, Eye } from "lucide-react";
import { toast } from "sonner";
import { marked } from "marked";

export default function Client() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [preview, setPreview] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!input.trim()) { setOutput(""); return; }
    const r = marked.parse(input);
    if (typeof r === "string") setOutput(r);
    else r.then(setOutput);
  }, [input]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setInput(ev.target?.result as string); toast.success(`${file.name} loaded`); };
    reader.readAsText(file);
  };

  const download = (content: string, name: string, type: string) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement("a"); a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  };

  return (
    <ToolLayout toolId="markdown-to-html">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Markdown Input
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-1" /> Upload
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => download(input, "document.md", "text/markdown")}>
                    <Download className="h-4 w-4 mr-1" /> .md
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input ref={fileRef} type="file" accept=".md,.markdown,text/markdown" onChange={handleFile} className="hidden" />
              <Textarea placeholder="Write markdown here..." value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[400px] font-mono text-sm" />
              <Button variant="outline" onClick={() => setInput("")} className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" /> Clear
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  Output
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <Switch checked={preview} onCheckedChange={setPreview} id="preview-toggle" />
                    <Label htmlFor="preview-toggle" className="text-sm font-normal">{preview ? "Preview" : "HTML"}</Label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(output); toast.success("HTML copied"); }}>
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => download(output, "document.html", "text/html")}>
                    <Download className="h-4 w-4 mr-1" /> .html
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {preview ? (
                <div className="prose dark:prose-invert max-w-none text-sm min-h-[400px] border rounded-md p-4 overflow-auto"
                  dangerouslySetInnerHTML={{ __html: output }} />
              ) : (
                <pre className="font-mono text-xs p-4 whitespace-pre-wrap border rounded-md min-h-[400px] overflow-auto bg-muted/50">{output}</pre>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
