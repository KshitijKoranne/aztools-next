"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

export default function Client() {
  const [bill, setBill] = useState("");
  const [tip, setTip] = useState("18");
  const [people, setPeople] = useState("1");

  const b = parseFloat(bill) || 0;
  const t = parseFloat(tip) || 0;
  const p = Math.max(1, parseInt(people) || 1);
  const tipAmt = (b * t) / 100;
  const total = b + tipAmt;

  return (
    <ToolLayout toolId="tip-calculator">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" /> Bill Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Bill Amount ($)</Label>
              <Input type="number" placeholder="0.00" value={bill} onChange={(e) => setBill(e.target.value)} step="0.01" />
            </div>
            <div className="space-y-2">
              <Label>Tip Percentage (%)</Label>
              <Input type="number" value={tip} onChange={(e) => setTip(e.target.value)} step="0.1" />
              <div className="flex gap-2">
                {[15, 18, 20, 25].map((pct) => (
                  <Button key={pct} variant={tip === String(pct) ? "default" : "outline"} size="sm" onClick={() => setTip(String(pct))}>
                    {pct}%
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Number of People</Label>
              <Input type="number" min="1" value={people} onChange={(e) => setPeople(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Results</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-muted-foreground">Tip Amount</p><p className="text-2xl font-bold">${tipAmt.toFixed(2)}</p></div>
              <div><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">${total.toFixed(2)}</p></div>
            </div>
            {p > 1 && (
              <div className="border-t pt-4 grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">Tip / Person</p><p className="text-xl font-semibold">${(tipAmt / p).toFixed(2)}</p></div>
                <div><p className="text-sm text-muted-foreground">Total / Person</p><p className="text-xl font-semibold">${(total / p).toFixed(2)}</p></div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
