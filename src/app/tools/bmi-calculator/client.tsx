'use client'

import { useState } from 'react';
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Scale, Info, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function BmiCalculator() {
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">('cm');
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">('kg');
  
  const [height, setHeight] = useState<number>(170);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);
  
  const [weight, setWeight] = useState<number>(70);
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string | null>(null);
  const [healthyWeightRange, setHealthyWeightRange] = useState<{min: number, max: number} | null>(null);
  
  const calculateBMI = () => {
    try {
      let bmiValue: number;
      let heightInMeters: number;
      let weightInKg: number;
      
      // Convert height to meters
      if (heightUnit === 'cm') {
        heightInMeters = height / 100;
      } else {
        // Convert feet and inches to cm, then to meters
        const totalInches = (heightFt * 12) + heightIn;
        heightInMeters = (totalInches * 2.54) / 100;
      }
      
      // Convert weight to kg
      if (weightUnit === 'kg') {
        weightInKg = weight;
      } else {
        weightInKg = weight * 0.453592;
      }
      
      // Calculate BMI: weight (kg) / height (m)²
      bmiValue = weightInKg / (heightInMeters * heightInMeters);
      
      // Round to 1 decimal place
      bmiValue = Math.round(bmiValue * 10) / 10;
      
      // Determine BMI category
      let category: string;
      
      if (bmiValue < 18.5) {
        category = "Underweight";
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        category = "Normal weight";
      } else if (bmiValue >= 25 && bmiValue < 30) {
        category = "Overweight";
      } else if (bmiValue >= 30 && bmiValue < 35) {
        category = "Obesity Class I";
      } else if (bmiValue >= 35 && bmiValue < 40) {
        category = "Obesity Class II";
      } else {
        category = "Obesity Class III";
      }
      
      // Calculate healthy weight range (BMI 18.5-24.9)
      const minHealthyWeight = 18.5 * (heightInMeters * heightInMeters);
      const maxHealthyWeight = 24.9 * (heightInMeters * heightInMeters);
      
      // Convert back to the selected unit
      const minWeightDisplay = weightUnit === 'kg' 
        ? Math.round(minHealthyWeight) 
        : Math.round(minHealthyWeight / 0.453592);
        
      const maxWeightDisplay = weightUnit === 'kg' 
        ? Math.round(maxHealthyWeight) 
        : Math.round(maxHealthyWeight / 0.453592);
      
      setBmi(bmiValue);
      setBmiCategory(category);
      setHealthyWeightRange({ min: minWeightDisplay, max: maxWeightDisplay });
      
      toast.success(`Your BMI is ${bmiValue} (${category})`);
      
    } catch (error) {
      toast.error("Please enter valid height and weight values");
    }
  };
  
  // Get BMI color based on value
  const getBmiColor = (bmiValue: number): string => {
    if (bmiValue < 18.5) return "text-blue-500";
    if (bmiValue < 25) return "text-green-500";
    if (bmiValue < 30) return "text-yellow-500";
    if (bmiValue < 35) return "text-orange-500";
    if (bmiValue < 40) return "text-red-500";
    return "text-red-700";
  };
  
  // Get the position for the BMI indicator on the chart
  const getBmiIndicatorPosition = (bmiValue: number): number => {
    // Position the indicator based on BMI value (from 10 to 45)
    const minValue = 10;
    const maxValue = 45;
    const position = ((bmiValue - minValue) / (maxValue - minValue)) * 100;
    
    // Clamp position between 0 and 100
    return Math.max(0, Math.min(100, position));
  };
  
  return (
    <ToolLayout toolId="bmi-calculator" categoryId="calculators">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  BMI Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="metric" className="mb-6" onValueChange={(value) => {
                  if (value === "metric") {
                    setHeightUnit("cm");
                    setWeightUnit("kg");
                  } else {
                    setHeightUnit("ft");
                    setWeightUnit("lb");
                  }
                }}>
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="metric">Metric</TabsTrigger>
                    <TabsTrigger value="imperial">Imperial</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="metric" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="height-metric">Height (cm)</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          id="height-metric"
                          min={100}
                          max={250}
                          step={1}
                          value={[height]}
                          onValueChange={(values) => setHeight(values[0])}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(Number(e.target.value))}
                          className="w-20"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weight-metric">Weight (kg)</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          id="weight-metric"
                          min={20}
                          max={200}
                          step={1}
                          value={[weight]}
                          onValueChange={(values) => setWeight(values[0])}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={weight}
                          onChange={(e) => setWeight(Number(e.target.value))}
                          className="w-20"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="imperial" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="height-imperial">Height (ft, in)</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Input
                            id="height-ft"
                            type="number"
                            min={1}
                            max={8}
                            value={heightFt}
                            onChange={(e) => setHeightFt(Number(e.target.value))}
                            className="text-center"
                          />
                          <div className="text-xs text-center mt-1">feet</div>
                        </div>
                        <div className="flex-1">
                          <Input
                            id="height-in"
                            type="number"
                            min={0}
                            max={11}
                            value={heightIn}
                            onChange={(e) => setHeightIn(Number(e.target.value))}
                            className="text-center"
                          />
                          <div className="text-xs text-center mt-1">inches</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weight-imperial">Weight (lb)</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          id="weight-imperial"
                          min={45}
                          max={440}
                          step={1}
                          value={[weight]}
                          onValueChange={(values) => setWeight(values[0])}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={weight}
                          onChange={(e) => setWeight(Number(e.target.value))}
                          className="w-20"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={calculateBMI}
                >
                  Calculate BMI
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            {bmi !== null && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h4 className="text-sm text-muted-foreground mb-1">Your BMI</h4>
                      <div className={`text-4xl font-bold ${getBmiColor(bmi)}`}>
                        {bmi.toFixed(1)}
                      </div>
                      <div className={`text-lg font-medium mt-1 ${getBmiColor(bmi)}`}>
                        {bmiCategory}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="h-6 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-700 relative">
                        <div 
                          className="absolute top-full w-1 h-3 -ml-0.5 bg-black"
                          style={{ left: `${getBmiIndicatorPosition(bmi)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>10</span>
                        <span>18.5</span>
                        <span>25</span>
                        <span>30</span>
                        <span>35</span>
                        <span>40</span>
                        <span>45+</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="text-blue-500">Under</span>
                        <span className="text-green-500 flex-grow text-center">Normal</span>
                        <span className="text-yellow-500">Over</span>
                        <span className="text-orange-500 flex-grow text-center">Obese</span>
                        <span className="text-red-700">Extreme</span>
                      </div>
                    </div>
                    
                    {healthyWeightRange && (
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2">Healthy Weight Range</h4>
                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">
                              {healthyWeightRange.min}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Min {weightUnit}
                            </div>
                          </div>
                          
                          <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">
                              {healthyWeightRange.max}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Max {weightUnit}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  BMI Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">What is BMI?</h4>
                    <p className="text-sm text-muted-foreground">
                      Body Mass Index (BMI) is a value derived from a person's weight and height. 
                      It provides a simple numeric measure of a person's thickness or thinness, 
                      allowing health professionals to discuss weight problems more objectively 
                      with their patients.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">BMI Categories</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-blue-500">Underweight</span>
                        <span>&lt; 18.5</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-green-500">Normal Weight</span>
                        <span>18.5 - 24.9</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-yellow-500">Overweight</span>
                        <span>25 - 29.9</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-orange-500">Obesity Class I</span>
                        <span>30 - 34.9</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-red-500">Obesity Class II</span>
                        <span>35 - 39.9</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-red-700">Obesity Class III</span>
                        <span>&ge; 40</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Limitations of BMI</h4>
                    <p className="text-sm text-muted-foreground">
                      BMI is a simple tool that doesn't take into account factors like muscle mass, 
                      bone density, overall body composition, or gender differences. Athletes or 
                      very muscular individuals might have a high BMI without excess fat. BMI also 
                      doesn't consider where fat is distributed on the body, which can affect health risks.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Health Considerations</h4>
                    <p className="text-sm text-muted-foreground">
                      BMI is just one indicator of potential health risks. Other important factors include:
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2 space-y-1">
                      <li>Waist circumference</li>
                      <li>Blood pressure</li>
                      <li>Cholesterol levels</li>
                      <li>Blood sugar levels</li>
                      <li>Family history of disease</li>
                      <li>Diet and physical activity</li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md text-sm">
                    <p>
                      <strong>Note:</strong> This calculator is for informational purposes only and 
                      is not a substitute for professional medical advice. Always consult with 
                      healthcare professionals for proper evaluation of your health.
                    </p>
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