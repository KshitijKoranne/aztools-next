"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Palette } from "lucide-react";

function hexToRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? { r: parseInt(r[1]!,16), g: parseInt(r[2]!,16), b: parseInt(r[3]!,16) } : {r:0,g:0,b:0};
}
function rgbToHex(r:number,g:number,b:number) {
  return "#"+[r,g,b].map(x=>{const h=Math.round(x).toString(16);return h.length===1?"0"+h:h;}).join("");
}

export default function ColorMixerClient() {
  const [color1, setColor1] = useState("#ff0000");
  const [color2, setColor2] = useState("#0000ff");
  const [ratio, setRatio] = useState([50]);

  const mix = () => {
    const c1=hexToRgb(color1), c2=hexToRgb(color2), r=ratio[0]!/100;
    return rgbToHex(c1.r*(1-r)+c2.r*r, c1.g*(1-r)+c2.g*r, c1.b*(1-r)+c2.b*r);
  };
  const mixed = mix();
  const mixedRgb = hexToRgb(mixed);

  return (
    <ToolLayout toolId="color-mixer">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5"/>Color Input</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Color 1</Label>
              <div className="flex gap-2 items-center">
                <Input type="color" value={color1} onChange={e=>setColor1(e.target.value)} className="w-16 h-10" />
                <Input value={color1} onChange={e=>setColor1(e.target.value)} className="flex-1 font-mono" />
              </div>
              <div className="w-full h-12 rounded border" style={{backgroundColor:color1}}/>
            </div>
            <div className="space-y-2">
              <Label>Mix Ratio: {ratio[0]}% Color 2</Label>
              <Slider value={ratio} onValueChange={setRatio} max={100} min={0} step={1}/>
            </div>
            <div className="space-y-2">
              <Label>Color 2</Label>
              <div className="flex gap-2 items-center">
                <Input type="color" value={color2} onChange={e=>setColor2(e.target.value)} className="w-16 h-10"/>
                <Input value={color2} onChange={e=>setColor2(e.target.value)} className="flex-1 font-mono"/>
              </div>
              <div className="w-full h-12 rounded border" style={{backgroundColor:color2}}/>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Mixed Result</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full h-32 rounded-lg border-2 border-dashed" style={{backgroundColor:mixed}}/>
            <div className="space-y-2"><Label>Hex</Label><Input value={mixed} readOnly className="font-mono"/></div>
            <div className="grid grid-cols-3 gap-2">
              <div><Label className="text-xs">Red</Label><Input value={mixedRgb.r} readOnly/></div>
              <div><Label className="text-xs">Green</Label><Input value={mixedRgb.g} readOnly/></div>
              <div><Label className="text-xs">Blue</Label><Input value={mixedRgb.b} readOnly/></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
