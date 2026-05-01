"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FilePenLine, Upload } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { baseName, downloadBlob, pdfBytesBlob } from "../_shared/pdf-helpers";

type Metadata = {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
};

const emptyMetadata: Metadata = { title: "", author: "", subject: "", keywords: "", creator: "", producer: "" };

export default function Client() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<Metadata>(emptyMetadata);
  const [dates, setDates] = useState({ creation: "", modification: "" });
  const [busy, setBusy] = useState(false);

  async function selectFile(nextFile: File | null) {
    setFile(nextFile);
    setMetadata(emptyMetadata);
    setDates({ creation: "", modification: "" });
    if (!nextFile) return;
    try {
      const pdf = await PDFDocument.load(await nextFile.arrayBuffer(), { ignoreEncryption: true });
      setMetadata({
        title: pdf.getTitle() ?? "",
        author: pdf.getAuthor() ?? "",
        subject: pdf.getSubject() ?? "",
        keywords: pdf.getKeywords() ?? "",
        creator: pdf.getCreator() ?? "",
        producer: pdf.getProducer() ?? "",
      });
      setDates({
        creation: pdf.getCreationDate()?.toLocaleString() ?? "",
        modification: pdf.getModificationDate()?.toLocaleString() ?? "",
      });
    } catch {
      toast.error("Could not read PDF metadata.");
    }
  }

  function updateField(key: keyof Metadata, value: string) {
    setMetadata((current) => ({ ...current, [key]: value }));
  }

  function clearMetadata() {
    setMetadata(emptyMetadata);
  }

  async function saveMetadata() {
    if (!file) return toast.error("Select a PDF.");
    setBusy(true);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      pdf.setTitle(metadata.title);
      pdf.setAuthor(metadata.author);
      pdf.setSubject(metadata.subject);
      pdf.setKeywords(metadata.keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean));
      pdf.setCreator(metadata.creator);
      pdf.setProducer(metadata.producer);
      pdf.setModificationDate(new Date());
      downloadBlob(pdfBytesBlob(await pdf.save({ useObjectStreams: true })), `${baseName(file.name)}_metadata.pdf`);
      toast.success("Metadata saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save metadata.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout toolId="pdf-metadata">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FilePenLine className="h-5 w-5" />PDF Metadata Editor</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Label className="flex cursor-pointer items-center gap-2 rounded-md border p-3">
              <Upload className="h-4 w-4" />
              {file ? file.name : "Select PDF"}
              <input type="file" accept="application/pdf" className="hidden" onChange={(event) => selectFile(event.target.files?.[0] ?? null)} />
            </Label>
            <div className="grid gap-4 md:grid-cols-2">
              {(Object.keys(metadata) as Array<keyof Metadata>).map((key) => (
                <div key={key} className="space-y-2">
                  <Label className="capitalize">{key}</Label>
                  <Input value={metadata[key]} onChange={(event) => updateField(key, event.target.value)} />
                </div>
              ))}
            </div>
            {(dates.creation || dates.modification) && (
              <div className="grid gap-3 rounded-md border p-3 text-sm text-muted-foreground md:grid-cols-2">
                <div>Created: {dates.creation || "Unknown"}</div>
                <div>Modified: {dates.modification || "Unknown"}</div>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Button onClick={saveMetadata} disabled={!file || busy}>{busy ? "Saving..." : "Download Updated PDF"}</Button>
              <Button variant="outline" onClick={clearMetadata} disabled={!file}>Clear Fields</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
