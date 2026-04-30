"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format as sqlFormat } from "sql-formatter";

function beautify(code: string, lang: string): string {
  switch (lang) {
    case "json": return JSON.stringify(JSON.parse(code), null, 2);
    case "sql": return sqlFormat(code, { language: "sql", keywordCase: "upper", linesBetweenQueries: 2 });
    case "javascript":
      return code.replace(/;/g, ';\n').replace(/{/g, '{\n').replace(/}/g, '\n}')
        .replace(/\n\s*\n/g, '\n').split('\n').map(l => l.trim()).join('\n');
    case "html":
      return code.replace(/>/g, '>\n').replace(/</g, '\n<')
        .replace(/\n\s*\n/g, '\n').split('\n').map(l => l.trim()).filter(Boolean).join('\n');
    default: return code;
  }
}

export default function Client() {
  const [code, setCode] = useState("");
  const [formatted, setFormatted] = useState("");
  const [lang, setLang] = useState("json");

  const format = () => {
    if (!code.trim()) { toast.error("Please enter code to format"); return; }
    try {
      setFormatted(beautify(code, lang));
      toast.success("Code formatted");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <ToolLayout toolId="code-beautifier">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Code Input</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="sql">SQL</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder={`Enter ${lang.toUpperCase()} code...`} value={code} onChange={(e) => setCode(e.target.value)} className="min-h-[300px] font-mono text-sm" />
            <div className="flex gap-4">
              <Button onClick={format} className="flex-1">Format Code</Button>
              <Button variant="outline" onClick={() => { setCode(""); setFormatted(""); }}><RefreshCw className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Formatted Code
              {formatted && (
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(formatted); toast.success("Copied"); }}>
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formatted ? (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code>{formatted}</code></pre>
            ) : (
              <p className="text-muted-foreground">Formatted code will appear here</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
