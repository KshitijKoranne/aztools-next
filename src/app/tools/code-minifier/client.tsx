'use client'

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileCode, Copy, Minimize2, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function CodeMinifierClient() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [minified, setMinified] = useState("");
  const [savings, setSavings] = useState<number | null>(null);

  const minifyCode = () => {
    if (!code.trim()) {
      toast.error("Please enter code to minify");
      return;
    }

    try {
      let minifiedCode = code;
      
      if (language === "javascript") {
        minifiedCode = code
          .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '') // Remove comments
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .replace(/\s*([{}();,:=+\-*/])\s*/g, '$1') // Remove spaces around operators and punctuation
          .replace(/;}/g, '}') // Remove semicolons before closing braces
          .replace(/^\s+|\s+$/gm, '') // Trim lines
          .replace(/\n\s*\n/g, '\n') // Remove empty lines
          .trim();
      } else if (language === "css") {
        minifiedCode = code
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .replace(/\s*([{}:;,>+~])\s*/g, '$1') // Remove spaces around CSS syntax
          .replace(/;}/g, '}') // Remove semicolons before closing braces
          .replace(/^\s+|\s+$/gm, '') // Trim lines
          .trim();
      } else if (language === "html") {
        minifiedCode = code
          .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .replace(/>\s+</g, '><') // Remove spaces between tags
          .replace(/^\s+|\s+$/gm, '') // Trim lines
          .trim();
      } else if (language === "json") {
        try {
          const parsed = JSON.parse(code);
          minifiedCode = JSON.stringify(parsed);
        } catch {
          minifiedCode = code.replace(/\s+/g, ' ').trim();
        }
      }

      setMinified(minifiedCode);
      
      const originalSize = new Blob([code]).size;
      const minifiedSize = new Blob([minifiedCode]).size;
      const savedBytes = originalSize - minifiedSize;
      const savingsPercent = ((savedBytes / originalSize) * 100);
      
      setSavings(savingsPercent);
      
      toast.success(`Code minified successfully! Reduced by ${savingsPercent.toFixed(1)}%`);
    } catch (error) {
      toast.error("Failed to minify code");
    }
  };

  const copyToClipboard = () => {
    if (minified) {
      navigator.clipboard.writeText(minified);
      toast.success("Minified code copied to clipboard");
    }
  };

  const downloadMinified = () => {
    if (!minified) return;
    
    const fileExtensions: Record<string, string> = {
      javascript: 'js',
      css: 'css',
      html: 'html',
      json: 'json'
    };

    const blob = new Blob([minified], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `minified.${fileExtensions[language] || 'txt'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Minified code downloaded successfully");
  };

  const clearAll = () => {
    setCode("");
    setMinified("");
    setSavings(null);
  };

  const getLanguageIcon = () => {
    switch (language) {
      case 'javascript': return '🟨';
      case 'css': return '🔷';
      case 'html': return '🧡';
      case 'json': return '📄';
      default: return '📄';
    }
  };

  return (
    <ToolLayout toolId="code-minifier" categoryId="developer-tools">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Minimize2 className="h-5 w-5" />
              Code Minifier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Language:</span>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">
                    <span className="flex items-center gap-2">
                      🟨 JavaScript
                    </span>
                  </SelectItem>
                  <SelectItem value="css">
                    <span className="flex items-center gap-2">
                      🔷 CSS
                    </span>
                  </SelectItem>
                  <SelectItem value="html">
                    <span className="flex items-center gap-2">
                      🧡 HTML
                    </span>
                  </SelectItem>
                  <SelectItem value="json">
                    <span className="flex items-center gap-2">
                      📄 JSON
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder={`Paste your ${language.toUpperCase()} code here...`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />

            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {new Blob([code]).size} bytes
              </Badge>
              <Badge variant="outline">
                {code.split('\n').length} lines
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button onClick={minifyCode} disabled={!code.trim()} className="flex-1">
                <Minimize2 className="h-4 w-4 mr-2" />
                Minify Code
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Minified Code
              </div>
              {minified && (
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadMinified}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {minified ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {new Blob([minified]).size} bytes
                  </Badge>
                  {savings !== null && (
                    <Badge 
                      variant={savings > 0 ? "default" : "secondary"}
                      className={savings > 0 ? "bg-green-100 text-green-800" : ""}
                    >
                      {savings > 0 ? '-' : ''}{savings.toFixed(1)}% size
                    </Badge>
                  )}
                </div>

                <div className="rounded-lg border bg-muted/50 overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted border-b">
                    <span className="text-lg">{getLanguageIcon()}</span>
                    <span className="text-sm font-medium">{language.toUpperCase()}</span>
                  </div>
                  <Textarea
                    value={minified}
                    readOnly
                    className="min-h-[300px] font-mono text-sm border-0 bg-transparent resize-none focus:ring-0"
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No minified code yet</p>
                <p className="text-sm">
                  Enter your code and click "Minify Code" to see the compressed result
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </ToolLayout>
  );
}