"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Database, Download, Eye, GitFork, RefreshCw, Table2 } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type DatabaseFormat = "mysql" | "postgresql" | "sqlite";

type Column = {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isNullable: boolean;
  referencedTable?: string;
  referencedColumn?: string;
};

type SchemaTable = {
  name: string;
  columns: Column[];
};

type Relationship = {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
};

const SAMPLE_SCHEMAS: Record<DatabaseFormat, string> = {
  mysql: `CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);`,
  postgresql: `CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  total_amount DECIMAL(10,2) NOT NULL
);`,
  sqlite: `CREATE TABLE invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_number TEXT UNIQUE NOT NULL,
  amount REAL NOT NULL
);

CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);`,
};

function splitSqlStatements(sql: string) {
  return sql.split(";").map((statement) => statement.trim()).filter(Boolean);
}

function splitDefinitions(section: string) {
  const definitions: string[] = [];
  let current = "";
  let depth = 0;

  for (const char of section) {
    if (char === "(") depth++;
    if (char === ")") depth--;
    if (char === "," && depth === 0) {
      definitions.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) definitions.push(current.trim());
  return definitions;
}

function stripIdentifier(value: string) {
  return value.replace(/[`"\[\]]/g, "");
}

function parseSchema(sql: string) {
  const tables: SchemaTable[] = [];
  const relationships: Relationship[] = [];

  for (const statement of splitSqlStatements(sql)) {
    const match = statement.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([`"\[\]\w.]+)\s*\(([\s\S]+)\)$/i);
    if (!match) continue;

    const tableName = stripIdentifier(match[1]!.split(".").pop() ?? match[1]!);
    const definitions = splitDefinitions(match[2]!);
    const columns: Column[] = [];

    for (const definition of definitions) {
      const fk = definition.match(/FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s+([`"\[\]\w.]+)\s*\(([^)]+)\)/i);
      if (fk) {
        const fromColumn = stripIdentifier(fk[1]!.trim());
        const toTable = stripIdentifier(fk[2]!.split(".").pop() ?? fk[2]!);
        const toColumn = stripIdentifier(fk[3]!.trim());
        relationships.push({ fromTable: tableName, fromColumn, toTable, toColumn });
        const column = columns.find((item) => item.name === fromColumn);
        if (column) {
          column.isForeignKey = true;
          column.referencedTable = toTable;
          column.referencedColumn = toColumn;
        }
        continue;
      }

      if (/^(PRIMARY|UNIQUE|CONSTRAINT|INDEX|KEY)\b/i.test(definition)) continue;

      const columnMatch = definition.match(/^([`"\[\]\w]+)\s+([^\s,]+(?:\([^)]*\))?)([\s\S]*)$/i);
      if (!columnMatch) continue;

      const name = stripIdentifier(columnMatch[1]!);
      const type = columnMatch[2]!;
      const constraints = columnMatch[3] ?? "";
      const inlineFk = constraints.match(/REFERENCES\s+([`"\[\]\w.]+)\s*\(([^)]+)\)/i);
      const column: Column = {
        name,
        type,
        isPrimaryKey: /PRIMARY\s+KEY/i.test(constraints),
        isForeignKey: Boolean(inlineFk),
        isNullable: !/NOT\s+NULL/i.test(constraints) && !/PRIMARY\s+KEY/i.test(constraints),
        referencedTable: inlineFk ? stripIdentifier(inlineFk[1]!.split(".").pop() ?? inlineFk[1]!) : undefined,
        referencedColumn: inlineFk ? stripIdentifier(inlineFk[2]!.trim()) : undefined,
      };

      if (inlineFk && column.referencedTable && column.referencedColumn) {
        relationships.push({
          fromTable: tableName,
          fromColumn: name,
          toTable: column.referencedTable,
          toColumn: column.referencedColumn,
        });
      }

      columns.push(column);
    }

    tables.push({ name: tableName, columns });
  }

  if (tables.length === 0) throw new Error("No CREATE TABLE statements found.");
  return { tables, relationships };
}

export default function Client() {
  const [sqlInput, setSqlInput] = useState("");
  const [format, setFormat] = useState<DatabaseFormat>("mysql");
  const [tables, setTables] = useState<SchemaTable[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);

  function visualizeSchema() {
    if (!sqlInput.trim()) {
      toast.error("Please enter SQL schema.");
      return;
    }

    try {
      const parsed = parseSchema(sqlInput);
      setTables(parsed.tables);
      setRelationships(parsed.relationships);
      toast.success(`Parsed ${parsed.tables.length} table(s).`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to parse schema.");
    }
  }

  async function copySummary() {
    const summary = tables.map((table) => [
      `Table: ${table.name}`,
      ...table.columns.map((column) => `  ${column.name}: ${column.type}${column.isPrimaryKey ? " (PK)" : ""}${column.isForeignKey ? " (FK)" : ""}`),
    ].join("\n")).join("\n\n");

    await navigator.clipboard.writeText(`${summary}\n\nRelationships:\n${relationships.map((rel) => `${rel.fromTable}.${rel.fromColumn} -> ${rel.toTable}.${rel.toColumn}`).join("\n")}`);
    toast.success("Schema summary copied.");
  }

  function exportSchema() {
    const blob = new Blob([JSON.stringify({ format, tables, relationships }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `database-schema-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success("Schema exported.");
  }

  return (
    <ToolLayout toolId="database-schema-visualizer">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitFork className="h-5 w-5" />
              Database Schema Visualizer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-2">
                <Label>Database Type</Label>
                <Select value={format} onValueChange={(value) => setFormat(value as DatabaseFormat)}>
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={() => setSqlInput(SAMPLE_SCHEMAS[format])}>Load Sample Schema</Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sql-input">SQL Schema</Label>
              <Textarea id="sql-input" value={sqlInput} onChange={(event) => setSqlInput(event.target.value)} placeholder="Paste CREATE TABLE statements here..." className="min-h-[220px] font-mono text-sm" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={visualizeSchema}><Eye className="mr-2 h-4 w-4" />Visualize Schema</Button>
              {tables.length > 0 && (
                <>
                  <Button variant="outline" onClick={exportSchema}><Download className="mr-2 h-4 w-4" />Export</Button>
                  <Button variant="outline" onClick={copySummary}><Copy className="mr-2 h-4 w-4" />Copy Summary</Button>
                  <Button variant="outline" size="icon" onClick={() => { setTables([]); setRelationships([]); }}><RefreshCw className="h-4 w-4" /></Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {tables.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2"><Database className="h-5 w-5" />Schema Diagram</span>
                  <Badge variant="outline">{format.toUpperCase()}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {tables.map((table) => (
                    <Card key={table.name}>
                      <CardHeader className="rounded-t-md bg-primary py-3 text-primary-foreground">
                        <CardTitle className="flex items-center gap-2 text-base"><Table2 className="h-4 w-4" />{table.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 pt-4">
                        {table.columns.map((column) => (
                          <div key={column.name} className="flex items-center justify-between gap-3 text-sm">
                            <span className="min-w-0 truncate font-medium">{column.name}</span>
                            <span className="flex items-center gap-1">
                              {column.isPrimaryKey && <Badge variant="outline">PK</Badge>}
                              {column.isForeignKey && <Badge variant="outline">FK</Badge>}
                              <span className="text-xs text-muted-foreground">{column.type}</span>
                            </span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Schema Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 text-sm md:grid-cols-3">
                  <div><div className="font-medium">Tables</div><div className="text-muted-foreground">{tables.length} total</div></div>
                  <div><div className="font-medium">Columns</div><div className="text-muted-foreground">{tables.reduce((sum, table) => sum + table.columns.length, 0)} total</div></div>
                  <div><div className="font-medium">Relationships</div><div className="text-muted-foreground">{relationships.length} foreign keys</div></div>
                </div>
                {relationships.length > 0 && (
                  <div className="space-y-2 text-sm">
                    {relationships.map((relationship, index) => (
                      <div key={`${relationship.fromTable}-${relationship.fromColumn}-${index}`} className="rounded-md border p-2 font-mono">
                        {relationship.fromTable}.{relationship.fromColumn} -&gt; {relationship.toTable}.{relationship.toColumn}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
