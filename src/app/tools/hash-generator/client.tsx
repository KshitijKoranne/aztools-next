'use client'

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Key, Copy, RefreshCw, Upload, FileText } from "lucide-react";
import { toast } from "sonner";

interface HashResult {
  algorithm: string;
  hash: string;
  length: number;
}

const algorithms = [
  { id: "SHA-1", name: "SHA-1", description: "160-bit hash (deprecated for security)" },
  { id: "SHA-256", name: "SHA-256", description: "256-bit secure hash (recommended)" },
  { id: "SHA-384", name: "SHA-384", description: "384-bit secure hash" },
  { id: "SHA-512", name: "SHA-512", description: "512-bit secure hash" }
];

export function HashGeneratorClient() {
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("SHA-256");
  const [results, setResults] = useState<HashResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputType, setInputType] = useState<"text" | "file">("text");

  const generateHash = async (data: string | ArrayBuffer, algorithm: string): Promise<string> => {
    try {
      let buffer: ArrayBuffer;
      
      if (typeof data === 'string') {
        const encoder = new TextEncoder();
        buffer = encoder.encode(data);
      } else {
        buffer = data;
      }

      const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (error) {
      throw new Error(`Failed to generate ${algorithm} hash: ${(error as Error).message}`);
    }
  };

  const handleGenerateForText = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter text to hash");
      return;
    }

    setIsGenerating(true);
    const newResults: HashResult[] = [];

    try {
      for (const algo of algorithms) {
        const hash = await generateHash(inputText, algo.id);
        newResults.push({
          algorithm: algo.name,
          hash,
          length: hash.length
        });
      }
      
      setResults(newResults);
      toast.success("Hashes generated successfully");
    } catch (error) {
      toast.error(`Error generating hashes: ${(error as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateForFile = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to hash");
      return;
    }

    setIsGenerating(true);
    const newResults: HashResult[] = [];

    try {
      const buffer = await selectedFile.arrayBuffer();
      
      for (const algo of algorithms) {
        const hash = await generateHash(buffer, algo.id);
        newResults.push({
          algorithm: algo.name,
          hash,
          length: hash.length
        });
      }
      
      setResults(newResults);
      toast.success(`File hashes generated for ${selectedFile.name}`);
    } catch (error) {
      toast.error(`Error generating file hashes: ${(error as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResults([]); // Clear previous results
    }
  };

  const handleCopy = (hash: string, algorithm: string) => {
    navigator.clipboard.writeText(hash);
    toast.success(`${algorithm} hash copied to clipboard`);
  };

  const clearAll = () => {
    setInputText("");
    setSelectedFile(null);
    setResults([]);
    // Reset file input
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Auto-generate hashes for text when input changes
  useEffect(() => {
    if (inputText.trim() && inputType === 'text') {
      const timeoutId = setTimeout(() => {
        handleGenerateForText();
      }, 500);

      return () => clearTimeout(timeoutId);
    } else if (inputType === 'text') {
      setResults([]);
    }
  }, [inputText, inputType]);

  return (
    <ToolLayout toolId="hash-generator" categoryId="developer-tools">
      <div className="space-y-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Hash Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={inputType} onValueChange={(value) => setInputType(value as "text" | "file")}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Text Input
                </TabsTrigger>
                <TabsTrigger value="file" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  File Input
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text-input">Text to Hash</Label>
                  <Textarea
                    id="text-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text to generate hash..."
                    className="min-h-[120px] font-mono text-sm"
                  />
                </div>
                <Button 
                  onClick={handleGenerateForText} 
                  disabled={isGenerating || !inputText.trim()}
                  className="w-full"
                >
                  {isGenerating ? "Generating..." : "Generate Hashes"}
                </Button>
              </TabsContent>
              
              <TabsContent value="file" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file-input">Select File</Label>
                  <Input
                    id="file-input"
                    type="file"
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />
                  {selectedFile && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">{selectedFile.name}</span>
                        <Badge variant="secondary">{formatFileSize(selectedFile.size)}</Badge>
                      </div>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={handleGenerateForFile} 
                  disabled={isGenerating || !selectedFile}
                  className="w-full"
                >
                  {isGenerating ? "Generating..." : "Generate File Hashes"}
                </Button>
              </TabsContent>
            </Tabs>

            <Button variant="outline" onClick={clearAll} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Hash Results</h3>
              <Badge variant="secondary">{results.length} algorithms</Badge>
            </div>
            
            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-2">
                      <span>{result.algorithm}</span>
                      <Badge variant="outline">{result.length} chars</Badge>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleCopy(result.hash, result.algorithm)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-4 rounded-lg border">
                    <code className="text-sm break-all font-mono">{result.hash}</code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hash Algorithm Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {algorithms.map((algo, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <div className="font-semibold min-w-[100px]">{algo.name}:</div>
                  <div className="text-sm text-muted-foreground">{algo.description}</div>
                  {algo.id === 'SHA-1' && (
                    <Badge variant="destructive" className="text-xs">
                      Deprecated
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 prose prose-sm max-w-none text-muted-foreground">
              <h4 className="font-medium text-foreground mb-2">Use Cases:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>File integrity verification</li>
                <li>Password hashing (with salt)</li>
                <li>Digital signatures</li>
                <li>Data deduplication</li>
                <li>Blockchain and cryptocurrency</li>
              </ul>
              
              <h4 className="font-medium text-foreground mb-2 mt-4">Security Notes:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>SHA-1 is cryptographically broken and should not be used for security purposes</li>
                <li>SHA-256 and above are currently considered secure</li>
                <li>Always use salt when hashing passwords</li>
                <li>Hash functions are one-way - you cannot reverse them to get the original data</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}