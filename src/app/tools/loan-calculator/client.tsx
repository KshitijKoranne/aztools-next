"use client";

import { useMemo, useState } from "react";
import { Calculator, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

type Frequency = "monthly" | "biweekly" | "weekly";

const currencies = ["INR", "USD", "EUR", "GBP", "JPY", "CAD", "AUD"];
const paymentsPerYear: Record<Frequency, number> = { monthly: 12, biweekly: 26, weekly: 52 };

function calculateLoan(principal: number, interestRate: number, years: number, frequency: Frequency) {
  const periods = years * paymentsPerYear[frequency];
  const periodicRate = interestRate / 100 / paymentsPerYear[frequency];
  const payment =
    periodicRate === 0
      ? principal / periods
      : (principal * periodicRate * (1 + periodicRate) ** periods) / ((1 + periodicRate) ** periods - 1);

  let balance = principal;
  let totalInterest = 0;
  const schedule = Array.from({ length: periods }, (_, index) => {
    const interestPaid = balance * periodicRate;
    const principalPaid = payment - interestPaid;
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interestPaid;
    return {
      paymentNumber: index + 1,
      paymentAmount: payment,
      principalPaid,
      interestPaid,
      remainingBalance: balance,
      totalInterestPaid: totalInterest,
    };
  });

  return { payment, totalInterest, totalPayments: payment * periods, schedule };
}

export default function Client() {
  const [principal, setPrincipal] = useState(300000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [currency, setCurrency] = useState("INR");

  const result = useMemo(() => calculateLoan(principal, interestRate, loanTerm, frequency), [frequency, interestRate, loanTerm, principal]);
  const chartData = useMemo(() => {
    const interval = Math.max(1, Math.floor(result.schedule.length / 18));
    return result.schedule.filter((_, index) => index % interval === 0 || index === result.schedule.length - 1);
  }, [result.schedule]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);

  const reset = () => {
    setPrincipal(300000);
    setInterestRate(5.5);
    setLoanTerm(30);
    setFrequency("monthly");
    setCurrency("INR");
  };

  const exportCsv = () => {
    const rows = [
      "Payment Number,Payment Amount,Principal Paid,Interest Paid,Remaining Balance",
      ...result.schedule.map((row) =>
        [row.paymentNumber, row.paymentAmount, row.principalPaid, row.interestPaid, row.remainingBalance]
          .map((value) => (typeof value === "number" ? value.toFixed(2) : value))
          .join(","),
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "loan-amortization.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Amortization CSV downloaded");
  };

  return (
    <ToolLayout toolId="loan-calculator">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[340px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Loan Details
            </CardTitle>
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
              <Label htmlFor="principal">Loan Amount</Label>
              <Input id="principal" type="number" value={principal} onChange={(event) => setPrincipal(Math.max(0, Number(event.target.value) || 0))} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between gap-4">
                <Label>Interest Rate</Label>
                <span className="text-sm text-muted-foreground">{interestRate}%</span>
              </div>
              <Slider min={0.1} max={20} step={0.1} value={[interestRate]} onValueChange={([value]) => setInterestRate(value ?? 0.1)} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between gap-4">
                <Label>Loan Term</Label>
                <span className="text-sm text-muted-foreground">{loanTerm} years</span>
              </div>
              <Slider min={1} max={40} step={1} value={[loanTerm]} onValueChange={([value]) => setLoanTerm(value ?? 1)} />
            </div>
            <div className="space-y-2">
              <Label>Payment Frequency</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["monthly", "biweekly", "weekly"] as Frequency[]).map((item) => (
                  <Button key={item} type="button" variant={frequency === item ? "default" : "outline"} onClick={() => setFrequency(item)}>
                    {item === "biweekly" ? "Bi-weekly" : item[0].toUpperCase() + item.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" />Reset</Button>
              <Button type="button" variant="outline" onClick={exportCsv}><Download className="h-4 w-4" />CSV</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardContent className="space-y-1 pt-4"><p className="text-sm text-muted-foreground">Payment</p><p className="text-2xl font-bold">{formatCurrency(result.payment)}</p></CardContent></Card>
            <Card><CardContent className="space-y-1 pt-4"><p className="text-sm text-muted-foreground">Total Interest</p><p className="text-2xl font-bold">{formatCurrency(result.totalInterest)}</p></CardContent></Card>
            <Card><CardContent className="space-y-1 pt-4"><p className="text-sm text-muted-foreground">Total Paid</p><p className="text-2xl font-bold">{formatCurrency(result.totalPayments)}</p></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Balance Over Time</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="paymentNumber" tickLine={false} />
                    <YAxis tickFormatter={(value) => formatCurrency(Number(value))} width={80} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} labelFormatter={(label) => `Payment ${label}`} />
                    <Line type="monotone" dataKey="remainingBalance" name="Balance" stroke="#2563eb" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="totalInterestPaid" name="Interest Paid" stroke="#f97316" strokeWidth={2} dot={false} />
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
