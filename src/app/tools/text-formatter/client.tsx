"use client";

import { useMemo, useState } from "react";
import { AlignLeft, Copy, RefreshCw, SortAsc, SortDesc, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type CaseType = "upper" | "lower" | "title" | "sentence" | "camel" | "snake" | "kebab";

function toCaseType(value: string): CaseType {
  return ([
    "upper",
    "lower",
    "title",
    "sentence",
    "camel",
    "snake",
    "kebab",
  ] as const).includes(value as CaseType)
    ? (value as CaseType)
    : "sentence";
}

function changeCase(text: string, type: CaseType): string {
  switch (type) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text
        .toLowerCase()
        .split(/(\s+)/)
        .map((part) =>
          /\s+/.test(part) || part.length === 0
            ? part
            : part.charAt(0).toUpperCase() + part.slice(1),
        )
        .join("");
    case "sentence":
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, (letter) => letter.toUpperCase());
    case "camel": {
      // Split into word-tokens, then camelCase
      const words = text.match(/[A-Za-z0-9]+/g);
      if (!words || words.length === 0) return "";
      const [first, ...rest] = words;
      return (
        first.toLowerCase() +
        rest
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join("")
      );
    }
    case "snake":
      return (
        text.match(/[A-Za-z0-9]+/g)?.map((w) => w.toLowerCase()).join("_") ?? ""
      );
    case "kebab":
      return (
        text.match(/[A-Za-z0-9]+/g)?.map((w) => w.toLowerCase()).join("-") ?? ""
      );
  }
}

function cleanWhitespace(text: string): string {
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/ ?([.,!?;:]) ?/g, "$1 ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

export default function TextFormatterClient() {
  const [text, setText] = useState("");
  const [formatted, setFormatted] = useState("");
  const [activeTab, setActiveTab] = useState("format");
  const [caseType, setCaseType] = useState<CaseType>("sentence");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    return {
      characters: text.length,
      words: trimmed ? trimmed.split(/\s+/).length : 0,
      sentences: trimmed ? trimmed.split(/[.!?]+/).filter(Boolean).length : 0,
      paragraphs: trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0,
      lines: text ? text.split("\n").length : 0,
    };
  }, [text]);

  const formatText = () => {
    if (!text.trim()) {
      toast.error("Please enter text to format");
      return;
    }
    try {
      const result =
        activeTab === "case" ? changeCase(text, caseType) : cleanWhitespace(text);
      setFormatted(result);
      toast.success("Text formatted");
    } catch {
      toast.error("Failed to format text");
    }
  };

  const removeDuplicates = () => {
    if (!text.trim()) {
      toast.error("Please enter text to process");
      return;
    }
    const lines = text.split("\n");
    const unique = Array.from(new Set(lines));
    setFormatted(unique.join("\n"));
    toast.success(`Removed ${lines.length - unique.length} duplicate line(s)`);
  };

  const sortLines = (ascending: boolean) => {
    if (!text.trim()) {
      toast.error("Please enter text to sort");
      return;
    }
    const sorted = text
      .split("\n")
      .sort((a, b) => (ascending ? a.localeCompare(b) : b.localeCompare(a)));
    setFormatted(sorted.join("\n"));
    toast.success(`Sorted ${ascending ? "ascending" : "descending"}`);
  };

  const copyToClipboard = async () => {
    if (!formatted) return;
    try {
      await navigator.clipboard.writeText(formatted);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  const clearAll = () => {
    setText("");
    setFormatted("");
  };

  return (
    <ToolLayout toolId="text-formatter">
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
                <Select
                  value={caseType}
                  onValueChange={(v) => setCaseType(toCaseType(v))}
                >
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
                <div className="font-medium text-foreground">Characters</div>
                <div>{stats.characters}</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Words</div>
                <div>{stats.words}</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Sentences</div>
                <div>{stats.sentences}</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Paragraphs</div>
                <div>{stats.paragraphs}</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Lines</div>
                <div>{stats.lines}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={formatText} className="flex-1 min-w-[120px]">
                Format Text
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => sortLines(true)}
                title="Sort lines ascending"
                aria-label="Sort lines ascending"
              >
                <SortAsc className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => sortLines(false)}
                title="Sort lines descending"
                aria-label="Sort lines descending"
              >
                <SortDesc className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={removeDuplicates}
                title="Remove duplicate lines"
                aria-label="Remove duplicate lines"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={clearAll}
                title="Clear all"
                aria-label="Clear all"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Formatted Text</span>
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
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap break-words">
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
