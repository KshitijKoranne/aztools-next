"use client";
import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Trash, Copy, Target } from "lucide-react";
import { toast } from "sonner";

function rgbToHex(r:number,g:number,b:number) { return "#"+[r,g,b].map(x=>{const h=x.toString(16);return h.length===1?"0"+h:h;}).join(""); }

export default function ImageColorPickerClient() {
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string|null>(null);
  const [picked, setPicked] = useState<{hex:string}[]>([]);
  const [hover, setHover] = useState<string|null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setImageUrl(ev.target?.result as string); setPicked([]); };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if(!imageUrl||!canvasRef.current||!imgRef.current) return;
    const canvas=canvasRef.current, ctx=canvas.getContext("2d"); if(!ctx) return;
    const img=imgRef.current;
    const draw=()=>{ canvas.width=img.naturalWidth; canvas.height=img.naturalHeight; ctx.drawImage(img,0,0); };
    if(img.complete) draw(); else img.onload=draw;
  }, [imageUrl]);

  const getColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas=canvasRef.current; if(!canvas) return null;
    const rect=canvas.getBoundingClientRect();
    const sx=canvas.width/rect.width, sy=canvas.height/rect.height;
    const cx=(e.clientX-rect.left)*sx, cy=(e.clientY-rect.top)*sy;
    const ctx=canvas.getContext("2d",{willReadFrequently:true}); if(!ctx) return null;
    const d=ctx.getImageData(cx,cy,1,1).data;
    return { hex:rgbToHex(d[0]!,d[1]!,d[2]!) };
  };

  return (
    <ToolLayout toolId="image-color-picker">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6">
        <Card className="p-4 space-y-4">
          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={()=>fileRef.current?.click()}><Upload className="h-4 w-4 mr-1"/>Upload Image</Button>
            {imageUrl && <Button variant="destructive" size="sm" onClick={()=>{setImageUrl(null);setPicked([]);if(fileRef.current)fileRef.current.value="";}}>
              <Trash className="h-4 w-4 mr-1"/>Clear
            </Button>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden"/>

          <div className="relative border rounded-lg bg-muted/30 overflow-hidden flex items-center justify-center min-h-[300px]">
            {!imageUrl ? (
              <div className="text-center cursor-pointer p-8" onClick={()=>fileRef.current?.click()}>
                <Upload className="h-10 w-10 mx-auto mb-3 opacity-50"/>
                <p className="font-medium">Upload an image</p>
                <p className="text-sm text-muted-foreground">Click anywhere to pick colors</p>
              </div>
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- Data URLs from user uploads are drawn to canvas and cannot be optimized by next/image. */}
                <img ref={imgRef} src={imageUrl} alt="Uploaded" className="hidden"/>
                <canvas ref={canvasRef}
                  className="max-w-full max-h-[500px] cursor-crosshair"
                  onClick={e=>{ const c=getColor(e); if(!c) return; setPicked(p=>[...p,c]); toast.success(`Picked ${c.hex.toUpperCase()}`); }}
                  onMouseMove={e=>{ const c=getColor(e); setHover(c?.hex||null); }}
                  onMouseLeave={()=>setHover(null)}
                />
                {hover && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-2 px-3 py-1 bg-background/80 rounded text-sm font-mono backdrop-blur-sm">
                    <div className="w-4 h-4 rounded-full border" style={{backgroundColor:hover}}/>
                    {hover.toUpperCase()}
                  </div>
                )}
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Click on the image to pick colors.</p>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">Picked Colors ({picked.length})</h3>
            {picked.length > 0 && (
              <Button variant="outline" size="sm" onClick={()=>{navigator.clipboard.writeText(picked.map(c=>c.hex).join("\n"));toast.success("All copied");}}>
                <Copy className="h-3 w-3"/>
              </Button>
            )}
          </div>
          {picked.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50"/>
              <p className="text-sm">Click image to pick</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {picked.map((c,i)=>(
                <div key={i} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 group">
                  <div className="w-7 h-7 rounded border" style={{backgroundColor:c.hex}}/>
                  <span className="font-mono text-xs flex-1">{c.hex.toUpperCase()}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={()=>{navigator.clipboard.writeText(c.hex);toast.success("Copied");}}>
                    <Copy className="h-3 w-3"/>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={()=>setPicked(p=>p.filter((_,j)=>j!==i))}>
                    <Trash className="h-3 w-3"/>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </ToolLayout>
  );
}
