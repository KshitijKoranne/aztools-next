"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export default function GradientGeneratorClient() {
  const [colors, setColors] = useState(["#3b82f6","#9333ea"]);
  const [type, setType] = useState("linear");
  const [direction, setDirection] = useState("to right");
  const [angle, setAngle] = useState(90);
  const [radialShape, setRadialShape] = useState("circle");
  const [radialPos, setRadialPos] = useState("center");

  const css = () => type === "linear"
    ? `linear-gradient(${direction==="custom"?`${angle}deg`:direction}, ${colors.join(", ")})`
    : `radial-gradient(${radialShape} at ${radialPos}, ${colors.join(", ")})`;

  const fullCss = `background: ${css()};`;

  const handleColorChange = (i:number, v:string) => { const c=[...colors]; c[i]=v; setColors(c); };
  const addColor = () => { if(colors.length<5) setColors([...colors,"#ffffff"]); };
  const removeColor = (i:number) => { if(colors.length>2) setColors(colors.filter((_,j)=>j!==i)); };

  return (
    <ToolLayout toolId="gradient-generator">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Gradient Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent><SelectItem value="linear">Linear</SelectItem><SelectItem value="radial">Radial</SelectItem></SelectContent>
            </Select>
          </div>

          {type==="linear" ? (
            <div className="space-y-2">
              <Label>Direction</Label>
              <Select value={direction} onValueChange={setDirection}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  {[["to right","Left to Right"],["to left","Right to Left"],["to bottom","Top to Bottom"],["to top","Bottom to Top"],["to bottom right","TL → BR"],["to bottom left","TR → BL"],["to top right","BL → TR"],["to top left","BR → TL"],["custom","Custom Angle"]].map(([v,l])=><SelectItem key={v} value={v}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
              {direction==="custom" && (
                <div className="space-y-1"><Label>Angle: {angle}°</Label><Slider value={[angle]} min={0} max={360} step={1} onValueChange={([v])=>setAngle(v!)}/></div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Shape</Label>
                <Select value={radialShape} onValueChange={setRadialShape}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent><SelectItem value="circle">Circle</SelectItem><SelectItem value="ellipse">Ellipse</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={radialPos} onValueChange={setRadialPos}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    {["center","top","bottom","left","right","top left","top right","bottom left","bottom right"].map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Color Stops</Label>
              {colors.length<5 && <Button variant="outline" size="sm" onClick={addColor}>Add Color</Button>}
            </div>
            <div className="space-y-2">
              {colors.map((color,i)=>(
                <div key={i} className="flex items-center gap-2">
                  <input type="color" value={color} onChange={e=>handleColorChange(i,e.target.value)} className="h-10 w-12 cursor-pointer rounded border p-0.5"/>
                  <Input value={color} onChange={e=>handleColorChange(i,e.target.value)} className="font-mono"/>
                  {colors.length>2 && <Button variant="outline" size="icon" onClick={()=>removeColor(i)}>✕</Button>}
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={()=>{ setColors(["#3b82f6","#9333ea"]); setType("linear"); setDirection("to right"); setAngle(90); }}>
            <RotateCcw className="mr-2 h-4 w-4"/>Reset
          </Button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-0 overflow-hidden rounded-md">
              <div className="w-full h-64 md:h-80" style={{background:css()}}/>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>CSS Code</Label>
              <Button size="sm" variant="ghost" onClick={()=>{navigator.clipboard.writeText(fullCss);toast.success("CSS copied");}}>
                <Copy className="mr-2 h-4 w-4"/>Copy
              </Button>
            </div>
            <div className="bg-muted p-4 rounded-md overflow-x-auto">
              <pre className="text-sm font-mono">{fullCss}</pre>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
