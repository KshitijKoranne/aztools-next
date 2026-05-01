"use client";
import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Trash } from "lucide-react";
import { toast } from "sonner";

interface Match { match: string; index: number; groups: string[]; }

export default function Client() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState({ global: true, caseInsensitive: false, multiline: false, unicode: false, sticky: false });

  const flagStr = [
    flags.global && "g", flags.caseInsensitive && "i", flags.multiline && "m",
    flags.unicode && "u", flags.sticky && "y",
  ].filter(Boolean).join("");

  const { matches, error } = useMemo(() => {
    if (!pattern || !testString) return { matches: [] as Match[], error: null as string | null };
    try {
      const re = new RegExp(pattern, flagStr);
      const results: Match[] = [];
      if (flags.global) {
        let m;
        while ((m = re.exec(testString)) !== null) {
          results.push({ match: m[0], index: m.index, groups: m.slice(1) });
          if (m[0] === "") re.lastIndex += 1;
        }
      } else {
        const m = re.exec(testString);
        if (m) results.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }
      return { matches: results, error: null };
    } catch (e) {
      return { matches: [] as Match[], error: (e as Error).message };
    }
  }, [flagStr, flags.global, pattern, testString]);

  const FLAG_LABELS: [keyof typeof flags, string][] = [
    ["global","Global (g)"],["caseInsensitive","Case Insensitive (i)"],["multiline","Multiline (m)"],
    ["unicode","Unicode (u)"],["sticky","Sticky (y)"],
  ];

  return (
    <ToolLayout toolId="regex-tester">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader><CardTitle>Regex Tester</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Pattern</Label>
              <div className="flex gap-2">
                <Input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Enter regex pattern..." className="font-mono" />
                <Button variant="outline" onClick={() => { navigator.clipboard.writeText(pattern); toast.success("Pattern copied"); }}>
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Flags</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {FLAG_LABELS.map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch id={key} checked={flags[key]} onCheckedChange={(v) => setFlags({ ...flags, [key]: v })} />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Test String</Label>
              <Textarea value={testString} onChange={(e) => setTestString(e.target.value)} placeholder="Enter text to test..." className="min-h-[200px] font-mono" />
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => { setPattern(""); setTestString(""); }}>
                <Trash className="h-4 w-4 mr-2" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6"><p className="text-destructive text-sm">{error}</p></CardContent>
          </Card>
        )}

        {matches.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Matches ({matches.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {matches.map((m, i) => (
                  <div key={i} className="bg-muted p-3 rounded-lg">
                    <p className="font-mono font-medium">{m.match}</p>
                    <p className="text-sm text-muted-foreground">
                      Index: {m.index}{m.groups.length > 0 && ` | Groups: ${m.groups.join(", ")}`}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {!error && matches.length === 0 && pattern && testString && (
          <Card><CardContent className="pt-6 text-muted-foreground text-sm">No matches found.</CardContent></Card>
        )}
      </div>
    </ToolLayout>
  );
}
