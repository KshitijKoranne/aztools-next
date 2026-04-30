"use client";

import { useRef, useState } from "react";
import { Copy, Scan, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type BarcodeDetectorCtor = new (options: { formats: string[] }) => {
  detect(image: ImageBitmapSource): Promise<Array<{ rawValue: string }>>;
};

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorCtor;
  }
}

export default function Client() {
  const [result, setResult] = useState("");
  const [preview, setPreview] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const decode = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    if (!window.BarcodeDetector) {
      toast.error("QR decoding is not supported in this browser");
      return;
    }
    const bitmap = await createImageBitmap(file);
    const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
    const codes = await detector.detect(bitmap);
    setResult(codes[0]?.rawValue ?? "");
    if (!codes.length) toast.error("No QR code found");
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    toast.success("Decoded text copied");
  };

  return (
    <ToolLayout toolId="qr-code-decoder">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Scan className="h-5 w-5" />QR Code Decoder</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={decode} />
            <Button variant="outline" onClick={() => inputRef.current?.click()}><UploadCloud className="h-4 w-4" />Upload Image</Button>
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="QR preview" className="max-h-72 rounded-lg border object-contain" />
            )}
            <Textarea readOnly value={result} placeholder="Decoded content will appear here" className="min-h-36 font-mono" />
            <Button variant="outline" onClick={copy} disabled={!result}><Copy className="h-4 w-4" />Copy Result</Button>
            <p className="text-xs text-muted-foreground">QR decoding uses the browser BarcodeDetector API. Chrome and Edge support it; Safari and Firefox support may vary.</p>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
