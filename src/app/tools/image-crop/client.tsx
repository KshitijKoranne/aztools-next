"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Crop, Download, Upload } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { downloadDataUrl, loadImage } from "../_shared/image-helpers";

export default function Client() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(400);
  const [output, setOutput] = useState("");

  async function pick(nextFile: File | undefined) {
    if (!nextFile) return;
    if (!nextFile.type.startsWith("image/")) return toast.error("Select an image file.");
    const image = await loadImage(nextFile);
    setFile(nextFile);
    setX(0);
    setY(0);
    setWidth(Math.floor(image.width / 2));
    setHeight(Math.floor(image.height / 2));
  }

  async function crop() {
    if (!file || !canvasRef.current) return toast.error("Upload an image first.");
    const image = await loadImage(file);
    const cropWidth = Math.min(width, image.width - x);
    const cropHeight = Math.min(height, image.height - y);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    ctx.drawImage(image, x, y, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    setOutput(canvas.toDataURL("image/png"));
    toast.success("Image cropped.");
  }

  return (
    <ToolLayout toolId="image-crop">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[360px_1fr]">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Crop className="h-5 w-5" />Image Crop Tool</CardTitle></CardHeader><CardContent className="space-y-4">
          <Label className="flex cursor-pointer items-center gap-2 rounded-md border p-3"><Upload className="h-4 w-4" />Upload Image<input type="file" accept="image/*" className="hidden" onChange={(event) => pick(event.target.files?.[0])} /></Label>
          <div className="grid grid-cols-2 gap-3">{[["X", x, setX], ["Y", y, setY], ["Width", width, setWidth], ["Height", height, setHeight]].map(([label, value, setter]) => <div key={String(label)} className="space-y-2"><Label>{String(label)}</Label><Input type="number" value={Number(value)} onChange={(event) => (setter as (n: number) => void)(Number(event.target.value) || 0)} /></div>)}</div>
          <Button className="w-full" onClick={crop}>Crop Image</Button>
          {output && <Button className="w-full" variant="outline" onClick={() => downloadDataUrl(output, "cropped-image.png")}><Download className="mr-2 h-4 w-4" />Download</Button>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Preview</CardTitle></CardHeader><CardContent><canvas ref={canvasRef} className="max-h-[520px] max-w-full rounded-md border" /></CardContent></Card>
      </div>
    </ToolLayout>
  );
}
