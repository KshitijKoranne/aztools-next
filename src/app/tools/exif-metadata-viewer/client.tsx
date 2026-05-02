"use client";

import { useMemo, useState } from "react";
import * as exifr from "exifr";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Copy, Image as ImageIcon, MapPin, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

type MetadataRecord = Record<string, unknown>;

type ImageSummary = {
  name: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  previewUrl?: string;
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

function serialiseValue(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(serialiseValue).join(", ");
  if (value && typeof value === "object") return JSON.stringify(value);
  return String(value ?? "");
}

function safeMetadata(metadata: MetadataRecord): MetadataRecord {
  const skipped = new Set(["MakerNote", "UserComment", "thumbnail", "Thumbnail", "image", "base64"]);
  return Object.fromEntries(Object.entries(metadata).filter(([key]) => !skipped.has(key)));
}

function toJson(value: unknown): string {
  return JSON.stringify(value, (_key, innerValue) => {
    if (innerValue instanceof Date) return innerValue.toISOString();
    if (innerValue instanceof Uint8Array) return `[${innerValue.byteLength} bytes]`;
    return innerValue;
  }, 2);
}

async function readImageDimensions(file: File): Promise<{ width?: number; height?: number; previewUrl?: string }> {
  if (!file.type.startsWith("image/")) return {};
  const previewUrl = URL.createObjectURL(file);
  const img = new Image();
  const dimensions = await new Promise<{ width?: number; height?: number }>((resolve) => {
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({});
    img.src = previewUrl;
  });
  return { ...dimensions, previewUrl };
}

export default function ExifMetadataViewerClient() {
  const [summary, setSummary] = useState<ImageSummary | null>(null);
  const [metadata, setMetadata] = useState<MetadataRecord>({});
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState("");

  const rows = useMemo(() => Object.entries(metadata).sort(([a], [b]) => a.localeCompare(b)), [metadata]);
  const latitude = typeof metadata.latitude === "number" ? metadata.latitude : undefined;
  const longitude = typeof metadata.longitude === "number" ? metadata.longitude : undefined;
  const hasGps = latitude !== undefined && longitude !== undefined;

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (summary?.previewUrl) URL.revokeObjectURL(summary.previewUrl);
    setIsReading(true);
    setError("");
    setMetadata({});

    try {
      const dimensions = await readImageDimensions(file);
      const parsed = await exifr.parse(file, {
        tiff: true,
        ifd0: {},
        ifd1: false,
        exif: true,
        gps: true,
        interop: true,
        xmp: true,
        iptc: true,
        icc: true,
        jfif: true,
        ihdr: true,
      } as Parameters<typeof exifr.parse>[1]);

      setSummary({ name: file.name, type: file.type || "Unknown", size: file.size, ...dimensions });
      setMetadata(safeMetadata(parsed || {}));
      toast.success(parsed ? "Metadata loaded" : "Image loaded — no embedded EXIF found");
    } catch (readError) {
      setError(readError instanceof Error ? readError.message : "Could not read metadata");
      setSummary({ name: file.name, type: file.type || "Unknown", size: file.size });
    } finally {
      setIsReading(false);
    }
  };

  const clear = () => {
    if (summary?.previewUrl) URL.revokeObjectURL(summary.previewUrl);
    setSummary(null);
    setMetadata({});
    setError("");
  };

  const copyJson = async () => {
    await navigator.clipboard.writeText(toJson({ file: summary, metadata }));
    toast.success("Metadata copied");
  };

  return (
    <ToolLayout toolId="exif-metadata-viewer">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5" /> EXIF Metadata Viewer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-file">Choose a photo</Label>
                  <Input id="image-file" type="file" accept="image/*,.heic,.heif,.tif,.tiff" onChange={handleFile} />
                  <p className="text-xs text-muted-foreground">Reads EXIF/GPS/camera metadata locally in your browser. Photos are not uploaded.</p>
                </div>

                {summary?.previewUrl && (
                  <div className="overflow-hidden rounded-xl border bg-muted/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={summary.previewUrl} alt="Selected preview" className="max-h-[360px] w-full object-contain" />
                  </div>
                )}

                {summary && (
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6 space-y-3 text-sm">
                      <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">File</span><span className="font-medium text-right break-all">{summary.name}</span></div>
                      <div className="flex items-center justify-between"><span className="text-muted-foreground">Type</span><span>{summary.type}</span></div>
                      <div className="flex items-center justify-between"><span className="text-muted-foreground">Size</span><span>{formatBytes(summary.size)}</span></div>
                      {summary.width && summary.height && <div className="flex items-center justify-between"><span className="text-muted-foreground">Dimensions</span><span>{summary.width} × {summary.height}</span></div>}
                      {hasGps && (
                        <a className="inline-flex items-center gap-2 text-primary hover:underline" href={`https://maps.google.com/?q=${latitude},${longitude}`} target="_blank" rel="noreferrer">
                          <MapPin className="h-4 w-4" /> Open GPS location
                        </a>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label>Metadata</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={!summary} onClick={copyJson}><Copy className="h-4 w-4 mr-2" /> Copy JSON</Button>
                    <Button variant="outline" size="sm" disabled={!summary} onClick={clear}><Trash2 className="h-4 w-4 mr-2" /> Clear</Button>
                  </div>
                </div>

                <div className="rounded-xl border overflow-hidden">
                  <div className="max-h-[560px] overflow-auto">
                    {isReading ? (
                      <div className="p-6 text-sm text-muted-foreground">Reading metadata…</div>
                    ) : error ? (
                      <div className="p-6 text-sm text-destructive">{error}</div>
                    ) : rows.length ? (
                      <table className="w-full text-sm">
                        <tbody>
                          {rows.map(([key, value]) => (
                            <tr key={key} className="border-b last:border-0 align-top">
                              <td className="w-48 bg-muted/40 p-3 font-medium">{key}</td>
                              <td className="p-3 break-words font-mono text-xs">{serialiseValue(value)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-6 text-sm text-muted-foreground">Upload an image to inspect its embedded metadata.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Textarea readOnly value={rows.length ? toJson(metadata) : ""} placeholder="Raw metadata JSON will appear here..." className="min-h-[180px] font-mono text-xs bg-muted/40" />

            <div className="grid gap-4 md:grid-cols-3 text-sm text-muted-foreground">
              <div className="rounded-lg border p-4"><ShieldCheck className="h-5 w-5 mb-2 text-foreground" /> Private by design: everything runs locally in your browser.</div>
              <div className="rounded-lg border p-4"><Camera className="h-5 w-5 mb-2 text-foreground" /> Shows camera, lens, exposure, date, GPS, ICC/XMP/IPTC, and image details when available.</div>
              <div className="rounded-lg border p-4"><ImageIcon className="h-5 w-5 mb-2 text-foreground" /> Works best with JPEG/TIFF/HEIC photos that include embedded metadata.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
