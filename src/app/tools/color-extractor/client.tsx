"use client";
import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Copy, Upload, Trash, Download, Palette } from "lucide-react";
import { toast } from "sonner";

interface Color { hex: string; name: string; pct: number; }

function rgbToHex(r:number,g:number,b:number) { return "#"+[r,g,b].map(x=>{const h=x.toString(16);return h.length===1?"0"+h:h;}).join(""); }
function textColor(hex:string) { const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return (0.299*r+0.587*g+0.114*b)/255>0.5?"black":"white"; }

export default function ColorExtractorClient() {
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string|null>(null);
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const [sampling, setSampling] = useState(10);
  const [maxColors, setMaxColors] = useState(12);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if(!file) return;
    if(!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if(file.size>10*1024*1024) { toast.error("File must be under 10MB"); return; }
    setLoading(true); setColors([]);
    const reader = new FileReader();
    reader.onload = ev => { setImageUrl(ev.target?.result as string); toast.success(`${file.name} loaded`); };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if(!imageUrl) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current; if(!canvas) return;
      const ctx = canvas.getContext("2d", {willReadFrequently:true}); if(!ctx) return;
      const max=500; let w=img.width, h=img.height;
      if(w>h&&w>max){h=h/w*max;w=max;}else if(h>max){w=w/h*max;h=max;}
      canvas.width=w; canvas.height=h;
      ctx.drawImage(img,0,0,w,h);
      const freq: Record<string,number> = {};
      const step=Math.max(1,Math.floor(sampling));
      for(let y=0;y<h;y+=step) for(let x=0;x<w;x+=step) {
        const d=ctx.getImageData(x,y,1,1).data;
        if(d[3]===0) continue;
        const hex=rgbToHex(d[0]!,d[1]!,d[2]!);
        freq[hex]=(freq[hex]||0)+1;
      }
      const total=Object.values(freq).reduce((s,c)=>s+c,0);
      const sorted=Object.entries(freq).sort(([,a],[,b])=>b-a).slice(0,maxColors)
        .map(([hex,count],i)=>({hex,name:`Color ${i+1}`,pct:(count/total)*100}));
      setColors(sorted); setLoading(false);
      toast.success(`Extracted ${sorted.length} dominant colors`);
    };
    img.onerror = () => { toast.error("Failed to load image"); setLoading(false); };
    img.src = imageUrl;
  }, [imageUrl, sampling, maxColors]);

  const savePalette = () => {
    const c=document.createElement("canvas"); const ctx=c.getContext("2d"); if(!ctx) return;
    c.width=50*colors.length; c.height=50;
    colors.forEach((col,i)=>{ ctx.fillStyle=col.hex; ctx.fillRect(i*50,0,50,50); });
    c.toBlob(blob=>{ if(!blob) return; const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="palette.png"; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); toast.success("Palette downloaded"); });
  };

  return (
    <ToolLayout toolId="color-extractor">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5"/>Color Extractor</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sampling Rate (higher = faster)</Label>
                <Slider value={[sampling]} min={1} max={20} step={1} onValueChange={([v])=>setSampling(v!)}/>
              </div>
              <div className="space-y-2">
                <Label>Max Colors</Label>
                <Input type="number" min={1} max={24} value={maxColors} onChange={e=>setMaxColors(parseInt(e.target.value)||12)}/>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden"/>
            {!imageUrl ? (
              <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50" onClick={()=>fileRef.current?.click()}>
                <Upload className="h-8 w-8 mx-auto mb-3 opacity-50"/>
                <p className="font-medium">Upload an image</p>
                <p className="text-sm text-muted-foreground mt-1">JPG, PNG, GIF, WebP (max 10MB)</p>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center min-h-[200px]">
                <img src={imageUrl} alt="Uploaded" className="max-w-full max-h-[400px] object-contain"/>
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 rounded-full" onClick={()=>{setImageUrl(null);setColors([]);if(fileRef.current)fileRef.current.value="";}}>
                  <Trash className="h-4 w-4"/>
                </Button>
                {loading && <div className="absolute inset-0 bg-background/80 flex items-center justify-center text-sm">Processing...</div>}
                <canvas ref={canvasRef} className="hidden"/>
              </div>
            )}
          </CardContent>
        </Card>

        {colors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Extracted Colors ({colors.length})</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={()=>{navigator.clipboard.writeText(colors.map(c=>c.hex).join("\n"));toast.success("All colors copied");}}>
                    <Copy className="h-3 w-3 mr-1"/>Copy All
                  </Button>
                  <Button size="sm" variant="outline" onClick={savePalette}><Download className="h-3 w-3 mr-1"/>Save Palette</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {colors.map((color,i)=>(
                  <div key={i} className="group space-y-2">
                    <div className="aspect-square rounded-lg border relative overflow-hidden" style={{backgroundColor:color.hex}}>
                      <span className="text-xs font-mono px-1 py-0.5 rounded absolute top-1 left-1 bg-background/90" style={{color:textColor(color.hex)}}>{color.hex.toUpperCase()}</span>
                      <Button size="icon" variant="ghost" className="absolute bottom-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 bg-background/90 hover:bg-background"
                        onClick={()=>{navigator.clipboard.writeText(color.hex);toast.success("Copied");}}>
                        <Copy className="h-3 w-3"/>
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground text-center">{color.pct.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
