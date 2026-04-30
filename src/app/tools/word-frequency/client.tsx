"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
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

interface WordData { word: string; count: number; percentage: number; }

const STOP_WORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by",
  "is","are","was","were","be","been","have","has","had","do","does","did",
  "will","would","could","should","may","might","must","shall","can","this",
  "that","these","those","i","you","he","she","it","we","they","me","him",
  "her","us","them","my","your","his","its","our","their","am","so","as",
  "if","when","where","why","how","all","any","both","each","few","more",
  "most","other","some","such","no","nor","not","only","own","same","than",
  "too","very","just","now","here","there","then","from","up","out","down",
  "off","over","under","again","further","once","during","before","after",
]);

const SAMPLE = `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.\n\nIn the world of typography and design, pangrams are incredibly useful for testing fonts and layouts. They provide a comprehensive view of how different characters appear together.\n\nThe phrase has been a standard in the printing and typing industry for decades. Modern digital typography has created new uses for pangrams in web design, app development, and user interface testing.`;

export default function WordFrequencyClient() {
  const [text, setText] = useState("");
  const [wordFreq, setWordFreq] = useState<WordData[]>([]);
  const [minLength, setMinLength] = useState(3);
  const [maxResults, setMaxResults] = useState(50);
  const [excludeCommon, setExcludeCommon] = useState(true);
  const [totalWords, setTotalWords] = useState(0);
  const [uniqueWords, setUniqueWords] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeFrequency = () => {
    if (!text.trim()) { toast.error("Please enter some text to analyze"); return; }

    const allWords = text.toLowerCase().replace(/[^\w\s'-]/g, " ").split(/\s+/).filter((w) => w.length > 0);
    const filtered = allWords.filter((w) => {
      if (w.length < minLength) return false;
      if (excludeCommon && STOP_WORDS.has(w)) return false;
      if (/^\d+$/.test(w) && parseInt(w) < 100) return false;
      return true;
    });

    const freq: Record<string, number> = {};
    filtered.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });

    const sorted = Object.entries(freq)
      .map(([word, count]) => ({ word, count, percentage: filtered.length > 0 ? (count / filtered.length) * 100 : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, maxResults);

    setWordFreq(sorted);
    setTotalWords(allWords.length);
    setUniqueWords(Object.keys(freq).length);
    toast.success(`Found ${Object.keys(freq).length} unique words`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("text/") && !file.name.match(/\.(txt|md|markdown)$/i)) { toast.error("Please select a .txt or .md file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("File must be under 5MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { setText(ev.target?.result as string); toast.success(`${file.name} loaded`); };
    reader.readAsText(file);
  };

  const exportCsv = () => {
    if (wordFreq.length === 0) { toast.error("Analyze some text first"); return; }
    const csv = ["Rank,Word,Count,Percentage", ...wordFreq.map((r, i) => `${i + 1},${r.word},${r.count},${r.percentage.toFixed(2)}%`)].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "word-frequency.csv";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Exported as CSV");
  };

  const clearAll = () => { setText(""); setWordFreq([]); setTotalWords(0); setUniqueWords(0); };

  return (
    <ToolLayout toolId="word-frequency">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Word Frequency Analyzer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Label>Text Input</Label>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4 mr-1" /> Upload</Button>
                <Button size="sm" variant="outline" onClick={() => { setText(SAMPLE); toast.success("Sample loaded"); }}><FileText className="h-4 w-4 mr-1" /> Sample</Button>
                <Button size="sm" variant="outline" onClick={clearAll}><RotateCcw className="h-4 w-4 mr-1" /> Clear</Button>
              </div>
            </div>
            <Textarea placeholder="Enter or paste your text here..." value={text} onChange={(e) => setText(e.target.value)} className="min-h-[200px] text-sm" />
            <input ref={fileInputRef} type="file" accept=".txt,.md,.markdown,text/*" onChange={handleFileChange} className="hidden" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label>Min Word Length</Label>
                <Input type="number" min="1" max="20" value={minLength} onChange={(e) => setMinLength(parseInt(e.target.value) || 3)} />
              </div>
              <div className="space-y-2">
                <Label>Max Results</Label>
                <Input type="number" min="10" max="200" value={maxResults} onChange={(e) => setMaxResults(parseInt(e.target.value) || 50)} />
              </div>
              <div className="space-y-2">
                <Label>Filter Stop Words</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="exclude-common" checked={excludeCommon} onCheckedChange={(v) => setExcludeCommon(v === true)} />
                  <Label htmlFor="exclude-common" className="font-normal">Exclude common words</Label>
                </div>
              </div>
              <div className="flex items-end">
                <Button onClick={analyzeFrequency} className="w-full"><Search className="h-4 w-4 mr-2" /> Analyze</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {wordFreq.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalWords.toLocaleString()}</div><div className="text-sm text-muted-foreground">Total Words</div></CardContent></Card>
              <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-green-600 dark:text-green-400">{uniqueWords.toLocaleString()}</div><div className="text-sm text-muted-foreground">Unique Words</div></CardContent></Card>
              <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{wordFreq.length}</div><div className="text-sm text-muted-foreground">Shown</div></CardContent></Card>
              <Card><CardContent className="pt-6 text-center"><Button size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-1" /> Export CSV</Button></CardContent></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Word Frequency Results</span>
                    <Badge variant="secondary">{wordFreq.length} words</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {wordFreq.map(({ word, count, percentage }, i) => (
                      <div key={word} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="min-w-[3rem] justify-center">#{i + 1}</Badge>
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

              <Card>
                <CardHeader><CardTitle>Top Words Distribution</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {wordFreq.slice(0, 15).map(({ word, count, percentage }) => (
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
          </>
        )}

        {wordFreq.length === 0 && !text.trim() && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enter or upload text to analyze word frequency.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
