"use client";

import { useMemo, useState } from "react";
import { Calculator, RefreshCw } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const currencies = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "JPY", label: "JPY (¥)" },
  { value: "INR", label: "INR (₹)" },
  { value: "CAD", label: "CAD ($)" },
  { value: "AUD", label: "AUD ($)" },
  { value: "CNY", label: "CNY (¥)" },
];

function calculate(
  principal: number,
  annualContribution: number,
  interestRate: number,
  years: number,
  compoundFrequency: number,
  contributionTime: string,
) {
  const periodicRate = interestRate / (100 * compoundFrequency);
  const contributionPerPeriod = annualContribution / compoundFrequency;
  let totalValue = principal;
  let totalPrincipal = principal;

  const yearlyBreakdown = Array.from({ length: years }, (_, index) => {
    for (let period = 0; period < compoundFrequency; period += 1) {
      if (contributionTime === "start") {
        totalValue += contributionPerPeriod;
        totalPrincipal += contributionPerPeriod;
      }
      totalValue *= 1 + periodicRate;
      if (contributionTime === "end") {
        totalValue += contributionPerPeriod;
        totalPrincipal += contributionPerPeriod;
      }
    }

    return {
      year: index + 1,
      principal: Number(totalPrincipal.toFixed(2)),
      interest: Number((totalValue - totalPrincipal).toFixed(2)),
      totalAmount: Number(totalValue.toFixed(2)),
    };
  });

  return {
    totalPrincipal: Number(totalPrincipal.toFixed(2)),
    totalInterest: Number((totalValue - totalPrincipal).toFixed(2)),
    totalAmount: Number(totalValue.toFixed(2)),
    yearlyBreakdown,
  };
}

export default function Client() {
  const [principal, setPrincipal] = useState(10000);
  const [annualContribution, setAnnualContribution] = useState(1200);
  const [interestRate, setInterestRate] = useState(5);
  const [years, setYears] = useState(10);
  const [compoundFrequency, setCompoundFrequency] = useState(12);
  const [contributionTime, setContributionTime] = useState("end");
  const [currency, setCurrency] = useState("USD");

  const result = useMemo(
    () => calculate(principal, annualContribution, interestRate, years, compoundFrequency, contributionTime),
    [annualContribution, compoundFrequency, contributionTime, interestRate, principal, years],
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const setNumber = (setter: (value: number) => void, min = 0) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(event.target.value);
    setter(Number.isFinite(value) ? Math.max(min, value) : min);
  };

  const reset = () => {
    setPrincipal(10000);
    setAnnualContribution(1200);
    setInterestRate(5);
    setYears(10);
    setCompoundFrequency(12);
    setContributionTime("end");
  };

  return (
    <ToolLayout toolId="compound-interest-calculator">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[340px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Inputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="principal">Initial Investment</Label>
              <Input id="principal" type="number" value={principal} onChange={setNumber(setPrincipal)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annual-contribution">Annual Contribution</Label>
              <Input id="annual-contribution" type="number" value={annualContribution} onChange={setNumber(setAnnualContribution)} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between gap-4">
                <Label htmlFor="interest-rate">Annual Interest Rate</Label>
                <span className="text-sm text-muted-foreground">{interestRate}%</span>
              </div>
              <div className="flex items-center gap-4">
                <Slider min={0} max={20} step={0.1} value={[interestRate]} onValueChange={([value]) => setInterestRate(value ?? 0)} />
                <Input id="interest-rate" type="number" value={interestRate} onChange={setNumber(setInterestRate)} className="w-20" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between gap-4">
                <Label htmlFor="years">Investment Period</Label>
                <span className="text-sm text-muted-foreground">{years} years</span>
              </div>
              <div className="flex items-center gap-4">
                <Slider min={1} max={50} step={1} value={[years]} onValueChange={([value]) => setYears(value ?? 1)} />
                <Input id="years" type="number" value={years} onChange={setNumber(setYears, 1)} className="w-20" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Compounding Frequency</Label>
              <Tabs value={String(compoundFrequency)} onValueChange={(value) => setCompoundFrequency(Number(value))}>
                <TabsList className="grid h-auto w-full grid-cols-2 gap-1">
                  <TabsTrigger value="1">Yearly</TabsTrigger>
                  <TabsTrigger value="4">Quarterly</TabsTrigger>
                  <TabsTrigger value="12">Monthly</TabsTrigger>
                  <TabsTrigger value="365">Daily</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label>Contribution Timing</Label>
              <Tabs value={contributionTime} onValueChange={setContributionTime}>
                <TabsList className="grid h-auto w-full grid-cols-2 gap-1">
                  <TabsTrigger value="start">Start</TabsTrigger>
                  <TabsTrigger value="end">End</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Button type="button" variant="outline" className="w-full" onClick={reset}>
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="space-y-1 pt-4">
                <p className="text-sm text-muted-foreground">Total Contributions</p>
                <p className="text-2xl font-bold">{formatCurrency(result.totalPrincipal)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-1 pt-4">
                <p className="text-sm text-muted-foreground">Interest Earned</p>
                <p className="text-2xl font-bold">{formatCurrency(result.totalInterest)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-1 pt-4">
                <p className="text-sm text-muted-foreground">Final Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(result.totalAmount)}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Growth Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.yearlyBreakdown} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tickLine={false} />
                    <YAxis tickFormatter={(value) => formatCurrency(Number(value))} width={80} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} labelFormatter={(label) => `Year ${label}`} />
                    <Line type="monotone" dataKey="principal" name="Contributions" stroke="#64748b" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="totalAmount" name="Balance" stroke="#2563eb" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
