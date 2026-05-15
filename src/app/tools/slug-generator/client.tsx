"use client";

import { useMemo, useState } from "react";
import { Copy, Hash, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const stopWords = new Set(["a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in", "is", "of", "on", "or", "the", "to", "with"]);

function createSlug(text: string, separator: string, removeStopWords: boolean, maxLength: number) {
  const normalized = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, " ");

  const words = normalized.split(/[\s-]+/).filter(Boolean).filter((word) => !removeStopWords || !stopWords.has(word));
  let slug = words.join(separator);
  if (maxLength > 0 && slug.length > maxLength) {
    slug = slug.slice(0, maxLength).replace(new RegExp(`${separator}[^${separator}]*$`), "");
  }
  return slug.replace(new RegExp(`${separator}{2,}`, "g"), separator).replace(new RegExp(`^${separator}|${separator}$`, "g"), "");
}

export default function SlugGeneratorClient() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [maxLength, setMaxLength] = useState(80);

  const output = useMemo(() => createSlug(input, separator, removeStopWords, maxLength), [input, separator, removeStopWords, maxLength]);

  async function copyOutput() {
    if (!output) {
      toast.error("Generate a slug first.");
      return;
    }
    await navigator.clipboard.writeText(output);
    toast.success("Slug copied.");
  }

  return (
    <ToolLayout toolId="slug-generator">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Hash className="h-5 w-5" /> Slug Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste a title, heading, or product name..." className="min-h-36" />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Separator</Label>
                <Select value={separator} onValueChange={setSeparator}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-">Hyphen (-)</SelectItem>
                    <SelectItem value="_">Underscore (_)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Max length</Label>
                <Input type="number" min={0} max={200} value={maxLength} onChange={(event) => setMaxLength(Number(event.target.value) || 0)} />
              </div>
              <div className="flex items-center gap-2">
                <Switch id="stop-words" checked={removeStopWords} onCheckedChange={setRemoveStopWords} />
                <Label htmlFor="stop-words">Remove stop words</Label>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={copyOutput}><Copy className="mr-2 h-4 w-4" />Copy Slug</Button>
              <Button variant="outline" onClick={() => setInput("Free Online Tools for PDF, Images, Text, Developers and SEO")}>Load Sample</Button>
              <Button variant="outline" size="icon" onClick={() => setInput("")}><RefreshCw className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Generated Slug</CardTitle></CardHeader>
          <CardContent>
            <Input value={output} readOnly placeholder="your-generated-slug" className="font-mono" />
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
