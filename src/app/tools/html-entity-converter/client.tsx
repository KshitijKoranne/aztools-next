"use client";

import { useState } from "react";
import { Code, Copy, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const namedEntities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function encodeHtml(input: string, encodeAll: boolean) {
  if (!encodeAll) {
    return input.replace(/[&<>"']/g, (char) => namedEntities[char] ?? char);
  }
  return Array.from(input)
    .map((char) => {
      if (char === "\n" || char === "\t" || char === " ") return char;
      const code = char.codePointAt(0);
      return code ? `&#${code};` : char;
    })
    .join("");
}

function decodeHtml(input: string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = input;
  return textarea.value;
}

export default function Client() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [encodeAll, setEncodeAll] = useState(false);

  function encode() {
    setOutput(encodeHtml(input, encodeAll));
    toast.success("HTML entities encoded.");
  }

  function decode() {
    setOutput(decodeHtml(input));
    toast.success("HTML entities decoded.");
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    toast.success("Copied.");
  }

  return (
    <ToolLayout toolId="html-entity-converter">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              HTML Entity Encoder and Decoder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Tabs defaultValue="encode">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="encode">Encode</TabsTrigger>
                <TabsTrigger value="decode">Decode</TabsTrigger>
              </TabsList>
              <TabsContent value="encode" className="mt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox id="encode-all" checked={encodeAll} onCheckedChange={(value) => setEncodeAll(Boolean(value))} />
                  <Label htmlFor="encode-all">Encode every visible character as a numeric entity</Label>
                </div>
                <Button onClick={encode}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Encode HTML
                </Button>
              </TabsContent>
              <TabsContent value="decode" className="mt-4">
                <Button onClick={decode}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Decode HTML
                </Button>
              </TabsContent>
            </Tabs>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Input</Label>
                <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-72 font-mono text-sm" placeholder={"Paste HTML, text, or entities like &lt;div&gt; here."} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label>Output</Label>
                  <Button variant="ghost" size="sm" onClick={copy} disabled={!output}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
                <Textarea readOnly value={output} className="min-h-72 font-mono text-sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
