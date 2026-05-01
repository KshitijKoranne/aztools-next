"use client";

import { useMemo, useRef, useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, RotateCcw, BarChart3, Clock, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  averageWordsPerSentence: number;
  averageSentencesPerParagraph: number;
  readingTime: number;
  speakingTime: number;
  longestWord: string;
  shortestWord: string;
  averageWordLength: number;
  mostCommonWords: Array<{ word: string; count: number }>;
  readabilityScore: number;
  readabilityGrade: string;
}

const STOP_WORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by",
  "is","are","was","were","be","been","have","has","had","do","does","did",
  "will","would","could","should","may","might","must","shall","can","this",
  "that","these","those","i","you","he","she","it","we","they","me","him",
  "her","us","them",
]);

function calcStats(text: string): TextStats {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const lines = text.split("\n").length;
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const paragraphCount = Math.max(paragraphs.length, 1);
  const avgWordsPerSentence = sentences.length > 0 ? Math.round((wordCount / sentences.length) * 10) / 10 : 0;
  const avgSentencesPerParagraph = Math.round((sentences.length / paragraphCount) * 10) / 10;
  const readingTime = Math.max(1, Math.round(wordCount / 200));
  const speakingTime = Math.max(1, Math.round(wordCount / 150));

  const cleanWords = words.map((w) => w.toLowerCase().replace(/[^\w]/g, "")).filter((w) => w.length > 0);
  const avgWordLen = cleanWords.length > 0
    ? Math.round((cleanWords.reduce((s, w) => s + w.length, 0) / cleanWords.length) * 10) / 10
    : 0;
  const longestWord = cleanWords.reduce((a, b) => (b.length > a.length ? b : a), "");
  const shortestWord = cleanWords.reduce((a, b) => (b.length < a.length ? b : a), cleanWords[0] ?? "");

  const freq: Record<string, number> = {};
  cleanWords.forEach((w) => {
    if (w.length > 2 && !STOP_WORDS.has(w)) freq[w] = (freq[w] || 0) + 1;
  });
  const mostCommonWords = Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  const readabilityScore = Math.max(
    0,
    Math.min(100, Math.round(206.835 - 1.015 * avgWordsPerSentence - 84.6 * (avgWordLen * 0.5)))
  );
  let readabilityGrade = "Very Difficult";
  if (readabilityScore >= 90) readabilityGrade = "Very Easy";
  else if (readabilityScore >= 80) readabilityGrade = "Easy";
  else if (readabilityScore >= 70) readabilityGrade = "Fairly Easy";
  else if (readabilityScore >= 60) readabilityGrade = "Standard";
  else if (readabilityScore >= 50) readabilityGrade = "Fairly Difficult";
  else if (readabilityScore >= 30) readabilityGrade = "Difficult";

  return {
    characters, charactersNoSpaces, words: wordCount, sentences: sentences.length,
    paragraphs: paragraphCount, lines, averageWordsPerSentence: avgWordsPerSentence,
    averageSentencesPerParagraph: avgSentencesPerParagraph, readingTime, speakingTime,
    longestWord, shortestWord, averageWordLength: avgWordLen, mostCommonWords,
    readabilityScore, readabilityGrade,
  };
}

function readabilityColor(score: number) {
  if (score >= 70) return "text-green-600 dark:text-green-400";
  if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

const SAMPLE = `The quick brown fox jumps over the lazy dog. This is a sample text to demonstrate the text statistics analyzer.\n\nIt can count words, characters, sentences, and paragraphs. The tool also calculates reading time, speaking time, and readability scores.\n\nThis analyzer provides comprehensive insights into your text content, making it perfect for writers, students, and content creators.`;

export default function TextStatisticsClient() {
  const [inputText, setInputText] = useState("");
  const stats = useMemo(() => inputText.trim() ? calcStats(inputText) : null, [inputText]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("text/") && !file.name.match(/\.(txt|md|markdown)$/i)) {
      toast.error("Please select a text file (.txt, .md, .markdown)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { toast.error("File must be under 5MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setInputText(ev.target?.result as string);
      toast.success(`${file.name} loaded`);
    };
    reader.readAsText(file);
  };

  const fmt = (n: number) => n.toLocaleString();

  return (
    <ToolLayout toolId="text-statistics">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Text Statistics Analyzer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Label htmlFor="text-input">Text Input</Label>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-1" /> Upload
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setInputText(SAMPLE); toast.success("Sample loaded"); }}>
                  <BookOpen className="h-4 w-4 mr-1" /> Sample
                </Button>
                <Button size="sm" variant="outline" onClick={() => setInputText("")}>
                  <RotateCcw className="h-4 w-4 mr-1" /> Clear
                </Button>
              </div>
            </div>
            <Textarea
              id="text-input"
              placeholder="Enter or paste your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[300px] text-sm"
            />
            <input ref={fileInputRef} type="file" accept=".txt,.md,.markdown,text/*" onChange={handleFileChange} className="hidden" />
          </CardContent>
        </Card>

        {stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Words", value: fmt(stats.words), color: "text-blue-600 dark:text-blue-400" },
                { label: "Characters", value: fmt(stats.characters), color: "text-green-600 dark:text-green-400" },
                { label: "Sentences", value: fmt(stats.sentences), color: "text-purple-600 dark:text-purple-400" },
                { label: "Paragraphs", value: fmt(stats.paragraphs), color: "text-orange-600 dark:text-orange-400" },
              ].map(({ label, value, color }) => (
                <Card key={label}>
                  <CardContent className="pt-6 text-center">
                    <div className={`text-2xl font-bold ${color}`}>{value}</div>
                    <div className="text-sm text-muted-foreground">{label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-lg">Detailed Counts</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    ["Characters (with spaces)", fmt(stats.characters)],
                    ["Characters (no spaces)", fmt(stats.charactersNoSpaces)],
                    ["Lines", fmt(stats.lines)],
                    ["Avg words per sentence", stats.averageWordsPerSentence],
                    ["Avg sentences per paragraph", stats.averageSentencesPerParagraph],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span>{k}:</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Reading &amp; Speaking Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1"><span>Reading time:</span><span className="font-medium">{stats.readingTime} min</span></div>
                    <div className="text-xs text-muted-foreground">@ 200 words per minute</div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><span>Speaking time:</span><span className="font-medium">{stats.speakingTime} min</span></div>
                    <div className="text-xs text-muted-foreground">@ 150 words per minute</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Word Analysis</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    ["Average word length", `${stats.averageWordLength} characters`],
                    ["Longest word", stats.longestWord],
                    ["Shortest word", stats.shortestWord],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span>{k}:</span>
                      <span className="font-medium font-mono text-sm">{v}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Readability</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Readability Score:</span>
                      <span className={`font-bold ${readabilityColor(stats.readabilityScore)}`}>
                        {stats.readabilityScore}/100
                      </span>
                    </div>
                    <Progress value={stats.readabilityScore} className="h-2" />
                  </div>
                  <div className="flex justify-between">
                    <span>Reading Level:</span>
                    <span className={`font-medium ${readabilityColor(stats.readabilityScore)}`}>
                      {stats.readabilityGrade}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">Based on Flesch Reading Ease formula</div>
                </CardContent>
              </Card>
            </div>

            {stats.mostCommonWords.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-lg">Most Common Words</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {stats.mostCommonWords.map(({ word, count }) => (
                      <div key={word} className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="font-medium text-sm">{word}</div>
                        <div className="text-xs text-muted-foreground">{count} times</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
