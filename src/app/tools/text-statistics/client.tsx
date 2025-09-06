'use client'

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  mostCommonWords: Array<{word: string, count: number}>;
  readabilityScore: number;
  readabilityGrade: string;
}

export function TextStatisticsClient() {
  const [inputText, setInputText] = useState("");
  const [stats, setStats] = useState<TextStats | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleText = `The quick brown fox jumps over the lazy dog. This is a sample text to demonstrate the text statistics analyzer. 

It can count words, characters, sentences, and paragraphs. The tool also calculates reading time, speaking time, and readability scores.

This analyzer provides comprehensive insights into your text content, making it perfect for writers, students, and content creators who need to understand their text statistics.`;

  useEffect(() => {
    if (inputText.trim()) {
      calculateStats();
    } else {
      setStats(null);
    }
  }, [inputText]);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('text/') && !file.name.match(/\.(txt|md|markdown)$/i)) {
      toast.error("Please select a text file (.txt, .md, .markdown)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please select a file smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
      toast.success(`${file.name} loaded successfully`);
    };
    reader.readAsText(file);
  };

  const calculateStats = () => {
    const text = inputText.trim();
    if (!text) return;

    // Basic counts
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const lines = text.split('\n').length;
    
    // Words (split by whitespace and filter empty)
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Sentences (split by sentence endings)
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const sentenceCount = sentences.length;
    
    // Paragraphs (split by double newlines or single newlines for simple counting)
    const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0);
    const paragraphCount = Math.max(paragraphs.length, 1);

    // Advanced calculations
    const averageWordsPerSentence = sentenceCount > 0 ? Math.round((wordCount / sentenceCount) * 10) / 10 : 0;
    const averageSentencesPerParagraph = paragraphCount > 0 ? Math.round((sentenceCount / paragraphCount) * 10) / 10 : 0;
    
    // Reading time (average 200 words per minute)
    const readingTime = Math.max(1, Math.round(wordCount / 200));
    
    // Speaking time (average 150 words per minute)
    const speakingTime = Math.max(1, Math.round(wordCount / 150));

    // Word analysis
    const cleanWords = words.map(word => word.toLowerCase().replace(/[^\w]/g, '')).filter(word => word.length > 0);
    const wordLengths = cleanWords.map(word => word.length);
    const averageWordLength = wordLengths.length > 0 ? Math.round((wordLengths.reduce((a, b) => a + b, 0) / wordLengths.length) * 10) / 10 : 0;
    
    const longestWord = cleanWords.reduce((longest, word) => word.length > longest.length ? word : longest, '');
    const shortestWord = cleanWords.reduce((shortest, word) => word.length < shortest.length ? word : shortest, cleanWords[0] || '');

    // Most common words (excluding common stop words)
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);
    const wordFreq: {[key: string]: number} = {};
    
    cleanWords.forEach(word => {
      if (word.length > 2 && !stopWords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    
    const mostCommonWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({word, count}));

    // Simple readability score (Flesch Reading Ease approximation)
    const avgSentenceLength = averageWordsPerSentence;
    const avgSyllablesPerWord = averageWordLength * 0.5; // Rough approximation
    const readabilityScore = Math.max(0, Math.min(100, Math.round(206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord))));
    
    let readabilityGrade = 'Very Difficult';
    if (readabilityScore >= 90) readabilityGrade = 'Very Easy';
    else if (readabilityScore >= 80) readabilityGrade = 'Easy';
    else if (readabilityScore >= 70) readabilityGrade = 'Fairly Easy';
    else if (readabilityScore >= 60) readabilityGrade = 'Standard';
    else if (readabilityScore >= 50) readabilityGrade = 'Fairly Difficult';
    else if (readabilityScore >= 30) readabilityGrade = 'Difficult';

    setStats({
      characters,
      charactersNoSpaces,
      words: wordCount,
      sentences: sentenceCount,
      paragraphs: paragraphCount,
      lines,
      averageWordsPerSentence,
      averageSentencesPerParagraph,
      readingTime,
      speakingTime,
      longestWord,
      shortestWord,
      averageWordLength,
      mostCommonWords,
      readabilityScore,
      readabilityGrade
    });
  };

  const loadSample = () => {
    setInputText(sampleText);
    toast.success("Sample text loaded for analysis");
  };

  const clearAll = () => {
    setInputText("");
    setStats(null);
    toast.success("All content cleared");
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getReadabilityColor = (score: number) => {
    if (score >= 70) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <ToolLayout toolId="text-statistics" categoryId="text-utilities">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Text Statistics Analyzer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Label htmlFor="text-input">Text Input</Label>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={handleFileUpload}>
                    <Upload className="h-4 w-4 mr-1" />
                    <span className="hidden xs:inline">Upload</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={loadSample}>
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span className="hidden xs:inline">Sample</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={clearAll}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    <span className="hidden xs:inline">Clear</span>
                  </Button>
                </div>
              </div>
              
              <Textarea
                id="text-input"
                placeholder="Enter or paste your text here to analyze its statistics..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[300px] text-sm"
              />
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.markdown,text/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {stats && (
          <>
            {/* Basic Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatNumber(stats.words)}</div>
                    <div className="text-sm text-muted-foreground">Words</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatNumber(stats.characters)}</div>
                    <div className="text-sm text-muted-foreground">Characters</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatNumber(stats.sentences)}</div>
                    <div className="text-sm text-muted-foreground">Sentences</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{formatNumber(stats.paragraphs)}</div>
                    <div className="text-sm text-muted-foreground">Paragraphs</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detailed Counts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Characters (with spaces):</span>
                    <span className="font-medium">{formatNumber(stats.characters)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Characters (no spaces):</span>
                    <span className="font-medium">{formatNumber(stats.charactersNoSpaces)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lines:</span>
                    <span className="font-medium">{formatNumber(stats.lines)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average words per sentence:</span>
                    <span className="font-medium">{stats.averageWordsPerSentence}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average sentences per paragraph:</span>
                    <span className="font-medium">{stats.averageSentencesPerParagraph}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Reading & Speaking Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Reading time:</span>
                      <span className="font-medium">{stats.readingTime} min</span>
                    </div>
                    <div className="text-xs text-muted-foreground">@ 200 words per minute</div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Speaking time:</span>
                      <span className="font-medium">{stats.speakingTime} min</span>
                    </div>
                    <div className="text-xs text-muted-foreground">@ 150 words per minute</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Word Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Word Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Average word length:</span>
                    <span className="font-medium">{stats.averageWordLength} characters</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Longest word:</span>
                    <span className="font-medium font-mono text-sm">{stats.longestWord}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shortest word:</span>
                    <span className="font-medium font-mono text-sm">{stats.shortestWord}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Readability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Readability Score:</span>
                      <span className={`font-bold ${getReadabilityColor(stats.readabilityScore)}`}>
                        {stats.readabilityScore}/100
                      </span>
                    </div>
                    <Progress value={stats.readabilityScore} className="h-2" />
                  </div>
                  <div className="flex justify-between">
                    <span>Reading Level:</span>
                    <span className={`font-medium ${getReadabilityColor(stats.readabilityScore)}`}>
                      {stats.readabilityGrade}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Based on Flesch Reading Ease formula
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Most Common Words */}
            {stats.mostCommonWords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Most Common Words</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {stats.mostCommonWords.slice(0, 10).map((item, index) => (
                      <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="font-medium text-sm">{item.word}</div>
                        <div className="text-xs text-muted-foreground">{item.count} times</div>
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