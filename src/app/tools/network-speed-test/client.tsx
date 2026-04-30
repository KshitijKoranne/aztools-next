"use client";

import { useState } from "react";
import { Gauge, RefreshCw } from "lucide-react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Result = { downloadMbps: number; latencyMs: number; durationMs: number; sizeMb: number };

export default function Client() {
  const [result, setResult] = useState<Result | null>(null);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setProgress(15);
    const latencyStart = performance.now();
    await fetch("https://www.cloudflare.com/cdn-cgi/trace", { cache: "no-store" });
    const latencyMs = performance.now() - latencyStart;
    setProgress(35);

    const sizeMb = 10;
    const start = performance.now();
    const response = await fetch(`https://speed.cloudflare.com/__down?bytes=${sizeMb * 1024 * 1024}`, { cache: "no-store" });
    await response.arrayBuffer();
    const durationMs = performance.now() - start;
    setProgress(100);
    setResult({ latencyMs, durationMs, sizeMb, downloadMbps: (sizeMb * 8) / (durationMs / 1000) });
    setRunning(false);
  };

  return (
    <ToolLayout toolId="network-speed-test">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Gauge className="h-5 w-5" />Network Speed Test</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <Button className="w-full" onClick={run} disabled={running}><RefreshCw className="h-4 w-4" />{running ? "Testing..." : "Start Test"}</Button>
            {running && <Progress value={progress} />}
            {result && (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-muted p-4"><p className="text-sm text-muted-foreground">Download</p><p className="text-2xl font-bold">{result.downloadMbps.toFixed(2)} Mbps</p></div>
                <div className="rounded-lg bg-muted p-4"><p className="text-sm text-muted-foreground">Latency</p><p className="text-2xl font-bold">{result.latencyMs.toFixed(0)} ms</p></div>
                <div className="rounded-lg bg-muted p-4"><p className="text-sm text-muted-foreground">Sample</p><p className="text-2xl font-bold">{result.sizeMb} MB</p></div>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Browser speed tests are estimates and can vary by Wi-Fi, VPN, device load, and test server routing.</p>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
