"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, Image as ImageIcon, Upload, X } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Favicon = { size: number; name: string; url: string };

const ALL_SIZES = [16, 32, 48, 57, 60, 72, 76, 96, 114, 120, 144, 152, 180, 192, 512];
const PRESETS: Record<string, number[]> = {
  standard: [16, 32, 48, 96, 180],
  web: [16, 32, 48, 96],
  mobile: [57, 60, 72, 76, 114, 120, 144, 152, 180, 192, 512],
  complete: ALL_SIZES,
};

function nameForSize(size: number) {
  if ([57, 60, 72, 76, 114, 120, 144, 152, 180].includes(size)) return `apple-touch-icon-${size}x${size}.png`;
  if ([192, 512].includes(size)) return `android-chrome-${size}x${size}.png`;
  return `favicon-${size}x${size}.png`;
}

export default function Client() {
  const [preview, setPreview] = useState("");
  const [preset, setPreset] = useState("standard");
  const [favicons, setFavicons] = useState<Favicon[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  function loadFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(String(reader.result));
      setFavicons([]);
    };
    reader.readAsDataURL(file);
  }

  async function resize(img: HTMLImageElement, size: number) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    const side = Math.max(img.width, img.height);
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, (side - img.width) / 2, (side - img.height) / 2, img.width, img.height, 0, 0, size, size);
    return canvas.toDataURL("image/png");
  }

  function generate() {
    if (!preview) {
      toast.error("Upload an image first.");
      return;
    }
    setIsGenerating(true);
    const img = new Image();
    img.onload = async () => {
      const next: Favicon[] = [];
      for (const size of PRESETS[preset] ?? PRESETS.standard) {
        next.push({ size, name: nameForSize(size), url: await resize(img, size) });
      }
      setFavicons(next);
      setIsGenerating(false);
      toast.success("Favicons generated.");
    };
    img.onerror = () => {
      setIsGenerating(false);
      toast.error("Image could not be loaded.");
    };
    img.src = preview;
  }

  function download(item: Favicon) {
    const link = document.createElement("a");
    link.href = item.url;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <ToolLayout toolId="favicon-generator">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" />Favicon Generator</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {!preview ? <Label className="flex cursor-pointer flex-col items-center gap-4 rounded-md border-2 border-dashed p-8 text-center"><Upload className="h-12 w-12 text-muted-foreground" /><span>Upload source image</span><input type="file" accept="image/*" className="hidden" onChange={(event) => loadFile(event.target.files?.[0])} /></Label> : <div className="flex items-center justify-between rounded-md border p-3"><div className="flex items-center gap-3"><div role="img" aria-label="Source preview" className="h-16 w-16 rounded bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${preview})` }} /><span className="text-sm">Source image loaded</span></div><Button size="icon" variant="ghost" onClick={() => { setPreview(""); setFavicons([]); }}><X className="h-4 w-4" /></Button></div>}
            <div className="grid gap-3 md:grid-cols-[1fr_auto]"><Select value={preset} onValueChange={setPreset}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="standard">Standard</SelectItem><SelectItem value="web">Web</SelectItem><SelectItem value="mobile">Mobile</SelectItem><SelectItem value="complete">Complete</SelectItem></SelectContent></Select><Button onClick={generate} disabled={isGenerating}>{isGenerating ? "Generating..." : "Generate Favicons"}</Button></div>
          </CardContent>
        </Card>
        {favicons.length > 0 && <Card><CardHeader><CardTitle>Generated Favicons</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">{favicons.map((item) => <div key={item.name} className="flex items-center justify-between rounded-md border p-3"><div className="flex items-center gap-3"><div className="h-8 w-8 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${item.url})` }} /><div><div className="text-sm font-medium">{item.name}</div><div className="text-xs text-muted-foreground">{item.size}x{item.size}</div></div></div><Button size="icon" variant="outline" onClick={() => download(item)}><Download className="h-4 w-4" /></Button></div>)}</CardContent></Card>}
      </div>
    </ToolLayout>
  );
}
