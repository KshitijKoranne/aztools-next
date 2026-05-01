"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { FlipHorizontal, FlipVertical, Upload, Download } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { downloadDataUrl, loadImage } from "../_shared/image-helpers";

export default function Client() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState("");

  async function draw(nextFile: File, horizontal = false, vertical = false) {
    if (!canvasRef.current) return;
    const image = await loadImage(nextFile);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.save();
    ctx.translate(horizontal ? image.width : 0, vertical ? image.height : 0);
    ctx.scale(horizontal ? -1 : 1, vertical ? -1 : 1);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
    setOutput(canvas.toDataURL("image/png"));
  }

  async function pick(nextFile: File | undefined) {
    if (!nextFile) return;
    if (!nextFile.type.startsWith("image/")) return toast.error("Select an image file.");
    setFile(nextFile);
    await draw(nextFile);
  }

  return (
    <ToolLayout toolId="image-flipper">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[360px_1fr]">
        <Card><CardHeader><CardTitle>Image Flipper</CardTitle></CardHeader><CardContent className="space-y-3">
          <Label className="flex cursor-pointer items-center gap-2 rounded-md border p-3"><Upload className="h-4 w-4" />Upload Image<input type="file" accept="image/*" className="hidden" onChange={(event) => pick(event.target.files?.[0])} /></Label>
          <Button className="w-full" onClick={() => file && draw(file, true, false)}><FlipHorizontal className="mr-2 h-4 w-4" />Flip Horizontal</Button>
          <Button className="w-full" variant="outline" onClick={() => file && draw(file, false, true)}><FlipVertical className="mr-2 h-4 w-4" />Flip Vertical</Button>
          {output && <Button className="w-full" variant="outline" onClick={() => downloadDataUrl(output, "flipped-image.png")}><Download className="mr-2 h-4 w-4" />Download</Button>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Preview</CardTitle></CardHeader><CardContent><canvas ref={canvasRef} className="max-h-[520px] max-w-full rounded-md border" /></CardContent></Card>
      </div>
    </ToolLayout>
  );
}
