'use client'

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Copy, RefreshCw, Code, Minimize2, Paintbrush } from "lucide-react";
import { toast } from "sonner";

export function CssFormatterClient() {
  const [inputCss, setInputCss] = useState("");
  const [outputCss, setOutputCss] = useState("");
  const [indentation, setIndentation] = useState("2");
  const [formatMode, setFormatMode] = useState<"beautify" | "minify">("beautify");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.css') && file.type !== 'text/css') {
      toast.error("Please select a CSS file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputCss(content);
      toast.success(`${file.name} loaded successfully`);
    };
    reader.readAsText(file);
  };

  const beautifyCss = () => {
    if (!inputCss.trim()) {
      toast.error("Please enter CSS code to beautify");
      return;
    }

    try {
      const indentStr = ' '.repeat(parseInt(indentation));
      let beautified = inputCss
        .replace(/\s+/g, ' ')
        .replace(/;\s*/g, ';\n' + indentStr)
        .replace(/{\s*/g, ' {\n' + indentStr)
        .replace(/}\s*/g, '\n}\n\n')
        .replace(/,\s*/g, ',\n')
        .replace(/([^{]+){/g, (match, selector) => {
          return selector.trim() + ' {';
        })
        .split('\n')
        .map(line => {
          const trimmed = line.trim();
          if (!trimmed) return '';
          
          if (trimmed.endsWith('{')) {
            return trimmed;
          } else if (trimmed === '}') {
            return trimmed;
          } else if (trimmed.includes(':') && trimmed.endsWith(';')) {
            return indentStr + trimmed;
          } else {
            return trimmed;
          }
        })
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      setOutputCss(beautified);
      setFormatMode("beautify");
      
      toast.success("CSS code beautified successfully");
    } catch (error) {
      toast.error("Failed to beautify CSS");
    }
  };

  const minifyCss = () => {
    if (!inputCss.trim()) {
      toast.error("Please enter CSS code to minify");
      return;
    }

    try {
      const minified = inputCss
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Remove extra whitespace
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*,\s*/g, ',')
        .replace(/\s*>\s*/g, '>')
        .replace(/\s*\+\s*/g, '+')
        .replace(/\s*~\s*/g, '~')
        .replace(/;}/g, '}') // Remove trailing semicolon before }
        .trim();

      setOutputCss(minified);
      setFormatMode("minify");
      
      const originalSize = new Blob([inputCss]).size;
      const minifiedSize = new Blob([minified]).size;
      const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
      
      toast.success(`CSS minified successfully. Reduced by ${savings}%`);
    } catch (error) {
      toast.error("Failed to minify CSS");
    }
  };

  const copyToClipboard = () => {
    if (!outputCss) {
      toast.error("Nothing to copy. Please format CSS first.");
      return;
    }

    navigator.clipboard.writeText(outputCss);
    toast.success("CSS copied to clipboard");
  };

  const downloadCss = () => {
    if (!outputCss) {
      toast.error("Nothing to download. Please format CSS first.");
      return;
    }

    const blob = new Blob([outputCss], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formatMode === 'beautify' ? 'beautified' : 'minified'}.css`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("CSS file downloaded successfully");
  };

  const clearAll = () => {
    setInputCss("");
    setOutputCss("");
  };

  const loadSample = () => {
    const sampleCss = `/* Sample CSS - Messy formatting */
body{margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;color:#333;}
.container{max-width:1200px;margin:0 auto;padding:20px;}
.header{background:#333;color:white;padding:1rem;text-align:center;}
.nav ul{list-style:none;padding:0;display:flex;justify-content:center;}
.nav li{margin:0 15px;}
.nav a{color:white;text-decoration:none;font-weight:bold;}
.nav a:hover{color:#ccc;}
.content{background:white;margin:20px 0;padding:30px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);}
.footer{text-align:center;padding:20px;background:#333;color:white;margin-top:40px;}
@media (max-width:768px){.container{padding:10px;}.content{margin:10px 0;padding:15px;}}`;

    setInputCss(sampleCss);
    setOutputCss("");
    toast.success("Sample CSS loaded");
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <ToolLayout toolId="css-formatter" categoryId="developer-tools">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Paintbrush className="h-5 w-5" />
              CSS Formatter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>CSS Input</Label>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleFileUpload}>
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
                <Button size="sm" variant="outline" onClick={loadSample}>
                  Load Sample
                </Button>
              </div>
            </div>
            
            <Textarea
              placeholder="Enter your CSS code here or upload a CSS file..."
              value={inputCss}
              onChange={(e) => setInputCss(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".css,text/css"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="flex items-center gap-2">
              {inputCss && (
                <>
                  <Badge variant="secondary">
                    {formatFileSize(new Blob([inputCss]).size)}
                  </Badge>
                  <Badge variant="outline">
                    {inputCss.split('\n').length} lines
                  </Badge>
                </>
              )}
            </div>

            {/* Format Options */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center gap-4">
                <Label>Indentation:</Label>
                <Select value={indentation} onValueChange={setIndentation}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">spaces</span>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={beautifyCss} 
                  disabled={!inputCss.trim()}
                  className="flex-1"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Beautify
                </Button>
                <Button 
                  onClick={minifyCss} 
                  disabled={!inputCss.trim()} 
                  variant="secondary"
                  className="flex-1"
                >
                  <Minimize2 className="h-4 w-4 mr-2" />
                  Minify
                </Button>
              </div>

              <Button variant="outline" onClick={clearAll} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                Formatted CSS
                {formatMode && (
                  <Badge variant={formatMode === 'beautify' ? 'default' : 'secondary'}>
                    {formatMode === 'beautify' ? 'Beautified' : 'Minified'}
                  </Badge>
                )}
              </div>
              {outputCss && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadCss}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {outputCss ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {formatFileSize(new Blob([outputCss]).size)}
                  </Badge>
                  <Badge variant="outline">
                    {outputCss.split('\n').length} lines
                  </Badge>
                  {inputCss && (
                    <Badge 
                      variant="outline"
                      className={
                        formatMode === 'minify' 
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }
                    >
                      {formatMode === 'minify' ? '-' : ''}
                      {(((new Blob([inputCss]).size - new Blob([outputCss]).size) / new Blob([inputCss]).size) * 100).toFixed(1)}%
                      {formatMode === 'minify' ? ' smaller' : ' change'}
                    </Badge>
                  )}
                </div>
                
                <div className="rounded-lg border bg-muted/50 overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted border-b">
                    <Code className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {formatMode === 'beautify' ? 'Beautified' : 'Minified'} CSS
                    </span>
                  </div>
                  <Textarea
                    value={outputCss}
                    readOnly
                    className="min-h-[300px] font-mono text-sm border-0 bg-transparent resize-none focus:ring-0"
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Paintbrush className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No formatted CSS yet</p>
                <p className="text-sm">
                  Enter CSS code and click "Beautify" or "Minify" to format it
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </ToolLayout>
  );
}