"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Archive, Download, Upload } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { downloadDataUrl, extensionForMime, loadImage } from "../_shared/image-helpers";

function dataUrlSize(dataUrl: string) {
  return Math.round((dataUrl.length - dataUrl.indexOf(",") - 1) * 0.75);
}

function formatSize(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
}

export default function Client() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(0.72);
  const [scale, setScale] = useState(0.85);
  const [output, setOutput] = useState("");

  async function compress(nextFile = file) {
    if (!nextFile || !canvasRef.current) return toast.error("Upload an image first.");
    const image = await loadImage(nextFile);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    setOutput(canvas.toDataURL(format, quality));
    toast.success("Image compressed.");
  }

  async function pick(nextFile: File | undefined) {
    if (!nextFile) return;
    if (!nextFile.type.startsWith("image/")) return toast.error("Select an image file.");
    setFile(nextFile);
    await compress(nextFile);
  }

  return (
    <ToolLayout toolId="image-compressor">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[360px_1fr]">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Archive className="h-5 w-5" />Image Compressor</CardTitle></CardHeader><CardContent className="space-y-4">
          <Label className="flex cursor-pointer items-center gap-2 rounded-md border p-3"><Upload className="h-4 w-4" />Upload Image<input type="file" accept="image/*" className="hidden" onChange={(event) => pick(event.target.files?.[0])} /></Label>
          <Select value={format} onValueChange={setFormat}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="image/jpeg">JPEG</SelectItem><SelectItem value="image/webp">WebP</SelectItem><SelectItem value="image/png">PNG</SelectItem></SelectContent></Select>
          <div className="space-y-2"><Label>Quality: {Math.round(quality * 100)}%</Label><Slider value={[quality]} min={0.1} max={1} step={0.05} onValueChange={([next]) => setQuality(next ?? 0.72)} /></div>
          <div className="space-y-2"><Label>Scale: {Math.round(scale * 100)}%</Label><Slider value={[scale]} min={0.1} max={1} step={0.05} onValueChange={([next]) => setScale(next ?? 0.85)} /></div>
          <Button className="w-full" onClick={() => compress()}>Compress</Button>
          {file && output && <p className="text-sm text-muted-foreground">Original: {formatSize(file.size)} · Output: {formatSize(dataUrlSize(output))}</p>}
          {output && <Button className="w-full" variant="outline" onClick={() => downloadDataUrl(output, `compressed-image.${extensionForMime(format)}`)}><Download className="mr-2 h-4 w-4" />Download</Button>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Preview</CardTitle></CardHeader><CardContent><canvas ref={canvasRef} className="max-h-[520px] max-w-full rounded-md border" /></CardContent></Card>
      </div>
    </ToolLayout>
  );
}
