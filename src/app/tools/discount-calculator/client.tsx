"use client";

import { useMemo, useState } from "react";
import { Calculator, Copy, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabId = "simple" | "multiple" | "reverse" | "compare";

const tabs: { id: TabId; label: string }[] = [
  { id: "simple", label: "Simple" },
  { id: "multiple", label: "Multiple" },
  { id: "reverse", label: "Reverse" },
  { id: "compare", label: "Compare" },
];

function numberFrom(value: string) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : null;
}

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

function ResultRow({ label, value }: { label: string; value: string }) {
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    toast.success("Result copied");
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-muted p-4">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-medium break-all">{value}</p>
      </div>
      <Button type="button" variant="ghost" size="icon" onClick={copy} aria-label="Copy result">
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function Client() {
  const [tab, setTab] = useState<TabId>("simple");
  const [simplePrice, setSimplePrice] = useState("");
  const [simpleDiscount, setSimpleDiscount] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discounts, setDiscounts] = useState([""]);
  const [finalPrice, setFinalPrice] = useState("");
  const [reverseDiscount, setReverseDiscount] = useState("");
  const [priceA, setPriceA] = useState("");
  const [discountA, setDiscountA] = useState("");
  const [priceB, setPriceB] = useState("");
  const [discountB, setDiscountB] = useState("");

  const simpleResult = useMemo(() => {
    const price = numberFrom(simplePrice);
    const discount = numberFrom(simpleDiscount);
    if (price === null || discount === null || discount < 0 || discount > 100) return null;
    const saved = price * (discount / 100);
    return { final: money(price - saved), saved: money(saved) };
  }, [simpleDiscount, simplePrice]);

  const multipleResult = useMemo(() => {
    const price = numberFrom(basePrice);
    if (price === null) return null;
    const values = discounts.map(numberFrom).filter((value): value is number => value !== null);
    if (!values.length || values.some((value) => value < 0 || value > 100)) return null;
    const final = values.reduce((current, discount) => current * (1 - discount / 100), price);
    const saved = price - final;
    return { final: money(final), saved: money(saved), rate: `${((saved / price) * 100).toFixed(2)}%` };
  }, [basePrice, discounts]);

  const reverseResult = useMemo(() => {
    const final = numberFrom(finalPrice);
    const discount = numberFrom(reverseDiscount);
    if (final === null || discount === null || discount < 0 || discount >= 100) return null;
    return money(final / (1 - discount / 100));
  }, [finalPrice, reverseDiscount]);

  const compareResult = useMemo(() => {
    const a = numberFrom(priceA);
    const da = numberFrom(discountA);
    const b = numberFrom(priceB);
    const db = numberFrom(discountB);
    if (a === null || da === null || b === null || db === null || da < 0 || da > 100 || db < 0 || db > 100) {
      return null;
    }
    const finalA = a * (1 - da / 100);
    const finalB = b * (1 - db / 100);
    return {
      finalA: money(finalA),
      finalB: money(finalB),
      diff: money(Math.abs(finalA - finalB)),
      better: finalA < finalB ? 1 : finalB < finalA ? 2 : 0,
    };
  }, [discountA, discountB, priceA, priceB]);

  const updateDiscount = (index: number, value: string) => {
    setDiscounts((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  return (
    <ToolLayout toolId="discount-calculator">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Discount Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(value) => setTab(value as TabId)}>
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4">
                {tabs.map((item) => (
                  <TabsTrigger key={item.id} value={item.id} className="h-8">
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="simple" className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="simple-price">Original Price ($)</Label>
                    <Input id="simple-price" type="number" placeholder="100" value={simplePrice} onChange={(event) => setSimplePrice(event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="simple-discount">Discount (%)</Label>
                    <Input id="simple-discount" type="number" placeholder="20" value={simpleDiscount} onChange={(event) => setSimpleDiscount(event.target.value)} />
                  </div>
                </div>
                {simpleResult && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <ResultRow label="Final Price" value={simpleResult.final} />
                    <ResultRow label="You Save" value={simpleResult.saved} />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="multiple" className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base-price">Base Price ($)</Label>
                  <Input id="base-price" type="number" placeholder="100" value={basePrice} onChange={(event) => setBasePrice(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label>Discount Percentages</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => setDiscounts((current) => [...current, ""])}>
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  {discounts.map((discount, index) => (
                    <div key={index} className="flex gap-2">
                      <Input type="number" placeholder={`Discount ${index + 1}`} value={discount} onChange={(event) => updateDiscount(index, event.target.value)} />
                      {discounts.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => setDiscounts((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label="Remove discount">
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {multipleResult && (
                  <div className="grid gap-4 md:grid-cols-3">
                    <ResultRow label="Final Price" value={multipleResult.final} />
                    <ResultRow label="Total Savings" value={multipleResult.saved} />
                    <ResultRow label="Effective Rate" value={multipleResult.rate} />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reverse" className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="final-price">Final Price ($)</Label>
                    <Input id="final-price" type="number" placeholder="80" value={finalPrice} onChange={(event) => setFinalPrice(event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reverse-discount">Discount (%)</Label>
                    <Input id="reverse-discount" type="number" placeholder="20" value={reverseDiscount} onChange={(event) => setReverseDiscount(event.target.value)} />
                  </div>
                </div>
                {reverseDiscount && numberFrom(reverseDiscount)! >= 100 && <p className="text-sm text-destructive">Discount must be less than 100%.</p>}
                {reverseResult && <ResultRow label="Original Price" value={reverseResult} />}
              </TabsContent>

              <TabsContent value="compare" className="mt-6 space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <p className="font-medium">Option 1</p>
                    <Input type="number" placeholder="Price" value={priceA} onChange={(event) => setPriceA(event.target.value)} />
                    <Input type="number" placeholder="Discount %" value={discountA} onChange={(event) => setDiscountA(event.target.value)} />
                  </div>
                  <div className="space-y-3">
                    <p className="font-medium">Option 2</p>
                    <Input type="number" placeholder="Price" value={priceB} onChange={(event) => setPriceB(event.target.value)} />
                    <Input type="number" placeholder="Discount %" value={discountB} onChange={(event) => setDiscountB(event.target.value)} />
                  </div>
                </div>
                {compareResult && (
                  <div className="grid gap-4 md:grid-cols-3">
                    <ResultRow label={compareResult.better === 1 ? "Option 1 - Better Deal" : "Option 1"} value={compareResult.finalA} />
                    <ResultRow label={compareResult.better === 2 ? "Option 2 - Better Deal" : "Option 2"} value={compareResult.finalB} />
                    <ResultRow label="Difference" value={compareResult.diff} />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
