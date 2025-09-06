'use client'

import React, { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, RefreshCw, Palette, Type } from 'lucide-react';
import { toast } from 'sonner';

interface WordFrequency {
  text: string;
  weight: number;
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these', 'those'
]);

const COLOR_SCHEMES = {
  default: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'],
  blues: ['#0066CC', '#0080FF', '#3399FF', '#6BB6FF', '#99CCFF', '#CCE7FF'],
  warm: ['#FF6B35', '#F7931E', '#FFD23F', '#EE4B2B', '#DC143C'],
  cool: ['#36C5F0', '#2EB398', '#54C6EB', '#8FD6E1', '#BFEFFF'],
  pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFDFBA', '#E0BBE4'],
  dark: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7']
};

const FONTS = [
  'Arial, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Helvetica, sans-serif',
  'Courier New, monospace',
  'Trebuchet MS, sans-serif',
  'Verdana, sans-serif'
];

export function WordCloudGeneratorClient() {
  const [inputText, setInputText] = useState('');
  const [words, setWords] = useState<WordFrequency[]>([]);
  const [maxWords, setMaxWords] = useState([50]);
  const [minLength, setMinLength] = useState([3]);
  const [colorScheme, setColorScheme] = useState<keyof typeof COLOR_SCHEMES>('default');
  const [font, setFont] = useState('Arial, sans-serif');
  const [includeStopWords, setIncludeStopWords] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processText = (text: string): WordFrequency[] => {
    if (!text.trim()) return [];

    // Clean and split text
    const cleanText = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const words = cleanText.split(' ');
    const wordCount: { [key: string]: number } = {};

    // Count word frequencies
    words.forEach(word => {
      if (word.length >= minLength[0] && 
          (includeStopWords || !STOP_WORDS.has(word))) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    // Convert to array and sort by frequency
    const wordArray = Object.entries(wordCount)
      .map(([text, count]) => ({ text, weight: count }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, maxWords[0]);

    return wordArray;
  };

  const generateWordCloud = () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to generate a word cloud.");
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const processedWords = processText(inputText);
      setWords(processedWords);
      drawWordCloud(processedWords);
      setIsGenerating(false);
    }, 100);
  };

  const drawWordCloud = (wordData: WordFrequency[]) => {
    const canvas = canvasRef.current;
    if (!canvas || wordData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Clear canvas with theme-aware background
    const isDark = document.documentElement.classList.contains('dark');
    ctx.fillStyle = isDark ? '#0f0f23' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const colors = COLOR_SCHEMES[colorScheme];
    const maxWeight = Math.max(...wordData.map(w => w.weight));
    const minFontSize = 14;
    const maxFontSize = 60;

    // Simple word cloud layout (spiral placement)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const usedPositions: { x: number; y: number; width: number; height: number }[] = [];

    wordData.forEach((word, index) => {
      const fontSize = minFontSize + ((word.weight / maxWeight) * (maxFontSize - minFontSize));
      const color = colors[index % colors.length];
      
      ctx.font = `${fontSize}px ${font}`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const textMetrics = ctx.measureText(word.text);
      const textWidth = textMetrics.width;
      const textHeight = fontSize;

      // Simple spiral positioning
      let angle = 0;
      let radius = 0;
      let x = centerX;
      let y = centerY;
      let placed = false;

      // Try to find a non-overlapping position
      for (let attempts = 0; attempts < 100 && !placed; attempts++) {
        x = centerX + Math.cos(angle) * radius;
        y = centerY + Math.sin(angle) * radius;

        const wordBounds = {
          x: x - textWidth / 2,
          y: y - textHeight / 2,
          width: textWidth,
          height: textHeight
        };

        // Check for overlap
        const overlaps = usedPositions.some(pos => 
          wordBounds.x < pos.x + pos.width &&
          wordBounds.x + wordBounds.width > pos.x &&
          wordBounds.y < pos.y + pos.height &&
          wordBounds.y + wordBounds.height > pos.y
        );

        if (!overlaps && 
            x - textWidth / 2 > 10 && 
            x + textWidth / 2 < canvas.width - 10 &&
            y - textHeight / 2 > 10 && 
            y + textHeight / 2 < canvas.height - 10) {
          usedPositions.push(wordBounds);
          placed = true;
        } else {
          angle += 0.3;
          radius += 2;
        }
      }

      if (placed) {
        ctx.fillText(word.text, x, y);
      }
    });
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'word-cloud.png';
    link.href = canvas.toDataURL();
    link.click();

    toast.success("Word cloud saved as PNG image.");
  };

  useEffect(() => {
    if (words.length > 0) {
      drawWordCloud(words);
    }
  }, [colorScheme, font, words]);

  return (
    <ToolLayout toolId="word-cloud-generator" categoryId="text-utilities">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Text Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="text-input">Enter your text</Label>
                <Textarea
                  id="text-input"
                  placeholder="Paste your text here to generate a word cloud..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] mt-2"
                />
              </div>
              
              <Button 
                onClick={generateWordCloud} 
                className="w-full"
                disabled={isGenerating || !inputText.trim()}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Word Cloud'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Maximum Words: {maxWords[0]}</Label>
                <Slider
                  value={maxWords}
                  onValueChange={setMaxWords}
                  max={100}
                  min={10}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Minimum Word Length: {minLength[0]}</Label>
                <Slider
                  value={minLength}
                  onValueChange={setMinLength}
                  max={8}
                  min={2}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Color Scheme</Label>
                <Select value={colorScheme} onValueChange={(value: keyof typeof COLOR_SCHEMES) => setColorScheme(value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="blues">Blues</SelectItem>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="cool">Cool</SelectItem>
                    <SelectItem value="pastel">Pastel</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Font Family</Label>
                <Select value={font} onValueChange={setFont}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONTS.map(fontName => (
                      <SelectItem key={fontName} value={fontName}>
                        {fontName.split(',')[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-stop-words"
                  checked={includeStopWords}
                  onCheckedChange={(checked) => setIncludeStopWords(checked as boolean)}
                />
                <Label htmlFor="include-stop-words">Include common words</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Word Cloud</span>
                {words.length > 0 && (
                  <Button onClick={downloadCanvas} size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download PNG
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-background">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto max-w-full"
                  style={{ display: 'block' }}
                />
              </div>
              
              {words.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Type className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Enter text and click "Generate Word Cloud" to create your visualization</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Word Statistics */}
          {words.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Word Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{words.length}</div>
                    <div className="text-sm text-muted-foreground">Unique Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{words.reduce((sum, w) => sum + w.weight, 0)}</div>
                    <div className="text-sm text-muted-foreground">Total Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{Math.max(...words.map(w => w.weight))}</div>
                    <div className="text-sm text-muted-foreground">Most Frequent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{words[0]?.text || '-'}</div>
                    <div className="text-sm text-muted-foreground">Top Word</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  <h4 className="font-medium">Top Words</h4>
                  {words.slice(0, 10).map((word, index) => (
                    <div key={word.text} className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2">
                        <span className="text-muted-foreground">#{index + 1}</span>
                        <span>{word.text}</span>
                      </span>
                      <span className="font-medium">{word.weight}</span>
                    </div>
                  ))}
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