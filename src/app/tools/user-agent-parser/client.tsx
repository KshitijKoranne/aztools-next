"use client";

import { useState } from "react";
import { Copy, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ParsedAgent {
  browser: string;
  browserVersion: string;
  os: string;
  device: string;
  engine: string;
  bot: string;
}

function matchVersion(ua: string, pattern: RegExp) {
  return ua.match(pattern)?.[1] ?? "-";
}

function parseAgent(ua: string): ParsedAgent {
  const browser =
    /Edg\//.test(ua) ? "Microsoft Edge" :
    /OPR\//.test(ua) ? "Opera" :
    /Chrome\//.test(ua) && !/Chromium\//.test(ua) ? "Chrome" :
    /Firefox\//.test(ua) ? "Firefox" :
    /Safari\//.test(ua) && /Version\//.test(ua) ? "Safari" :
    /MSIE|Trident/.test(ua) ? "Internet Explorer" : "Unknown";

  const browserVersion =
    browser === "Microsoft Edge" ? matchVersion(ua, /Edg\/([\d.]+)/) :
    browser === "Opera" ? matchVersion(ua, /OPR\/([\d.]+)/) :
    browser === "Chrome" ? matchVersion(ua, /Chrome\/([\d.]+)/) :
    browser === "Firefox" ? matchVersion(ua, /Firefox\/([\d.]+)/) :
    browser === "Safari" ? matchVersion(ua, /Version\/([\d.]+)/) :
    browser === "Internet Explorer" ? matchVersion(ua, /(?:MSIE |rv:)([\d.]+)/) : "-";

  const os =
    /Windows NT 10/.test(ua) ? "Windows 10/11" :
    /Windows NT 6\.3/.test(ua) ? "Windows 8.1" :
    /Windows NT 6\.1/.test(ua) ? "Windows 7" :
    /Android/.test(ua) ? `Android ${matchVersion(ua, /Android ([\d.]+)/)}` :
    /iPhone|iPad|iPod/.test(ua) ? `iOS ${matchVersion(ua, /OS ([\d_]+)/).replace(/_/g, ".")}` :
    /Mac OS X/.test(ua) ? `macOS ${matchVersion(ua, /Mac OS X ([\d_]+)/).replace(/_/g, ".")}` :
    /Linux/.test(ua) ? "Linux" : "Unknown";

  const device = /bot|crawler|spider|slurp/i.test(ua) ? "Bot" : /Mobile|iPhone|Android/.test(ua) ? "Mobile" : /iPad|Tablet/.test(ua) ? "Tablet" : "Desktop";
  const engine = /AppleWebKit/.test(ua) ? "WebKit/Blink" : /Gecko\//.test(ua) ? "Gecko" : /Trident/.test(ua) ? "Trident" : "Unknown";
  const bot = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit/i.test(ua) ? "Likely bot/crawler" : "No bot signal found";

  return { browser, browserVersion, os, device, engine, bot };
}

export default function UserAgentParserClient() {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<ParsedAgent | null>(null);

  function parse() {
    if (!input.trim()) {
      toast.error("Paste a user agent string first.");
      return;
    }
    setParsed(parseAgent(input));
    toast.success("User agent parsed.");
  }

  async function copyJson() {
    if (!parsed) return;
    await navigator.clipboard.writeText(JSON.stringify(parsed, null, 2));
    toast.success("Result copied.");
  }

  return (
    <ToolLayout toolId="user-agent-parser">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" /> User Agent Parser</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste a user agent string..." className="min-h-36 font-mono text-sm" />
            <div className="flex flex-wrap gap-2">
              <Button onClick={parse}>Parse</Button>
              <Button variant="outline" onClick={() => setInput(navigator.userAgent)}>Use My User Agent</Button>
              <Button variant="outline" onClick={copyJson} disabled={!parsed}><Copy className="mr-2 h-4 w-4" />Copy JSON</Button>
              <Button variant="outline" size="icon" onClick={() => { setInput(""); setParsed(null); }}><RefreshCw className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>

        {parsed && (
          <Card>
            <CardHeader><CardTitle>Result</CardTitle></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {Object.entries(parsed).map(([key, value]) => (
                <div key={key} className="rounded-md border bg-muted/30 p-3">
                  <div className="text-xs font-bold uppercase text-muted-foreground">{key}</div>
                  <div className="mt-1 font-semibold">{value}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
