'use client'

import { useState, useEffect } from 'react';
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CompoundResult {
  totalPrincipal: number;
  totalInterest: number;
  totalAmount: number;
  yearlyBreakdown: {
    year: number;
    principal: number;
    interest: number;
    totalAmount: number;
  }[];
}

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "JPY", label: "JPY (¥)", symbol: "¥" },
  { value: "INR", label: "INR (₹)", symbol: "₹" },
  { value: "CAD", label: "CAD ($)", symbol: "$" },
  { value: "AUD", label: "AUD ($)", symbol: "$" },
  { value: "CNY", label: "CNY (¥)", symbol: "¥" },
];

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState<number>(10000);
  const [annualContribution, setAnnualContribution] = useState<number>(1200);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [years, setYears] = useState<number>(10);
  const [compoundFrequency, setCompoundFrequency] = useState<number>(12); // Monthly
  const [contributionTime, setContributionTime] = useState<string>("end"); // "start" or "end" of period
  const [currency, setCurrency] = useState<string>("USD");
  const [result, setResult] = useState<CompoundResult>({
    totalPrincipal: 0,
    totalInterest: 0,
    totalAmount: 0,
    yearlyBreakdown: [],
  });

  // Calculate compound interest
  const calculateCompoundInterest = () => {
    let currentPrincipal = principal;
    let totalContributions = principal;
    let yearlyData = [];

    const periodicRate = interestRate / (100 * compoundFrequency);
    const periodsPerYear = compoundFrequency;
    const contributionPerPeriod = annualContribution / periodsPerYear;
    
    let totalValue = currentPrincipal;
    
    for (let year = 1; year <= years; year++) {
      for (let period = 1; period <= periodsPerYear; period++) {
        // Add contribution at the start if selected
        if (contributionTime === "start") {
          totalValue += contributionPerPeriod;
          totalContributions += contributionPerPeriod;
        }
        
        // Calculate interest for this period
        totalValue = totalValue * (1 + periodicRate);
        
        // Add contribution at the end if selected
        if (contributionTime === "end") {
          totalValue += contributionPerPeriod;
          totalContributions += contributionPerPeriod;
        }
      }
      
      // Store data for this year
      yearlyData.push({
        year,
        principal: Number(totalContributions.toFixed(2)),
        interest: Number((totalValue - totalContributions).toFixed(2)),
        totalAmount: Number(totalValue.toFixed(2)),
      });
    }
    
    setResult({
      totalPrincipal: Number(totalContributions.toFixed(2)),
      totalInterest: Number((totalValue - totalContributions).toFixed(2)),
      totalAmount: Number(totalValue.toFixed(2)),
      yearlyBreakdown: yearlyData,
    });
  };

  // Calculate on input change
  useEffect(() => {
    calculateCompoundInterest();
  }, [principal, annualContribution, interestRate, years, compoundFrequency, contributionTime]);

  // Format currency
  const formatCurrency = (value: number) => {
    const currencyObj = CURRENCIES.find(c => c.value === currency) || CURRENCIES[0];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Reset to defaults
  const resetValues = () => {
    setPrincipal(10000);
    setAnnualContribution(1200);
    setInterestRate(5);
    setYears(10);
    setCompoundFrequency(12);
    setContributionTime("end");
    toast.success("Values reset to defaults");
  };

  // Handle numeric input changes
  const handleNumericInput = (setter: React.Dispatch<React.SetStateAction<number>>, min: number = 0) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value === "" ? "" : parseFloat(e.target.value);
      if (value === "") {
        setter(0);
      } else if (!isNaN(value as number) && (value as number) >= min) {
        setter(value as number);
      }
    };

  return (
    <ToolLayout toolId="compound-interest-calculator" categoryId="calculators">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calculator Inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="principal">Initial Investment</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      {CURRENCIES.find(c => c.value === currency)?.symbol || "$"}
                    </span>
                    <Input
                      id="principal"
                      type="text"
                      value={principal === 0 ? "" : principal}
                      onChange={handleNumericInput(setPrincipal)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contribution">Annual Contribution</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      {CURRENCIES.find(c => c.value === currency)?.symbol || "$"}
                    </span>
                    <Input
                      id="contribution"
                      type="text"
                      value={annualContribution === 0 ? "" : annualContribution}
                      onChange={handleNumericInput(setAnnualContribution)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="interest-rate">Annual Interest Rate</Label>
                    <span className="text-muted-foreground">{interestRate}%</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <Slider
                      value={[interestRate]}
                      min={0}
                      max={20}
                      step={0.1}
                      onValueChange={(value) => setInterestRate(value[0])}
                    />
                    <Input
                      id="interest-rate"
                      type="text"
                      value={interestRate === 0 ? "" : interestRate}
                      onChange={handleNumericInput(setInterestRate)}
                      className="w-20"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="years">Investment Period (Years)</Label>
                    <span className="text-muted-foreground">{years} years</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <Slider
                      value={[years]}
                      min={1}
                      max={50}
                      step={1}
                      onValueChange={(value) => setYears(value[0])}
                    />
                    <Input
                      id="years"
                      type="text"
                      value={years === 0 ? "" : years}
                      onChange={handleNumericInput(setYears, 1)}
                      className="w-20"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="compounding-frequency">Compounding Frequency</Label>
                  <Tabs 
                    defaultValue="12" 
                    value={compoundFrequency.toString()} 
                    onValueChange={(value) => setCompoundFrequency(parseInt(value))}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="1">Yearly</TabsTrigger>
                      <TabsTrigger value="4">Quarterly</TabsTrigger>
                    </TabsList>
                    <TabsList className="grid grid-cols-2 w-full mt-2">
                      <TabsTrigger value="12">Monthly</TabsTrigger>
                      <TabsTrigger value="365">Daily</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contribution-timing">Contribution Timing</Label>
                  <Tabs 
                    defaultValue="end" 
                    value={contributionTime} 
                    onValueChange={setContributionTime}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="start">Start of Period</TabsTrigger>
                      <TabsTrigger value="end">End of Period</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
            
            <Button variant="outline" onClick={resetValues} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Values
            </Button>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium text-muted-foreground mb-1">Initial Investment</h3>
                  <div className="text-2xl font-bold">{formatCurrency(principal)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium text-muted-foreground mb-1">Total Contributions</h3>
                  <div className="text-2xl font-bold">{formatCurrency(result.totalPrincipal)}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <h3 className="font-medium text-primary-foreground/80 mb-1">Final Balance</h3>
                  <div className="text-2xl font-bold">{formatCurrency(result.totalAmount)}</div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Growth Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={result.yearlyBreakdown}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="year" 
                        label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} 
                      />
                      <YAxis 
                        tickFormatter={(value) => `${CURRENCIES.find(c => c.value === currency)?.symbol || "$"}${value.toLocaleString()}`}
                      />
                      <Tooltip 
                        formatter={(value) => [`${CURRENCIES.find(c => c.value === currency)?.symbol || "$"}${Number(value).toLocaleString()}`, undefined]} 
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="principal" 
                        name="Total Contributions" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="interest" 
                        name="Interest Earned" 
                        stroke="#82ca9d" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalAmount" 
                        name="Total Value" 
                        stroke="#ff7300" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Initial Investment</span>
                    <span className="font-medium">{formatCurrency(principal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Contributions</span>
                    <span className="font-medium">{formatCurrency(result.totalPrincipal - principal)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span>Total Principal</span>
                    <span className="font-medium">{formatCurrency(result.totalPrincipal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Interest</span>
                    <span className="font-medium text-green-600">{formatCurrency(result.totalInterest)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center font-bold">
                    <span>Final Balance</span>
                    <span>{formatCurrency(result.totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}