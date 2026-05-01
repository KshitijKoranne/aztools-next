"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Download, Droplets, Upload } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { downloadDataUrl, loadImage } from "../_shared/image-helpers";

export default function Client() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("AZ Tools");
  const [size, setSize] = useState(48);
  const [opacity, setOpacity] = useState(0.55);
  const [output, setOutput] = useState("");

  async function render(nextFile = file) {
    if (!nextFile || !canvasRef.current) return toast.error("Upload an image first.");
    const image = await loadImage(nextFile);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = Math.max(2, size / 14);
    ctx.font = `700 ${size}px Arial`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.strokeText(text, canvas.width - 32, canvas.height - 32);
    ctx.fillText(text, canvas.width - 32, canvas.height - 32);
    ctx.globalAlpha = 1;
    setOutput(canvas.toDataURL("image/png"));
    toast.success("Watermark added.");
  }

  async function pick(nextFile: File | undefined) {
    if (!nextFile) return;
    if (!nextFile.type.startsWith("image/")) return toast.error("Select an image file.");
    setFile(nextFile);
    await render(nextFile);
  }

  return (
    <ToolLayout toolId="watermark-tool">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[360px_1fr]">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Droplets className="h-5 w-5" />Watermark Tool</CardTitle></CardHeader><CardContent className="space-y-4">
          <Label className="flex cursor-pointer items-center gap-2 rounded-md border p-3"><Upload className="h-4 w-4" />Upload Image<input type="file" accept="image/*" className="hidden" onChange={(event) => pick(event.target.files?.[0])} /></Label>
          <div className="space-y-2"><Label>Watermark Text</Label><Input value={text} onChange={(event) => setText(event.target.value)} /></div>
          <div className="space-y-2"><Label>Size: {size}px</Label><Slider value={[size]} min={16} max={160} step={2} onValueChange={([next]) => setSize(next ?? 48)} /></div>
          <div className="space-y-2"><Label>Opacity: {Math.round(opacity * 100)}%</Label><Slider value={[opacity]} min={0.1} max={1} step={0.05} onValueChange={([next]) => setOpacity(next ?? 0.55)} /></div>
          <Button className="w-full" onClick={() => render()}>Apply Watermark</Button>
          {output && <Button className="w-full" variant="outline" onClick={() => downloadDataUrl(output, "watermarked-image.png")}><Download className="mr-2 h-4 w-4" />Download</Button>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Preview</CardTitle></CardHeader><CardContent><canvas ref={canvasRef} className="max-h-[520px] max-w-full rounded-md border" /></CardContent></Card>
      </div>
    </ToolLayout>
  );
}
