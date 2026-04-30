"use client";

import { useMemo, useState } from "react";
import { Copy, Download, QrCode } from "lucide-react";
import { toast } from "sonner";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Mode = "text" | "url" | "email" | "phone" | "sms" | "wifi";

export default function Client() {
  const [mode, setMode] = useState<Mode>("url");
  const [value, setValue] = useState("https://aztools.in");
  const [secondary, setSecondary] = useState("");
  const [size, setSize] = useState("240");

  const qrValue = useMemo(() => {
    if (mode === "email") return `mailto:${value}`;
    if (mode === "phone") return `tel:${value}`;
    if (mode === "sms") return `SMSTO:${value}:${secondary}`;
    if (mode === "wifi") return `WIFI:T:WPA;S:${value};P:${secondary};;`;
    return value;
  }, [mode, secondary, value]);

  const imageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrValue)}`;

  const copy = async () => {
    await navigator.clipboard.writeText(qrValue);
    toast.success("QR content copied");
  };

  const download = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "qr-code.png";
    link.click();
  };

  return (
    <ToolLayout toolId="qr-code-generator">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><QrCode className="h-5 w-5" />QR Code Generator</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={mode} onValueChange={(next) => setMode(next as Mode)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="wifi">Wi-Fi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Size</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="180">180px</SelectItem>
                    <SelectItem value="240">240px</SelectItem>
                    <SelectItem value="320">320px</SelectItem>
                    <SelectItem value="480">480px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{mode === "wifi" ? "Network Name" : mode === "sms" ? "Phone Number" : "Content"}</Label>
              {mode === "text" ? (
                <Textarea value={value} onChange={(event) => setValue(event.target.value)} className="min-h-36" />
              ) : (
                <Input value={value} onChange={(event) => setValue(event.target.value)} />
              )}
            </div>
            {(mode === "wifi" || mode === "sms") && (
              <div className="space-y-2">
                <Label>{mode === "wifi" ? "Password" : "Message"}</Label>
                <Input value={secondary} onChange={(event) => setSecondary(event.target.value)} />
              </div>
            )}
            <Textarea readOnly value={qrValue} className="min-h-24 font-mono" />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={copy}><Copy className="h-4 w-4" />Copy Content</Button>
              <Button variant="outline" onClick={download}><Download className="h-4 w-4" />Download</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Generated QR code" width={Number(size)} height={Number(size)} className="rounded-lg border bg-white p-3" />
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
