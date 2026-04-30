"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Strategy = "conservative" | "balanced" | "aggressive";

const currencies = ["INR", "USD", "EUR", "GBP", "JPY", "CAD", "AUD"];
const strategies: Record<Strategy, { label: string; adjustment: number; description: string }> = {
  conservative: { label: "Conservative", adjustment: -2, description: "Lower risk, lower potential returns" },
  balanced: { label: "Balanced", adjustment: 0, description: "Medium risk, medium potential returns" },
  aggressive: { label: "Aggressive", adjustment: 2, description: "Higher risk, higher potential returns" },
};

function project(initial: number, monthly: number, annualReturn: number, years: number, strategy: Strategy) {
  const monthlyRate = (annualReturn + strategies[strategy].adjustment) / 100 / 12;
  let balance = initial;
  let contributions = 0;
  let interest = 0;

  return Array.from({ length: years }, (_, index) => {
    for (let month = 0; month < 12; month += 1) {
      const earned = balance * monthlyRate;
      balance += earned + monthly;
      contributions += monthly;
      interest += earned;
    }
    return {
      year: index + 1,
      initial,
      contributions: Number(contributions.toFixed(2)),
      interest: Number(interest.toFixed(2)),
      balance: Number(balance.toFixed(2)),
    };
  });
}

export default function Client() {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [years, setYears] = useState(20);
  const [strategy, setStrategy] = useState<Strategy>("aggressive");
  const [currency, setCurrency] = useState("INR");
  const [view, setView] = useState("chart");

  const results = useMemo(
    () => project(initialInvestment, monthlyContribution, annualReturn, years, strategy),
    [annualReturn, initialInvestment, monthlyContribution, strategy, years],
  );
  const final = results.at(-1);
  const chartData = results.filter((_, index) => index % Math.ceil(years / 12) === 0 || index === results.length - 1);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);

  const totalContributions = final ? final.contributions + initialInvestment : initialInvestment;
  const growthMultiple = final && totalContributions > 0 ? final.balance / totalContributions : 0;

  return (
    <ToolLayout toolId="investment-calculator">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[340px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{currencies.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="initial">Initial Investment</Label>
              <Input id="initial" type="number" min={0} value={initialInvestment} onChange={(event) => setInitialInvestment(Math.max(0, Number(event.target.value) || 0))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly">Monthly Contribution</Label>
              <Input id="monthly" type="number" min={0} value={monthlyContribution} onChange={(event) => setMonthlyContribution(Math.max(0, Number(event.target.value) || 0))} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between gap-4">
                <Label>Annual Return</Label>
                <span className="text-sm text-muted-foreground">{annualReturn}%</span>
              </div>
              <Slider min={1} max={15} step={0.1} value={[annualReturn]} onValueChange={([value]) => setAnnualReturn(value ?? 1)} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between gap-4">
                <Label>Investment Period</Label>
                <span className="text-sm text-muted-foreground">{years} years</span>
              </div>
              <Slider min={1} max={40} step={1} value={[years]} onValueChange={([value]) => setYears(value ?? 1)} />
            </div>
            <div className="space-y-2">
              <Label>Strategy</Label>
              <Select value={strategy} onValueChange={(value) => setStrategy(value as Strategy)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(strategies).map(([key, item]) => (
                    <SelectItem key={key} value={key}>{item.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{strategies[strategy].description}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card><CardContent className="space-y-1 pt-4"><p className="text-sm text-muted-foreground">Final Balance</p><p className="text-2xl font-bold">{formatCurrency(final?.balance ?? 0)}</p></CardContent></Card>
            <Card><CardContent className="space-y-1 pt-4"><p className="text-sm text-muted-foreground">Contributions</p><p className="text-2xl font-bold">{formatCurrency(totalContributions)}</p></CardContent></Card>
            <Card><CardContent className="space-y-1 pt-4"><p className="text-sm text-muted-foreground">Interest</p><p className="text-2xl font-bold">{formatCurrency(final?.interest ?? 0)}</p></CardContent></Card>
            <Card><CardContent className="space-y-1 pt-4"><p className="text-sm text-muted-foreground">Multiple</p><p className="text-2xl font-bold">{growthMultiple.toFixed(2)}x</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={view} onValueChange={setView}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="table">Table</TabsTrigger>
                </TabsList>
                <TabsContent value="chart" className="mt-4">
                  <div className="h-[340px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" tickLine={false} />
                        <YAxis tickFormatter={(value) => formatCurrency(Number(value))} width={80} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} labelFormatter={(label) => `Year ${label}`} />
                        <Bar dataKey="initial" stackId="growth" name="Initial" fill="#6366f1" />
                        <Bar dataKey="contributions" stackId="growth" name="Contributions" fill="#22c55e" />
                        <Bar dataKey="interest" stackId="growth" name="Interest" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="table" className="mt-4 max-h-[340px] overflow-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background">
                      <tr>
                        <th className="p-2 text-left">Year</th>
                        <th className="p-2 text-right">Balance</th>
                        <th className="p-2 text-right">Contributions</th>
                        <th className="p-2 text-right">Interest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row) => (
                        <tr key={row.year} className="border-t">
                          <td className="p-2">{row.year}</td>
                          <td className="p-2 text-right">{formatCurrency(row.balance)}</td>
                          <td className="p-2 text-right">{formatCurrency(row.contributions + initialInvestment)}</td>
                          <td className="p-2 text-right">{formatCurrency(row.interest)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
