"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Mail } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]!);
}

export default function Client() {
  const [type, setType] = useState("newsletter");
  const [brand, setBrand] = useState("Your Brand");
  const [title, setTitle] = useState("A useful update from us");
  const [body, setBody] = useState("Write your email body here. Keep it concise, helpful, and clear.");
  const [cta, setCta] = useState("Read More");
  const [ctaUrl, setCtaUrl] = useState("https://example.com");

  const html = `<!doctype html>
<html><body style="margin:0;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:8px;overflow:hidden">
<tr><td style="padding:24px;background:#111827;color:#ffffff;font-size:20px;font-weight:700">${escapeHtml(brand)}</td></tr>
<tr><td style="padding:32px">
<p style="margin:0 0 8px;color:#6b7280;text-transform:uppercase;font-size:12px;letter-spacing:.08em">${escapeHtml(type)}</p>
<h1 style="margin:0 0 16px;font-size:28px;line-height:1.2">${escapeHtml(title)}</h1>
<p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#374151">${escapeHtml(body).replace(/\n/g, "<br>")}</p>
<a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:6px;font-weight:700">${escapeHtml(cta)}</a>
</td></tr>
<tr><td style="padding:18px 32px;background:#f9fafb;color:#6b7280;font-size:12px">You are receiving this email from ${escapeHtml(brand)}.</td></tr>
</table></td></tr></table>
</body></html>`;

  async function copy() {
    await navigator.clipboard.writeText(html);
    toast.success("Template copied.");
  }

  return (
    <ToolLayout toolId="email-template-generator">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" />Email Template Generator</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Template Type</Label><Select value={type} onValueChange={setType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newsletter">Newsletter</SelectItem><SelectItem value="announcement">Announcement</SelectItem><SelectItem value="promotion">Promotion</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Brand</Label><Input value={brand} onChange={(event) => setBrand(event.target.value)} /></div>
            <div className="space-y-2"><Label>Title</Label><Input value={title} onChange={(event) => setTitle(event.target.value)} /></div>
            <div className="space-y-2"><Label>Body</Label><Textarea value={body} onChange={(event) => setBody(event.target.value)} className="min-h-[140px]" /></div>
            <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>CTA Text</Label><Input value={cta} onChange={(event) => setCta(event.target.value)} /></div><div className="space-y-2"><Label>CTA URL</Label><Input value={ctaUrl} onChange={(event) => setCtaUrl(event.target.value)} /></div></div>
            <Button onClick={copy}><Copy className="mr-2 h-4 w-4" />Copy HTML</Button>
          </CardContent>
        </Card>
        <Card><CardHeader><CardTitle>HTML Output</CardTitle></CardHeader><CardContent><Textarea value={html} readOnly className="min-h-[520px] font-mono text-xs" /></CardContent></Card>
      </div>
    </ToolLayout>
  );
}
