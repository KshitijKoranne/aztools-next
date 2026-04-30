"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Mail, AlertTriangle, Copy } from "lucide-react";
import { toast } from "sonner";

interface VResult {
  email: string;
  isValid: boolean;
  issues: string[];
  suggestions: string[];
  parts?: { localPart: string; domain: string; tld: string };
}

function validateEmail(email: string): VResult {
  const trimmed = email.trim();
  const issues: string[] = [];
  const suggestions: string[] = [];
  if (!trimmed) { issues.push("Email is required"); return { email: trimmed, isValid: false, issues, suggestions }; }
  if (/\s/.test(trimmed)) issues.push("Email cannot contain spaces");
  const basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  if (!basic) {
    if (!trimmed.includes("@")) issues.push("Missing @ symbol");
    else if (trimmed.split("@").length > 2) issues.push("Multiple @ symbols");
    else if (!trimmed.includes(".")) issues.push("Missing domain extension");
  }
  let parts: VResult["parts"];
  if (trimmed.includes("@")) {
    const at = trimmed.lastIndexOf("@");
    const local = trimmed.slice(0, at), domain = trimmed.slice(at + 1);
    if (domain.includes(".")) {
      const segs = domain.split(".");
      parts = { localPart: local, domain, tld: segs[segs.length - 1]! };
    }
  }
  if (parts) {
    const { localPart, domain, tld } = parts;
    if (!localPart) issues.push("Local part is empty");
    if (localPart.length > 64) issues.push("Local part too long (max 64)");
    if (localPart.startsWith(".") || localPart.endsWith(".")) issues.push("Local part cannot start/end with period");
    if (localPart.includes("..")) issues.push("Consecutive periods in local part");
    if (domain.length > 253) issues.push("Domain too long");
    if (domain.startsWith("-") || domain.endsWith("-")) issues.push("Domain cannot start/end with hyphen");
    if (!tld || tld.length < 2) issues.push("TLD too short");
    if (!/^[a-zA-Z]+$/.test(tld!)) issues.push("TLD can only contain letters");
    const TYPOS: Record<string, string> = { "gmial.com": "gmail.com", "gmai.com": "gmail.com", "yahho.com": "yahoo.com", "hotmial.com": "hotmail.com" };
    if (TYPOS[domain.toLowerCase()]) suggestions.push(`Did you mean ${TYPOS[domain.toLowerCase()]}?`);
  }
  if (trimmed.length > 320) issues.push("Email too long (max 320)");
  if (issues.length === 0) suggestions.push("Email format is valid");
  return { email: trimmed, isValid: issues.length === 0 && basic, issues, suggestions, parts };
}

export default function Client() {
  const [single, setSingle] = useState("");
  const [bulk, setBulk] = useState("");
  const [singleRes, setSingleRes] = useState<VResult | null>(null);
  const [bulkRes, setBulkRes] = useState<VResult[]>([]);

  return (
    <ToolLayout toolId="email-validator">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Email Validator</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue="single">
              <TabsList className="grid grid-cols-2"><TabsTrigger value="single">Single</TabsTrigger><TabsTrigger value="bulk">Bulk</TabsTrigger></TabsList>

              <TabsContent value="single" className="space-y-4 mt-4">
                <Input placeholder="Enter email to validate..." value={single} onChange={(e) => setSingle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { const r = validateEmail(single); setSingleRes(r); toast[r.isValid ? "success" : "error"](r.isValid ? "Valid email" : `${r.issues.length} issue(s) found`); }}} />
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => { const r = validateEmail(single); setSingleRes(r); toast[r.isValid ? "success" : "error"](r.isValid ? "Valid email" : `${r.issues.length} issue(s) found`); }}>Validate</Button>
                  <Button variant="outline" onClick={() => { setSingle(""); setSingleRes(null); }}>Clear</Button>
                </div>
                {singleRes && (
                  <Card>
                    <CardHeader><CardTitle className="flex justify-between text-sm">Result <Badge variant={singleRes.isValid ? "default" : "destructive"}>{singleRes.isValid ? <><Check className="h-3 w-3 mr-1" />Valid</> : <><X className="h-3 w-3 mr-1" />Invalid</>}</Badge></CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-muted p-3 rounded font-mono text-sm">{singleRes.email}</div>
                      {singleRes.parts && (
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div><p className="font-medium">Local</p><p className="text-muted-foreground">{singleRes.parts.localPart}</p></div>
                          <div><p className="font-medium">Domain</p><p className="text-muted-foreground">{singleRes.parts.domain}</p></div>
                          <div><p className="font-medium">TLD</p><p className="text-muted-foreground">{singleRes.parts.tld}</p></div>
                        </div>
                      )}
                      {singleRes.issues.length > 0 && <div><p className="font-medium text-sm mb-1 flex items-center gap-1"><X className="h-4 w-4 text-red-500" />Issues</p><ul className="text-sm space-y-1">{singleRes.issues.map((i, k) => <li key={k} className="flex gap-2 items-start"><X className="h-3 w-3 text-red-500 mt-0.5 shrink-0" />{i}</li>)}</ul></div>}
                      {singleRes.suggestions.length > 0 && <div><p className="font-medium text-sm mb-1 flex items-center gap-1"><AlertTriangle className="h-4 w-4 text-yellow-500" />Suggestions</p><ul className="text-sm space-y-1">{singleRes.suggestions.map((s, k) => <li key={k} className="flex gap-2 items-start"><AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 shrink-0" />{s}</li>)}</ul></div>}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="bulk" className="space-y-4 mt-4">
                <Textarea placeholder="One email per line..." value={bulk} onChange={(e) => setBulk(e.target.value)} className="min-h-[200px]" />
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => { const results = bulk.split("\n").map((e) => e.trim()).filter(Boolean).map(validateEmail); setBulkRes(results); const valid = results.filter((r) => r.isValid).length; toast.success(`${valid}/${results.length} valid`); }}>Validate All</Button>
                  <Button variant="outline" onClick={() => { setBulk(""); setBulkRes([]); }}>Clear</Button>
                  {bulkRes.length > 0 && <Button variant="outline" onClick={() => { navigator.clipboard.writeText(bulkRes.map((r) => `${r.email}: ${r.isValid ? "Valid" : "Invalid"}`).join("\n")); toast.success("Copied"); }}><Copy className="h-4 w-4" /></Button>}
                </div>
                {bulkRes.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Results ({bulkRes.filter((r) => r.isValid).length}/{bulkRes.length} valid)</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {bulkRes.map((r, i) => (
                          <div key={i} className="flex justify-between items-center p-2 border rounded">
                            <span className="font-mono text-sm truncate flex-1">{r.email}</span>
                            <Badge variant={r.isValid ? "default" : "destructive"}>{r.isValid ? <><Check className="h-3 w-3 mr-1" />Valid</> : <><X className="h-3 w-3 mr-1" />Invalid</>}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
