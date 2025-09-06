'use client'

import { useState } from 'react';
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Copy, Percent } from 'lucide-react';
import { toast } from 'sonner';

export default function PercentageCalculator() {
  const [activeTab, setActiveTab] = useState('percentage-of');
  
  // Percentage of
  const [percentageOfValue, setPercentageOfValue] = useState('');
  const [percentageOfBase, setPercentageOfBase] = useState('');
  const [percentageOfResult, setPercentageOfResult] = useState('');
  
  // Percentage change
  const [initialValue, setInitialValue] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [percentageChangeResult, setPercentageChangeResult] = useState('');
  
  // Percentage point
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [percentagePointResult, setPercentagePointResult] = useState('');

  // Percentage increase/decrease
  const [baseValue, setBaseValue] = useState('');
  const [percentageAmount, setPercentageAmount] = useState('');
  const [increaseDecreaseResult, setIncreaseDecreaseResult] = useState('');
  const [isIncrease, setIsIncrease] = useState(true);
  
  // Reverse percentage
  const [finalAmount, setFinalAmount] = useState('');
  const [percentageDiscount, setPercentageDiscount] = useState('');
  const [reverseResult, setReverseResult] = useState('');

  const calculatePercentageOf = () => {
    try {
      const percentage = parseFloat(percentageOfValue);
      const base = parseFloat(percentageOfBase);
      
      if (isNaN(percentage) || isNaN(base)) {
        throw new Error("Please enter valid numbers");
      }
      
      const result = (percentage / 100) * base;
      setPercentageOfResult(result.toFixed(2));
      
      toast.success(`${percentage}% of ${base} is ${result.toFixed(2)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid input");
    }
  };

  const calculatePercentageChange = () => {
    try {
      const initial = parseFloat(initialValue);
      const final = parseFloat(finalValue);
      
      if (isNaN(initial) || isNaN(final)) {
        throw new Error("Please enter valid numbers");
      }
      
      if (initial === 0) {
        throw new Error("Initial value cannot be zero");
      }
      
      const change = ((final - initial) / Math.abs(initial)) * 100;
      setPercentageChangeResult(change.toFixed(2));
      
      const description = change >= 0 
        ? `Increase of ${change.toFixed(2)}%` 
        : `Decrease of ${Math.abs(change).toFixed(2)}%`;
      
      toast.success(description);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid input");
    }
  };

  const calculatePercentagePoint = () => {
    try {
      const v1 = parseFloat(value1);
      const v2 = parseFloat(value2);
      
      if (isNaN(v1) || isNaN(v2)) {
        throw new Error("Please enter valid percentages");
      }
      
      const pointDifference = v2 - v1;
      setPercentagePointResult(pointDifference.toFixed(2));
      
      const description = pointDifference >= 0 
        ? `Increase of ${pointDifference.toFixed(2)} percentage points` 
        : `Decrease of ${Math.abs(pointDifference).toFixed(2)} percentage points`;
      
      toast.success(description);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid input");
    }
  };

  const calculateIncreaseDecrease = () => {
    try {
      const base = parseFloat(baseValue);
      const percentage = parseFloat(percentageAmount);
      
      if (isNaN(base) || isNaN(percentage)) {
        throw new Error("Please enter valid numbers");
      }
      
      const factor = isIncrease ? 1 + (percentage / 100) : 1 - (percentage / 100);
      const result = base * factor;
      setIncreaseDecreaseResult(result.toFixed(2));
      
      const action = isIncrease ? "increased" : "decreased";
      toast.success(`${base} ${action} by ${percentage}% is ${result.toFixed(2)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid input");
    }
  };

  const calculateReverse = () => {
    try {
      const final = parseFloat(finalAmount);
      const discount = parseFloat(percentageDiscount);
      
      if (isNaN(final) || isNaN(discount)) {
        throw new Error("Please enter valid numbers");
      }
      
      if (discount >= 100) {
        throw new Error("Discount percentage must be less than 100%");
      }
      
      const original = final / (1 - (discount / 100));
      setReverseResult(original.toFixed(2));
      
      toast.success(`Original price before ${discount}% discount was ${original.toFixed(2)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid input");
    }
  };

  const copyResult = (result: string, description: string) => {
    navigator.clipboard.writeText(result);
    toast.success(`${description} copied to clipboard!`);
  };

  return (
    <ToolLayout toolId="percentage-calculator" categoryId="calculators">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Percentage Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="percentage-of">% of</TabsTrigger>
                <TabsTrigger value="percentage-change">% Change</TabsTrigger>
                <TabsTrigger value="percentage-point">Points</TabsTrigger>
                <TabsTrigger value="increase-decrease">Inc/Dec</TabsTrigger>
                <TabsTrigger value="reverse">Reverse</TabsTrigger>
              </TabsList>
              
              {/* Percentage of Value */}
              <TabsContent value="percentage-of" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="percentage-value">Percentage (%)</Label>
                      <Input
                        id="percentage-value"
                        type="number"
                        placeholder="e.g., 15"
                        value={percentageOfValue}
                        onChange={(e) => setPercentageOfValue(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <span className="text-2xl font-medium">% of</span>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="percentage-base">Value</Label>
                      <Input
                        id="percentage-base"
                        type="number"
                        placeholder="e.g., 200"
                        value={percentageOfBase}
                        onChange={(e) => setPercentageOfBase(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={calculatePercentageOf} className="w-full">
                    Calculate
                  </Button>
                  
                  {percentageOfResult && (
                    <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Result:</p>
                        <p className="text-lg font-medium">{percentageOfResult}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => copyResult(percentageOfResult, "Result")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Percentage Change */}
              <TabsContent value="percentage-change" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="initial-value">Initial Value</Label>
                      <Input
                        id="initial-value"
                        type="number"
                        placeholder="e.g., 100"
                        value={initialValue}
                        onChange={(e) => setInitialValue(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="final-value">Final Value</Label>
                      <Input
                        id="final-value"
                        type="number"
                        placeholder="e.g., 150"
                        value={finalValue}
                        onChange={(e) => setFinalValue(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={calculatePercentageChange} className="w-full">
                    Calculate Percentage Change
                  </Button>
                  
                  {percentageChangeResult && (
                    <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Percentage Change:</p>
                        <p className="text-lg font-medium">{percentageChangeResult}%</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => copyResult(`${percentageChangeResult}%`, "Percentage change")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Percentage Point Difference */}
              <TabsContent value="percentage-point" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="value-1">First Percentage (%)</Label>
                      <Input
                        id="value-1"
                        type="number"
                        placeholder="e.g., 10"
                        value={value1}
                        onChange={(e) => setValue1(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="value-2">Second Percentage (%)</Label>
                      <Input
                        id="value-2"
                        type="number"
                        placeholder="e.g., 15"
                        value={value2}
                        onChange={(e) => setValue2(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={calculatePercentagePoint} className="w-full">
                    Calculate Percentage Points
                  </Button>
                  
                  {percentagePointResult && (
                    <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Percentage Point Difference:</p>
                        <p className="text-lg font-medium">{percentagePointResult} points</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => copyResult(`${percentagePointResult} percentage points`, "Point difference")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Increase/Decrease by Percentage */}
              <TabsContent value="increase-decrease" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 items-end">
                    <div className="space-y-2 col-span-3 md:col-span-1">
                      <Label htmlFor="base-value">Value</Label>
                      <Input
                        id="base-value"
                        type="number"
                        placeholder="e.g., 200"
                        value={baseValue}
                        onChange={(e) => setBaseValue(e.target.value)}
                      />
                    </div>
                    
                    <div className="col-span-2 md:col-span-1 space-y-2">
                      <Label htmlFor="percentage-amount">Percentage (%)</Label>
                      <Input
                        id="percentage-amount"
                        type="number"
                        placeholder="e.g., 15"
                        value={percentageAmount}
                        onChange={(e) => setPercentageAmount(e.target.value)}
                      />
                    </div>
                    
                    <div className="col-span-1 space-y-2">
                      <Label>&nbsp;</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          type="button" 
                          variant={isIncrease ? "default" : "outline"}
                          className="w-full"
                          onClick={() => setIsIncrease(true)}
                        >
                          +
                        </Button>
                        <Button 
                          type="button" 
                          variant={!isIncrease ? "default" : "outline"}
                          className="w-full"
                          onClick={() => setIsIncrease(false)}
                        >
                          -
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={calculateIncreaseDecrease} className="w-full">
                    Calculate {isIncrease ? "Increase" : "Decrease"}
                  </Button>
                  
                  {increaseDecreaseResult && (
                    <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Result after {isIncrease ? "increase" : "decrease"}:</p>
                        <p className="text-lg font-medium">{increaseDecreaseResult}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => copyResult(increaseDecreaseResult, "Result")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Reverse Percentage */}
              <TabsContent value="reverse" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="final-amount">Amount After Discount</Label>
                      <Input
                        id="final-amount"
                        type="number"
                        placeholder="e.g., 85"
                        value={finalAmount}
                        onChange={(e) => setFinalAmount(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="percentage-discount">Discount Percentage (%)</Label>
                      <Input
                        id="percentage-discount"
                        type="number"
                        placeholder="e.g., 15"
                        value={percentageDiscount}
                        onChange={(e) => setPercentageDiscount(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={calculateReverse} className="w-full">
                    Calculate Original Amount
                  </Button>
                  
                  {reverseResult && (
                    <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Original Amount:</p>
                        <p className="text-lg font-medium">{reverseResult}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => copyResult(reverseResult, "Original amount")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}