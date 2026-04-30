"use client";

import { useState } from "react";
import { Copy, Search } from "lucide-react";
import { toast } from "sonner";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const recordTypes = ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "SOA"];

type DnsAnswer = { name: string; type: number; TTL: number; data: string };

export default function Client() {
  const [domain, setDomain] = useState("");
  const [type, setType] = useState("A");
  const [answers, setAnswers] = useState<DnsAnswer[]>([]);
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    if (!domain.trim()) return toast.error("Enter a domain");
    setLoading(true);
    try {
      const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain.trim())}&type=${type}`);
      const data = await response.json();
      setAnswers(data.Answer ?? []);
      if (!data.Answer?.length) toast.error("No records found");
    } catch {
      toast.error("DNS lookup failed");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(answers.map((answer) => `${answer.name} ${answer.TTL} ${type} ${answer.data}`).join("\n"));
    toast.success("DNS records copied");
  };

  return (
    <ToolLayout toolId="dns-lookup">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader><CardTitle>DNS Lookup</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[1fr_160px]">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input id="domain" placeholder="example.com" value={domain} onChange={(event) => setDomain(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Record Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{recordTypes.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={lookup} disabled={loading} className="w-full"><Search className="h-4 w-4" />{loading ? "Looking up..." : "Lookup Records"}</Button>
            {answers.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-end"><Button variant="outline" size="sm" onClick={copy}><Copy className="h-4 w-4" />Copy</Button></div>
                {answers.map((answer, index) => (
                  <div key={`${answer.data}-${index}`} className="rounded-lg bg-muted p-4">
                    <p className="font-mono break-all">{answer.data}</p>
                    <p className="mt-1 text-xs text-muted-foreground">TTL {answer.TTL}s · {answer.name}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
