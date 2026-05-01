"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Download, Repeat, Upload } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { downloadDataUrl, extensionForMime, loadImage } from "../_shared/image-helpers";

export default function Client() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("image/png");
  const [quality, setQuality] = useState(0.9);
  const [output, setOutput] = useState("");

  async function convert(nextFile = file) {
    if (!nextFile || !canvasRef.current) return toast.error("Upload an image first.");
    const image = await loadImage(nextFile);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    setOutput(canvas.toDataURL(format, quality));
    toast.success("Image converted.");
  }

  async function pick(nextFile: File | undefined) {
    if (!nextFile) return;
    if (!nextFile.type.startsWith("image/")) return toast.error("Select an image file.");
    setFile(nextFile);
    await convert(nextFile);
  }

  return (
    <ToolLayout toolId="image-converter">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[360px_1fr]">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Repeat className="h-5 w-5" />Image Converter</CardTitle></CardHeader><CardContent className="space-y-4">
          <Label className="flex cursor-pointer items-center gap-2 rounded-md border p-3"><Upload className="h-4 w-4" />Upload Image<input type="file" accept="image/*" className="hidden" onChange={(event) => pick(event.target.files?.[0])} /></Label>
          <Select value={format} onValueChange={setFormat}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="image/png">PNG</SelectItem><SelectItem value="image/jpeg">JPEG</SelectItem><SelectItem value="image/webp">WebP</SelectItem></SelectContent></Select>
          <div className="space-y-2"><Label>Quality: {Math.round(quality * 100)}%</Label><Slider value={[quality]} min={0.1} max={1} step={0.05} onValueChange={([next]) => setQuality(next ?? 0.9)} /></div>
          <Button className="w-full" onClick={() => convert()}>Convert</Button>
          {output && <Button className="w-full" variant="outline" onClick={() => downloadDataUrl(output, `converted-image.${extensionForMime(format)}`)}><Download className="mr-2 h-4 w-4" />Download</Button>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Preview</CardTitle></CardHeader><CardContent><canvas ref={canvasRef} className="max-h-[520px] max-w-full rounded-md border" /></CardContent></Card>
      </div>
    </ToolLayout>
  );
}
