"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileCode, Copy } from "lucide-react";
import { toast } from "sonner";

function minify(code: string, lang: string): string {
  if (lang === "javascript" || lang === "css") {
    return code
      .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}():;,])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();
  }
  if (lang === "html") {
    return code
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
  }
  return code;
}

export default function Client() {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("javascript");
  const [minified, setMinified] = useState("");

  const doMinify = () => {
    if (!code.trim()) { toast.error("Please enter code to minify"); return; }
    try {
      const result = minify(code, lang);
      setMinified(result);
      const savings = ((1 - result.length / code.length) * 100).toFixed(1);
      toast.success(`Size reduced by ${savings}%`);
    } catch {
      toast.error("Failed to minify code");
    }
  };

  return (
    <ToolLayout toolId="code-minifier">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileCode className="h-5 w-5" /> Code Input</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder={`Enter ${lang.toUpperCase()} code...`} value={code} onChange={(e) => setCode(e.target.value)} className="min-h-[300px] font-mono text-sm" />
            <Button onClick={doMinify} className="w-full">Minify Code</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Minified Code
              {minified && (
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(minified); toast.success("Copied"); }}>
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {minified ? (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap break-all"><code>{minified}</code></pre>
            ) : (
              <p className="text-muted-foreground">Minified code will appear here</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
