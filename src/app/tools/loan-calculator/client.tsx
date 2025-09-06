'use client'

import { useState, useEffect } from 'react';
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  PieChart, 
  Pie, 
  Cell
} from "recharts";
import { Download, RotateCcw, Calculator } from 'lucide-react';
import { toast } from 'sonner';
import { 
  formatCurrency, 
  getCurrencySymbol, 
  SupportedCurrency, 
  currencyOptions 
} from "@/utils/currency";

interface LoanData {
  principal: number;
  interestRate: number;
  loanTerm: number;
  paymentFrequency: "monthly" | "biweekly" | "weekly";
  currency: SupportedCurrency;
}

interface AmortizationRow {
  paymentNumber: number;
  paymentAmount: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  totalPrincipalPaid: number;
  totalInterestPaid: number;
}

export default function LoanCalculator() {
  const [loanData, setLoanData] = useState<LoanData>({
    principal: 300000,
    interestRate: 5.5,
    loanTerm: 30,
    paymentFrequency: "monthly",
    currency: "INR"
  });
  
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalPayments, setTotalPayments] = useState<number>(0);
  const [totalInterestPaid, setTotalInterestPaid] = useState<number>(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationRow[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  
  const currencySymbol = getCurrencySymbol(loanData.currency);
  
  const getPaymentsPerYear = (frequency: string): number => {
    switch (frequency) {
      case "biweekly": return 26;
      case "weekly": return 52;
      default: return 12;
    }
  };
  
  const calculateLoan = () => {
    try {
      const { principal, interestRate, loanTerm, paymentFrequency } = loanData;
      
      // Convert annual interest rate to periodic rate
      const paymentsPerYear = getPaymentsPerYear(paymentFrequency);
      const totalNumberOfPayments = loanTerm * paymentsPerYear;
      const periodicInterestRate = (interestRate / 100) / paymentsPerYear;
      
      // Calculate payment amount (P * r * (1+r)^n) / ((1+r)^n - 1)
      const paymentAmount = 
        (principal * periodicInterestRate * Math.pow(1 + periodicInterestRate, totalNumberOfPayments)) / 
        (Math.pow(1 + periodicInterestRate, totalNumberOfPayments) - 1);
      
      // Generate amortization schedule
      let remainingBalance = principal;
      let totalPrincipalPaid = 0;
      let totalInterest = 0;
      
      const schedule: AmortizationRow[] = [];
      
      for (let i = 1; i <= totalNumberOfPayments; i++) {
        const interestForPayment = remainingBalance * periodicInterestRate;
        const principalForPayment = paymentAmount - interestForPayment;
        
        totalPrincipalPaid += principalForPayment;
        totalInterest += interestForPayment;
        remainingBalance -= principalForPayment;
        
        if (remainingBalance < 0.01) remainingBalance = 0;
        
        schedule.push({
          paymentNumber: i,
          paymentAmount,
          principalPaid: principalForPayment,
          interestPaid: interestForPayment,
          remainingBalance,
          totalPrincipalPaid,
          totalInterestPaid: totalInterest
        });
      }
      
      // Generate chart data (simplified for performance)
      const simplifiedData = [];
      const interval = Math.max(1, Math.floor(schedule.length / 12));
      
      for (let i = 0; i < schedule.length; i += interval) {
        const payment = schedule[i];
        simplifiedData.push({
          paymentNumber: payment.paymentNumber,
          Balance: payment.remainingBalance,
          "Principal Paid": payment.totalPrincipalPaid,
          "Interest Paid": payment.totalInterestPaid
        });
      }
      
      // Add the last payment if it's not already included
      if (schedule.length > 0 && schedule.length % interval !== 0) {
        const lastPayment = schedule[schedule.length - 1];
        simplifiedData.push({
          paymentNumber: lastPayment.paymentNumber,
          Balance: lastPayment.remainingBalance,
          "Principal Paid": lastPayment.totalPrincipalPaid,
          "Interest Paid": lastPayment.totalInterestPaid
        });
      }
      
      setMonthlyPayment(paymentAmount);
      setTotalPayments(paymentAmount * totalNumberOfPayments);
      setTotalInterestPaid(totalInterest);
      setAmortizationSchedule(schedule);
      setChartData(simplifiedData);
      
      toast.success(`Payment: ${formatCurrency(paymentAmount, loanData.currency)}`);
      
    } catch (error) {
      console.error("Error calculating loan:", error);
      toast.error("There was an error calculating the loan payments");
    }
  };
  
  const resetForm = () => {
    setLoanData({
      principal: 300000,
      interestRate: 5.5,
      loanTerm: 30,
      paymentFrequency: "monthly",
      currency: "INR"
    });
  };
  
  useEffect(() => {
    calculateLoan();
  }, [loanData]);
  
  const handleChange = (name: keyof LoanData, value: number | string) => {
    setLoanData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleExport = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Payment Number,Payment Amount,Principal Paid,Interest Paid,Remaining Balance,Total Principal Paid,Total Interest Paid\n";
      
      amortizationSchedule.forEach(row => {
        csvContent += `${row.paymentNumber},${row.paymentAmount.toFixed(2)},${row.principalPaid.toFixed(2)},${row.interestPaid.toFixed(2)},${row.remainingBalance.toFixed(2)},${row.totalPrincipalPaid.toFixed(2)},${row.totalInterestPaid.toFixed(2)}\n`;
      });
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "loan_amortization.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Amortization schedule has been downloaded");
    } catch (error) {
      toast.error("There was an error exporting the data");
    }
  };
  
  const COLORS = ['#0088FE', '#FF8042'];
  
  return (
    <ToolLayout toolId="loan-calculator" categoryId="calculators">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Loan Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={loanData.currency} 
                      onValueChange={(value) => handleChange('currency', value as SupportedCurrency)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencyOptions.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="principal">Loan Amount</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{currencySymbol}</span>
                      <Input
                        id="principal"
                        type="number"
                        min="1000"
                        max="10000000"
                        value={loanData.principal}
                        onChange={(e) => handleChange('principal', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="interestRate">Interest Rate: {loanData.interestRate}%</Label>
                    </div>
                    <Slider
                      id="interestRate"
                      min={0.1}
                      max={15}
                      step={0.1}
                      value={[loanData.interestRate]}
                      onValueChange={(values) => handleChange('interestRate', values[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="loanTerm">Loan Term: {loanData.loanTerm} years</Label>
                    </div>
                    <Slider
                      id="loanTerm"
                      min={1}
                      max={40}
                      step={1}
                      value={[loanData.loanTerm]}
                      onValueChange={(values) => handleChange('loanTerm', values[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={loanData.paymentFrequency === "monthly" ? "default" : "outline"}
                        onClick={() => handleChange('paymentFrequency', "monthly")}
                        className="w-full"
                      >
                        Monthly
                      </Button>
                      <Button
                        variant={loanData.paymentFrequency === "biweekly" ? "default" : "outline"}
                        onClick={() => handleChange('paymentFrequency', "biweekly")}
                        className="w-full"
                      >
                        Bi-Weekly
                      </Button>
                      <Button
                        variant={loanData.paymentFrequency === "weekly" ? "default" : "outline"}
                        onClick={() => handleChange('paymentFrequency', "weekly")}
                        className="w-full"
                      >
                        Weekly
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={resetForm} className="gap-1">
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </Button>
                    <Button onClick={calculateLoan} className="gap-1">
                      <Calculator className="h-4 w-4" />
                      Calculate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Loan Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Amount:</span>
                    <span className="font-medium">{formatCurrency(monthlyPayment, loanData.currency)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total of Payments:</span>
                    <span className="font-medium">{formatCurrency(totalPayments, loanData.currency)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Interest:</span>
                    <span className="font-medium">{formatCurrency(totalInterestPaid, loanData.currency)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loan Amount:</span>
                    <span className="font-medium">{formatCurrency(loanData.principal, loanData.currency)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interest Rate:</span>
                    <span className="font-medium">{loanData.interestRate}%</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loan Term:</span>
                    <span className="font-medium">{loanData.loanTerm} years</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Tabs defaultValue="chart">
              <Card>
                <TabsList className="w-full rounded-b-none">
                  <TabsTrigger value="chart" className="flex-1">Payment Chart</TabsTrigger>
                  <TabsTrigger value="breakdown" className="flex-1">Payment Breakdown</TabsTrigger>
                  <TabsTrigger value="amortization" className="flex-1">Amortization</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chart" className="m-0">
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="paymentNumber" 
                          label={{ 
                            value: 'Payment Number', 
                            position: 'insideBottomRight', 
                            offset: -10 
                          }} 
                        />
                        <YAxis 
                          tickFormatter={(value) => {
                            const formatted = formatCurrency(value, loanData.currency);
                            return formatted.replace(currencySymbol, '');
                          }}
                        />
                        <Tooltip 
                          formatter={(value) => formatCurrency(value as number, loanData.currency)} 
                          labelFormatter={(label) => `Payment ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="Balance" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Principal Paid" 
                          stroke="#0088FE" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Interest Paid" 
                          stroke="#FF8042" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="breakdown" className="m-0">
                  <CardContent className="pt-6 space-y-6">
                    <div className="aspect-square max-w-[300px] mx-auto">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Principal', value: loanData.principal },
                              { name: 'Interest', value: totalInterestPaid }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {[0, 1].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(value as number, loanData.currency)} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-[#0088FE] rounded-full"></span>
                          Principal
                        </span>
                        <span>{formatCurrency(loanData.principal, loanData.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-[#FF8042] rounded-full"></span>
                          Interest
                        </span>
                        <span>{formatCurrency(totalInterestPaid, loanData.currency)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2 border-t">
                        <span>Total</span>
                        <span>{formatCurrency(totalPayments, loanData.currency)}</span>
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="amortization" className="m-0 overflow-auto max-h-[400px]">
                  <CardContent className="pt-6">
                    <div className="flex justify-end mb-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleExport}
                        className="gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Export CSV
                      </Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="px-2 py-2 text-left font-medium text-sm">#</th>
                            <th className="px-2 py-2 text-right font-medium text-sm">Payment</th>
                            <th className="px-2 py-2 text-right font-medium text-sm">Principal</th>
                            <th className="px-2 py-2 text-right font-medium text-sm">Interest</th>
                            <th className="px-2 py-2 text-right font-medium text-sm">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {amortizationSchedule.filter((_, index) => 
                            // Show first 12, then every 12th payment, then the last payment
                            index < 12 || index % 12 === 0 || index === amortizationSchedule.length - 1
                          ).map((row) => (
                            <tr key={row.paymentNumber} className="border-b hover:bg-muted/50">
                              <td className="px-2 py-2 text-sm">{row.paymentNumber}</td>
                              <td className="px-2 py-2 text-right text-sm">{formatCurrency(row.paymentAmount, loanData.currency)}</td>
                              <td className="px-2 py-2 text-right text-sm">{formatCurrency(row.principalPaid, loanData.currency)}</td>
                              <td className="px-2 py-2 text-right text-sm">{formatCurrency(row.interestPaid, loanData.currency)}</td>
                              <td className="px-2 py-2 text-right text-sm">{formatCurrency(row.remainingBalance, loanData.currency)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="text-xs text-muted-foreground text-center mt-4">
                      Showing first 12 payments, then every 12th payment for brevity. 
                      Export to CSV for the complete schedule.
                    </div>
                  </CardContent>
                </TabsContent>
              </Card>
            </Tabs>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}