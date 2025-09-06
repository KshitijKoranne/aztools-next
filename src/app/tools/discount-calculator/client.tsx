'use client'

import { useState } from 'react';
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Copy, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

export default function DiscountCalculator() {
  const [activeTab, setActiveTab] = useState('simple');

  // Simple Discount
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [amountSaved, setAmountSaved] = useState('');
  
  // Multiple Discounts
  const [basePrice, setBasePrice] = useState('');
  const [discounts, setDiscounts] = useState(['']);
  const [multipleDiscountResult, setMultipleDiscountResult] = useState('');
  const [totalSavings, setTotalSavings] = useState('');
  const [effectiveRate, setEffectiveRate] = useState('');
  
  // Reverse Calculation
  const [finalAmount, setFinalAmount] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [originalAmount, setOriginalAmount] = useState('');
  
  // Discount Comparison
  const [price1, setPrice1] = useState('');
  const [discount1, setDiscount1] = useState('');
  const [price2, setPrice2] = useState('');
  const [discount2, setDiscount2] = useState('');
  const [comparisonResult, setComparisonResult] = useState<{ 
    final1: string; 
    final2: string; 
    difference: string; 
    better: number 
  } | null>(null);

  // Simple discount calculation
  const calculateSimpleDiscount = () => {
    try {
      const original = parseFloat(originalPrice);
      const discount = parseFloat(discountPercentage);
      
      if (isNaN(original) || isNaN(discount)) {
        throw new Error("Please enter valid numbers");
      }
      
      if (discount < 0 || discount > 100) {
        throw new Error("Discount percentage must be between 0 and 100");
      }
      
      const saved = original * (discount / 100);
      const final = original - saved;
      
      setFinalPrice(final.toFixed(2));
      setAmountSaved(saved.toFixed(2));
      
      toast.success(`Original: $${original.toFixed(2)}, Discount: ${discount}%, Final: $${final.toFixed(2)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid input");
    }
  };

  // Multiple discounts calculation
  const calculateMultipleDiscounts = () => {
    try {
      const base = parseFloat(basePrice);
      
      if (isNaN(base)) {
        throw new Error("Please enter a valid price");
      }
      
      const discountValues = discounts
        .map(d => parseFloat(d))
        .filter(d => !isNaN(d));
      
      if (discountValues.length === 0) {
        throw new Error("Please enter at least one valid discount");
      }
      
      if (discountValues.some(d => d < 0 || d > 100)) {
        throw new Error("All discounts must be between 0 and 100");
      }
      
      let finalPrice = base;
      let totalDiscountAmount = 0;
      
      discountValues.forEach(discount => {
        const discountAmount = finalPrice * (discount / 100);
        finalPrice -= discountAmount;
        totalDiscountAmount += discountAmount;
      });
      
      const effectiveDiscountRate = (totalDiscountAmount / base) * 100;
      
      setMultipleDiscountResult(finalPrice.toFixed(2));
      setTotalSavings(totalDiscountAmount.toFixed(2));
      setEffectiveRate(effectiveDiscountRate.toFixed(2));
      
      toast.success(`Final price after all discounts: $${finalPrice.toFixed(2)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid input");
    }
  };

  // Add another discount field
  const addDiscountField = () => {
    setDiscounts([...discounts, '']);
  };

  // Remove a discount field
  const removeDiscountField = (index: number) => {
    if (discounts.length <= 1) return;
    const newDiscounts = [...discounts];
    newDiscounts.splice(index, 1);
    setDiscounts(newDiscounts);
  };

  // Update discount value
  const updateDiscount = (index: number, value: string) => {
    const newDiscounts = [...discounts];
    newDiscounts[index] = value;
    setDiscounts(newDiscounts);
  };

  // Reverse calculation
  const calculateReverse = () => {
    try {
      const final = parseFloat(finalAmount);
      const discount = parseFloat(discountRate);
      
      if (isNaN(final) || isNaN(discount)) {
        throw new Error("Please enter valid numbers");
      }
      
      if (discount < 0 || discount >= 100) {
        throw new Error("Discount percentage must be between 0 and less than 100");
      }
      
      const original = final / (1 - (discount / 100));
      
      setOriginalAmount(original.toFixed(2));
      
      toast.success(`Original price before ${discount}% discount: $${original.toFixed(2)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid input");
    }
  };

  // Discount comparison
  const compareDiscounts = () => {
    try {
      const p1 = parseFloat(price1);
      const d1 = parseFloat(discount1);
      const p2 = parseFloat(price2);
      const d2 = parseFloat(discount2);
      
      if (isNaN(p1) || isNaN(d1) || isNaN(p2) || isNaN(d2)) {
        throw new Error("Please enter valid numbers");
      }
      
      if (d1 < 0 || d1 > 100 || d2 < 0 || d2 > 100) {
        throw new Error("Discount percentages must be between 0 and 100");
      }
      
      const finalPrice1 = p1 * (1 - (d1 / 100));
      const finalPrice2 = p2 * (1 - (d2 / 100));
      const difference = Math.abs(finalPrice1 - finalPrice2);
      
      setComparisonResult({
        final1: finalPrice1.toFixed(2),
        final2: finalPrice2.toFixed(2),
        difference: difference.toFixed(2),
        better: finalPrice1 < finalPrice2 ? 1 : finalPrice2 < finalPrice1 ? 2 : 0
      });
      
      toast.success(`Option ${finalPrice1 < finalPrice2 ? '1' : finalPrice2 < finalPrice1 ? '2' : 'Both'} is better`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid input");
    }
  };

  // Copy result to clipboard
  const copyResult = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <ToolLayout toolId="discount-calculator" categoryId="calculators">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Discount Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="simple">Simple</TabsTrigger>
                <TabsTrigger value="multiple">Multiple</TabsTrigger>
                <TabsTrigger value="reverse">Reverse</TabsTrigger>
                <TabsTrigger value="comparison">Compare</TabsTrigger>
              </TabsList>
              
              {/* Simple Discount */}
              <TabsContent value="simple" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="original-price">Original Price ($)</Label>
                      <Input
                        id="original-price"
                        type="number"
                        placeholder="e.g., 100"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="discount-percentage">Discount Percentage (%)</Label>
                      <Input
                        id="discount-percentage"
                        type="number"
                        placeholder="e.g., 20"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={calculateSimpleDiscount} className="w-full">
                    Calculate Discount
                  </Button>
                  
                  {finalPrice && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Final Price:</p>
                          <p className="text-lg font-medium">${finalPrice}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => copyResult(finalPrice, "Final price")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">You Save:</p>
                          <p className="text-lg font-medium">${amountSaved}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => copyResult(amountSaved, "Amount saved")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Multiple Discounts */}
              <TabsContent value="multiple" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="base-price">Base Price ($)</Label>
                    <Input
                      id="base-price"
                      type="number"
                      placeholder="e.g., 100"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <Label>Discount Percentages (%)</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={addDiscountField}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Discount
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {discounts.map((discount, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder={`Discount ${index + 1}`}
                            value={discount}
                            onChange={(e) => updateDiscount(index, e.target.value)}
                          />
                          {discounts.length > 1 && (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeDiscountField(index)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button onClick={calculateMultipleDiscounts} className="w-full">
                    Calculate Multiple Discounts
                  </Button>
                  
                  {multipleDiscountResult && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">Final Price:</p>
                            <p className="text-lg font-medium">${multipleDiscountResult}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => copyResult(multipleDiscountResult, "Final price")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Savings:</p>
                            <p className="text-lg font-medium">${totalSavings}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => copyResult(totalSavings, "Total savings")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">Effective Rate:</p>
                            <p className="text-lg font-medium">{effectiveRate}%</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => copyResult(`${effectiveRate}%`, "Effective discount rate")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Reverse Calculation */}
              <TabsContent value="reverse" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="final-amount">Final Price ($)</Label>
                      <Input
                        id="final-amount"
                        type="number"
                        placeholder="e.g., 80"
                        value={finalAmount}
                        onChange={(e) => setFinalAmount(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="discount-rate">Discount Percentage (%)</Label>
                      <Input
                        id="discount-rate"
                        type="number"
                        placeholder="e.g., 20"
                        value={discountRate}
                        onChange={(e) => setDiscountRate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={calculateReverse} className="w-full">
                    Calculate Original Price
                  </Button>
                  
                  {originalAmount && (
                    <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Original Price:</p>
                        <p className="text-lg font-medium">${originalAmount}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => copyResult(originalAmount, "Original price")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Discount Comparison */}
              <TabsContent value="comparison" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Option 1</h3>
                      <div className="space-y-2">
                        <Label htmlFor="price-1">Original Price ($)</Label>
                        <Input
                          id="price-1"
                          type="number"
                          placeholder="e.g., 100"
                          value={price1}
                          onChange={(e) => setPrice1(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="discount-1">Discount Percentage (%)</Label>
                        <Input
                          id="discount-1"
                          type="number"
                          placeholder="e.g., 20"
                          value={discount1}
                          onChange={(e) => setDiscount1(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Option 2</h3>
                      <div className="space-y-2">
                        <Label htmlFor="price-2">Original Price ($)</Label>
                        <Input
                          id="price-2"
                          type="number"
                          placeholder="e.g., 120"
                          value={price2}
                          onChange={(e) => setPrice2(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="discount-2">Discount Percentage (%)</Label>
                        <Input
                          id="discount-2"
                          type="number"
                          placeholder="e.g., 30"
                          value={discount2}
                          onChange={(e) => setDiscount2(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={compareDiscounts} className="w-full">
                    Compare Discounts
                  </Button>
                  
                  {comparisonResult && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`bg-muted p-4 rounded-md ${comparisonResult.better === 1 ? 'border-2 border-green-500' : ''}`}>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-muted-foreground">Option 1 Final Price:</p>
                              <p className="text-lg font-medium">${comparisonResult.final1}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => copyResult(comparisonResult.final1, "Option 1 final price")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          {comparisonResult.better === 1 && (
                            <p className="text-green-600 mt-2">Better Deal!</p>
                          )}
                        </div>
                        
                        <div className={`bg-muted p-4 rounded-md ${comparisonResult.better === 2 ? 'border-2 border-green-500' : ''}`}>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-muted-foreground">Option 2 Final Price:</p>
                              <p className="text-lg font-medium">${comparisonResult.final2}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => copyResult(comparisonResult.final2, "Option 2 final price")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          {comparisonResult.better === 2 && (
                            <p className="text-green-600 mt-2">Better Deal!</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-md">
                        <p className="text-sm text-muted-foreground">Price Difference:</p>
                        <p className="text-lg font-medium">${comparisonResult.difference}</p>
                        {comparisonResult.better === 0 && (
                          <p className="text-amber-600 mt-2">Both options are the same price after discount.</p>
                        )}
                      </div>
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