"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type PaletteType = "monochromatic"|"analogous"|"complementary"|"triadic"|"tetradic";

function hexToHsl(hex: string): [number,number,number] {
  hex = hex.replace(/^#/,""); if(hex.length===3) hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  const r=parseInt(hex.slice(0,2),16)/255, g=parseInt(hex.slice(2,4),16)/255, b=parseInt(hex.slice(4,6),16)/255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b); let h=0,s=0; const l=(max+min)/2;
  if(max!==min){const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;}h/=6;}
  return [h*360,s*100,l*100];
}

function hslToHex(h:number,s:number,l:number):string {
  h/=360;s/=100;l/=100;let r: number,g: number,b: number;
  if(s===0){r=g=b=l;}else{const q=l<0.5?l*(1+s):l+s-l*s,p=2*l-q;const f=(p:number,q:number,t:number)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};r=f(p,q,h+1/3);g=f(p,q,h);b=f(p,q,h-1/3);}
  return "#"+[r,g,b].map(x=>{const h=Math.round(x*255).toString(16);return h.length===1?"0"+h:h;}).join("");
}

function generate(hex:string, type:PaletteType, count:number) {
  const [h,s,l] = hexToHsl(hex);
  if(type==="monochromatic") return Array.from({length:count},(_,i)=>hslToHex(h,s,Math.max(10,Math.min(90,(100/(count+1))*(i+1)))));
  if(type==="analogous") { const step=30/Math.floor(count/2); return Array.from({length:count},(_,i)=>{const hue=(h+step*(i-Math.floor(count/2)))%360; return hslToHex(hue<0?hue+360:hue,s,l);});}
  if(type==="complementary") { const c=(h+180)%360; const base=[hslToHex(h,s,l),hslToHex(c,s,l)]; for(let i=2;i<count;i++){const bh=i%2===0?h:c;base.push(hslToHex(bh,s,Math.max(10,Math.min(90,l+(i%2===0?15:-15)))));} return base.slice(0,count);}
  if(type==="triadic") { const h2=(h+120)%360,h3=(h+240)%360; const base=[hslToHex(h,s,l),hslToHex(h2,s,l),hslToHex(h3,s,l)]; for(let i=3;i<count;i++){const bh=[h,h2,h3][i%3]!;base.push(hslToHex(bh,Math.max(0,s-10),Math.min(90,l+10)));} return base.slice(0,count);}
  // tetradic
  const h2=(h+90)%360,h3=(h+180)%360,h4=(h+270)%360; const base=[hslToHex(h,s,l),hslToHex(h2,s,l),hslToHex(h3,s,l),hslToHex(h4,s,l)]; for(let i=4;i<count;i++){const bh=[h,h2,h3,h4][i%4]!;base.push(hslToHex(bh,s,Math.max(10,Math.min(90,l+(Math.floor(i/4)*10)))));} return base.slice(0,count);
}

export default function ColorPaletteGeneratorClient() {
  const [base, setBase] = useState("#3498db");
  const [type, setType] = useState<PaletteType>("monochromatic");
  const [count, setCount] = useState(5);
  const [palette, setPalette] = useState<string[]>([]);

  const gen = () => {
    if (!/^#?([0-9A-F]{3}){1,2}$/i.test(base)) { toast.error("Invalid HEX color"); return; }
    const h = base.startsWith("#") ? base : `#${base}`;
    setPalette(generate(h, type, count));
    toast.success(`${type} palette generated`);
  };

  return (
    <ToolLayout toolId="color-palette-generator">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Base Color (HEX)</Label>
            <div className="flex gap-2">
              <Input placeholder="#3498db" value={base} onChange={e=>setBase(e.target.value)} />
              <input type="color" value={base.startsWith("#")?base:"#3498db"} onChange={e=>setBase(e.target.value)} className="h-10 w-10 cursor-pointer rounded border p-0.5" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Palette Type</Label>
            <Tabs value={type} onValueChange={v=>setType(v as PaletteType)}>
              <TabsList className="grid grid-cols-5 h-auto">
                {(["monochromatic","analogous","complementary","triadic","tetradic"] as PaletteType[]).map(t=>(
                  <TabsTrigger key={t} value={t} className="text-xs py-2 capitalize">{t.slice(0,5)}{t.length>5?".":""}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label>Number of Colors: {count}</Label>
            <div className="flex gap-2">
              {[2,3,4,5,6,7,8].map(n=>(
                <button key={n} onClick={()=>setCount(n)}
                  className={`w-8 h-8 rounded text-sm ${count===n?"bg-primary text-primary-foreground":"bg-muted hover:bg-muted/80"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={gen} className="w-full gap-2"><RefreshCw className="h-4 w-4"/>Generate Palette</Button>
        </div>

        {palette.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Generated Palette</h3>
              <Button size="sm" variant="outline" onClick={()=>{ navigator.clipboard.writeText(palette.join(", ")); toast.success("All colors copied"); }}>
                <Copy className="h-3 w-3 mr-2"/>Copy All
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {palette.map((color, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-20 rounded-md shadow-sm flex items-end p-2" style={{backgroundColor:color}}>
                    <span className="text-xs font-mono px-1 py-0.5 rounded bg-background/90 border border-border/50">{color.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Color {i+1}</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={()=>{navigator.clipboard.writeText(color);toast.success("Copied");}}>
                      <Copy className="h-3 w-3"/>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
