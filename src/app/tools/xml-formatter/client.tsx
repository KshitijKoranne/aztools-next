"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Copy, FileCode, RefreshCw } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

function validationError(doc: Document) {
  return doc.querySelector("parsererror")?.textContent?.trim() ?? "";
}

function serializeNode(node: Node, level: number, indent: string, sortAttributes: boolean): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim();
    return text ? `${indent.repeat(level)}${text}` : "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const element = node as Element;
  const attrs = Array.from(element.attributes)
    .sort((a, b) => sortAttributes ? a.name.localeCompare(b.name) : 0)
    .map((attr) => ` ${attr.name}="${attr.value}"`)
    .join("");
  const children = Array.from(element.childNodes).map((child) => serializeNode(child, level + 1, indent, sortAttributes)).filter(Boolean);

  if (children.length === 0) return `${indent.repeat(level)}<${element.tagName}${attrs}/>`;
  if (children.length === 1 && !children[0]!.trim().startsWith("<")) {
    return `${indent.repeat(level)}<${element.tagName}${attrs}>${children[0]!.trim()}</${element.tagName}>`;
  }

  return [
    `${indent.repeat(level)}<${element.tagName}${attrs}>`,
    ...children,
    `${indent.repeat(level)}</${element.tagName}>`,
  ].join("\n");
}

export default function Client() {
  const [xmlInput, setXmlInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [indentSize, setIndentSize] = useState(2);
  const [sortAttributes, setSortAttributes] = useState(false);

  function parseXml() {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlInput, "application/xml");
    const parserError = validationError(doc);

    if (parserError) throw new Error(parserError);
    return doc;
  }

  function formatXml() {
    if (!xmlInput.trim()) {
      toast.error("Please enter XML content.");
      return;
    }

    try {
      const doc = parseXml();
      const declaration = xmlInput.trim().startsWith("<?xml") ? '<?xml version="1.0" encoding="UTF-8"?>\n' : "";
      setOutput(`${declaration}${serializeNode(doc.documentElement, 0, " ".repeat(indentSize), sortAttributes)}`);
      setIsValid(true);
      setError("");
      toast.success("XML formatted.");
    } catch (err) {
      setOutput("");
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid XML.");
      toast.error("Invalid XML.");
    }
  }

  function minifyXml() {
    if (!xmlInput.trim()) {
      toast.error("Please enter XML content.");
      return;
    }

    try {
      parseXml();
      setOutput(xmlInput.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim());
      setIsValid(true);
      setError("");
      toast.success("XML minified.");
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid XML.");
      toast.error("Invalid XML.");
    }
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    toast.success("XML copied.");
  }

  function loadSample() {
    setXmlInput(`<catalog><book id="1" currency="USD"><title>The Great Gatsby</title><author>F. Scott Fitzgerald</author><year>1925</year></book><book id="2"><title>To Kill a Mockingbird</title><author>Harper Lee</author><year>1960</year></book></catalog>`);
  }

  return (
    <ToolLayout toolId="xml-formatter">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              XML Formatter & Validator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Indent Size</Label>
                <div className="flex gap-2">
                  {[2, 4, 8].map((size) => (
                    <Button key={size} variant={indentSize === size ? "default" : "outline"} size="sm" onClick={() => setIndentSize(size)}>
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="sort-attrs" checked={sortAttributes} onCheckedChange={setSortAttributes} />
                <Label htmlFor="sort-attrs">Sort attributes</Label>
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={loadSample}>Load Sample</Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={formatXml}>Format XML</Button>
              <Button variant="outline" onClick={minifyXml}>Minify</Button>
              <Button variant="outline" size="icon" onClick={() => { setXmlInput(""); setOutput(""); setError(""); setIsValid(null); }}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>XML Input</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={xmlInput} onChange={(event) => setXmlInput(event.target.value)} placeholder="Paste XML content here..." className="min-h-[400px] font-mono text-sm" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  Formatted XML
                  {isValid === true && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {isValid === false && <AlertCircle className="h-4 w-4 text-red-600" />}
                </span>
                {output && <Button size="sm" variant="outline" onClick={copyOutput}><Copy className="mr-2 h-4 w-4" />Copy</Button>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
              ) : (
                <Textarea value={output} readOnly placeholder="Formatted XML will appear here..." className="min-h-[400px] font-mono text-sm" />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
