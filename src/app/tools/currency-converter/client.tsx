"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpDown, Clock, DollarSign, RefreshCw, TrendingUp } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Conversion = {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: string;
};

const CURRENCIES = [
  ["USD", "US Dollar", "$"],
  ["EUR", "Euro", "EUR"],
  ["GBP", "British Pound", "GBP"],
  ["JPY", "Japanese Yen", "JPY"],
  ["CAD", "Canadian Dollar", "CAD"],
  ["AUD", "Australian Dollar", "AUD"],
  ["CHF", "Swiss Franc", "CHF"],
  ["CNY", "Chinese Yuan", "CNY"],
  ["INR", "Indian Rupee", "INR"],
  ["SGD", "Singapore Dollar", "SGD"],
  ["BRL", "Brazilian Real", "BRL"],
  ["ZAR", "South African Rand", "ZAR"],
] as const;

function symbol(code: string) {
  return CURRENCIES.find((currency) => currency[0] === code)?.[2] ?? code;
}

export default function Client() {
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState<Conversion | null>(null);
  const [history, setHistory] = useState<Conversion[]>([]);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [lastUpdated, setLastUpdated] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function fetchRates(base: string) {
    const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base.toLowerCase()}.json`);
    if (!response.ok) throw new Error("Unable to fetch exchange rates.");

    const data = await response.json();
    const nextRates = data[base.toLowerCase()] as Record<string, number> | undefined;
    if (!nextRates) throw new Error("Exchange rates are unavailable.");

    setRates(nextRates);
    setLastUpdated(new Date().toLocaleString());
    return nextRates;
  }

  async function convert() {
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Enter a valid positive amount.");
      return;
    }

    if (fromCurrency === toCurrency) {
      const conversion = { from: fromCurrency, to: toCurrency, amount: parsedAmount, result: parsedAmount, rate: 1, timestamp: new Date().toLocaleString() };
      setResult(conversion);
      setHistory((current) => [conversion, ...current.slice(0, 4)]);
      return;
    }

    setIsLoading(true);
    try {
      const nextRates = await fetchRates(fromCurrency);
      const rate = nextRates[toCurrency.toLowerCase()];
      if (!rate) throw new Error(`Rate for ${toCurrency} is unavailable.`);

      const conversion = {
        from: fromCurrency,
        to: toCurrency,
        amount: parsedAmount,
        result: parsedAmount * rate,
        rate,
        timestamp: new Date().toLocaleString(),
      };
      setResult(conversion);
      setHistory((current) => [conversion, ...current.slice(0, 4)]);
      toast.success("Currency converted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Conversion failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ToolLayout toolId="currency-converter">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Currency Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} />
            </div>
            <div className="grid items-end gap-4 md:grid-cols-[1fr_auto_1fr]">
              <div className="space-y-2">
                <Label>From Currency</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CURRENCIES.map(([code, name]) => <SelectItem key={code} value={code}>{code} - {name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="icon" onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); setResult(null); }}>
                <ArrowUpDown className="h-4 w-4" />
              </Button>
              <div className="space-y-2">
                <Label>To Currency</Label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CURRENCIES.map(([code, name]) => <SelectItem key={code} value={code}>{code} - {name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full" onClick={convert} disabled={isLoading}>
              {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <DollarSign className="mr-2 h-4 w-4" />}
              Convert Currency
            </Button>
            {lastUpdated && <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground"><Clock className="h-3 w-3" />Rates updated: {lastUpdated}</p>}
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Conversion Result</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-center">
              <div className="text-4xl font-bold text-primary">{symbol(result.to)} {result.result.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              <p className="text-muted-foreground">{result.amount.toLocaleString()} {result.from} = {result.result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {result.to}</p>
              <p className="text-sm text-muted-foreground">1 {result.from} = {result.rate.toFixed(6)} {result.to}</p>
            </CardContent>
          </Card>
        )}

        {history.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Recent Conversions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {history.map((conversion, index) => (
                <div key={`${conversion.timestamp}-${index}`} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3">
                  <Badge variant="outline">{conversion.from} to {conversion.to}</Badge>
                  <span className="text-sm">{conversion.amount.toLocaleString()} = {conversion.result.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  <span className="text-xs text-muted-foreground">{conversion.timestamp}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {Object.keys(rates).length > 0 && (
          <Card>
            <CardHeader><CardTitle>Exchange Rates (Base: {fromCurrency})</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {CURRENCIES.filter(([code]) => code !== fromCurrency).slice(0, 8).map(([code, name]) => (
                <div key={code} className="rounded-md border p-3 text-center">
                  <div className="font-medium">{code}</div>
                  <div className="truncate text-xs text-muted-foreground">{name}</div>
                  <div className="font-mono text-sm text-primary">{rates[code.toLowerCase()]?.toFixed(4) ?? "-"}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
