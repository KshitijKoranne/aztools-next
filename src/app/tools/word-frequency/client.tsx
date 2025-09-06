'use client'

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Upload, RotateCcw, BarChart3, Download, FileText } from "lucide-react";
import { toast } from "sonner";

interface WordData {
  word: string;
  count: number;
  percentage: number;
}

export function WordFrequencyClient() {
  const [text, setText] = useState("");
  const [wordFreq, setWordFreq] = useState<WordData[]>([]);
  const [minLength, setMinLength] = useState(3);
  const [maxResults, setMaxResults] = useState(50);
  const [excludeCommon, setExcludeCommon] = useState(true);
  const [totalWords, setTotalWords] = useState(0);
  const [uniqueWords, setUniqueWords] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common stop words to exclude
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this',
    'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
    'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'am', 'so', 'as',
    'if', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'than',
    'too', 'very', 'just', 'now', 'here', 'there', 'then', 'from', 'up', 'out', 'down',
    'off', 'over', 'under', 'again', 'further', 'once', 'during', 'before', 'after'
  ]);

  const analyzeFrequency = () => {
    if (!text.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }
    
    // Clean and process text
    const cleanedText = text
      .toLowerCase()
      .replace(/[^\w\s'-]/g, ' ')  // Keep apostrophes and hyphens
      .replace(/\s+/g, ' ')
      .trim();
    
    const allWords = cleanedText.split(/\s+/).filter(word => word.length > 0);
    const filteredWords = allWords.filter(word => {
      if (word.length < minLength) return false;
      if (excludeCommon && stopWords.has(word.toLowerCase())) return false;
      // Filter out purely numeric strings if they're common
      if (/^\d+$/.test(word) && parseInt(word) < 100) return false;
      return true;
    });
    
    // Count frequencies
    const frequency: Record<string, number> = {};
    filteredWords.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    // Calculate percentages and sort
    const totalFilteredWords = filteredWords.length;
    const sorted = Object.entries(frequency)
      .map(([word, count]) => ({
        word,
        count,
        percentage: totalFilteredWords > 0 ? (count / totalFilteredWords) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, maxResults);
    
    setWordFreq(sorted);
    setTotalWords(allWords.length);
    setUniqueWords(Object.keys(frequency).length);
    
    toast.success(`Analysis complete - Found ${Object.keys(frequency).length} unique words`);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('text/') && !file.name.match(/\.(txt|md|markdown)$/i)) {
      toast.error("Please select a text file (.txt, .md, .markdown)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please select a file smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
      toast.success(`${file.name} loaded successfully`);
    };
    reader.readAsText(file);
  };

  const exportResults = () => {
    if (wordFreq.length === 0) {
      toast.error("Please analyze some text first");
      return;
    }

    const csvContent = [
      "Rank,Word,Count,Percentage",
      ...wordFreq.map((item, index) => 
        `${index + 1},${item.word},${item.count},${item.percentage.toFixed(2)}%`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'word-frequency-analysis.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Word frequency data exported as CSV");
  };

  const clearAll = () => {
    setText("");
    setWordFreq([]);
    setTotalWords(0);
    setUniqueWords(0);
    toast.success("All data cleared");
  };

  const loadSample = () => {
    const sampleText = `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. 

    In the world of typography and design, pangrams are incredibly useful for testing fonts and layouts. They provide a comprehensive view of how different characters appear together.

    The phrase "The quick brown fox jumps over the lazy dog" has been a standard in the printing and typing industry for decades. It's concise, memorable, and effective for demonstrating the full range of letterforms.

    Other famous pangrams include "Pack my box with five dozen liquor jugs" and "Waltz, bad nymph, for quick jigs vex." Each serves the same purpose but with different word choices and character distributions.

    Modern digital typography has created new uses for pangrams in web design, app development, and user interface testing. They help designers ensure that text renders correctly across different devices and screen sizes.`;
    
    setText(sampleText);
    toast.success("Sample text loaded for analysis");
  };

  return (
    <ToolLayout toolId="word-frequency" categoryId="text-utilities">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Word Frequency Analyzer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Label htmlFor="text-input">Text Input</Label>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={handleFileUpload}>
                    <Upload className="h-4 w-4 mr-1" />
                    Upload File
                  </Button>
                  <Button size="sm" variant="outline" onClick={loadSample}>
                    <FileText className="h-4 w-4 mr-1" />
                    Load Sample
                  </Button>
                  <Button size="sm" variant="outline" onClick={clearAll}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
              
              <Textarea
                id="text-input"
                placeholder="Enter or paste your text here to analyze word frequency..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] text-sm"
              />
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.markdown,text/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Analysis Options */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="min-length">Min Word Length</Label>
                <Input
                  id="min-length"
                  type="number"
                  min="1"
                  max="20"
                  value={minLength}
                  onChange={(e) => setMinLength(parseInt(e.target.value) || 3)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-results">Max Results</Label>
                <Input
                  id="max-results"
                  type="number"
                  min="10"
                  max="200"
                  value={maxResults}
                  onChange={(e) => setMaxResults(parseInt(e.target.value) || 50)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exclude-common">Exclude Common Words</Label>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="exclude-common"
                    checked={excludeCommon}
                    onCheckedChange={setExcludeCommon}
                  />
                  <span className="text-sm">Filter stop words</span>
                </div>
              </div>
              
              <div className="flex items-end">
                <Button onClick={analyzeFrequency} className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Analyze
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Overview */}
        {wordFreq.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalWords.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Words</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{uniqueWords.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Unique Words</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{wordFreq.length}</div>
                  <div className="text-sm text-muted-foreground">Analyzed</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Button size="sm" onClick={exportResults}>
                    <Download className="h-4 w-4 mr-1" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Section */}
        {wordFreq.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Word List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Word Frequency Results</span>
                  <Badge variant="secondary">{wordFreq.length} words</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {wordFreq.map(({ word, count, percentage }, index) => (
                    <div key={word} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="min-w-[3rem] justify-center">
                          #{index + 1}
                        </Badge>
                        <span className="font-medium">{word}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{count}</div>
                        <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Visual Representation */}
            <Card>
              <CardHeader>
                <CardTitle>Top Words Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {wordFreq.slice(0, 15).map(({ word, count, percentage }, index) => (
                    <div key={word} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{word}</span>
                        <span>{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Results State */}
        {wordFreq.length === 0 && text.trim() === "" && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Word Frequency Analyzer</h3>
                <p>Enter or upload text to analyze word frequency and discover the most common words in your content.</p>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </ToolLayout>
  );
}