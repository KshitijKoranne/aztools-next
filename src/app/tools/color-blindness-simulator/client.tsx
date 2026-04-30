"use client";
import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Upload, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type VisionType = "normal"|"protanopia"|"deuteranopia"|"tritanopia"|"achromatopsia";

const TYPES: {id:VisionType;name:string}[] = [
  {id:"normal",name:"Normal Vision"},
  {id:"protanopia",name:"Protanopia (Red-Blind)"},
  {id:"deuteranopia",name:"Deuteranopia (Green-Blind)"},
  {id:"tritanopia",name:"Tritanopia (Blue-Blind)"},
  {id:"achromatopsia",name:"Achromatopsia (Monochromacy)"},
];

const MATRICES: Record<VisionType, number[]> = {
  normal: [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0],
  protanopia: [0.567,0.433,0,0,0,0.558,0.442,0,0,0,0,0.242,0.758,0,0,0,0,0,1,0],
  deuteranopia: [0.625,0.375,0,0,0,0.7,0.3,0,0,0,0,0.3,0.7,0,0,0,0,0,1,0],
  tritanopia: [0.95,0.05,0,0,0,0,0.433,0.567,0,0,0,0.475,0.525,0,0,0,0,0,1,0],
  achromatopsia: [0.299,0.587,0.114,0,0,0.299,0.587,0.114,0,0,0.299,0.587,0.114,0,0,0,0,0,1,0],
};

export default function ColorBlindnessSimulatorClient() {
  const [image, setImage] = useState<string|null>(null);
  const [type, setType] = useState<VisionType>("normal");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if(!file) return;
    if(!file.type.match("image.*")) { toast.error("Please upload an image file"); return; }
    const reader = new FileReader();
    reader.onload = ev => { if(ev.target?.result) setImage(ev.target.result as string); };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if(!image||!canvasRef.current) return;
    const canvas=canvasRef.current, ctx=canvas.getContext("2d"); if(!ctx) return;
    const img=new Image(); img.src=image;
    img.onload=()=>{
      canvas.width=img.width; canvas.height=img.height; ctx.drawImage(img,0,0);
      if(type==="normal") return;
      const d=ctx.getImageData(0,0,canvas.width,canvas.height); const px=d.data; const m=MATRICES[type]!;
      for(let i=0;i<px.length;i+=4){
        const r=px[i]!,g=px[i+1]!,b=px[i+2]!;
        px[i]=r*m[0]!+g*m[1]!+b*m[2]!; px[i+1]=r*m[5]!+g*m[6]!+b*m[7]!; px[i+2]=r*m[10]!+g*m[11]!+b*m[12]!;
      }
      ctx.putImageData(d,0,0);
    };
  }, [image, type]);

  const download=()=>{
    if(!canvasRef.current) return;
    const a=document.createElement("a"); a.download=`${type}.png`; a.href=canvasRef.current.toDataURL("image/png");
    a.click(); toast.success("Downloaded");
  };

  return (
    <ToolLayout toolId="color-blindness-simulator">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5"/>Image</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden"/>
              <Button className="w-full" onClick={()=>fileRef.current?.click()}><Upload className="h-4 w-4 mr-2"/>Choose Image</Button>
              {image && <>
                <Button variant="outline" className="w-full" onClick={()=>{setImage(null);setType("normal");if(fileRef.current)fileRef.current.value="";}}>
                  <RefreshCw className="h-4 w-4 mr-2"/>Reset
                </Button>
                <Button variant="secondary" className="w-full" onClick={download}><Download className="h-4 w-4 mr-2"/>Download</Button>
              </>}
            </CardContent>
          </Card>

          {image && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5"/>Vision Type</CardTitle></CardHeader>
              <CardContent>
                <Tabs value={type} onValueChange={v=>setType(v as VisionType)}>
                  <TabsList className="grid grid-cols-1 w-full h-auto gap-1">
                    {TYPES.map(t=>(
                      <TabsTrigger key={t.id} value={t.id} className="justify-start text-xs p-2 h-auto">
                        <Eye className="h-3 w-3 mr-2 shrink-0"/>{t.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          )}

          <Card className={image?"lg:col-span-2":"lg:col-span-3"}>
            <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5"/>Preview</CardTitle></CardHeader>
            <CardContent>
              {image ? (
                <div className="flex justify-center bg-muted/20 rounded-lg p-4 min-h-[300px] overflow-hidden">
                  <canvas ref={canvasRef} className="max-w-full max-h-[500px] object-contain"/>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                  <Eye className="h-16 w-16 mb-4 opacity-30"/>
                  <h3 className="font-medium mb-2">No Image Uploaded</h3>
                  <p className="text-sm text-muted-foreground">Upload an image to simulate color blindness.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
