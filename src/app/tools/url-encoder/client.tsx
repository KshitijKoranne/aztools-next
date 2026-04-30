"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy } from "lucide-react";
import { toast } from "sonner";

export default function Client() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => {
    try { setOutput(encodeURIComponent(input)); toast.success("Encoded"); }
    catch { toast.error("Failed to encode"); }
  };
  const decode = () => {
    try { setOutput(decodeURIComponent(input)); toast.success("Decoded"); }
    catch { toast.error("Invalid encoded string"); }
  };

  return (
    <ToolLayout toolId="url-encoder">
      <div className="grid gap-8 max-w-3xl mx-auto">
        <Tabs defaultValue="encode">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>
          <TabsContent value="encode" className="space-y-4 mt-4">
            <Label>Text to Encode</Label>
            <Textarea placeholder="Enter text to encode..." className="min-h-[150px] font-mono" value={input} onChange={(e) => setInput(e.target.value)} />
            <Button onClick={encode} className="w-full">Encode</Button>
          </TabsContent>
          <TabsContent value="decode" className="space-y-4 mt-4">
            <Label>URL to Decode</Label>
            <Textarea placeholder="Enter URL encoded text..." className="min-h-[150px] font-mono" value={input} onChange={(e) => setInput(e.target.value)} />
            <Button onClick={decode} className="w-full">Decode</Button>
          </TabsContent>
        </Tabs>

        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between items-center">
            <Label>Result</Label>
            {output && (
              <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
            )}
          </div>
          <Textarea readOnly value={output} className="min-h-[150px] font-mono" />
        </div>

        <div className="text-sm text-muted-foreground">
          <h3 className="font-medium flex items-center gap-2"><Code className="h-4 w-4" /> About URL Encoding</h3>
          <p className="mt-2">URL encoding converts characters not allowed in URLs into a &quot;%&quot; followed by two hexadecimal digits.</p>
        </div>
      </div>
    </ToolLayout>
  );
}
