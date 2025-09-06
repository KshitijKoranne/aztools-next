'use client'

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function UrlEncoderClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState("encode");

  const handleEncode = () => {
    if (!input.trim()) {
      toast.error("Please enter text to encode");
      return;
    }

    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      toast.success("Text encoded successfully");
    } catch (error) {
      toast.error("Failed to encode text");
    }
  };

  const handleDecode = () => {
    if (!input.trim()) {
      toast.error("Please enter URL encoded text to decode");
      return;
    }

    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      toast.success("URL decoded successfully");
    } catch (error) {
      toast.error("Failed to decode URL. Invalid format.");
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      toast.success("Result copied to clipboard");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  const getStats = () => {
    const inputLength = input.length;
    const outputLength = output.length;
    const compressionRatio = inputLength > 0 ? ((outputLength - inputLength) / inputLength * 100) : 0;
    
    return {
      inputLength,
      outputLength,
      compressionRatio
    };
  };

  const stats = getStats();

  return (
    <ToolLayout toolId="url-encoder" categoryId="developer-tools">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              URL Encoder/Decoder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="encode">Encode</TabsTrigger>
                <TabsTrigger value="decode">Decode</TabsTrigger>
              </TabsList>
              
              <TabsContent value="encode" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="input-text">Text to Encode</Label>
                  <Textarea
                    id="input-text"
                    placeholder="Enter text to URL encode (e.g., Hello World!)"
                    className="min-h-[200px] font-mono text-sm"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
                <Button onClick={handleEncode} className="w-full">
                  Encode Text
                </Button>
              </TabsContent>
              
              <TabsContent value="decode" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="input-url">URL Encoded Text to Decode</Label>
                  <Textarea
                    id="input-url"
                    placeholder="Enter URL encoded text (e.g., Hello%20World%21)"
                    className="min-h-[200px] font-mono text-sm"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
                <Button onClick={handleDecode} className="w-full">
                  Decode URL
                </Button>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-muted-foreground pt-4 border-t">
              <div>
                <div className="font-medium">Input Length</div>
                <div>{stats.inputLength}</div>
              </div>
              <div>
                <div className="font-medium">Output Length</div>
                <div>{stats.outputLength}</div>
              </div>
              <div>
                <div className="font-medium">Size Change</div>
                <div className={stats.compressionRatio > 0 ? "text-orange-500" : "text-green-500"}>
                  {stats.compressionRatio > 0 ? '+' : ''}{stats.compressionRatio.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={clearAll} title="Clear All">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Result
              {output && (
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {output ? (
              <div className="space-y-4">
                <Textarea
                  readOnly
                  value={output}
                  className="min-h-[200px] font-mono text-sm"
                />
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Preview</h4>
                  <p className="text-sm break-all">{output}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                {activeTab === 'encode' ? 'Encoded' : 'Decoded'} result will appear here
              </p>
            )}
          </CardContent>
        </Card>
      </div>

    </ToolLayout>
  );
}