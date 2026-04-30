"use client";
import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hash, Copy } from "lucide-react";
import { toast } from "sonner";

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

async function hashText(text: string, algo: string): Promise<string> {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function Client() {
  const [input, setInput] = useState("");
  const [algo, setAlgo] = useState("SHA-256");
  const [output, setOutput] = useState("");
  const [inputType, setInputType] = useState<"text"|"file">("text");

  useEffect(() => {
    if (input && inputType === "text") {
      hashText(input, algo).then(setOutput);
    }
  }, [input, algo, inputType]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setInput(ev.target?.result as string);
      hashText(ev.target?.result as string, algo).then(h => { setOutput(h); toast.success("Hash generated"); });
    };
    reader.readAsText(file);
  };

  return (
    <ToolLayout toolId="hash-generator">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Hash className="h-5 w-5" /> Hash Generator</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="text" onValueChange={(v) => { setInputType(v as "text"|"file"); setInput(""); setOutput(""); }}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">Text Input</TabsTrigger>
                <TabsTrigger value="file">File Input</TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="space-y-2 mt-4">
                <Label>Enter Text</Label>
                <Textarea placeholder="Type or paste text to hash..." className="min-h-[150px]" value={input} onChange={(e) => setInput(e.target.value)} />
              </TabsContent>
              <TabsContent value="file" className="space-y-2 mt-4">
                <Label>Upload File</Label>
                <Input type="file" onChange={handleFile} />
                <p className="text-xs text-muted-foreground">Text files only, under 5MB.</p>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label>Algorithm</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {ALGOS.map((a) => (
                  <Button key={a} variant={algo === a ? "default" : "outline"} onClick={() => setAlgo(a)}>{a}</Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{algo} Hash</Label>
                {output && (
                  <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                )}
              </div>
              <Textarea readOnly value={output} className="font-mono text-sm min-h-[80px] bg-muted/50" placeholder="Hash will appear here..." />
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
