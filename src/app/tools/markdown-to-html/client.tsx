'use client'

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Upload, Download, Copy, RotateCcw, FileText, Eye } from "lucide-react";
import { toast } from 'sonner';

export function MarkdownToHtmlClient() {
  const [inputMarkdown, setInputMarkdown] = useState("");
  const [outputHtml, setOutputHtml] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [includeStyles, setIncludeStyles] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample markdown for demonstration
  const sampleMarkdown = `# Welcome to Markdown to HTML Converter

This tool converts **Markdown** text to *HTML* with live preview.

## Features

- **Headers** (H1-H6)
- **Bold** and *italic* text
- [Links](https://example.com)
- Lists (ordered and unordered)
- \`inline code\` and code blocks
- > Blockquotes
- Tables and more!

### Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Table Example

| Feature | Supported |
|---------|-----------|
| Headers | ✅ |
| Lists   | ✅ |
| Links   | ✅ |
| Code    | ✅ |

---

> **Note:** This converter supports most common Markdown syntax and generates clean HTML output.`;

  useEffect(() => {
    if (inputMarkdown) {
      convertToHtml();
    }
  }, [inputMarkdown, includeStyles]);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.match(/\.(md|markdown|txt)$/i)) {
      toast.error("Please select a Markdown file (.md, .markdown, or .txt)");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Please select a file smaller than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputMarkdown(content);
      toast.success(`${file.name} loaded successfully`);
    };
    reader.readAsText(file);
  };

  const convertToHtml = () => {
    if (!inputMarkdown.trim()) {
      setOutputHtml("");
      setPreviewHtml("");
      return;
    }

    try {
      let html = inputMarkdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        
        // Bold and Italic
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        
        // Code blocks
        .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
          return `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`;
        })
        
        // Blockquotes
        .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
        
        // Horizontal rules
        .replace(/^---$/gim, '<hr>')
        
        // Lists
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/^(\s*)- (.*$)/gim, '<li>$2</li>')
        .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')
        
        // Tables (basic support)
        .replace(/\|([^|\n]+)\|/g, (match, content) => {
          const cells = content.split('|').map(cell => cell.trim());
          return '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        })
        
        // Line breaks
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

      // Wrap orphaned list items
      html = html.replace(/(<li>.*?<\/li>)/g, (match, listItems) => {
        if (!listItems.includes('<ul>') && !listItems.includes('<ol>')) {
          return `<ul>${listItems}</ul>`;
        }
        return listItems;
      });

      // Wrap in paragraphs
      if (html && !html.startsWith('<h') && !html.startsWith('<ul') && !html.startsWith('<ol') && !html.startsWith('<blockquote')) {
        html = `<p>${html}</p>`;
      }

      // Clean up empty paragraphs
      html = html.replace(/<p><\/p>/g, '');

      setOutputHtml(html);

      // Create preview HTML with styles
      let styledHtml = html;
      if (includeStyles) {
        styledHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Preview</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 20px; 
    }
    h1, h2, h3 { color: #2c3e50; }
    h1 { border-bottom: 2px solid #3498db; padding-bottom: 10px; }
    h2 { border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; }
    code { 
      background: #f4f4f4; 
      padding: 2px 4px; 
      border-radius: 3px; 
      font-family: 'Monaco', 'Consolas', monospace; 
    }
    pre { 
      background: #f8f8f8; 
      padding: 15px; 
      border-radius: 5px; 
      overflow-x: auto; 
      border-left: 4px solid #3498db; 
    }
    blockquote { 
      border-left: 4px solid #e67e22; 
      margin: 0; 
      padding-left: 20px; 
      color: #7f8c8d; 
      font-style: italic; 
    }
    table { 
      border-collapse: collapse; 
      width: 100%; 
      margin: 20px 0; 
    }
    td, th { 
      border: 1px solid #ddd; 
      padding: 8px; 
      text-align: left; 
    }
    th { 
      background-color: #f2f2f2; 
      font-weight: bold; 
    }
    a { 
      color: #3498db; 
      text-decoration: none; 
    }
    a:hover { 
      text-decoration: underline; 
    }
    ul, ol { 
      padding-left: 30px; 
    }
    hr { 
      border: none; 
      border-top: 2px solid #ecf0f1; 
      margin: 30px 0; 
    }
  </style>
</head>
<body>
${html}
</body>
</html>`;
      }
      setPreviewHtml(styledHtml);

      toast.success("Markdown converted to HTML successfully");
    } catch (error) {
      toast.error("Failed to convert Markdown");
    }
  };

  const copyToClipboard = () => {
    if (!outputHtml) {
      toast.error("Please convert Markdown first");
      return;
    }

    navigator.clipboard.writeText(includeStyles ? previewHtml : outputHtml);
    toast.success("HTML copied to clipboard");
  };

  const downloadHtml = () => {
    if (!outputHtml) {
      toast.error("Please convert Markdown first");
      return;
    }

    const content = includeStyles ? previewHtml : outputHtml;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = includeStyles ? 'output.html' : 'output-clean.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("HTML file downloaded successfully");
  };

  const loadSample = () => {
    setInputMarkdown(sampleMarkdown);
    toast.success("Sample Markdown content loaded");
  };

  const clearAll = () => {
    setInputMarkdown("");
    setOutputHtml("");
    setPreviewHtml("");
    toast.success("All content cleared");
  };

  const formatFileSize = (text: string) => {
    const size = new Blob([text]).size;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <ToolLayout
      toolId="markdown-to-html"
      categoryId="developer-tools"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Markdown to HTML Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="markdown-input">Markdown Input</Label>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleFileUpload}>
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                    <Button size="sm" variant="outline" onClick={loadSample}>
                      <FileText className="h-4 w-4 mr-1" />
                      Sample
                    </Button>
                    <Button size="sm" variant="outline" onClick={clearAll}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
                
                <Textarea
                  id="markdown-input"
                  placeholder="Enter your Markdown text here or upload a .md file..."
                  value={inputMarkdown}
                  onChange={(e) => setInputMarkdown(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".md,.markdown,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {inputMarkdown && (
                  <div className="text-sm text-muted-foreground">
                    Size: {formatFileSize(inputMarkdown)}
                  </div>
                )}
              </div>

              {/* Output Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="html-output">HTML Output</Label>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard} disabled={!outputHtml}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadHtml} disabled={!outputHtml}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <Textarea
                  id="html-output"
                  placeholder="HTML output will appear here..."
                  value={outputHtml}
                  readOnly
                  className="min-h-[400px] font-mono text-sm bg-muted/50"
                />
                
                {outputHtml && (
                  <div className="text-sm text-muted-foreground">
                    Size: {formatFileSize(outputHtml)}
                  </div>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-styles"
                    checked={includeStyles}
                    onCheckedChange={setIncludeStyles}
                  />
                  <Label htmlFor="include-styles">Include CSS styles</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-preview"
                    checked={showPreview}
                    onCheckedChange={setShowPreview}
                  />
                  <Label htmlFor="show-preview">Show preview</Label>
                </div>
              </div>
              
              <Button onClick={convertToHtml} disabled={!inputMarkdown.trim()}>
                <FileText className="h-4 w-4 mr-2" />
                Convert to HTML
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Preview */}
        {showPreview && outputHtml && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose dark:prose-invert max-w-none border rounded-lg p-6 bg-background min-h-[200px]"
                dangerouslySetInnerHTML={{ __html: outputHtml }}
              />
            </CardContent>
          </Card>
        )}

      </div>
    </ToolLayout>
  );
}