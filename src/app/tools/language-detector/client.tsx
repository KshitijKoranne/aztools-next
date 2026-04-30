"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Languages, Copy, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { francAll } from "franc";

export default function LanguageDetectorClient() {
  const [text, setText] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);

  const detectLanguage = () => {
    if (!text.trim()) { toast.error("Please enter text to detect language"); return; }
    if (text.trim().length < 10) { toast.error("Enter at least 10 characters for better accuracy"); return; }

    const results = francAll(text, { minLength: 3 });
    if (!results || results.length === 0) {
      setDetectedLanguage("Unable to detect language");
      setConfidence(null);
      toast.error("Could not detect language. Try entering more text.");
      return;
    }

    const [langCode, score] = results[0];
    if (langCode === "und") {
      setDetectedLanguage("Unable to detect language");
      setConfidence(null);
      toast.error("Could not detect language. Try entering more text.");
      return;
    }

    try {
      const name = new Intl.DisplayNames(["en"], { type: "language" }).of(langCode);
      setDetectedLanguage(name ?? langCode);
    } catch {
      setDetectedLanguage(langCode);
    }
    setConfidence(score);
    toast.success("Language detected");
  };

  const clearAll = () => {
    setText("");
    setDetectedLanguage("");
    setConfidence(null);
  };

  return (
    <ToolLayout toolId="language-detector">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" /> Text Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter at least 10 characters of text to detect its language..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] font-mono"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={detectLanguage} className="flex-1">Detect Language</Button>
              <Button variant="outline" onClick={clearAll}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Detected Language
              {detectedLanguage && (
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(detectedLanguage); toast.success("Copied"); }}>
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {detectedLanguage ? (
              <>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-lg font-medium">{detectedLanguage}</p>
                </div>
                {confidence !== null && (
                  <div className="flex items-start gap-2 rounded-md border p-3 text-sm">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>
                      Confidence: {Math.round(confidence * 100)}%
                      {confidence < 0.6 && " (Low — try adding more text)"}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">Detected language will appear here</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
