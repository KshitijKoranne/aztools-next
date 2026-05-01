"use client";

import { useMemo, useState } from "react";
import { Copy, Hash } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const bases = [
  ["2", "Binary"],
  ["8", "Octal"],
  ["10", "Decimal"],
  ["16", "Hexadecimal"],
] as const;

function parseValue(value: string, base: number) {
  const trimmed = value.trim();
  const sign = trimmed.startsWith("-") ? "-" : "";
  const unsigned = trimmed.replace(/^-/, "");
  const cleaned = `${sign}${unsigned.replace(/^0b/i, "").replace(/^0x/i, "").replace(/^0o/i, "").replaceAll("_", "").replaceAll(" ", "")}`;
  if (!cleaned) return null;
  const valid = base === 2 ? /^-?[01]+$/ : base === 8 ? /^-?[0-7]+$/ : base === 10 ? /^-?\d+$/ : /^-?[0-9a-f]+$/i;
  if (!valid.test(cleaned)) return null;
  const parsed = Number.parseInt(cleaned, base);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function group(value: string, size: number) {
  const sign = value.startsWith("-") ? "-" : "";
  const unsigned = sign ? value.slice(1) : value;
  return sign + (unsigned.split("").reverse().join("").match(new RegExp(`.{1,${size}}`, "g"))?.join(" ").split("").reverse().join("") ?? unsigned);
}

export default function Client() {
  const [input, setInput] = useState("255");
  const [base, setBase] = useState("10");
  const value = useMemo(() => parseValue(input, Number(base)), [base, input]);
  const rows = value === null ? [] : [
    ["Decimal", String(value)],
    ["Binary", group(value.toString(2), 4)],
    ["Octal", value.toString(8)],
    ["Hexadecimal", value.toString(16).toUpperCase()],
  ];

  async function copy(text: string) {
    await navigator.clipboard.writeText(text.replaceAll(" ", ""));
    toast.success("Copied.");
  }

  return (
    <ToolLayout toolId="number-base-converter">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Hash className="h-5 w-5" />Number Base Converter</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[1fr_220px]">
            <div className="space-y-2"><Label>Number</Label><Input value={input} onChange={(event) => setInput(event.target.value)} className="font-mono" /></div>
            <div className="space-y-2">
              <Label>Input Base</Label>
              <Select value={base} onValueChange={setBase}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{bases.map(([id, name]) => <SelectItem key={id} value={id}>{name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        {value === null ? (
          <Card><CardContent className="pt-6 text-sm text-destructive">Enter a valid safe integer for the selected base.</CardContent></Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {rows.map(([label, text]) => (
              <Card key={label}>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">{label}</div>
                  <div className="mt-1 break-all font-mono text-xl font-semibold">{text}</div>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => copy(text)}><Copy className="mr-2 h-4 w-4" />Copy</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
