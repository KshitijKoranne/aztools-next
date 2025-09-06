'use client'

import { useState, useEffect } from 'react';
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from 'sonner';
import { currencyOptions, SupportedCurrency, formatCurrency } from "@/utils/currency";

export default function InvestmentCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [years, setYears] = useState(20);
  const [investmentStrategy, setInvestmentStrategy] = useState("aggressive");
  const [results, setResults] = useState<Array<{ year: number; investment: number; contributions: number; interest: number; balance: number }>>([]);
  const [tabValue, setTabValue] = useState("chart");
  const [currency, setCurrency] = useState<SupportedCurrency>("INR");

  // Strategy adjustment factors (representing different risk/return profiles)
  const strategies = {
    conservative: { returnAdjustment: -2, description: "Lower risk, lower potential returns" },
    balanced: { returnAdjustment: 0, description: "Medium risk, medium potential returns" },
    aggressive: { returnAdjustment: 2, description: "Higher risk, higher potential returns" }
  };

  useEffect(() => {
    calculateInvestment();
  }, [initialInvestment, monthlyContribution, annualReturn, years, investmentStrategy]);

  const calculateInvestment = () => {
    try {
      // Adjust return rate based on selected strategy
      const adjustedAnnualReturn = annualReturn + strategies[investmentStrategy as keyof typeof strategies].returnAdjustment;
      const monthlyRate = adjustedAnnualReturn / 100 / 12;
      
      const resultsData = [];
      let balance = initialInvestment;
      let totalContributions = initialInvestment;
      let totalInterest = 0;
      
      for (let year = 1; year <= years; year++) {
        let yearlyContributions = 0;
        let yearlyInterest = 0;
        
        // Calculate each month within the year
        for (let month = 1; month <= 12; month++) {
          const interestEarned = balance * monthlyRate;
          balance += interestEarned + monthlyContribution;
          yearlyContributions += monthlyContribution;
          yearlyInterest += interestEarned;
        }
        
        totalContributions += yearlyContributions;
        totalInterest += yearlyInterest;
        
        resultsData.push({
          year,
          investment: initialInvestment,
          contributions: totalContributions - initialInvestment,
          interest: totalInterest,
          balance,
        });
      }
      
      setResults(resultsData);
    } catch (error) {
      toast.error("Please check your inputs and try again");
    }
  };

  const handleCalculate = () => {
    calculateInvestment();
    toast.success("Investment calculation updated");
  };

  return (
    <ToolLayout toolId="investment-calculator" categoryId="calculators">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={(value) => setCurrency(value as SupportedCurrency)}>
                    <SelectTrigger id="currency" className="w-full">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyOptions.map((option) => (
                        <SelectItem key={option.code} value={option.code}>
                          {option.symbol} {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              
                <div>
                  <Label htmlFor="initial-investment">Initial Investment</Label>
                  <div className="flex items-center mt-2">
                    <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0">{currencyOptions.find(c => c.code === currency)?.symbol || "₹"}</span>
                    <Input 
                      id="initial-investment"
                      type="number"
                      min="0"
                      className="rounded-l-none"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(Number(e.target.value))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="monthly-contribution">Monthly Contribution</Label>
                  <div className="flex items-center mt-2">
                    <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0">{currencyOptions.find(c => c.code === currency)?.symbol || "₹"}</span>
                    <Input 
                      id="monthly-contribution"
                      type="number"
                      min="0"
                      className="rounded-l-none"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Annual Return Rate: {annualReturn}%</Label>
                  <Slider 
                    value={[annualReturn]} 
                    min={1} 
                    max={15} 
                    step={0.1} 
                    onValueChange={(value) => setAnnualReturn(value[0])}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Investment Period: {years} years</Label>
                  <Slider 
                    value={[years]} 
                    min={1} 
                    max={40} 
                    step={1} 
                    onValueChange={(value) => setYears(value[0])}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="investment-strategy">Investment Strategy</Label>
                  <Select value={investmentStrategy} onValueChange={setInvestmentStrategy}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {strategies[investmentStrategy as keyof typeof strategies].description}
                  </p>
                </div>
                
                <Button onClick={handleCalculate} className="w-full">
                  Calculate
                </Button>
              </CardContent>
            </Card>
            
            {results.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Final Balance</p>
                      <p className="text-xl font-bold">{formatCurrency(results[results.length - 1].balance, currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Contributions</p>
                      <p className="text-lg font-medium">{formatCurrency(results[results.length - 1].contributions + initialInvestment, currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Interest</p>
                      <p className="text-lg font-medium">{formatCurrency(results[results.length - 1].interest, currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Growth Multiple</p>
                      <p className="text-lg font-medium">
                        {(results[results.length - 1].balance / (results[results.length - 1].contributions + initialInvestment)).toFixed(2)}x
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="md:col-span-2">
            {results.length > 0 ? (
              <Tabs value={tabValue} onValueChange={setTabValue}>
                <Card>
                  <TabsList className="w-full rounded-b-none">
                    <TabsTrigger value="chart" className="flex-1">Chart</TabsTrigger>
                    <TabsTrigger value="table" className="flex-1">Table</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chart" className="m-0">
                    <CardContent className="pt-6">
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                          data={results.filter((_, index) => index % Math.ceil(years / 10) === 0 || index === results.length - 1)}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                          <YAxis 
                            tickFormatter={(value) => `${currencyOptions.find(c => c.code === currency)?.symbol || "₹"}${value.toLocaleString()}`} 
                          />
                          <Tooltip 
                            formatter={(value: number) => [`${formatCurrency(value, currency)}`, '']}
                            labelFormatter={(label) => `Year ${label}`}
                          />
                          <Legend />
                          <Bar dataKey="investment" stackId="a" name="Initial Investment" fill="#8884d8" />
                          <Bar dataKey="contributions" stackId="a" name="Contributions" fill="#82ca9d" />
                          <Bar dataKey="interest" stackId="a" name="Interest" fill="#ffc658" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="table" className="m-0 overflow-auto max-h-[500px]">
                    <CardContent className="pt-6">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead className="sticky top-0 bg-background">
                            <tr>
                              <th className="border p-2 text-left">Year</th>
                              <th className="border p-2 text-right">Balance</th>
                              <th className="border p-2 text-right">Contributions</th>
                              <th className="border p-2 text-right">Interest</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.map((result) => (
                              <tr key={result.year}>
                                <td className="border p-2">{result.year}</td>
                                <td className="border p-2 text-right">{formatCurrency(result.balance, currency)}</td>
                                <td className="border p-2 text-right">{formatCurrency(result.contributions + initialInvestment, currency)}</td>
                                <td className="border p-2 text-right">{formatCurrency(result.interest, currency)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </TabsContent>
                </Card>
              </Tabs>
            ) : (
              <Card className="h-[500px]">
                <CardContent className="flex justify-center items-center h-full">
                  <p>Enter your investment details and click Calculate</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}