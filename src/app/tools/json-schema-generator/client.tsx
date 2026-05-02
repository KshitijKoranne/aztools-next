"use client";

import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Braces, Copy, Download, FileJson, Wand2 } from "lucide-react";
import { toast } from "sonner";

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };
type JsonSchema = Record<string, unknown>;

const SAMPLE_JSON = `{
  "id": 1001,
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "active": true,
  "createdAt": "2026-05-02T10:30:00Z",
  "roles": ["admin", "editor"],
  "profile": {
    "website": "https://example.com",
    "score": 98.5
  }
}`;

function isPlainObject(value: unknown): value is Record<string, JsonValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function detectFormat(value: string): string | undefined {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "email";
  if (/^https?:\/\/[^\s]+$/i.test(value)) return "uri";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/.test(value)) return "date-time";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return "date";
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) return "uuid";
  return undefined;
}

function mergeSchemas(schemas: JsonSchema[]): JsonSchema {
  if (schemas.length === 0) return {};
  if (schemas.length === 1) return schemas[0];

  const types = Array.from(new Set(schemas.map((schema) => schema.type as string | undefined).filter(Boolean)));
  if (types.length > 1) {
    return { anyOf: schemas };
  }

  const type = types[0];
  if (type === "object") {
    const keys = Array.from(new Set(schemas.flatMap((schema) => Object.keys((schema.properties as Record<string, JsonSchema>) || {}))));
    const properties: Record<string, JsonSchema> = {};
    for (const key of keys) {
      const childSchemas = schemas
        .map((schema) => (schema.properties as Record<string, JsonSchema> | undefined)?.[key])
        .filter(Boolean) as JsonSchema[];
      properties[key] = mergeSchemas(childSchemas);
    }
    return { type: "object", properties };
  }

  if (type === "array") {
    const itemSchemas = schemas.map((schema) => schema.items).filter(Boolean) as JsonSchema[];
    return { type: "array", items: mergeSchemas(itemSchemas) };
  }

  return schemas[0];
}

function inferSchema(value: JsonValue, options: { required: boolean; examples: boolean; additionalProperties: boolean }): JsonSchema {
  if (value === null) return { type: "null" };
  if (typeof value === "boolean") return options.examples ? { type: "boolean", examples: [value] } : { type: "boolean" };
  if (typeof value === "number") {
    const schema: JsonSchema = { type: Number.isInteger(value) ? "integer" : "number" };
    if (options.examples) schema.examples = [value];
    return schema;
  }
  if (typeof value === "string") {
    const schema: JsonSchema = { type: "string" };
    const format = detectFormat(value);
    if (format) schema.format = format;
    if (options.examples) schema.examples = [value];
    return schema;
  }
  if (Array.isArray(value)) {
    const schema: JsonSchema = { type: "array" };
    schema.items = value.length ? mergeSchemas(value.map((item) => inferSchema(item, options))) : {};
    return schema;
  }
  if (isPlainObject(value)) {
    const properties: Record<string, JsonSchema> = {};
    for (const [key, child] of Object.entries(value)) {
      properties[key] = inferSchema(child, options);
    }
    const schema: JsonSchema = { type: "object", properties };
    if (options.required) schema.required = Object.keys(value);
    schema.additionalProperties = options.additionalProperties;
    return schema;
  }
  return {};
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/schema+json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function JsonSchemaGeneratorClient() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [required, setRequired] = useState(true);
  const [examples, setExamples] = useState(false);
  const [additionalProperties, setAdditionalProperties] = useState(false);

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(input) as JsonValue;
      const schema = {
        $schema: "https://json-schema.org/draft/2020-12/schema",
        ...inferSchema(parsed, { required, examples, additionalProperties }),
      };
      return { schema: JSON.stringify(schema, null, 2), error: "" };
    } catch (error) {
      return { schema: "", error: error instanceof Error ? error.message : "Invalid JSON" };
    }
  }, [input, required, examples, additionalProperties]);

  const copySchema = async () => {
    if (!result.schema) return;
    await navigator.clipboard.writeText(result.schema);
    toast.success("Schema copied");
  };

  return (
    <ToolLayout toolId="json-schema-generator">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileJson className="h-5 w-5" /> JSON Schema Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="json-input">JSON sample</Label>
                  <Button variant="outline" size="sm" onClick={() => setInput(SAMPLE_JSON)}>
                    <Wand2 className="h-4 w-4 mr-2" /> Load sample
                  </Button>
                </div>
                <Textarea
                  id="json-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  className="min-h-[520px] font-mono text-sm"
                  spellCheck={false}
                />
                {result.error && <p className="text-sm text-destructive">JSON error: {result.error}</p>}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label>Generated schema</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={!result.schema} onClick={copySchema}>
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                    <Button variant="outline" size="sm" disabled={!result.schema} onClick={() => downloadText("schema.json", result.schema)}>
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                </div>
                <Textarea
                  readOnly
                  value={result.schema}
                  placeholder="Valid JSON Schema will appear here..."
                  className="min-h-[520px] font-mono text-sm bg-muted/40"
                  spellCheck={false}
                />
              </div>
            </div>

            <Card className="bg-muted/30">
              <CardContent className="pt-6 grid gap-4 md:grid-cols-3">
                <label className="flex items-center gap-3 text-sm">
                  <Input type="checkbox" className="h-4 w-4" checked={required} onChange={(event) => setRequired(event.target.checked)} />
                  Mark object keys as required
                </label>
                <label className="flex items-center gap-3 text-sm">
                  <Input type="checkbox" className="h-4 w-4" checked={examples} onChange={(event) => setExamples(event.target.checked)} />
                  Include examples
                </label>
                <label className="flex items-center gap-3 text-sm">
                  <Input type="checkbox" className="h-4 w-4" checked={additionalProperties} onChange={(event) => setAdditionalProperties(event.target.checked)} />
                  Allow additional properties
                </label>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3 text-sm text-muted-foreground">
              <div className="rounded-lg border p-4"><Braces className="h-5 w-5 mb-2 text-foreground" /> Detects strings, numbers, booleans, arrays, objects, nulls, and mixed arrays.</div>
              <div className="rounded-lg border p-4"><FileJson className="h-5 w-5 mb-2 text-foreground" /> Adds useful formats for emails, URLs, UUIDs, dates, and date-times.</div>
              <div className="rounded-lg border p-4"><Copy className="h-5 w-5 mb-2 text-foreground" /> Runs fully in your browser. Your JSON is never uploaded.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
