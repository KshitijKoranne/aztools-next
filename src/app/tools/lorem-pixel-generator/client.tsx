"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, Image as ImageIcon } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function Client() {
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(630);
  const [color, setColor] = useState("#e5e7eb");
  const [textColor, setTextColor] = useState("#111827");
  const [text, setText] = useState("Lorem Ipsum");
  const [textSize, setTextSize] = useState(48);
  const [imageUrl, setImageUrl] = useState("");

  function generate() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = Math.max(1, Math.min(width, 3840));
    canvas.height = Math.max(1, Math.min(height, 2160));
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = textColor;
    ctx.font = `700 ${textSize}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width - 40);
    setImageUrl(canvas.toDataURL("image/png"));
    toast.success("Image generated.");
  }

  return (
    <ToolLayout toolId="lorem-pixel-generator">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" />Image Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>Width</Label><Input type="number" value={width} onChange={(event) => setWidth(Number(event.target.value) || 1)} /></div><div className="space-y-2"><Label>Height</Label><Input type="number" value={height} onChange={(event) => setHeight(Number(event.target.value) || 1)} /></div></div>
            <div className="space-y-2"><Label>Text</Label><Input value={text} onChange={(event) => setText(event.target.value)} /></div>
            <div className="space-y-2"><Label>Text Size: {textSize}px</Label><Slider value={[textSize]} min={12} max={200} step={2} onValueChange={([next]) => setTextSize(next ?? 48)} /></div>
            <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>Background</Label><Input type="color" value={color} onChange={(event) => setColor(event.target.value)} /></div><div className="space-y-2"><Label>Text Color</Label><Input type="color" value={textColor} onChange={(event) => setTextColor(event.target.value)} /></div></div>
            <Button onClick={generate}>Generate Image</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {imageUrl ? <div className="rounded-md border bg-muted p-3"><div role="img" aria-label="Generated placeholder" className="min-h-[300px] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${imageUrl})` }} /></div> : <div className="flex min-h-[300px] items-center justify-center rounded-md border text-sm text-muted-foreground">Preview appears here.</div>}
            {imageUrl && <Button asChild><a href={imageUrl} download="lorem-pixel.png"><Download className="mr-2 h-4 w-4" />Download Image</a></Button>}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
