"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Download, KeyRound, RefreshCw, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function formatUuid(value: string, uppercase: boolean, removeHyphens: boolean, wrapBraces: boolean) {
  let result = uppercase ? value.toUpperCase() : value.toLowerCase();
  if (removeHyphens) result = result.replaceAll("-", "");
  if (wrapBraces) result = `{${result}}`;
  return result;
}

export default function Client() {
  const [count, setCount] = useState("10");
  const [uppercase, setUppercase] = useState(false);
  const [removeHyphens, setRemoveHyphens] = useState(false);
  const [wrapBraces, setWrapBraces] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [candidate, setCandidate] = useState("");

  const validation = useMemo(() => {
    const cleaned = candidate.trim().replace(/^\{|\}$/g, "");
    if (!cleaned) return null;
    const normalized = cleaned.length === 32
      ? `${cleaned.slice(0, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(12, 16)}-${cleaned.slice(16, 20)}-${cleaned.slice(20)}`
      : cleaned;
    return {
      normalized,
      valid: uuidPattern.test(normalized),
      version: uuidPattern.test(normalized) ? normalized.charAt(14) : "",
    };
  }, [candidate]);

  function generate() {
    const amount = Math.min(500, Math.max(1, Number.parseInt(count) || 1));
    const next = Array.from({ length: amount }, () => formatUuid(crypto.randomUUID(), uppercase, removeHyphens, wrapBraces));
    setUuids(next);
    toast.success(amount === 1 ? "UUID generated." : `${amount} UUIDs generated.`);
  }

  async function copy(text = uuids.join("\n")) {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast.success("Copied.");
  }

  function download() {
    if (!uuids.length) return;
    const url = URL.createObjectURL(new Blob([uuids.join("\n")], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "uuids.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout toolId="uuid-generator">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              UUID Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="uuid-count">How many</Label>
              <Input id="uuid-count" type="number" min="1" max="500" value={count} onChange={(event) => setCount(event.target.value)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={uppercase} onCheckedChange={(value) => setUppercase(Boolean(value))} />
                Uppercase
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={removeHyphens} onCheckedChange={(value) => setRemoveHyphens(Boolean(value))} />
                No hyphens
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={wrapBraces} onCheckedChange={(value) => setWrapBraces(Boolean(value))} />
                Wrap in braces
              </label>
            </div>
            <Button className="w-full" onClick={generate}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate UUIDs
            </Button>
            <Textarea readOnly value={uuids.join("\n")} className="min-h-72 font-mono text-sm" placeholder="Generated UUIDs will appear here." />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => copy()} disabled={!uuids.length}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button variant="outline" onClick={download} disabled={!uuids.length}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Validate UUID</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="uuid-candidate">UUID or GUID</Label>
              <Input id="uuid-candidate" value={candidate} onChange={(event) => setCandidate(event.target.value)} placeholder="123e4567-e89b-12d3-a456-426614174000" />
            </div>
            {validation && (
              <div className="rounded-md border p-4">
                <div className="mb-3 flex items-center gap-2">
                  {validation.valid ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <ShieldAlert className="h-5 w-5 text-destructive" />}
                  <span className="font-medium">{validation.valid ? "Valid UUID" : "Invalid UUID"}</span>
                  {validation.version && <Badge variant="outline">v{validation.version}</Badge>}
                </div>
                <p className="break-all font-mono text-sm text-muted-foreground">{validation.normalized}</p>
                {validation.valid && (
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => copy(validation.normalized)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy normalized
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
