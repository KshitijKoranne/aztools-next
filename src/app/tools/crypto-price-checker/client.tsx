"use client";

import { useState } from "react";
import { RefreshCw, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PriceResult {
  asset: string;
  fiat: string;
  amount: number;
  fetchedAt: string;
}

const assets = ["BTC", "ETH", "SOL", "DOGE", "ADA", "AVAX", "LINK", "LTC", "BCH", "DOT", "MATIC", "ATOM", "XLM"];
const fiats = ["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY", "SGD"];

export default function Client() {
  const [asset, setAsset] = useState("BTC");
  const [fiat, setFiat] = useState("USD");
  const [result, setResult] = useState<PriceResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function fetchPrice() {
    setBusy(true);
    try {
      const response = await fetch(`/api/live-data/crypto-price?asset=${asset}&fiat=${fiat}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Price lookup failed.");
      setResult(data);
      toast.success("Price updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not fetch price.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout toolId="crypto-price-checker">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Crypto Price Checker</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <div className="space-y-2">
              <Label>Asset</Label>
              <Select value={asset} onValueChange={setAsset}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{assets.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={fiat} onValueChange={setFiat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{fiats.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button onClick={fetchPrice} disabled={busy} className="self-end">
              <RefreshCw className="h-4 w-4" />
              {busy ? "Updating..." : "Get Price"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="text-sm font-bold uppercase text-primary">Live spot price</div>
              <div className="mt-3 text-5xl font-black tracking-tight">
                {new Intl.NumberFormat("en", { style: "currency", currency: result.fiat, maximumFractionDigits: result.fiat === "JPY" ? 0 : 2 }).format(result.amount)}
              </div>
              <p className="mt-3 text-muted-foreground">
                1 {result.asset} in {result.fiat} · Updated {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(result.fetchedAt))}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
