"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, ArrowRight } from "lucide-react";
import { toast } from "sonner";

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500" };
  if (bmi < 25) return { label: "Normal weight", color: "text-green-500" };
  if (bmi < 30) return { label: "Overweight", color: "text-yellow-500" };
  if (bmi < 35) return { label: "Obesity Class I", color: "text-orange-500" };
  if (bmi < 40) return { label: "Obesity Class II", color: "text-red-500" };
  return { label: "Obesity Class III", color: "text-red-700" };
}

export default function Client() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [height, setHeight] = useState(170);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);
  const [weight, setWeight] = useState(70);
  const [bmi, setBmi] = useState<number | null>(null);
  const [healthyRange, setHealthyRange] = useState<{ min: number; max: number } | null>(null);

  const calculate = () => {
    const hm = unit === "metric" ? height / 100 : ((heightFt * 12 + heightIn) * 2.54) / 100;
    const wkg = unit === "metric" ? weight : weight * 0.453592;
    const val = Math.round((wkg / (hm * hm)) * 10) / 10;
    setBmi(val);
    const minW = 18.5 * hm * hm;
    const maxW = 24.9 * hm * hm;
    setHealthyRange({
      min: Math.round(unit === "metric" ? minW : minW / 0.453592),
      max: Math.round(unit === "metric" ? maxW : maxW / 0.453592),
    });
    toast.success(`BMI: ${val} (${getBmiCategory(val).label})`);
  };

  const indicatorPos = bmi ? Math.max(0, Math.min(100, ((bmi - 10) / 35) * 100)) : 0;

  return (
    <ToolLayout toolId="bmi-calculator">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Scale className="h-5 w-5" /> BMI Calculator</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={unit} onValueChange={(v) => setUnit(v as "metric" | "imperial")}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="metric">Metric</TabsTrigger>
                <TabsTrigger value="imperial">Imperial</TabsTrigger>
              </TabsList>

              <TabsContent value="metric" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <div className="flex items-center gap-4">
                    <Slider min={100} max={250} step={1} value={[height]} onValueChange={([v]) => setHeight(v!)} className="flex-1" />
                    <Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <div className="flex items-center gap-4">
                    <Slider min={20} max={200} step={1} value={[weight]} onValueChange={([v]) => setWeight(v!)} className="flex-1" />
                    <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-20" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="imperial" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Height (ft / in)</Label>
                  <div className="flex gap-2">
                    <div className="flex-1"><Input type="number" min={1} max={8} value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value))} /><div className="text-xs text-center mt-1">feet</div></div>
                    <div className="flex-1"><Input type="number" min={0} max={11} value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))} /><div className="text-xs text-center mt-1">inches</div></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Weight (lb)</Label>
                  <div className="flex items-center gap-4">
                    <Slider min={45} max={440} step={1} value={[weight]} onValueChange={([v]) => setWeight(v!)} className="flex-1" />
                    <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-20" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Button className="w-full gap-2" size="lg" onClick={calculate}>Calculate BMI <ArrowRight className="h-4 w-4" /></Button>

            {bmi !== null && (
              <div className="space-y-4 pt-2 border-t">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Your BMI</p>
                  <p className={`text-4xl font-bold ${getBmiCategory(bmi).color}`}>{bmi.toFixed(1)}</p>
                  <p className={`text-lg font-medium ${getBmiCategory(bmi).color}`}>{getBmiCategory(bmi).label}</p>
                </div>
                <div className="relative">
                  <div className="h-4 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-700" />
                  <div className="absolute top-full w-0.5 h-3 bg-foreground" style={{ left: `${indicatorPos}%`, transform: "translateX(-50%)" }} />
                </div>
                {healthyRange && (
                  <div className="flex justify-between items-center pt-2">
                    <div className="text-center"><p className="text-2xl font-bold text-green-500">{healthyRange.min}</p><p className="text-xs text-muted-foreground">Min {unit === "metric" ? "kg" : "lb"}</p></div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="text-center"><p className="text-2xl font-bold text-green-500">{healthyRange.max}</p><p className="text-xs text-muted-foreground">Max {unit === "metric" ? "kg" : "lb"}</p></div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>BMI Categories</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { label: "Underweight", range: "< 18.5", color: "text-blue-500" },
              { label: "Normal Weight", range: "18.5 – 24.9", color: "text-green-500" },
              { label: "Overweight", range: "25 – 29.9", color: "text-yellow-500" },
              { label: "Obesity Class I", range: "30 – 34.9", color: "text-orange-500" },
              { label: "Obesity Class II", range: "35 – 39.9", color: "text-red-500" },
              { label: "Obesity Class III", range: "≥ 40", color: "text-red-700" },
            ].map(({ label, range, color }) => (
              <div key={label} className="flex justify-between">
                <span className={`font-medium ${color}`}>{label}</span>
                <span>{range}</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-2">BMI is a screening tool, not a diagnostic measure. Consult a healthcare professional for proper evaluation.</p>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
