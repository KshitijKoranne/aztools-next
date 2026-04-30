"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, FolderEdit, RefreshCw, Trash2, Upload } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type RenamePattern = "sequential" | "prefix" | "suffix" | "replace";

type FileItem = {
  file: File;
  originalName: string;
  baseName: string;
  extension: string;
};

function splitName(name: string) {
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return { baseName: name, extension: "" };
  return { baseName: name.slice(0, dot), extension: name.slice(dot) };
}

function sanitizeName(name: string) {
  return name.replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-").trim() || "file";
}

export default function Client() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [pattern, setPattern] = useState<RenamePattern>("sequential");
  const [patternValue, setPatternValue] = useState("file");
  const [replaceFrom, setReplaceFrom] = useState("");
  const [replaceTo, setReplaceTo] = useState("");
  const [startNumber, setStartNumber] = useState(1);
  const [padding, setPadding] = useState(3);
  const [preserveExtension, setPreserveExtension] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const renamedFiles = useMemo(() => files.map((item, index) => {
    let nextBase = item.baseName;

    if (pattern === "sequential") nextBase = `${patternValue || "file"}_${String(startNumber + index).padStart(padding, "0")}`;
    if (pattern === "prefix") nextBase = `${patternValue}${item.baseName}`;
    if (pattern === "suffix") nextBase = `${item.baseName}${patternValue}`;
    if (pattern === "replace" && replaceFrom) nextBase = item.baseName.replaceAll(replaceFrom, replaceTo);

    const newName = `${sanitizeName(nextBase)}${preserveExtension ? item.extension : ""}`;
    return { ...item, newName };
  }), [files, padding, pattern, patternValue, preserveExtension, replaceFrom, replaceTo, startNumber]);

  const hasConflict = useMemo(() => {
    const names = renamedFiles.map((item) => item.newName.toLowerCase());
    return names.length !== new Set(names).size;
  }, [renamedFiles]);

  function addFiles(fileList: FileList | null) {
    const nextFiles = Array.from(fileList ?? []).map((file) => ({ file, originalName: file.name, ...splitName(file.name) }));
    setFiles((current) => [...current, ...nextFiles]);
    if (nextFiles.length > 0) toast.success(`${nextFiles.length} file(s) added.`);
  }

  async function downloadRenamedFiles() {
    if (hasConflict) {
      toast.error("Resolve duplicate output names first.");
      return;
    }

    setIsDownloading(true);
    try {
      for (const item of renamedFiles) {
        const url = URL.createObjectURL(item.file);
        const link = document.createElement("a");
        link.href = url;
        link.download = item.newName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        await new Promise((resolve) => window.setTimeout(resolve, 150));
      }
      toast.success("Renamed files downloaded.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <ToolLayout toolId="bulk-file-renamer">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FolderEdit className="h-5 w-5" />Bulk File Renamer</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="bulk-files" className="flex cursor-pointer flex-col items-center gap-4 rounded-md border-2 border-dashed p-8 text-center">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <span className="text-lg font-medium">{files.length > 0 ? `${files.length} files selected` : "Click to upload files"}</span>
              <Input id="bulk-files" type="file" multiple className="hidden" onChange={(event) => addFiles(event.target.files)} />
            </Label>
            {files.length > 0 && <div className="flex justify-between"><Badge variant="secondary">{files.length} files</Badge><Button size="sm" variant="outline" onClick={() => setFiles([])}><Trash2 className="mr-2 h-4 w-4" />Clear</Button></div>}
          </CardContent>
        </Card>

        {files.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
            <Card>
              <CardHeader><CardTitle>Rename Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Rename Method</Label><Select value={pattern} onValueChange={(value) => setPattern(value as RenamePattern)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="sequential">Sequential Numbering</SelectItem><SelectItem value="prefix">Add Prefix</SelectItem><SelectItem value="suffix">Add Suffix</SelectItem><SelectItem value="replace">Find and Replace</SelectItem></SelectContent></Select></div>
                {pattern !== "replace" && <div className="space-y-2"><Label>{pattern === "sequential" ? "Base Name" : "Text"}</Label><Input value={patternValue} onChange={(event) => setPatternValue(event.target.value)} /></div>}
                {pattern === "sequential" && <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>Start</Label><Input type="number" value={startNumber} onChange={(event) => setStartNumber(Number(event.target.value) || 1)} /></div><div className="space-y-2"><Label>Padding</Label><Input type="number" min="1" max="10" value={padding} onChange={(event) => setPadding(Number(event.target.value) || 1)} /></div></div>}
                {pattern === "replace" && <div className="grid gap-3"><div className="space-y-2"><Label>Find</Label><Input value={replaceFrom} onChange={(event) => setReplaceFrom(event.target.value)} /></div><div className="space-y-2"><Label>Replace With</Label><Input value={replaceTo} onChange={(event) => setReplaceTo(event.target.value)} /></div></div>}
                <div className="flex items-center gap-2"><Switch id="ext" checked={preserveExtension} onCheckedChange={setPreserveExtension} /><Label htmlFor="ext">Preserve file extensions</Label></div>
                <Button className="w-full" onClick={downloadRenamedFiles} disabled={isDownloading || hasConflict}>{isDownloading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}Download Renamed Files</Button>
                {hasConflict && <p className="text-sm text-destructive">Duplicate output names detected.</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
              <CardContent className="max-h-[560px] space-y-2 overflow-auto">
                {renamedFiles.map((item, index) => <div key={`${item.originalName}-${index}`} className="grid gap-2 rounded-md border p-3 text-sm md:grid-cols-2"><span className="truncate text-muted-foreground">{item.originalName}</span><span className="truncate font-medium">{item.newName}</span></div>)}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
