"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, FileDown, Plus, Receipt, Trash2 } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "CAD", "AUD"];
const SYMBOLS: Record<string, string> = { USD: "$", EUR: "EUR ", GBP: "GBP ", INR: "INR ", CAD: "CAD ", AUD: "AUD " };

function isoDate(offsetDays = 0) {
  return new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]!);
}

export default function Client() {
  const [invoiceNumber, setInvoiceNumber] = useState(() => `INV-${Date.now().toString().slice(-6)}`);
  const [invoiceDate, setInvoiceDate] = useState(() => isoDate());
  const [dueDate, setDueDate] = useState(() => isoDate(30));
  const [businessName, setBusinessName] = useState("Your Business Name");
  const [businessAddress, setBusinessAddress] = useState("123 Business St\nCity, State 12345");
  const [businessEmail, setBusinessEmail] = useState("hello@example.com");
  const [clientName, setClientName] = useState("Client Company");
  const [clientAddress, setClientAddress] = useState("456 Client Ave\nClient City, State 67890");
  const [clientEmail, setClientEmail] = useState("client@example.com");
  const [notes, setNotes] = useState("Thank you for your business.");
  const [terms, setTerms] = useState("Payment is due within 30 days.");
  const [currency, setCurrency] = useState("USD");
  const [taxRate, setTaxRate] = useState(0);
  const [items, setItems] = useState<InvoiceItem[]>(() => [{ id: crypto.randomUUID(), description: "Web Development Services", quantity: 1, rate: 500 }]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const taxAmount = subtotal * (taxRate / 100);
    return { subtotal, taxAmount, total: subtotal + taxAmount };
  }, [items, taxRate]);

  function formatCurrency(value: number) {
    return `${SYMBOLS[currency] ?? currency} ${value.toFixed(2)}`.replace(/\s+/g, " ");
  }

  function updateItem(id: string, field: keyof InvoiceItem, value: string | number) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  }

  function invoiceHtml() {
    const rows = items.map((item) => `
      <tr>
        <td>${escapeHtml(item.description)}</td>
        <td>${item.quantity}</td>
        <td>${formatCurrency(item.rate)}</td>
        <td>${formatCurrency(item.quantity * item.rate)}</td>
      </tr>
    `).join("");

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Invoice ${escapeHtml(invoiceNumber)}</title>
<style>
body{font-family:Arial,sans-serif;background:#f6f6f6;margin:0;padding:32px;color:#111}
.invoice{max-width:820px;margin:0 auto;background:#fff;padding:40px;border-radius:8px}
.header{display:flex;justify-content:space-between;gap:32px;margin-bottom:36px}
h1{margin:0;color:#2563eb;font-size:40px}
.muted{color:#666;white-space:pre-line;line-height:1.5}
.bill{background:#f8fafc;padding:18px;border-radius:6px;margin-bottom:28px}
table{width:100%;border-collapse:collapse;margin:28px 0}
th{background:#2563eb;color:#fff;text-align:left;padding:12px}
td{border-bottom:1px solid #e5e7eb;padding:12px}
td:nth-child(n+2),th:nth-child(n+2){text-align:right}
.totals{margin-left:auto;width:320px}
.totals td{border:0}
.total{font-weight:700;font-size:18px;background:#eff6ff}
@media print{body{background:#fff;padding:0}.invoice{box-shadow:none}}
</style>
</head>
<body>
<main class="invoice">
<section class="header">
<div><h2>${escapeHtml(businessName)}</h2><div class="muted">${escapeHtml(businessAddress)}<br>${escapeHtml(businessEmail)}</div></div>
<div><h1>INVOICE</h1><p><strong>#</strong> ${escapeHtml(invoiceNumber)}<br><strong>Date</strong> ${invoiceDate}<br><strong>Due</strong> ${dueDate}</p></div>
</section>
<section class="bill"><strong>Bill To</strong><div class="muted">${escapeHtml(clientName)}<br>${escapeHtml(clientAddress)}<br>${escapeHtml(clientEmail)}</div></section>
<table><thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table>
<table class="totals">
<tr><td>Subtotal</td><td>${formatCurrency(totals.subtotal)}</td></tr>
<tr><td>Tax (${taxRate}%)</td><td>${formatCurrency(totals.taxAmount)}</td></tr>
<tr class="total"><td>Total</td><td>${formatCurrency(totals.total)}</td></tr>
</table>
${notes ? `<p><strong>Notes</strong><br>${escapeHtml(notes)}</p>` : ""}
${terms ? `<p><strong>Terms</strong><br>${escapeHtml(terms)}</p>` : ""}
</main>
</body>
</html>`;
  }

  function downloadInvoice() {
    const blob = new Blob([invoiceHtml()], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoiceNumber}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success("Invoice downloaded.");
  }

  async function copyHtml() {
    await navigator.clipboard.writeText(invoiceHtml());
    toast.success("Invoice HTML copied.");
  }

  return (
    <ToolLayout toolId="invoice-generator">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" />Invoice Generator</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Invoice Number</Label><Input value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} /></div>
            <div className="space-y-2"><Label>Currency</Label><Select value={currency} onValueChange={setCurrency}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CURRENCIES.map((code) => <SelectItem key={code} value={code}>{code}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Invoice Date</Label><Input type="date" value={invoiceDate} onChange={(event) => setInvoiceDate(event.target.value)} /></div>
            <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></div>
            <div className="space-y-2"><Label>Business Name</Label><Input value={businessName} onChange={(event) => setBusinessName(event.target.value)} /></div>
            <div className="space-y-2"><Label>Business Email</Label><Input value={businessEmail} onChange={(event) => setBusinessEmail(event.target.value)} /></div>
            <div className="space-y-2"><Label>Business Address</Label><Textarea value={businessAddress} onChange={(event) => setBusinessAddress(event.target.value)} /></div>
            <div className="space-y-2"><Label>Client Details</Label><Input className="mb-2" value={clientName} onChange={(event) => setClientName(event.target.value)} /><Input className="mb-2" value={clientEmail} onChange={(event) => setClientEmail(event.target.value)} /><Textarea value={clientAddress} onChange={(event) => setClientAddress(event.target.value)} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Invoice Items</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="grid gap-2 rounded-md border p-3 md:grid-cols-[1fr_100px_120px_auto]">
                <Input value={item.description} onChange={(event) => updateItem(item.id, "description", event.target.value)} placeholder="Description" />
                <Input type="number" min="0" value={item.quantity} onChange={(event) => updateItem(item.id, "quantity", Number(event.target.value))} />
                <Input type="number" min="0" value={item.rate} onChange={(event) => updateItem(item.id, "rate", Number(event.target.value))} />
                <Button size="icon" variant="ghost" onClick={() => setItems((current) => current.filter((next) => next.id !== item.id))}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button variant="outline" onClick={() => setItems((current) => [...current, { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 }])}><Plus className="mr-2 h-4 w-4" />Add Item</Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader><CardTitle>Notes & Terms</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Tax Rate (%)</Label><Input type="number" min="0" value={taxRate} onChange={(event) => setTaxRate(Number(event.target.value))} /></div>
              <div />
              <div className="space-y-2"><Label>Notes</Label><Textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></div>
              <div className="space-y-2"><Label>Terms</Label><Textarea value={terms} onChange={(event) => setTerms(event.target.value)} /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between"><span>Subtotal</span><strong>{formatCurrency(totals.subtotal)}</strong></div>
              <div className="flex justify-between"><span>Tax</span><strong>{formatCurrency(totals.taxAmount)}</strong></div>
              <div className="flex justify-between border-t pt-3 text-lg"><span>Total</span><strong>{formatCurrency(totals.total)}</strong></div>
              <Button className="w-full" onClick={downloadInvoice}><FileDown className="mr-2 h-4 w-4" />Download HTML</Button>
              <Button className="w-full" variant="outline" onClick={copyHtml}><Copy className="mr-2 h-4 w-4" />Copy HTML</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
