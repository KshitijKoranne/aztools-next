"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, ScanText, Upload } from "lucide-react";
import { createWorker } from "tesseract.js";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function Client() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);

  async function extract() {
    if (!file) return toast.error("Upload an image first.");
    setIsReading(true);
    setProgress(0);
    try {
      const worker = await createWorker("eng", 1, {
        logger: (message) => {
          if (message.status === "recognizing text") setProgress(Math.round(message.progress * 100));
        },
      });
      const result = await worker.recognize(file);
      await worker.terminate();
      setText(result.data.text.trim());
      toast.success("Text extracted.");
    } catch {
      toast.error("OCR failed.");
    } finally {
      setIsReading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(text);
    toast.success("Copied.");
  }

  return (
    <ToolLayout toolId="ocr-text-extractor">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><ScanText className="h-5 w-5" />OCR Text Extractor</CardTitle></CardHeader><CardContent className="space-y-4">
          <Label className="flex cursor-pointer items-center gap-2 rounded-md border p-3"><Upload className="h-4 w-4" />{file ? file.name : "Upload Image"}<input type="file" accept="image/*" className="hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></Label>
          {isReading && <Progress value={progress} />}
          <Button onClick={extract} disabled={isReading}>{isReading ? "Reading..." : "Extract Text"}</Button>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center justify-between">Extracted Text{text && <Button size="sm" variant="outline" onClick={copy}><Copy className="mr-2 h-4 w-4" />Copy</Button>}</CardTitle></CardHeader><CardContent><Textarea value={text} onChange={(event) => setText(event.target.value)} className="min-h-[320px]" /></CardContent></Card>
      </div>
    </ToolLayout>
  );
}
