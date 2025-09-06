'use client'

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Copy, FileText, ArrowDownToLine } from "lucide-react";

// Function to find differences between two texts
const findDiff = (text1: string, text2: string): {
  added: string[];
  removed: string[];
  unchanged: string[];
} => {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  
  const added: string[] = [];
  const removed: string[] = [];
  const unchanged: string[] = [];
  
  // Simple diff algorithm
  const maxLines = Math.max(lines1.length, lines2.length);
  
  for (let i = 0; i < maxLines; i++) {
    const line1 = i < lines1.length ? lines1[i] : null;
    const line2 = i < lines2.length ? lines2[i] : null;
    
    if (line1 === null) {
      added.push(line2!);
    } else if (line2 === null) {
      removed.push(line1);
    } else if (line1 === line2) {
      unchanged.push(line1);
    } else {
      removed.push(line1);
      added.push(line2);
    }
  }
  
  return { added, removed, unchanged };
};

export function TextDiffClient() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState<{
    added: string[];
    removed: string[];
    unchanged: string[];
  } | null>(null);
  
  const handleCompare = () => {
    const result = findDiff(text1, text2);
    setDiffResult(result);
    
    toast.success(
      `Found ${result.added.length} additions and ${result.removed.length} removals.`,
      { description: "Comparison Complete" }
    );
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard");
  };
  
  const downloadDiff = () => {
    if (!diffResult) return;
    
    const content = [
      "=== DIFF RESULT ===",
      "",
      "=== ADDED ===",
      ...diffResult.added,
      "",
      "=== REMOVED ===",
      ...diffResult.removed,
      "",
      "=== UNCHANGED ===",
      ...diffResult.unchanged
    ].join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-diff-result.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Diff result has been downloaded");
  };
  
  return (
    <ToolLayout toolId="text-diff" categoryId="text-utilities">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Original Text</h3>
            <Textarea
              placeholder="Paste your original text here..."
              className="min-h-[200px] font-mono text-sm"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Modified Text</h3>
            <Textarea
              placeholder="Paste your modified text here..."
              className="min-h-[200px] font-mono text-sm"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-center mb-6">
          <Button 
            onClick={handleCompare} 
            disabled={!text1.trim() || !text2.trim()}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Compare Texts
          </Button>
        </div>
        
        {diffResult && (
          <Card className="p-4">
            <div className="flex justify-between mb-4">
              <h3 className="font-medium">Comparison Results</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => copyToClipboard([
                    ...diffResult.added.map(line => `+ ${line}`),
                    ...diffResult.removed.map(line => `- ${line}`),
                    ...diffResult.unchanged.map(line => `  ${line}`)
                  ].join('\n'))}
                >
                  <Copy className="h-3 w-3" />
                  Copy All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={downloadDiff}
                >
                  <ArrowDownToLine className="h-3 w-3" />
                  Download
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Changes</TabsTrigger>
                <TabsTrigger value="added">Added ({diffResult.added.length})</TabsTrigger>
                <TabsTrigger value="removed">Removed ({diffResult.removed.length})</TabsTrigger>
                <TabsTrigger value="unchanged">Unchanged ({diffResult.unchanged.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="border rounded-md p-2">
                <div className="h-[300px] overflow-y-auto space-y-1">
                  {[
                    ...diffResult.added.map((line, i) => (
                      <div key={`added-${i}`} className="bg-green-500/10 text-green-700 dark:text-green-400 py-0.5 pl-2 border-l-2 border-green-500 font-mono text-xs">
                        + {line}
                      </div>
                    )),
                    ...diffResult.removed.map((line, i) => (
                      <div key={`removed-${i}`} className="bg-red-500/10 text-red-700 dark:text-red-400 py-0.5 pl-2 border-l-2 border-red-500 font-mono text-xs">
                        - {line}
                      </div>
                    )),
                    ...diffResult.unchanged.map((line, i) => (
                      <div key={`unchanged-${i}`} className="py-0.5 pl-2 border-l-2 border-transparent font-mono text-xs">
                        {line}
                      </div>
                    ))
                  ]}
                </div>
              </TabsContent>
              
              <TabsContent value="added" className="border rounded-md p-2">
                <pre className="whitespace-pre-wrap text-xs font-mono h-[300px] overflow-y-auto">
                  {diffResult.added.map((line, i) => (
                    <div key={i} className="bg-green-500/10 text-green-700 dark:text-green-400 py-0.5 pl-2 border-l-2 border-green-500">
                      + {line}
                    </div>
                  ))}
                </pre>
              </TabsContent>
              
              <TabsContent value="removed" className="border rounded-md p-2">
                <pre className="whitespace-pre-wrap text-xs font-mono h-[300px] overflow-y-auto">
                  {diffResult.removed.map((line, i) => (
                    <div key={i} className="bg-red-500/10 text-red-700 dark:text-red-400 py-0.5 pl-2 border-l-2 border-red-500">
                      - {line}
                    </div>
                  ))}
                </pre>
              </TabsContent>
              
              <TabsContent value="unchanged" className="border rounded-md p-2">
                <pre className="whitespace-pre-wrap text-xs font-mono h-[300px] overflow-y-auto">
                  {diffResult.unchanged.map((line, i) => (
                    <div key={i} className="py-0.5 pl-2">
                      {line}
                    </div>
                  ))}
                </pre>
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}