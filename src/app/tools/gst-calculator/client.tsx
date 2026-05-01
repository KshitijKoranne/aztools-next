"use client";

import { useMemo, useState } from "react";
import { Copy, IndianRupee, Receipt } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const gstRates = ["0", "3", "5", "12", "18", "28"];

function money(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);
}

export default function Client() {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");
  const [supplyType, setSupplyType] = useState<"intra" | "inter">("intra");

  const result = useMemo(() => {
    const value = Math.max(0, Number(amount) || 0);
    const gstRate = Math.max(0, Number(rate) || 0);
    const tax = mode === "exclusive" ? value * (gstRate / 100) : value - value / (1 + gstRate / 100);
    const taxable = mode === "exclusive" ? value : value - tax;
    const total = mode === "exclusive" ? value + tax : value;
    const halfTax = tax / 2;
    return { taxable, tax, total, cgst: halfTax, sgst: halfTax, igst: tax };
  }, [amount, mode, rate]);

  async function copySummary() {
    const lines = [
      `Taxable value: ${money(result.taxable)}`,
      `GST (${rate}%): ${money(result.tax)}`,
      supplyType === "intra" ? `CGST: ${money(result.cgst)}\nSGST: ${money(result.sgst)}` : `IGST: ${money(result.igst)}`,
      `Total: ${money(result.total)}`,
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    toast.success("GST summary copied.");
  }

  return (
    <ToolLayout toolId="gst-calculator">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              GST Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>GST Rate</Label>
                <Select value={rate} onValueChange={setRate}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {gstRates.map((gstRate) => <SelectItem key={gstRate} value={gstRate}>{gstRate}%</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tax Treatment</Label>
                <RadioGroup value={mode} onValueChange={(value) => setMode(value as "exclusive" | "inclusive")} className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 rounded-md border p-2 text-sm">
                    <RadioGroupItem value="exclusive" />
                    Add GST
                  </label>
                  <label className="flex items-center gap-2 rounded-md border p-2 text-sm">
                    <RadioGroupItem value="inclusive" />
                    Includes GST
                  </label>
                </RadioGroup>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Supply Type</Label>
              <RadioGroup value={supplyType} onValueChange={(value) => setSupplyType(value as "intra" | "inter")} className="grid gap-2 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-md border p-3 text-sm">
                  <RadioGroupItem value="intra" />
                  Intra-state CGST + SGST
                </label>
                <label className="flex items-center gap-2 rounded-md border p-3 text-sm">
                  <RadioGroupItem value="inter" />
                  Inter-state IGST
                </label>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2"><Receipt className="h-5 w-5" />Tax Breakdown</span>
              <Button variant="outline" size="sm" onClick={copySummary}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">Taxable Value</div>
                <div className="text-2xl font-semibold">{money(result.taxable)}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">GST Amount</div>
                <div className="text-2xl font-semibold">{money(result.tax)}</div>
              </div>
            </div>
            <div className="rounded-md border p-4">
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="outline">{rate}% GST</Badge>
                <Badge variant="secondary">{mode === "exclusive" ? "Exclusive" : "Inclusive"}</Badge>
              </div>
              {supplyType === "intra" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><div className="text-sm text-muted-foreground">CGST</div><div className="font-semibold">{money(result.cgst)}</div></div>
                  <div><div className="text-sm text-muted-foreground">SGST</div><div className="font-semibold">{money(result.sgst)}</div></div>
                </div>
              ) : (
                <div><div className="text-sm text-muted-foreground">IGST</div><div className="font-semibold">{money(result.igst)}</div></div>
              )}
            </div>
            <div className="rounded-md bg-primary p-5 text-primary-foreground">
              <div className="text-sm opacity-90">Final Total</div>
              <div className="text-3xl font-bold">{money(result.total)}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
