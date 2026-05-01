"use client";

import { useMemo, useState } from "react";
import { Copy, Server } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ipToNumber(ip: string) {
  const parts = ip.trim().split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return null;
  return (((parts[0]! << 24) >>> 0) + (parts[1]! << 16) + (parts[2]! << 8) + parts[3]!) >>> 0;
}

function numberToIp(value: number) {
  return [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join(".");
}

function calculate(ip: string, prefixText: string) {
  const ipNumber = ipToNumber(ip);
  const prefix = Number(prefixText);
  if (ipNumber === null || !Number.isInteger(prefix) || prefix < 0 || prefix > 32) return null;
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = ipNumber & mask;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const totalHosts = 2 ** (32 - prefix);
  const usableHosts = prefix >= 31 ? totalHosts : Math.max(0, totalHosts - 2);
  return {
    cidr: `${numberToIp(network)}/${prefix}`,
    network: numberToIp(network),
    broadcast: numberToIp(broadcast),
    subnetMask: numberToIp(mask),
    wildcardMask: numberToIp((~mask) >>> 0),
    firstUsable: numberToIp(prefix >= 31 ? network : network + 1),
    lastUsable: numberToIp(prefix >= 31 ? broadcast : broadcast - 1),
    totalHosts,
    usableHosts,
    isPrivate:
      (ipNumber >= ipToNumber("10.0.0.0")! && ipNumber <= ipToNumber("10.255.255.255")!) ||
      (ipNumber >= ipToNumber("172.16.0.0")! && ipNumber <= ipToNumber("172.31.255.255")!) ||
      (ipNumber >= ipToNumber("192.168.0.0")! && ipNumber <= ipToNumber("192.168.255.255")!),
  };
}

export default function Client() {
  const [ip, setIp] = useState("192.168.1.42");
  const [prefix, setPrefix] = useState("24");
  const result = useMemo(() => calculate(ip, prefix), [ip, prefix]);

  async function copySummary() {
    if (!result) return;
    const text = Object.entries(result)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    await navigator.clipboard.writeText(text);
    toast.success("Subnet summary copied.");
  }

  return (
    <ToolLayout toolId="cidr-calculator">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Server className="h-5 w-5" />CIDR Calculator</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[1fr_180px]">
            <div className="space-y-2"><Label>IPv4 Address</Label><Input value={ip} onChange={(event) => setIp(event.target.value)} placeholder="192.168.1.42" /></div>
            <div className="space-y-2"><Label>Prefix Length</Label><Input type="number" min="0" max="32" value={prefix} onChange={(event) => setPrefix(event.target.value)} /></div>
          </CardContent>
        </Card>

        {result ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                <span>Subnet Details</span>
                <Button variant="outline" size="sm" onClick={copySummary}><Copy className="mr-2 h-4 w-4" />Copy</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2"><Badge>{result.cidr}</Badge>{result.isPrivate && <Badge variant="secondary">Private range</Badge>}</div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Network", result.network],
                  ["Broadcast", result.broadcast],
                  ["Subnet Mask", result.subnetMask],
                  ["Wildcard Mask", result.wildcardMask],
                  ["First Usable", result.firstUsable],
                  ["Last Usable", result.lastUsable],
                  ["Total Addresses", result.totalHosts.toLocaleString()],
                  ["Usable Hosts", result.usableHosts.toLocaleString()],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="font-mono font-medium">{value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card><CardContent className="pt-6 text-sm text-destructive">Enter a valid IPv4 address and prefix from 0 to 32.</CardContent></Card>
        )}
      </div>
    </ToolLayout>
  );
}
