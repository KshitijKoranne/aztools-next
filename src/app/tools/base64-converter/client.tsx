"use client";

import { useRef, useState } from "react";
import { Copy, Download, RefreshCw, Trash, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

function toBase64(text: string) {
  return btoa(unescape(encodeURIComponent(text)));
}

function fromBase64(text: string) {
  return decodeURIComponent(escape(atob(text)));
}

function formatSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export default function Client() {
  const [text, setText] = useState("");
  const [encoded, setEncoded] = useState("");
  const [urlSafe, setUrlSafe] = useState(true);
  const [lineBreaks, setLineBreaks] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("application/octet-stream");
  const [fileSize, setFileSize] = useState(0);
  const [fileBase64, setFileBase64] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const encode = () => {
    let output = toBase64(text);
    if (urlSafe) output = output.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    if (lineBreaks) output = output.match(/.{1,76}/g)?.join("\n") ?? output;
    setEncoded(output);
  };

  const decode = () => {
    try {
      let normalized = encoded.replace(/\s/g, "").replace(/-/g, "+").replace(/_/g, "/");
      while (normalized.length % 4) normalized += "=";
      setText(fromBase64(normalized));
    } catch {
      toast.error("Invalid Base64 input");
    }
  };

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    toast.success("Copied");
  };

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileType(file.type || "application/octet-stream");
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = () => setFileBase64(String(reader.result).split(",")[1] ?? "");
    reader.readAsDataURL(file);
  };

  const downloadFile = () => {
    const bytes = Uint8Array.from(atob(fileBase64), (char) => char.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: fileType }));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "decoded-file";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout toolId="base64-converter">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader><CardTitle>Base64 Converter</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue="text">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="file">File</TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="plain">Plain Text</Label>
                    <Textarea id="plain" className="min-h-48 font-mono" value={text} onChange={(event) => setText(event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="base64">Base64</Label>
                    <Textarea id="base64" className="min-h-48 font-mono" value={encoded} onChange={(event) => setEncoded(event.target.value)} />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-sm"><Checkbox checked={urlSafe} onCheckedChange={(v) => setUrlSafe(Boolean(v))} />URL-safe</label>
                  <label className="flex items-center gap-2 text-sm"><Checkbox checked={lineBreaks} onCheckedChange={(v) => setLineBreaks(Boolean(v))} />Line breaks</label>
                </div>
                <div className="grid gap-2 sm:grid-cols-4">
                  <Button onClick={encode}><RefreshCw className="h-4 w-4" />Encode</Button>
                  <Button variant="outline" onClick={decode}>Decode</Button>
                  <Button variant="outline" onClick={() => copy(encoded)} disabled={!encoded}><Copy className="h-4 w-4" />Copy Base64</Button>
                  <Button variant="outline" onClick={() => { setText(""); setEncoded(""); }}><Trash className="h-4 w-4" />Clear</Button>
                </div>
              </TabsContent>
              <TabsContent value="file" className="mt-6 space-y-4">
                <input ref={fileRef} type="file" className="hidden" onChange={selectFile} />
                <Button variant="outline" onClick={() => fileRef.current?.click()}><UploadCloud className="h-4 w-4" />Choose File</Button>
                {fileBase64 && (
                  <>
                    <div className="rounded-lg bg-muted p-4 text-sm">{fileName} · {formatSize(fileSize)}</div>
                    <Textarea className="min-h-56 font-mono" value={fileBase64} onChange={(event) => setFileBase64(event.target.value)} />
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={() => copy(fileBase64)}><Copy className="h-4 w-4" />Copy</Button>
                      <Button variant="outline" onClick={downloadFile}><Download className="h-4 w-4" />Download</Button>
                      <Button variant="outline" onClick={() => setFileBase64("")}><Trash className="h-4 w-4" />Clear</Button>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
