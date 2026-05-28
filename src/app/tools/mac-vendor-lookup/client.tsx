"use client";

import { useState } from "react";
import { Copy, Search, Server } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MacVendorResult {
  input: string;
  normalized: string;
  oui: string;
  vendor: string;
}

export default function Client() {
  const [mac, setMac] = useState("00:1B:44:11:3A:B7");
  const [result, setResult] = useState<MacVendorResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function lookupVendor() {
    if (!mac.trim()) return toast.error("Enter a MAC address or OUI.");
    setBusy(true);
    try {
      const response = await fetch(`/api/live-data/mac-vendor?mac=${encodeURIComponent(mac.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "MAC lookup failed.");
      setResult(data);
      toast.success("Vendor loaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not fetch MAC vendor.");
      setResult(null);
    } finally {
      setBusy(false);
    }
  }

  async function copyVendor() {
    if (!result) return;
    await navigator.clipboard.writeText(`${result.normalized} - ${result.vendor}`);
    toast.success("Vendor copied.");
  }

  return (
    <ToolLayout toolId="mac-vendor-lookup">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Server className="h-5 w-5" />MAC Vendor Lookup</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <Label>MAC address or OUI</Label>
              <Input value={mac} onChange={(event) => setMac(event.target.value)} onKeyDown={(event) => event.key === "Enter" && lookupVendor()} placeholder="00:1B:44 or 00:1B:44:11:3A:B7" />
            </div>
            <Button onClick={lookupVendor} disabled={busy} className="self-end">
              <Search className="h-4 w-4" />
              {busy ? "Looking..." : "Lookup"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardContent className="space-y-5 py-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-sm font-bold uppercase text-primary">Registered vendor</div>
                  <h2 className="mt-2 text-3xl font-black">{result.vendor}</h2>
                  <p className="mt-2 text-muted-foreground">{result.normalized}</p>
                </div>
                <Button variant="outline" onClick={copyVendor}>
                  <Copy className="h-4 w-4" /> Copy
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Info label="Normalized MAC" value={result.normalized} />
                <Info label="OUI prefix" value={result.oui} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/30 p-3">
      <div className="text-xs font-bold uppercase text-muted-foreground">{label}</div>
      <div className="mt-1 break-words font-semibold">{value}</div>
    </div>
  );
}
