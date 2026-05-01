"use client";

import { useMemo, useState } from "react";
import { Copy, SearchCode } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const statuses = [
  [100, "Continue", "The server received the request headers and the client should continue."],
  [101, "Switching Protocols", "The server is switching protocols as requested."],
  [200, "OK", "The request succeeded."],
  [201, "Created", "The request succeeded and created a new resource."],
  [202, "Accepted", "The request was accepted but has not finished processing."],
  [204, "No Content", "The request succeeded with no response body."],
  [301, "Moved Permanently", "The resource has permanently moved to a new URL."],
  [302, "Found", "The resource is temporarily available at another URL."],
  [304, "Not Modified", "The cached response is still valid."],
  [400, "Bad Request", "The server could not understand the request."],
  [401, "Unauthorized", "Authentication is required or failed."],
  [403, "Forbidden", "The server understood the request but refuses it."],
  [404, "Not Found", "The requested resource does not exist."],
  [405, "Method Not Allowed", "The HTTP method is not supported for this resource."],
  [409, "Conflict", "The request conflicts with current server state."],
  [410, "Gone", "The resource is no longer available."],
  [418, "I'm a Teapot", "A playful status from the HTCPCP specification."],
  [422, "Unprocessable Content", "The request is syntactically valid but semantically invalid."],
  [429, "Too Many Requests", "The client sent too many requests in a given time."],
  [500, "Internal Server Error", "The server hit an unexpected condition."],
  [501, "Not Implemented", "The server does not support the requested functionality."],
  [502, "Bad Gateway", "An upstream server returned an invalid response."],
  [503, "Service Unavailable", "The server is temporarily unavailable."],
  [504, "Gateway Timeout", "An upstream server did not respond in time."],
] as const;

function category(code: number) {
  if (code < 200) return "Informational";
  if (code < 300) return "Success";
  if (code < 400) return "Redirection";
  if (code < 500) return "Client error";
  return "Server error";
}

export default function Client() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return statuses;
    return statuses.filter(([code, title, description]) => `${code} ${title} ${description} ${category(code)}`.toLowerCase().includes(q));
  }, [query]);

  async function copy(code: number, title: string) {
    await navigator.clipboard.writeText(`${code} ${title}`);
    toast.success("Status copied.");
  }

  return (
    <ToolLayout toolId="http-status-lookup">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><SearchCode className="h-5 w-5" />HTTP Status Code Lookup</CardTitle></CardHeader>
          <CardContent><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search 404, redirect, unauthorized, server error..." /></CardContent>
        </Card>
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map(([code, title, description]) => (
            <Card key={code}>
              <CardContent className="pt-6">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div><div className="font-mono text-2xl font-bold">{code}</div><div className="font-medium">{title}</div></div>
                  <Badge variant="outline">{category(code)}</Badge>
                </div>
                <p className="min-h-10 text-sm text-muted-foreground">{description}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => copy(code, title)}><Copy className="mr-2 h-4 w-4" />Copy</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
