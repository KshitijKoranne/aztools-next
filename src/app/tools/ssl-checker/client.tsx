"use client";

import { useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SslResult = {
  host: string;
  authorized: boolean;
  authorizationError?: string | null;
  subject?: Record<string, string>;
  issuer?: Record<string, string>;
  validFrom?: string;
  validTo?: string;
  daysUntilExpiry?: number | null;
  altNames?: string;
};

export default function Client() {
  const [host, setHost] = useState("");
  const [result, setResult] = useState<SslResult | null>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!host.trim()) return toast.error("Enter a host");
    setLoading(true);
    try {
      const response = await fetch(`/api/ssl-check?host=${encodeURIComponent(host.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "SSL check failed");
      setResult(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "SSL check failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout toolId="ssl-checker">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" />SSL Certificate Checker</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="host">Domain</Label>
              <Input id="host" placeholder="example.com" value={host} onChange={(event) => setHost(event.target.value)} />
            </div>
            <Button className="w-full" disabled={loading} onClick={check}><Search className="h-4 w-4" />{loading ? "Checking..." : "Check Certificate"}</Button>
            {result && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-muted p-4"><p className="text-sm text-muted-foreground">Status</p><p className="font-medium">{result.authorized ? "Trusted" : result.authorizationError ?? "Not trusted"}</p></div>
                <div className="rounded-lg bg-muted p-4"><p className="text-sm text-muted-foreground">Expires In</p><p className="font-medium">{result.daysUntilExpiry == null ? "Unknown" : `${result.daysUntilExpiry} days`}</p></div>
                <div className="rounded-lg bg-muted p-4"><p className="text-sm text-muted-foreground">Valid From</p><p className="font-medium">{result.validFrom ?? "Unknown"}</p></div>
                <div className="rounded-lg bg-muted p-4"><p className="text-sm text-muted-foreground">Valid To</p><p className="font-medium">{result.validTo ?? "Unknown"}</p></div>
                <div className="rounded-lg bg-muted p-4"><p className="text-sm text-muted-foreground">Subject</p><p className="font-medium break-all">{result.subject?.CN ?? result.host}</p></div>
                <div className="rounded-lg bg-muted p-4"><p className="text-sm text-muted-foreground">Issuer</p><p className="font-medium break-all">{result.issuer?.CN ?? "Unknown"}</p></div>
                <div className="rounded-lg bg-muted p-4 md:col-span-2"><p className="text-sm text-muted-foreground">Alternative Names</p><p className="font-medium break-all">{result.altNames ?? "Not available"}</p></div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
