"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
  return `${r}, ${g}, ${b}`;
}

function rgbToHex(rgb: string) {
  const [r,g,b] = rgb.split(",").map(n => parseInt(n.trim(),10));
  return `#${((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1).toUpperCase()}`;
}

function rgbToHsl(rgb: string) {
  const [r,g,b] = rgb.split(",").map(n => parseInt(n.trim(),10)/255);
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h=0, s=0;
  const l=(max+min)/2;
  if (max !== min) {
    const d = max-min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max) {
      case r: h=(g-b)/d+(g<b?6:0); break;
      case g: h=(b-r)/d+2; break;
      case b: h=(r-g)/d+4; break;
    }
    h /= 6;
  }
  return `${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%`;
}

function hslToRgb(hsl: string) {
  let [h,s,l] = hsl.split(",").map(n => parseFloat(n.trim().replace("%","")));
  h/=360; s/=100; l/=100;
  let r: number, g: number, b: number;
  if (s===0) { r=g=b=l; } else {
    const hue2rgb=(p:number,q:number,t:number)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};
    const q=l<0.5?l*(1+s):l+s-l*s, p=2*l-q;
    r=hue2rgb(p,q,h+1/3); g=hue2rgb(p,q,h); b=hue2rgb(p,q,h-1/3);
  }
  return `${Math.round(r*255)}, ${Math.round(g*255)}, ${Math.round(b*255)}`;
}

const isHex = (v:string) => /^#?([0-9A-F]{3}){1,2}$/i.test(v);
const isRgb = (v:string) => { const p=v.split(",").map(n=>parseInt(n.trim(),10)); return p.length===3&&p.every(x=>!isNaN(x)&&x>=0&&x<=255); };
const isHsl = (v:string) => { const p=v.split(",").map(n=>parseFloat(n.trim())); return p.length===3&&!isNaN(p[0])&&p[0]>=0&&p[0]<=360&&!isNaN(p[1])&&p[1]>=0&&p[1]<=100&&!isNaN(p[2])&&p[2]>=0&&p[2]<=100; };

export default function ColorConverterClient() {
  const [hex, setHex] = useState("#3498db");
  const [rgb, setRgb] = useState("52, 152, 219");
  const [hsl, setHsl] = useState("204, 70%, 53%");
  const [tab, setTab] = useState("hex-to-rgb");

  const convert = () => {
    try {
      if (tab === "hex-to-rgb") {
        if (!isHex(hex)) { toast.error("Invalid HEX color"); return; }
        const h = hex.startsWith("#") ? hex : `#${hex}`;
        setHex(h); setRgb(hexToRgb(h)); setHsl(rgbToHsl(hexToRgb(h)));
      } else if (tab === "rgb-to-hex") {
        if (!isRgb(rgb)) { toast.error("Invalid RGB color (e.g. 52, 152, 219)"); return; }
        const h = rgbToHex(rgb); setHex(h); setHsl(rgbToHsl(rgb));
      } else {
        if (!isHsl(hsl)) { toast.error("Invalid HSL color (e.g. 204, 70%, 53%)"); return; }
        const r = hslToRgb(hsl); const h = rgbToHex(r); setHex(h); setRgb(r);
      }
      toast.success("Converted");
    } catch { toast.error("Conversion failed"); }
  };

  const copy = (v:string, label:string) => { navigator.clipboard.writeText(v); toast.success(`${label} copied`); };

  const previewHex = isHex(hex) ? (hex.startsWith("#") ? hex : `#${hex}`) : "#3498db";

  return (
    <ToolLayout toolId="color-converter">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 bg-muted p-4 rounded-md flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-md shadow-md" style={{ backgroundColor: previewHex }} />
            <input type="color" value={previewHex} onChange={(e) => { const h=e.target.value; setHex(h); setRgb(hexToRgb(h)); setHsl(rgbToHsl(hexToRgb(h))); }} className="h-10 w-10 cursor-pointer border-0 rounded" />
          </div>
          <div className="font-mono text-sm space-y-1">
            <p>HEX: {hex}</p>
            <p>RGB: rgb({rgb})</p>
            <p>HSL: hsl({hsl})</p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="hex-to-rgb">HEX → RGB/HSL</TabsTrigger>
            <TabsTrigger value="rgb-to-hex">RGB → HEX/HSL</TabsTrigger>
            <TabsTrigger value="hsl-to-hex">HSL → HEX/RGB</TabsTrigger>
          </TabsList>
          <TabsContent value="hex-to-rgb" className="space-y-2 mt-4">
            <Label>HEX Color Code</Label>
            <div className="flex gap-2"><Input placeholder="#3498db" value={hex} onChange={e=>setHex(e.target.value)} /><Button variant="outline" onClick={()=>copy(hex,"HEX")}><Copy className="h-4 w-4"/></Button></div>
          </TabsContent>
          <TabsContent value="rgb-to-hex" className="space-y-2 mt-4">
            <Label>RGB (comma-separated)</Label>
            <div className="flex gap-2"><Input placeholder="52, 152, 219" value={rgb} onChange={e=>setRgb(e.target.value)} /><Button variant="outline" onClick={()=>copy(rgb,"RGB")}><Copy className="h-4 w-4"/></Button></div>
          </TabsContent>
          <TabsContent value="hsl-to-hex" className="space-y-2 mt-4">
            <Label>HSL (comma-separated)</Label>
            <div className="flex gap-2"><Input placeholder="204, 70%, 53%" value={hsl} onChange={e=>setHsl(e.target.value)} /><Button variant="outline" onClick={()=>copy(hsl,"HSL")}><Copy className="h-4 w-4"/></Button></div>
          </TabsContent>
        </Tabs>

        <Button onClick={convert} className="w-full mt-6 gap-2"><RefreshCw className="h-4 w-4"/>Convert</Button>

        <div className="grid grid-cols-3 gap-4 mt-8">
          {[["HEX", hex, hex], ["RGB", `rgb(${rgb})`, `rgb(${rgb})`], ["HSL", `hsl(${hsl})`, `hsl(${hsl})`]].map(([label, display, copyVal]) => (
            <div key={label} className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">{label}</h3>
              <p className="text-sm mb-2 font-mono break-all">{display}</p>
              <Button size="sm" variant="secondary" className="w-full" onClick={()=>copy(copyVal, label)}><Copy className="h-3 w-3 mr-2"/>Copy</Button>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
