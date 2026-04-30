"use client";

import { useState } from "react";
import { Copy, Globe, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type IpInfo = {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  country_name?: string;
  org?: string;
  isp?: string;
  timezone?: { id?: string };
};

const privateRanges = [
  ["Loopback", "127.0.0.0/8", "Localhost communications"],
  ["Private A", "10.0.0.0/8", "Private network range"],
  ["Private B", "172.16.0.0/12", "Private network range"],
  ["Private C", "192.168.0.0/16", "Private network range"],
  ["Link-local", "169.254.0.0/16", "Automatic local addressing"],
  ["Carrier NAT", "100.64.0.0/10", "ISP carrier-grade NAT"],
];

export default function Client() {
  const [ip, setIp] = useState("");
  const [result, setResult] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const isValid = !ip || /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(ip);

  const lookup = async (target = ip) => {
    if (target && !isValid) return toast.error("Enter a valid IPv4 address");
    setLoading(true);
    try {
      const response = await fetch(`https://ipwho.is/${target}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.message ?? "Lookup failed");
      setResult(data);
      if (!target) setIp(data.ip);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    toast.success("IP details copied");
  };

  return (
    <ToolLayout toolId="ip-address-lookup">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />IP Address Lookup</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue="lookup">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lookup">Lookup</TabsTrigger>
                <TabsTrigger value="ranges">Private Ranges</TabsTrigger>
              </TabsList>
              <TabsContent value="lookup" className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ip">IP Address</Label>
                  <div className="flex gap-2">
                    <Input id="ip" placeholder="8.8.8.8 or leave blank for your IP" value={ip} onChange={(event) => setIp(event.target.value)} />
                    <Button variant="outline" size="icon" onClick={() => lookup("")} disabled={loading} aria-label="Find my IP"><RefreshCw className="h-4 w-4" /></Button>
                  </div>
                  {!isValid && <p className="text-sm text-destructive">Please enter a valid IPv4 address.</p>}
                </div>
                <Button onClick={() => lookup()} disabled={loading || !isValid} className="w-full"><Search className="h-4 w-4" />{loading ? "Looking up..." : "Lookup"}</Button>
                {result && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      ["IP", result.ip],
                      ["Location", [result.city, result.region, result.country_name ?? result.country].filter(Boolean).join(", ")],
                      ["ISP", result.isp ?? result.org],
                      ["Timezone", result.timezone?.id],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg bg-muted p-4">
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="font-medium break-all">{value || "Not available"}</p>
                      </div>
                    ))}
                    <Button variant="outline" onClick={copy} className="md:col-span-2"><Copy className="h-4 w-4" />Copy JSON</Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="ranges" className="mt-6 grid gap-3">
                {privateRanges.map(([name, range, description]) => (
                  <div key={range} className="rounded-lg bg-muted p-4">
                    <p className="font-medium">{name}</p>
                    <p className="font-mono text-sm">{range}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
