"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Archive, Download, Trash2, Upload } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const BLOCK_SIZE = 512;

type FileItem = {
  id: string;
  file: File;
};

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** index).toFixed(2)} ${units[index]}`;
}

function writeString(target: Uint8Array, offset: number, length: number, value: string) {
  const encoded = new TextEncoder().encode(value.slice(0, length));
  target.set(encoded, offset);
}

function writeOctal(target: Uint8Array, offset: number, length: number, value: number) {
  writeString(target, offset, length, value.toString(8).padStart(length - 1, "0"));
}

function createTarHeader(file: File) {
  const header = new Uint8Array(BLOCK_SIZE);
  writeString(header, 0, 100, file.name.replace(/^\/+/, ""));
  writeOctal(header, 100, 8, 0o644);
  writeOctal(header, 108, 8, 0);
  writeOctal(header, 116, 8, 0);
  writeOctal(header, 124, 12, file.size);
  writeOctal(header, 136, 12, Math.floor(file.lastModified / 1000));
  header.fill(32, 148, 156);
  header[156] = "0".charCodeAt(0);
  writeString(header, 257, 6, "ustar");
  writeString(header, 263, 2, "00");

  const checksum = header.reduce((sum, byte) => sum + byte, 0);
  writeOctal(header, 148, 8, checksum);
  header[155] = 32;

  return header;
}

async function createTar(files: File[]) {
  const chunks: Uint8Array[] = [];

  for (const file of files) {
    chunks.push(createTarHeader(file));
    const content = new Uint8Array(await file.arrayBuffer());
    chunks.push(content);
    const padding = (BLOCK_SIZE - (content.length % BLOCK_SIZE)) % BLOCK_SIZE;
    if (padding) chunks.push(new Uint8Array(padding));
  }

  chunks.push(new Uint8Array(BLOCK_SIZE * 2));
  const parts = chunks.map((chunk) => chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength) as ArrayBuffer);
  return new Blob(parts, { type: "application/x-tar" });
}

async function gzipBlob(blob: Blob) {
  if (!("CompressionStream" in window)) {
    throw new Error("This browser does not support gzip compression.");
  }

  const stream = blob.stream().pipeThrough(new CompressionStream("gzip"));
  return new Response(stream).blob();
}

export default function Client() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<{ original: number; compressed: number } | null>(null);

  function addFiles(fileList: FileList | null) {
    const nextFiles = Array.from(fileList ?? []).map((file) => ({ id: crypto.randomUUID(), file }));
    setFiles((current) => [...current, ...nextFiles]);
    setStats(null);
    if (nextFiles.length > 0) toast.success(`${nextFiles.length} file(s) added.`);
  }

  async function compressFiles() {
    if (files.length === 0) {
      toast.error("Add files to compress.");
      return;
    }

    setIsProcessing(true);
    setProgress(15);
    try {
      const original = files.reduce((sum, item) => sum + item.file.size, 0);
      const tar = await createTar(files.map((item) => item.file));
      setProgress(65);
      const compressed = await gzipBlob(tar);
      setProgress(100);
      setStats({ original, compressed: compressed.size });

      const url = URL.createObjectURL(compressed);
      const link = document.createElement("a");
      link.href = url;
      link.download = `compressed-files-${new Date().toISOString().slice(0, 10)}.tar.gz`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Archive downloaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Compression failed.");
    } finally {
      setIsProcessing(false);
      window.setTimeout(() => setProgress(0), 600);
    }
  }

  return (
    <ToolLayout toolId="file-compressor">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Archive className="h-5 w-5" />File Compressor</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="compress-files" className="flex cursor-pointer flex-col items-center gap-4 rounded-md border-2 border-dashed p-8 text-center">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <span className="text-lg font-medium">{files.length > 0 ? `${files.length} files selected` : "Click to upload files"}</span>
              <span className="text-sm text-muted-foreground">Creates a browser-side .tar.gz archive.</span>
              <Input id="compress-files" type="file" multiple className="hidden" onChange={(event) => addFiles(event.target.files)} />
            </Label>
            {files.length > 0 && <div className="flex justify-between"><Badge variant="secondary">{files.length} files · {formatFileSize(files.reduce((sum, item) => sum + item.file.size, 0))}</Badge><Button size="sm" variant="outline" onClick={() => { setFiles([]); setStats(null); }}><Trash2 className="mr-2 h-4 w-4" />Clear</Button></div>}
          </CardContent>
        </Card>

        {files.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <Card>
              <CardHeader><CardTitle>Files</CardTitle></CardHeader>
              <CardContent className="max-h-[520px] space-y-2 overflow-auto">
                {files.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm"><span className="truncate">{item.file.name}</span><span className="text-muted-foreground">{formatFileSize(item.file.size)}</span></div>)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Compression</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {isProcessing && <Progress value={progress} />}
                {stats && <div className="space-y-2 rounded-md border p-3 text-sm"><div className="flex justify-between"><span>Original</span><span>{formatFileSize(stats.original)}</span></div><div className="flex justify-between"><span>Compressed</span><span>{formatFileSize(stats.compressed)}</span></div></div>}
                <Button className="w-full" onClick={compressFiles} disabled={isProcessing}><Download className="mr-2 h-4 w-4" />Compress & Download</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
