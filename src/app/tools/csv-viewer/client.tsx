"use client";
import { useState, useRef } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Download, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const ROWS_PER_PAGE = 10;

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cur = "", inQ = false;
  const row: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (c === '"' && inQ && n === '"') { cur += '"'; i++; }
    else if (c === '"') { inQ = !inQ; }
    else if (c === ',' && !inQ) { row.push(cur); cur = ''; }
    else if ((c === '\r' || c === '\n') && !inQ) {
      if (cur !== '' || row.length > 0) {
        row.push(cur);
        if (row.some(f => f.trim())) rows.push([...row]);
        row.length = 0; cur = '';
      }
      if (c === '\r' && n === '\n') i++;
    } else { cur += c; }
  }
  if (cur !== '' || row.length > 0) { row.push(cur); if (row.some(f => f.trim())) rows.push([...row]); }
  return rows;
}

export default function Client() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<string[][]>([]);
  const [fileName, setFileName] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const rows = parseCSV(ev.target?.result as string);
        if (rows.length > 0) { setHeaders(rows[0]); setData(rows.slice(1)); setPage(1); toast.success(`Loaded ${rows.length - 1} rows`); }
        else toast.error("CSV file is empty");
      } catch { toast.error("Failed to parse CSV"); }
    };
    reader.readAsText(file);
  };

  const filtered = data.filter(row => row.some(c => c.toLowerCase().includes(search.toLowerCase())));
  const pageCount = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const download = () => {
    const csv = [headers.join(','), ...data.map(row => row.map(c => c.includes('"') || c.includes(',') || c.includes('\n') ? `"${c.replace(/"/g, '""')}"` : c).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = fileName || 'data.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  };

  return (
    <ToolLayout toolId="csv-viewer">
      <div className="max-w-6xl mx-auto">
        <Card className="p-4 mb-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
            <Button variant="outline" className="w-full sm:w-auto gap-2" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Upload CSV
            </Button>
            {data.length > 0 && (
              <>
                <div className="text-sm text-muted-foreground">{fileName} • {filtered.length} rows</div>
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-8 w-full" />
                  {search && (
                    <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setSearch("")}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button variant="outline" className="w-full sm:w-auto gap-2" onClick={download}>
                  <Download className="h-4 w-4" /> Download
                </Button>
              </>
            )}
          </div>
        </Card>

        {data.length > 0 ? (
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  {headers.map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left font-medium text-muted-foreground">{h || `Column ${i + 1}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? paginated.map((row, ri) => (
                  <tr key={ri} className="border-b hover:bg-muted/30">
                    {headers.map((_, ci) => (
                      <td key={ci} className="px-4 py-2">{row[ci] ?? ""}</td>
                    ))}
                  </tr>
                )) : (
                  <tr><td colSpan={headers.length} className="text-center py-6 text-muted-foreground">{search ? "No results found" : "No data"}</td></tr>
                )}
              </tbody>
            </table>
            {filtered.length > ROWS_PER_PAGE && (
              <div className="flex items-center justify-between p-4 border-t">
                <span className="text-sm text-muted-foreground">
                  {Math.min(filtered.length, (page - 1) * ROWS_PER_PAGE + 1)}–{Math.min(filtered.length, page * ROWS_PER_PAGE)} of {filtered.length} rows
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
                  <span className="text-sm">Page {page} of {pageCount}</span>
                  <Button variant="outline" size="icon" onClick={() => setPage(p => p + 1)} disabled={page === pageCount}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-2 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Upload a CSV File</h3>
              <p className="text-sm text-muted-foreground mb-4">Upload a CSV file to view, search, and analyze its contents.</p>
              <Button onClick={() => fileRef.current?.click()}>Select File</Button>
            </div>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
