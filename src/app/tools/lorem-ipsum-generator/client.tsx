'use client'

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, RefreshCw, FileText } from "lucide-react";
import { toast } from "sonner";

export function LoremIpsumGeneratorClient() {
  const [activeTab, setActiveTab] = useState("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generated, setGenerated] = useState("");

  const loremWords = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
    "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
    "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
    "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
    "deserunt", "mollit", "anim", "id", "est", "laborum", "at", "vero", "eos",
    "accusamus", "accusantium", "doloremque", "laudantium", "totam", "rem",
    "aperiam", "eaque", "ipsa", "quae", "ab", "illo", "inventore", "veritatis",
    "et", "quasi", "architecto", "beatae", "vitae", "dicta", "sunt", "explicabo",
    "nemo", "ipsam", "voluptatem", "quia", "voluptas", "aspernatur", "aut",
    "odit", "fugit", "sed", "quia", "consequuntur", "magni", "dolores", "ratione",
    "sequi", "nesciunt", "neque", "porro", "quisquam", "est", "qui", "dolorem",
    "adipisci", "numquam", "eius", "modi", "tempora", "incidunt", "ut", "labore",
    "et", "dolore", "magnam", "aliquam", "quaerat", "voluptatem", "ut", "enim",
    "ad", "minima", "veniam", "quis", "nostrum", "exercitationem", "ullam",
    "corporis", "suscipit", "laboriosam", "nisi", "ut", "aliquid", "ex", "ea",
    "commodi", "consequatur", "quis", "autem", "vel", "eum", "iure",
    "reprehenderit", "qui", "in", "ea", "voluptate", "velit", "esse", "quam",
    "nihil", "molestiae", "et", "iusto", "odio", "dignissimos", "ducimus", "qui",
    "blanditiis", "praesentium", "voluptatum", "deleniti", "atque", "corrupti",
    "quos", "dolores", "et", "quas", "molestias", "excepturi", "sint", "occaecati",
    "cupiditate", "non", "provident", "similique", "sunt", "in", "culpa", "qui",
    "officia", "deserunt", "mollitia", "animi", "id", "est", "laborum", "et",
    "dolorum", "fuga", "et", "harum", "quidem", "rerum", "facilis", "est", "et",
    "expedita", "distinctio", "nam", "libero", "tempore", "cum", "soluta",
    "nobis", "est", "eligendi", "optio", "cumque", "nihil", "impedit", "quo",
    "porro", "quisquam", "est", "qui", "minus", "id", "quod", "maxime",
    "placeat", "facere", "possimus", "omnis", "voluptas", "assumenda", "est",
    "omnis", "dolor", "repellendus", "temporibus", "autem", "quibusdam", "et",
    "aut", "consequatur", "aut", "perferendis", "doloribus", "asperiores",
    "repellat"
  ];

  const generateWords = (wordCount: number): string => {
    const words: string[] = [];
    
    if (startWithLorem && wordCount > 0) {
      words.push("Lorem", "ipsum", "dolor", "sit", "amet");
      wordCount -= 5;
    }

    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * loremWords.length);
      words.push(loremWords[randomIndex]);
    }

    return words.join(" ");
  };

  const generateSentence = (): string => {
    const sentenceLength = Math.floor(Math.random() * 15) + 5; // 5-20 words
    const sentence = generateWords(sentenceLength);
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
  };

  const generateParagraph = (): string => {
    const sentenceCount = Math.floor(Math.random() * 5) + 3; // 3-8 sentences
    const sentences: string[] = [];
    
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    
    return sentences.join(" ");
  };

  const handleGenerate = () => {
    let result = "";

    switch (activeTab) {
      case "words":
        result = generateWords(count);
        break;
      case "sentences":
        const sentences: string[] = [];
        for (let i = 0; i < count; i++) {
          sentences.push(generateSentence());
        }
        result = sentences.join(" ");
        break;
      case "paragraphs":
        const paragraphs: string[] = [];
        for (let i = 0; i < count; i++) {
          paragraphs.push(generateParagraph());
        }
        result = paragraphs.join("\n\n");
        break;
    }

    setGenerated(result);
    toast.success(`Generated ${count} ${activeTab}`);
  };

  const copyToClipboard = () => {
    if (generated) {
      navigator.clipboard.writeText(generated);
      toast.success("Lorem ipsum text copied to clipboard");
    }
  };

  const clearGenerated = () => {
    setGenerated("");
  };

  return (
    <ToolLayout toolId="lorem-ipsum-generator" categoryId="text-utilities">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Lorem Ipsum Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-1 sm:grid-cols-3">
                <TabsTrigger value="words">Words</TabsTrigger>
                <TabsTrigger value="sentences">Sentences</TabsTrigger>
                <TabsTrigger value="paragraphs">Paragraphs</TabsTrigger>
              </TabsList>

              <TabsContent value="words" className="space-y-4">
                <div className="space-y-2">
                  <Label>Number of Words</Label>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="sentences" className="space-y-4">
                <div className="space-y-2">
                  <Label>Number of Sentences</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="paragraphs" className="space-y-4">
                <div className="space-y-2">
                  <Label>Number of Paragraphs</Label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="startWithLorem"
                checked={startWithLorem}
                onCheckedChange={setStartWithLorem}
              />
              <Label htmlFor="startWithLorem">Start with "Lorem ipsum..."</Label>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleGenerate} className="flex-1">
                Generate Lorem Ipsum
              </Button>
              <Button variant="outline" onClick={clearGenerated}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated Text
              {generated && (
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generated ? (
              <Textarea
                value={generated}
                readOnly
                className="min-h-[300px] resize-none"
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Configure your settings above and click "Generate Lorem Ipsum"</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </ToolLayout>
  );
}