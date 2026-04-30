"use client";
import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Trash, Shield } from "lucide-react";
import { toast } from "sonner";

interface Decoded { header: unknown; payload: unknown; signature: string; error?: string; }

function decodeJWT(token: string): Decoded | null {
  const parts = token.split(".");
  if (parts.length !== 3) return { header: null, payload: null, signature: "", error: "Invalid JWT format — expected 3 parts" };
  try {
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    return { header, payload, signature: parts[2] };
  } catch (e) {
    return { header: null, payload: null, signature: "", error: (e as Error).message };
  }
}

export default function Client() {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<Decoded | null>(null);

  useEffect(() => {
    if (input.trim()) setDecoded(decodeJWT(input.trim()));
    else setDecoded(null);
  }, [input]);

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied"); };

  return (
    <ToolLayout toolId="jwt-decoder">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> JWT Decoder</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Label>JWT Token</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste JWT token..." className="font-mono flex-1" />
              <Button variant="outline" onClick={() => { setInput(""); setDecoded(null); }}>
                <Trash className="h-4 w-4 mr-2" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {decoded?.error && (
          <Card className="border-destructive">
            <CardContent className="pt-6"><p className="text-destructive text-sm">{decoded.error}</p></CardContent>
          </Card>
        )}

        {decoded && !decoded.error && (
          <div className="space-y-4">
            {[
              { title: "Header", data: decoded.header },
              { title: "Payload", data: decoded.payload },
            ].map(({ title, data }) => (
              <Card key={title}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {title}
                    <Button variant="ghost" size="sm" onClick={() => copy(JSON.stringify(data, null, 2))}>
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{JSON.stringify(data, null, 2)}</pre>
                </CardContent>
              </Card>
            ))}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Signature
                  <Button variant="ghost" size="sm" onClick={() => copy(decoded.signature)}>
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm break-all">{decoded.signature}</pre>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
