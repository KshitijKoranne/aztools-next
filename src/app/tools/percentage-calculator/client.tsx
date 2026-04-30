"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Calculator, Copy, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabId = "percentage-of" | "percentage-change" | "percentage-point" | "increase-decrease" | "reverse";

const tabs: { id: TabId; label: string; shortLabel: string }[] = [
  { id: "percentage-of", label: "% of Value", shortLabel: "% of" },
  { id: "percentage-change", label: "% Change", shortLabel: "% Chg" },
  { id: "percentage-point", label: "% Points", shortLabel: "Points" },
  { id: "increase-decrease", label: "Inc/Dec", shortLabel: "Inc/Dec" },
  { id: "reverse", label: "Reverse %", shortLabel: "Rev %" },
];

function parseInput(value: string) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : null;
}

function formatNumber(value: number) {
  return Number.parseFloat(value.toFixed(8)).toString();
}

function ResultRow({ label, value }: { label: string; value: string }) {
  const copyValue = async () => {
    await navigator.clipboard.writeText(value);
    toast.success("Result copied");
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-muted p-4">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-medium break-all">{value}</p>
      </div>
      <Button type="button" variant="ghost" size="icon" onClick={copyValue} aria-label="Copy result">
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function Client() {
  const [activeTab, setActiveTab] = useState<TabId>("percentage-of");
  const [percentageOfValue, setPercentageOfValue] = useState("");
  const [percentageOfBase, setPercentageOfBase] = useState("");
  const [initialValue, setInitialValue] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [firstPercentage, setFirstPercentage] = useState("");
  const [secondPercentage, setSecondPercentage] = useState("");
  const [baseValue, setBaseValue] = useState("");
  const [percentageAmount, setPercentageAmount] = useState("");
  const [isIncrease, setIsIncrease] = useState(true);
  const [finalAmount, setFinalAmount] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");

  const percentageOfResult = useMemo(() => {
    const percentage = parseInput(percentageOfValue);
    const base = parseInput(percentageOfBase);
    if (percentage === null || base === null) return null;
    return `${formatNumber((percentage / 100) * base)}`;
  }, [percentageOfBase, percentageOfValue]);

  const percentageChangeResult = useMemo(() => {
    const initial = parseInput(initialValue);
    const final = parseInput(finalValue);
    if (initial === null || final === null || initial === 0) return null;
    const change = ((final - initial) / Math.abs(initial)) * 100;
    return `${formatNumber(change)}%`;
  }, [finalValue, initialValue]);

  const percentagePointResult = useMemo(() => {
    const first = parseInput(firstPercentage);
    const second = parseInput(secondPercentage);
    if (first === null || second === null) return null;
    return `${formatNumber(second - first)} points`;
  }, [firstPercentage, secondPercentage]);

  const increaseDecreaseResult = useMemo(() => {
    const base = parseInput(baseValue);
    const percentage = parseInput(percentageAmount);
    if (base === null || percentage === null) return null;
    const factor = isIncrease ? 1 + percentage / 100 : 1 - percentage / 100;
    return formatNumber(base * factor);
  }, [baseValue, isIncrease, percentageAmount]);

  const reverseResult = useMemo(() => {
    const final = parseInput(finalAmount);
    const discount = parseInput(discountPercentage);
    if (final === null || discount === null || discount >= 100) return null;
    return formatNumber(final / (1 - discount / 100));
  }, [discountPercentage, finalAmount]);

  return (
    <ToolLayout toolId="percentage-calculator">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Percentage Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabId)}>
              <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="h-8 grow sm:grow-0 sm:px-3">
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="percentage-of" className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
                  <div className="space-y-2">
                    <Label htmlFor="percentage-value">Percentage (%)</Label>
                    <Input
                      id="percentage-value"
                      type="number"
                      placeholder="15"
                      value={percentageOfValue}
                      onChange={(event) => setPercentageOfValue(event.target.value)}
                    />
                  </div>
                  <div className="flex h-8 items-center justify-center text-sm font-medium text-muted-foreground">
                    of
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="percentage-base">Value</Label>
                    <Input
                      id="percentage-base"
                      type="number"
                      placeholder="200"
                      value={percentageOfBase}
                      onChange={(event) => setPercentageOfBase(event.target.value)}
                    />
                  </div>
                </div>
                {percentageOfResult && <ResultRow label="Result" value={percentageOfResult} />}
              </TabsContent>

              <TabsContent value="percentage-change" className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
                  <div className="space-y-2">
                    <Label htmlFor="initial-value">Initial Value</Label>
                    <Input
                      id="initial-value"
                      type="number"
                      placeholder="100"
                      value={initialValue}
                      onChange={(event) => setInitialValue(event.target.value)}
                    />
                  </div>
                  <div className="flex h-8 items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="final-value">Final Value</Label>
                    <Input
                      id="final-value"
                      type="number"
                      placeholder="150"
                      value={finalValue}
                      onChange={(event) => setFinalValue(event.target.value)}
                    />
                  </div>
                </div>
                {initialValue && parseInput(initialValue) === 0 && (
                  <p className="text-sm text-destructive">Initial value cannot be zero.</p>
                )}
                {percentageChangeResult && <ResultRow label="Percentage Change" value={percentageChangeResult} />}
              </TabsContent>

              <TabsContent value="percentage-point" className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
                  <div className="space-y-2">
                    <Label htmlFor="first-percentage">First Percentage (%)</Label>
                    <Input
                      id="first-percentage"
                      type="number"
                      placeholder="10"
                      value={firstPercentage}
                      onChange={(event) => setFirstPercentage(event.target.value)}
                    />
                  </div>
                  <div className="flex h-8 items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="second-percentage">Second Percentage (%)</Label>
                    <Input
                      id="second-percentage"
                      type="number"
                      placeholder="15"
                      value={secondPercentage}
                      onChange={(event) => setSecondPercentage(event.target.value)}
                    />
                  </div>
                </div>
                {percentagePointResult && <ResultRow label="Percentage Point Difference" value={percentagePointResult} />}
              </TabsContent>

              <TabsContent value="increase-decrease" className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                  <div className="space-y-2">
                    <Label htmlFor="base-value">Value</Label>
                    <Input
                      id="base-value"
                      type="number"
                      placeholder="200"
                      value={baseValue}
                      onChange={(event) => setBaseValue(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="percentage-amount">Percentage (%)</Label>
                    <Input
                      id="percentage-amount"
                      type="number"
                      placeholder="15"
                      value={percentageAmount}
                      onChange={(event) => setPercentageAmount(event.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={isIncrease ? "default" : "outline"}
                      size="icon"
                      onClick={() => setIsIncrease(true)}
                      aria-label="Increase"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant={!isIncrease ? "default" : "outline"}
                      size="icon"
                      onClick={() => setIsIncrease(false)}
                      aria-label="Decrease"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {increaseDecreaseResult && (
                  <ResultRow label={`Result after ${isIncrease ? "increase" : "decrease"}`} value={increaseDecreaseResult} />
                )}
              </TabsContent>

              <TabsContent value="reverse" className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="final-amount">Amount After Discount</Label>
                    <Input
                      id="final-amount"
                      type="number"
                      placeholder="85"
                      value={finalAmount}
                      onChange={(event) => setFinalAmount(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount-percentage">Discount Percentage (%)</Label>
                    <Input
                      id="discount-percentage"
                      type="number"
                      placeholder="15"
                      value={discountPercentage}
                      onChange={(event) => setDiscountPercentage(event.target.value)}
                    />
                  </div>
                </div>
                {discountPercentage && parseInput(discountPercentage)! >= 100 && (
                  <p className="text-sm text-destructive">Discount percentage must be less than 100%.</p>
                )}
                {reverseResult && <ResultRow label="Original Amount" value={reverseResult} />}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
