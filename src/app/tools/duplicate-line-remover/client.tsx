'use client'

import React, { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, Download, Trash2, FileText, BarChart3, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ProcessingStats {
  originalLines: number;
  uniqueLines: number;
  duplicatesRemoved: number;
  emptyLinesRemoved: number;
}

export function DuplicateLineRemoverClient() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [stats, setStats] = useState<ProcessingStats | null>(null);
  const [preserveEmpty, setPreserveEmpty] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [preserveOrder, setPreserveOrder] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const processText = useCallback(() => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to remove duplicates.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const lines = inputText.split('\n');
      const originalCount = lines.length;
      let processedLines: string[] = [];
      let emptyRemoved = 0;
      
      if (preserveOrder) {
        // Use Set to track seen lines while preserving order
        const seen = new Set<string>();
        
        processedLines = lines.filter(line => {
          // Handle empty lines
          if (line.trim() === '') {
            if (preserveEmpty) {
              return true;
            } else {
              emptyRemoved++;
              return false;
            }
          }
          
          // Handle duplicate detection
          const compareKey = caseSensitive ? line : line.toLowerCase();
          if (seen.has(compareKey)) {
            return false; // This is a duplicate
          }
          
          seen.add(compareKey);
          return true;
        });
      } else {
        // Sort lines alphabetically and then remove duplicates
        let linesToProcess = lines.filter(line => {
          if (line.trim() === '') {
            if (preserveEmpty) {
              return true;
            } else {
              emptyRemoved++;
              return false;
            }
          }
          return true;
        });
        
        // Sort lines
        linesToProcess.sort((a, b) => {
          const aCompare = caseSensitive ? a : a.toLowerCase();
          const bCompare = caseSensitive ? b : b.toLowerCase();
          return aCompare.localeCompare(bCompare);
        });
        
        // Remove duplicates from sorted array
        const seen = new Set<string>();
        processedLines = linesToProcess.filter(line => {
          const compareKey = caseSensitive ? line : line.toLowerCase();
          if (seen.has(compareKey)) {
            return false;
          }
          seen.add(compareKey);
          return true;
        });
      }

      const result = processedLines.join('\n');
      const duplicatesRemoved = originalCount - processedLines.length - emptyRemoved;
      
      setOutputText(result);
      setStats({
        originalLines: originalCount,
        uniqueLines: processedLines.length,
        duplicatesRemoved,
        emptyLinesRemoved: emptyRemoved
      });
      
      setIsProcessing(false);
      
      toast.success(`Removed ${duplicatesRemoved} duplicate lines${emptyRemoved > 0 ? ` and ${emptyRemoved} empty lines` : ''}.`);
    }, 100);
  }, [inputText, preserveEmpty, caseSensitive, preserveOrder]);

  const copyToClipboard = () => {
    if (!outputText) return;
    
    navigator.clipboard.writeText(outputText).then(() => {
      toast.success("Processed text copied to clipboard.");
    }).catch(() => {
      toast.error("Failed to copy text to clipboard.");
    });
  };

  const downloadText = () => {
    if (!outputText) return;
    
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'processed-text.txt';
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success("Processed text saved as file.");
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setStats(null);
  };

  const loadSampleText = () => {
    const sample = `apple
banana
apple
cherry
banana
date
apple
elderberry
fig
banana
grape
apple
cherry
date

elderberry
fig
grape`;
    setInputText(sample);
  };

  return (
    <ToolLayout toolId="duplicate-line-remover" categoryId="text-utilities">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Input Text
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="input-text">Enter text with duplicate lines</Label>
                <Textarea
                  id="input-text"
                  placeholder="Paste your text here, each line will be processed separately..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[300px] mt-2 font-mono text-sm"
                />
                <div className="text-xs text-muted-foreground mt-2">
                  Lines: {inputText ? inputText.split('\n').length : 0} | 
                  Characters: {inputText.length}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={processText} 
                  disabled={!inputText.trim() || isProcessing}
                  className="flex-1 min-w-[140px]"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Duplicates
                    </>
                  )}
                </Button>
                
                <Button onClick={loadSampleText} variant="outline">
                  Load Sample
                </Button>
                
                <Button onClick={clearAll} variant="outline">
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Processing Options */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="case-sensitive"
                  checked={caseSensitive}
                  onCheckedChange={setCaseSensitive}
                />
                <Label htmlFor="case-sensitive">Case sensitive comparison</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="preserve-order"
                  checked={preserveOrder}
                  onCheckedChange={setPreserveOrder}
                />
                <Label htmlFor="preserve-order">Preserve original order</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="preserve-empty"
                  checked={preserveEmpty}
                  onCheckedChange={setPreserveEmpty}
                />
                <Label htmlFor="preserve-empty">Keep empty lines</Label>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Case sensitive:</strong> "Apple" and "apple" are different</p>
                <p><strong>Preserve order:</strong> Keep first occurrence position</p>
                <p><strong>Keep empty:</strong> Preserve blank lines in output</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Processed Text
                </span>
                {outputText && (
                  <div className="flex gap-2">
                    <Button onClick={copyToClipboard} size="sm" variant="outline">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button onClick={downloadText} size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {outputText ? (
                <div>
                  <Textarea
                    value={outputText}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <div className="text-xs text-muted-foreground mt-2">
                    Lines: {outputText.split('\n').length} | 
                    Characters: {outputText.length}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-muted-foreground">
                  <Trash2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Processed text will appear here after removing duplicates</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Processing Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.originalLines}</div>
                    <div className="text-sm text-muted-foreground">Original Lines</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.uniqueLines}</div>
                    <div className="text-sm text-muted-foreground">Unique Lines</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.duplicatesRemoved}</div>
                    <div className="text-sm text-muted-foreground">Duplicates Removed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.emptyLinesRemoved}</div>
                    <div className="text-sm text-muted-foreground">Empty Lines Removed</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reduction:</span>
                    <Badge variant="outline">
                      {((stats.duplicatesRemoved + stats.emptyLinesRemoved) / stats.originalLines * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Efficiency:</span>
                    <Badge variant="outline">
                      {(stats.uniqueLines / stats.originalLines * 100).toFixed(1)}% retained
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </ToolLayout>
  );
}