"use client";

import { useMemo, useState } from "react";
import { Copy, ExternalLink, Link2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const utmFields = [
  ["utm_source", "Source", "google, newsletter, linkedin"],
  ["utm_medium", "Medium", "cpc, email, social"],
  ["utm_campaign", "Campaign", "spring_sale"],
  ["utm_term", "Term", "running shoes"],
  ["utm_content", "Content", "blue_button"],
] as const;

type Params = Record<(typeof utmFields)[number][0], string>;

const emptyParams: Params = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
};

function buildUrl(baseUrl: string, params: Params) {
  if (!baseUrl.trim()) return "";
  try {
    const url = new URL(baseUrl.trim());
    utmFields.forEach(([key]) => {
      const value = params[key].trim();
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    });
    return url.toString();
  } catch {
    return "";
  }
}

export default function Client() {
  const [baseUrl, setBaseUrl] = useState("https://example.com/landing-page");
  const [params, setParams] = useState<Params>({ ...emptyParams, utm_source: "newsletter", utm_medium: "email", utm_campaign: "launch" });
  const [parseInput, setParseInput] = useState("");

  const result = useMemo(() => buildUrl(baseUrl, params), [baseUrl, params]);
  const requiredReady = Boolean(params.utm_source.trim() && params.utm_medium.trim() && params.utm_campaign.trim());

  function updateParam(key: keyof Params, value: string) {
    setParams((current) => ({ ...current, [key]: value }));
  }

  function parseUrl() {
    try {
      const url = new URL(parseInput.trim());
      const nextParams = { ...emptyParams };
      utmFields.forEach(([key]) => {
        nextParams[key] = url.searchParams.get(key) ?? "";
        url.searchParams.delete(key);
      });
      setBaseUrl(url.toString());
      setParams(nextParams);
      toast.success("UTM URL parsed.");
    } catch {
      toast.error("Enter a valid URL to parse.");
    }
  }

  function reset() {
    setParams(emptyParams);
    setBaseUrl("");
    setParseInput("");
  }

  async function copy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    toast.success("Campaign URL copied.");
  }

  return (
    <ToolLayout toolId="utm-builder">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              UTM Campaign URL Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="base-url">Destination URL</Label>
              <Input id="base-url" value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} placeholder="https://example.com/page" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {utmFields.map(([key, label, placeholder]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>
                    {label}
                    {["utm_source", "utm_medium", "utm_campaign"].includes(key) && <span className="text-destructive"> *</span>}
                  </Label>
                  <Input id={key} value={params[key]} onChange={(event) => updateParam(key, event.target.value)} placeholder={placeholder} />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={requiredReady ? "default" : "secondary"}>{requiredReady ? "Core tags ready" : "Add source, medium, and campaign"}</Badge>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-3">
              Campaign URL
              <Button variant="outline" size="sm" onClick={copy} disabled={!result}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea readOnly value={result || "Enter a valid destination URL to generate the campaign link."} className="min-h-28 font-mono text-sm" />
            {result && (
              <Button variant="outline" asChild>
                <a href={result} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open URL
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Parse Existing UTM URL</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea value={parseInput} onChange={(event) => setParseInput(event.target.value)} className="min-h-24 font-mono text-sm" placeholder="Paste a tagged campaign URL to split it into editable fields." />
            <Button onClick={parseUrl}>Parse URL</Button>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
