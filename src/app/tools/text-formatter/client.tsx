"use client"

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlignLeft, Copy, RefreshCw, SortAsc, SortDesc, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function TextFormatterClient() {
  const [text, setText] = useState("");
  const [formatted, setFormatted] = useState("");
  const [activeTab, setActiveTab] = useState("format");
  const [caseType, setCaseType] = useState("sentence");
  const { toast } = useToast();

  const formatText = () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to format",
        variant: "destructive"
      });
      return;
    }

    try {
      let result = text;
      
      if (activeTab === "format") {
        // Basic text formatting
        result = text
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .replace(/\s*([.,!?])\s*/g, '$1 ') // Add space after punctuation
          .replace(/\s+/g, ' ') // Clean up any extra spaces
          .trim();
      } else if (activeTab === "case") {
        // Case conversion
        switch (caseType) {
          case "upper":
            result = text.toUpperCase();
            break;
          case "lower":
            result = text.toLowerCase();
            break;
          case "title":
            result = text
              .toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            break;
          case "sentence":
            result = text
              .toLowerCase()
              .replace(/(^\w|\.\s+\w)/g, letter => letter.toUpperCase());
            break;
          case "camel":
            result = text
              .toLowerCase()
              .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
            break;
          case "snake":
            result = text
              .toLowerCase()
              .replace(/[^a-zA-Z0-9]+/g, '_')
              .replace(/([A-Z])/g, '_$1')
              .toLowerCase();
            break;
          case "kebab":
            result = text
              .toLowerCase()
              .replace(/[^a-zA-Z0-9]+/g, '-')
              .replace(/([A-Z])/g, '-$1')
              .toLowerCase();
            break;
        }
      }

      setFormatted(result);
      toast({
        title: "Success",
        description: "Text formatted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to format text",
        variant: "destructive"
      });
    }
  };

  const removeDuplicates = () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to process",
        variant: "destructive"
      });
      return;
    }

    const lines = text.split('\n');
    const uniqueLines = [...new Set(lines)];
    setFormatted(uniqueLines.join('\n'));
    toast({
      title: "Success",
      description: "Duplicate lines removed"
    });
  };

  const sortLines = (ascending = true) => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to sort",
        variant: "destructive"
      });
      return;
    }

    const lines = text.split('\n');
    const sortedLines = lines.sort((a, b) => {
      if (ascending) {
        return a.localeCompare(b);
      }
      return b.localeCompare(a);
    });
    setFormatted(sortedLines.join('\n'));
    toast({
      title: "Success",
      description: `Lines sorted ${ascending ? 'ascending' : 'descending'}`
    });
  };

  const copyToClipboard = () => {
    if (formatted) {
      navigator.clipboard.writeText(formatted);
      toast({
        title: "Copied!",
        description: "Formatted text copied to clipboard"
      });
    }
  };

  const clearAll = () => {
    setText("");
    setFormatted("");
  };

  const getTextStats = () => {
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean) : [];
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(Boolean) : [];
    const lines = text.trim() ? text.split('\n') : [];

    return {
      characters: text.length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      lines: lines.length
    };
  };

  const stats = getTextStats();

  return (
    <ToolLayout
      toolId="text-formatter"
      categoryId="text-utilities"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlignLeft className="h-5 w-5" />
              Text Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="format">Format</TabsTrigger>
                <TabsTrigger value="case">Case</TabsTrigger>
              </TabsList>
              
              <TabsContent value="case" className="mt-4">
                <Select value={caseType} onValueChange={setCaseType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select case type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upper">UPPERCASE</SelectItem>
                    <SelectItem value="lower">lowercase</SelectItem>
                    <SelectItem value="title">Title Case</SelectItem>
                    <SelectItem value="sentence">Sentence case</SelectItem>
                    <SelectItem value="camel">camelCase</SelectItem>
                    <SelectItem value="snake">snake_case</SelectItem>
                    <SelectItem value="kebab">kebab-case</SelectItem>
                  </SelectContent>
                </Select>
              </TabsContent>
            </Tabs>

            <Textarea
              placeholder="Enter your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] font-mono"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-sm text-muted-foreground">
              <div>
                <div className="font-medium">Characters</div>
                <div>{stats.characters}</div>
              </div>
              <div>
                <div className="font-medium">Words</div>
                <div>{stats.words}</div>
              </div>
              <div>
                <div className="font-medium">Sentences</div>
                <div>{stats.sentences}</div>
              </div>
              <div>
                <div className="font-medium">Paragraphs</div>
                <div>{stats.paragraphs}</div>
              </div>
              <div>
                <div className="font-medium">Lines</div>
                <div>{stats.lines}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={formatText} className="flex-1">
                Format Text
              </Button>
              <Button variant="outline" onClick={() => sortLines(true)} title="Sort Ascending">
                <SortAsc className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => sortLines(false)} title="Sort Descending">
                <SortDesc className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={removeDuplicates} title="Remove Duplicates">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={clearAll} title="Clear All">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Formatted Text
              {formatted && (
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formatted ? (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{formatted}</code>
              </pre>
            ) : (
              <p className="text-muted-foreground">Formatted text will appear here</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}