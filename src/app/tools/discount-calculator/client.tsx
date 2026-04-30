"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

function Res({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted p-4 rounded-md flex justify-between items-center">
      <div><p className="text-sm text-muted-foreground">{label}</p><p className="text-lg font-medium">{value}</p></div>
      <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard.writeText(value); toast.success("Copied"); }}><Copy className="h-4 w-4" /></Button>
    </div>
  );
}

export default function Client() {
  const [sOrig, setSorig] = useState(""); const [sDpct, setSdpct] = useState(""); const [sFinal, setSfinal] = useState(""); const [sSaved, setSsaved] = useState("");
  const [mBase, setMbase] = useState(""); const [mDiscs, setMdiscs] = useState([""]); const [mFinal, setMfinal] = useState(""); const [mSavings, setMsavings] = useState(""); const [mRate, setMrate] = useState("");
  const [rFinal, setRfinal] = useState(""); const [rRate, setRrate] = useState(""); const [rOrig, setRorig] = useState("");
  const [c1P, setC1p] = useState(""); const [c1D, setC1d] = useState(""); const [c2P, setC2p] = useState(""); const [c2D, setC2d] = useState("");
  const [cmp, setCmp] = useState<{ f1: string; f2: string; diff: string; better: number } | null>(null);

  const n = (s: string) => parseFloat(s) || 0;

  return (
    <ToolLayout toolId="discount-calculator">
      <div className="max-w-3xl mx-auto">
        <Tabs defaultValue="simple">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="simple">Simple</TabsTrigger>
            <TabsTrigger value="multiple">Multiple</TabsTrigger>
            <TabsTrigger value="reverse">Reverse</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
          </TabsList>

          <TabsContent value="simple" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Original Price ($)</Label><Input type="number" placeholder="100" value={sOrig} onChange={(e) => setSorig(e.target.value)} /></div>
              <div><Label>Discount (%)</Label><Input type="number" placeholder="20" value={sDpct} onChange={(e) => setSdpct(e.target.value)} /></div>
            </div>
            <Button className="w-full" onClick={() => { const saved = n(sOrig) * n(sDpct) / 100; const final = n(sOrig) - saved; setSfinal(final.toFixed(2)); setSsaved(saved.toFixed(2)); toast.success(`Final: $${final.toFixed(2)}`); }}>Calculate</Button>
            {sFinal && <div className="grid grid-cols-2 gap-4"><Res label="Final Price" value={`$${sFinal}`} /><Res label="You Save" value={`$${sSaved}`} /></div>}
          </TabsContent>

          <TabsContent value="multiple" className="space-y-4 mt-6">
            <div><Label>Base Price ($)</Label><Input type="number" placeholder="100" value={mBase} onChange={(e) => setMbase(e.target.value)} /></div>
            <div className="space-y-2">
              <div className="flex justify-between items-center"><Label>Discount Percentages</Label><Button size="sm" variant="outline" onClick={() => setMdiscs([...mDiscs, ""])}><Plus className="h-4 w-4 mr-1" />Add</Button></div>
              {mDiscs.map((d, i) => (
                <div key={i} className="flex gap-2">
                  <Input type="number" placeholder={`Discount ${i + 1}`} value={d} onChange={(e) => { const a = [...mDiscs]; a[i] = e.target.value; setMdiscs(a); }} />
                  {mDiscs.length > 1 && <Button variant="ghost" size="icon" onClick={() => setMdiscs(mDiscs.filter((_, j) => j !== i))}><Minus className="h-4 w-4" /></Button>}
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={() => {
              const vals = mDiscs.map(n).filter(v => v > 0);
              let price = n(mBase); let totalSaved = 0;
              vals.forEach(d => { const s = price * d / 100; price -= s; totalSaved += s; });
              const eff = (totalSaved / n(mBase)) * 100;
              setMfinal(price.toFixed(2)); setMsavings(totalSaved.toFixed(2)); setMrate(eff.toFixed(2));
              toast.success(`Final: $${price.toFixed(2)}`);
            }}>Calculate</Button>
            {mFinal && <div className="grid grid-cols-3 gap-4"><Res label="Final Price" value={`$${mFinal}`} /><Res label="Total Savings" value={`$${mSavings}`} /><Res label="Effective Rate" value={`${mRate}%`} /></div>}
          </TabsContent>

          <TabsContent value="reverse" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Final Price ($)</Label><Input type="number" placeholder="80" value={rFinal} onChange={(e) => setRfinal(e.target.value)} /></div>
              <div><Label>Discount (%)</Label><Input type="number" placeholder="20" value={rRate} onChange={(e) => setRrate(e.target.value)} /></div>
            </div>
            <Button className="w-full" onClick={() => {
              if (n(rRate) >= 100) return toast.error("Discount must be less than 100%");
              const r = (n(rFinal) / (1 - n(rRate) / 100)).toFixed(2);
              setRorig(r); toast.success(`Original: $${r}`);
            }}>Calculate Original Price</Button>
            {rOrig && <Res label="Original Price" value={`$${rOrig}`} />}
          </TabsContent>

          <TabsContent value="compare" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3"><h3 className="font-medium">Option 1</h3><div><Label>Price ($)</Label><Input type="number" placeholder="100" value={c1P} onChange={(e) => setC1p(e.target.value)} /></div><div><Label>Discount (%)</Label><Input type="number" placeholder="20" value={c1D} onChange={(e) => setC1d(e.target.value)} /></div></div>
              <div className="space-y-3"><h3 className="font-medium">Option 2</h3><div><Label>Price ($)</Label><Input type="number" placeholder="120" value={c2P} onChange={(e) => setC2p(e.target.value)} /></div><div><Label>Discount (%)</Label><Input type="number" placeholder="30" value={c2D} onChange={(e) => setC2d(e.target.value)} /></div></div>
            </div>
            <Button className="w-full" onClick={() => {
              const f1 = n(c1P) * (1 - n(c1D) / 100); const f2 = n(c2P) * (1 - n(c2D) / 100);
              setCmp({ f1: f1.toFixed(2), f2: f2.toFixed(2), diff: Math.abs(f1 - f2).toFixed(2), better: f1 < f2 ? 1 : f2 < f1 ? 2 : 0 });
            }}>Compare</Button>
            {cmp && (
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-md bg-muted ${cmp.better === 1 ? "border-2 border-green-500" : ""}`}>
                  <p className="text-sm text-muted-foreground">Option 1</p><p className="text-lg font-medium">${cmp.f1}</p>
                  {cmp.better === 1 && <p className="text-green-600 text-sm mt-1">Better Deal!</p>}
                </div>
                <div className={`p-4 rounded-md bg-muted ${cmp.better === 2 ? "border-2 border-green-500" : ""}`}>
                  <p className="text-sm text-muted-foreground">Option 2</p><p className="text-lg font-medium">${cmp.f2}</p>
                  {cmp.better === 2 && <p className="text-green-600 text-sm mt-1">Better Deal!</p>}
                </div>
                <div className="col-span-2 p-4 rounded-md bg-muted text-center">
                  <p className="text-sm text-muted-foreground">Price Difference</p><p className="text-lg font-medium">${cmp.diff}</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
}
