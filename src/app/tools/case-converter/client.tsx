"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const CASES = [
  { label: "Sentence case", fn: (t: string) => t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()) },
  { label: "lower case", fn: (t: string) => t.toLowerCase() },
  { label: "UPPER CASE", fn: (t: string) => t.toUpperCase() },
  { label: "Title Case", fn: (t: string) => t.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) },
  { label: "Capitalized Case", fn: (t: string) => t.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) },
  { label: "aLtErNaTiNg cAsE", fn: (t: string) => t.split("").map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join("") },
  { label: "InVeRsE CaSe", fn: (t: string) => t.split("").map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join("") },
];

export default function CaseConverterClient() {
  const [text, setText] = useState("");

  const apply = (fn: (t: string) => string) => {
    if (!text.trim()) { toast.error("Enter some text first"); return; }
    setText(fn(text));
    toast.success("Case applied");
  };

  return (
    <ToolLayout toolId="case-converter">
      <div className="max-w-3xl mx-auto space-y-4">
        <Textarea
          placeholder="Enter your text here"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          className="font-mono text-sm"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {CASES.map(({ label, fn }) => (
            <Button key={label} variant="outline" onClick={() => apply(fn)} className="text-sm">
              {label}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              if (!text) return;
              navigator.clipboard.writeText(text);
              toast.success("Copied to clipboard");
            }}
            className="text-sm"
          >
            <Copy className="h-4 w-4 mr-1" /> Copy
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
