"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Hash, Upload } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { baseName, downloadBlob, pdfBytesBlob } from "../_shared/pdf-helpers";

type Position = "bottom-center" | "bottom-left" | "bottom-right" | "top-center" | "top-left" | "top-right";

function hexToRgb(hex: string) {
  const normalized = /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#000000";
  return rgb(parseInt(normalized.slice(1, 3), 16) / 255, parseInt(normalized.slice(3, 5), 16) / 255, parseInt(normalized.slice(5, 7), 16) / 255);
}

function pageText(format: string, page: number, total: number) {
  if (format === "page-total") return `Page ${page} of ${total}`;
  if (format === "slash") return `${page} / ${total}`;
  return String(page);
}

export default function Client() {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [format, setFormat] = useState("page-total");
  const [fontSize, setFontSize] = useState("12");
  const [margin, setMargin] = useState("32");
  const [color, setColor] = useState("#000000");
  const [skipFirst, setSkipFirst] = useState(false);
  const [busy, setBusy] = useState(false);

  async function addNumbers() {
    if (!file) return toast.error("Select a PDF.");
    const size = Math.min(72, Math.max(6, Number(fontSize) || 12));
    const edge = Math.min(144, Math.max(8, Number(margin) || 32));
    setBusy(true);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const visibleTotal = pages.length - (skipFirst ? 1 : 0);
      pages.forEach((page, index) => {
        if (skipFirst && index === 0) return;
        const displayPage = index + 1 - (skipFirst ? 1 : 0);
        const text = pageText(format, displayPage, visibleTotal);
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, size);
        const x = position.endsWith("left") ? edge : position.endsWith("right") ? width - textWidth - edge : (width - textWidth) / 2;
        const y = position.startsWith("top") ? height - edge : edge;
        page.drawText(text, { x, y, size, font, color: hexToRgb(color) });
      });
      downloadBlob(pdfBytesBlob(await pdf.save({ useObjectStreams: true })), `${baseName(file.name)}_numbered.pdf`);
      toast.success("Page numbers added.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add page numbers.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout toolId="pdf-page-numbers">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Hash className="h-5 w-5" />Add Page Numbers to PDF</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Label className="flex cursor-pointer items-center gap-2 rounded-md border p-3">
              <Upload className="h-4 w-4" />
              {file ? file.name : "Select PDF"}
              <input type="file" accept="application/pdf" className="hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            </Label>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={position} onValueChange={(value) => setPosition(value as Position)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["bottom-center", "bottom-left", "bottom-right", "top-center", "top-left", "top-right"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="page-total">Page 1 of 10</SelectItem><SelectItem value="slash">1 / 10</SelectItem><SelectItem value="number">1</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Font size</Label><Input type="number" min="6" max="72" value={fontSize} onChange={(event) => setFontSize(event.target.value)} /></div>
              <div className="space-y-2"><Label>Margin</Label><Input type="number" min="8" max="144" value={margin} onChange={(event) => setMargin(event.target.value)} /></div>
              <div className="space-y-2"><Label>Color</Label><Input type="color" value={color} onChange={(event) => setColor(event.target.value)} /></div>
              <label className="flex items-center gap-2 self-end text-sm"><Checkbox checked={skipFirst} onCheckedChange={(value) => setSkipFirst(Boolean(value))} />Skip first page</label>
            </div>
            <Button onClick={addNumbers} disabled={!file || busy}>{busy ? "Processing..." : "Add Page Numbers"}</Button>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
