"use client";

import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownToLine, Copy, Code, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import { marked } from "marked";

const INITIAL_MARKDOWN = `# Hello Markdown

This is a **bold** text and this is an *italic* text.

## Lists

- Item 1
- Item 2
- Item 3

## Code

\`\`\`javascript
function hello() {
  console.log("Hello World!");
}
\`\`\`
`;

function download(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function MarkdownEditorClient() {
  const [markdown, setMarkdown] = useState(INITIAL_MARKDOWN);
  const htmlOutput = useMemo(() => marked.parse(markdown, { async: false }) as string, [markdown]);

  return (
    <ToolLayout toolId="markdown-editor">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col-reverse md:flex-row gap-4">
          {/* Editor */}
          <div className="flex-1">
            <Card className="p-4 h-full">
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium flex items-center gap-1">
                  <Code className="h-4 w-4" /> Editor
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    download(markdown, "document.md", "text/markdown");
                    toast.success("Markdown downloaded");
                  }}
                >
                  <ArrowDownToLine className="h-3 w-3" />
                  Download .md
                </Button>
              </div>
              <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="h-[400px] font-mono text-sm"
                placeholder="Write your markdown here..."
              />
            </Card>
          </div>

          {/* Preview / HTML */}
          <div className="flex-1">
            <Card className="p-4 h-full">
              <Tabs defaultValue="preview">
                <div className="flex justify-between mb-2">
                  <TabsList>
                    <TabsTrigger value="preview" className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> Preview
                    </TabsTrigger>
                    <TabsTrigger value="html" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" /> HTML
                    </TabsTrigger>
                  </TabsList>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => {
                      download(htmlOutput, "document.html", "text/html");
                      toast.success("HTML downloaded");
                    }}
                  >
                    <ArrowDownToLine className="h-3 w-3" />
                    Download .html
                  </Button>
                </div>

                <TabsContent
                  value="preview"
                  className="h-[400px] overflow-auto border rounded-md p-4"
                >
                  <div
                    className="prose dark:prose-invert max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: htmlOutput }}
                  />
                </TabsContent>

                <TabsContent value="html" className="h-[400px]">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 gap-1 z-10"
                      onClick={() => {
                        navigator.clipboard.writeText(htmlOutput);
                        toast.success("HTML copied to clipboard");
                      }}
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                    <pre className="font-mono text-xs p-4 whitespace-pre-wrap border rounded-md h-[400px] overflow-auto bg-muted/50">
                      {htmlOutput}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
