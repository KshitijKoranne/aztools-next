"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X, RefreshCw } from "lucide-react";

function getLuminance(hex: string) {
  const len = hex.length;
  let r=0,g=0,b=0;
  if(len===4){r=parseInt(hex[1]+hex[1],16);g=parseInt(hex[2]+hex[2],16);b=parseInt(hex[3]+hex[3],16);}
  else if(len===7){r=parseInt(hex.slice(1,3),16);g=parseInt(hex.slice(3,5),16);b=parseInt(hex.slice(5,7),16);}
  const f=(c:number)=>{const x=c/255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4);};
  return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b);
}

function contrastRatio(c1:string,c2:string) {
  const l1=getLuminance(c1), l2=getLuminance(c2);
  const light=Math.max(l1,l2), dark=Math.min(l1,l2);
  return parseFloat(((light+0.05)/(dark+0.05)).toFixed(2));
}

const isHex = (v:string) => /^#([A-Fa-f0-9]{3}){1,2}$/.test(v);

export default function ColorContrastCheckerClient() {
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");

  const valid = isHex(fg) && isHex(bg);
  const ratio = valid ? contrastRatio(fg, bg) : 0;
  const AA = ratio >= 4.5, AALarge = ratio >= 3, AAA = ratio >= 7, AAALarge = ratio >= 4.5;

  const grade = AAA ? "AAA — Excellent" : AA ? "AA — Good" : AALarge ? "AA Large only" : "Fails WCAG";
  const gradeColor = AAA||AA ? "text-green-600 dark:text-green-400" : AALarge ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400";

  const swap = () => { const t=fg; setFg(bg); setBg(t); };

  const handle = (setter: (v:string)=>void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setter(v.startsWith("#") ? v : `#${v}`);
  };

  return (
    <ToolLayout toolId="color-contrast-checker">
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Text Color (Foreground)</Label>
            <div className="flex gap-2 items-center">
              <input type="color" value={isHex(fg)?fg:"#000000"} onChange={e=>setFg(e.target.value)} className="h-10 w-10 cursor-pointer rounded border"/>
              <Input value={fg} onChange={handle(setFg)} className="font-mono" placeholder="#000000"/>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2 items-center">
              <input type="color" value={isHex(bg)?bg:"#ffffff"} onChange={e=>setBg(e.target.value)} className="h-10 w-10 cursor-pointer rounded border"/>
              <Input value={bg} onChange={handle(setBg)} className="font-mono" placeholder="#ffffff"/>
            </div>
          </div>
          <Button variant="outline" onClick={swap}><RefreshCw className="mr-2 h-4 w-4"/>Swap Colors</Button>
          {!valid && <p className="text-sm text-red-500">Enter valid hex values (e.g. #ffffff)</p>}
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="p-6 rounded-md flex items-center justify-center min-h-[120px] text-center" style={{backgroundColor:isHex(bg)?bg:"#fff",color:isHex(fg)?fg:"#000"}}>
              <div>
                <div className="text-2xl font-bold">Sample Text</div>
                <div className="text-sm mt-1">How your text looks</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Contrast Ratio</span>
                <span className="font-bold">{valid ? `${ratio}:1` : "—"}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" style={{width:`${Math.min(100,(ratio/21)*100)}%`}}/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[["AA",AA,"Small text 4.5:1"],["AA Large",AALarge,"Large text 3:1"],["AAA",AAA,"Small text 7:1"],["AAA Large",AAALarge,"Large text 4.5:1"]].map(([label,pass,desc])=>(
                <div key={label as string} className="flex items-start gap-2">
                  {pass ? <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5"/> : <X className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5"/>}
                  <div><div className="font-medium text-sm">{label as string}</div><div className="text-xs text-muted-foreground">{desc as string}</div></div>
                </div>
              ))}
            </div>

            <div className={`pt-2 border-t font-medium text-sm ${gradeColor}`}>{valid ? grade : "Enter valid colors"}</div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
