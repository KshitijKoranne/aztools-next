"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Download, Image as ImageIcon, Upload } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { downloadDataUrl, loadImage } from "../_shared/image-helpers";

export default function Client() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [output, setOutput] = useState("");

  async function pick(nextFile: File | undefined) {
    if (!nextFile) return;
    if (!nextFile.type.startsWith("image/")) return toast.error("Select an image file.");
    const image = await loadImage(nextFile);
    setFile(nextFile);
    setWidth(image.width);
    setHeight(image.height);
    setOutput("");
  }

  async function resize() {
    if (!file || !canvasRef.current) return toast.error("Upload an image first.");
    const image = await loadImage(file);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = width;
    canvas.height = height;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, width, height);
    setOutput(canvas.toDataURL("image/png"));
    toast.success("Image resized.");
  }

  return (
    <ToolLayout toolId="image-resizer">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[360px_1fr]">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" />Image Resizer</CardTitle></CardHeader><CardContent className="space-y-4">
          <Label className="flex cursor-pointer items-center gap-2 rounded-md border p-3"><Upload className="h-4 w-4" />Upload Image<Input type="file" accept="image/*" className="hidden" onChange={(event) => pick(event.target.files?.[0])} /></Label>
          <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>Width</Label><Input type="number" value={width} onChange={(event) => setWidth(Number(event.target.value) || 1)} /></div><div className="space-y-2"><Label>Height</Label><Input type="number" value={height} onChange={(event) => setHeight(Number(event.target.value) || 1)} /></div></div>
          <Button className="w-full" onClick={resize}>Resize Image</Button>
          {output && <Button className="w-full" variant="outline" onClick={() => downloadDataUrl(output, "resized-image.png")}><Download className="mr-2 h-4 w-4" />Download</Button>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Preview</CardTitle></CardHeader><CardContent><canvas ref={canvasRef} className="max-h-[520px] max-w-full rounded-md border" /></CardContent></Card>
      </div>
    </ToolLayout>
  );
}
