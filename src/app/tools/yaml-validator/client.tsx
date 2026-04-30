"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileCode, Copy } from "lucide-react";
import { toast } from "sonner";
import yaml from "js-yaml";

export default function Client() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ valid: boolean; message: string; formatted?: string } | null>(null);

  const validate = () => {
    if (!input.trim()) { toast.error("Please enter YAML content"); return; }
    try {
      const parsed = yaml.load(input);
      const formatted = yaml.dump(parsed);
      setResult({ valid: true, message: "Valid YAML", formatted });
      toast.success("YAML is valid");
    } catch (e) {
      setResult({ valid: false, message: e instanceof Error ? e.message : "Invalid YAML" });
      toast.error("Invalid YAML");
    }
  };

  return (
    <ToolLayout toolId="yaml-validator">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileCode className="h-5 w-5" /> YAML Input</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Textarea placeholder="Paste your YAML here..." value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[300px] font-mono text-sm" />
            <Button onClick={validate} className="w-full">Validate YAML</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Validation Result
              {result?.formatted && (
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(result.formatted!); toast.success("Copied"); }}>
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg text-sm ${result.valid ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-red-500/10 text-red-700 dark:text-red-400"}`}>
                  {result.message}
                </div>
                {result.formatted && (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code>{result.formatted}</code></pre>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Validation result will appear here</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
