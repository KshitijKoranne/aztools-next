'use client'

import { useState } from 'react';
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState("");
  const [tipPercentage, setTipPercentage] = useState("18");
  const [numberOfPeople, setNumberOfPeople] = useState("1");

  const calculateTip = () => {
    const bill = parseFloat(billAmount) || 0;
    const tip = parseFloat(tipPercentage) || 0;
    const people = parseInt(numberOfPeople) || 1;
    
    const tipAmount = (bill * tip) / 100;
    const totalAmount = bill + tipAmount;
    const perPerson = totalAmount / people;
    const tipPerPerson = tipAmount / people;
    
    return {
      tipAmount: tipAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      perPerson: perPerson.toFixed(2),
      tipPerPerson: tipPerPerson.toFixed(2)
    };
  };

  const result = calculateTip();

  const setTipPreset = (percentage: number) => {
    setTipPercentage(percentage.toString());
  };

  return (
    <ToolLayout toolId="tip-calculator" categoryId="calculators">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Bill Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Bill Amount ($)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label>Tip Percentage (%)</Label>
                <Input
                  type="number"
                  value={tipPercentage}
                  onChange={(e) => setTipPercentage(e.target.value)}
                  step="0.1"
                />
                <div className="flex gap-2 flex-wrap">
                  {[15, 18, 20, 25].map(percent => (
                    <Button
                      key={percent}
                      variant="outline"
                      size="sm"
                      onClick={() => setTipPreset(percent)}
                      className={tipPercentage === percent.toString() ? "bg-primary text-primary-foreground" : ""}
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Number of People</Label>
                <Input
                  type="number"
                  min="1"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calculation Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Tip Amount</Label>
                  <div className="text-2xl font-bold">${result.tipAmount}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Total Amount</Label>
                  <div className="text-2xl font-bold">${result.totalAmount}</div>
                </div>
              </div>
              
              {parseInt(numberOfPeople) > 1 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Per Person</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Tip Per Person</Label>
                      <div className="text-xl font-semibold">${result.tipPerPerson}</div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Total Per Person</Label>
                      <div className="text-xl font-semibold">${result.perPerson}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}