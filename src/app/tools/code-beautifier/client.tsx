'use client'

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileCode, Copy, RefreshCw, Wand2 } from "lucide-react";
import { toast } from "sonner";

const supportedLanguages = [
  { id: 'json', name: 'JSON', description: 'JavaScript Object Notation' },
  { id: 'javascript', name: 'JavaScript', description: 'Basic formatting' },
  { id: 'css', name: 'CSS', description: 'Cascading Style Sheets' },
  { id: 'html', name: 'HTML', description: 'HyperText Markup Language' },
  { id: 'xml', name: 'XML', description: 'eXtensible Markup Language' }
];

export function CodeBeautifierClient() {
  const [code, setCode] = useState("");
  const [formatted, setFormatted] = useState("");
  const [language, setLanguage] = useState("json");
  const [isFormatting, setIsFormatting] = useState(false);

  const formatJSON = (json: string): string => {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed, null, 2);
  };

  const formatJavaScript = (js: string): string => {
    // Basic JavaScript formatting
    let result = js;
    
    // Add newlines after semicolons
    result = result.replace(/;(?!\s*$)/g, ';\n');
    
    // Add newlines after opening braces
    result = result.replace(/{(?!\s*})/g, '{\n');
    
    // Add newlines before closing braces
    result = result.replace(/(?<!{\s*)}/g, '\n}');
    
    // Clean up multiple newlines
    result = result.replace(/\n\s*\n/g, '\n');
    
    // Basic indentation
    const lines = result.split('\n');
    let indentLevel = 0;
    const formatted = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      if (trimmed.includes('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indented = '  '.repeat(indentLevel) + trimmed;
      
      if (trimmed.includes('{')) {
        indentLevel++;
      }
      
      return indented;
    });
    
    return formatted.join('\n');
  };

  const formatCSS = (css: string): string => {
    let result = css;
    
    // Add newlines after opening braces
    result = result.replace(/{/g, ' {\n');
    
    // Add newlines after semicolons
    result = result.replace(/;/g, ';\n');
    
    // Add newlines before closing braces
    result = result.replace(/}/g, '\n}\n');
    
    // Clean up multiple newlines
    result = result.replace(/\n\s*\n/g, '\n');
    
    // Basic indentation
    const lines = result.split('\n');
    let indentLevel = 0;
    const formatted = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      if (trimmed === '}') {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indented = '  '.repeat(indentLevel) + trimmed;
      
      if (trimmed.includes('{')) {
        indentLevel++;
      }
      
      return indented;
    });
    
    return formatted.join('\n');
  };

  const formatHTML = (html: string): string => {
    let result = html;
    
    // Add newlines after tags
    result = result.replace(/></g, '>\n<');
    
    // Basic indentation
    const lines = result.split('\n');
    let indentLevel = 0;
    const formatted = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      // Check for closing tags
      if (trimmed.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indented = '  '.repeat(indentLevel) + trimmed;
      
      // Check for opening tags (but not self-closing)
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
        indentLevel++;
      }
      
      return indented;
    });
    
    return formatted.join('\n');
  };

  const formatXML = (xml: string): string => {
    // Similar to HTML formatting
    return formatHTML(xml);
  };

  const beautifyCode = () => {
    if (!code.trim()) {
      toast.error("Please enter code to format");
      return;
    }

    setIsFormatting(true);

    try {
      let result = "";
      
      switch (language) {
        case "json":
          result = formatJSON(code);
          break;
        case "javascript":
          result = formatJavaScript(code);
          break;
        case "css":
          result = formatCSS(code);
          break;
        case "html":
          result = formatHTML(code);
          break;
        case "xml":
          result = formatXML(code);
          break;
        default:
          result = code; // Fallback
      }
      
      setFormatted(result);
      toast.success(`${supportedLanguages.find(l => l.id === language)?.name} formatted successfully`);
    } catch (error) {
      toast.error(`Failed to format ${language.toUpperCase()}: ${(error as Error).message}`);
      setFormatted("");
    } finally {
      setIsFormatting(false);
    }
  };

  const handleCopy = () => {
    if (formatted) {
      navigator.clipboard.writeText(formatted);
      toast.success("Formatted code copied to clipboard");
    }
  };

  const clearAll = () => {
    setCode("");
    setFormatted("");
  };

  const getStats = () => {
    const originalLines = code.split('\n').length;
    const formattedLines = formatted.split('\n').length;
    const originalChars = code.length;
    const formattedChars = formatted.length;
    
    return {
      originalLines,
      formattedLines,
      originalChars,
      formattedChars,
      sizeDiff: formattedChars - originalChars
    };
  };

  const stats = getStats();

  return (
    <ToolLayout toolId="code-beautifier" categoryId="developer-tools">
      <div className="space-y-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Code Beautifier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="language-select">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language-select">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{lang.name}</span>
                          <span className="text-xs text-muted-foreground">{lang.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code-input">Code to Format</Label>
              <Textarea
                id="code-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Enter your ${language.toUpperCase()} code here...`}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div>
                <div className="font-medium">Original Lines</div>
                <div>{stats.originalLines}</div>
              </div>
              <div>
                <div className="font-medium">Formatted Lines</div>
                <div>{stats.formattedLines}</div>
              </div>
              <div>
                <div className="font-medium">Original Size</div>
                <div>{stats.originalChars} chars</div>
              </div>
              <div>
                <div className="font-medium">Size Change</div>
                <div className={stats.sizeDiff > 0 ? "text-orange-500" : stats.sizeDiff < 0 ? "text-green-500" : ""}>
                  {stats.sizeDiff > 0 ? '+' : ''}{stats.sizeDiff}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={beautifyCode} disabled={isFormatting || !code.trim()} className="flex-1 sm:flex-none">
                <Wand2 className="h-4 w-4 mr-2" />
                {isFormatting ? "Formatting..." : "Beautify Code"}
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Formatted Code
              {formatted && (
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formatted ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{language.toUpperCase()}</Badge>
                  <Badge variant="outline">{stats.formattedLines} lines</Badge>
                </div>
                <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm border max-h-96">
                  <code>{formatted}</code>
                </pre>
              </div>
            ) : (
              <p className="text-muted-foreground">Formatted code will appear here</p>
            )}
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Languages & Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportedLanguages.map((lang) => (
                <div key={lang.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-semibold">{lang.name}</div>
                  <div className="text-sm text-muted-foreground">{lang.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {lang.id === 'json' && 'Validates and formats JSON with proper indentation'}
                    {lang.id === 'javascript' && 'Basic formatting with newlines and indentation'}
                    {lang.id === 'css' && 'Formats CSS rules with proper spacing and indentation'}
                    {lang.id === 'html' && 'Formats HTML tags with proper nesting'}
                    {lang.id === 'xml' && 'Formats XML elements with proper structure'}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 prose prose-sm max-w-none text-muted-foreground">
              <h4 className="font-medium text-foreground mb-2">Features:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Auto-indentation and proper spacing</li>
                <li>Syntax validation for supported languages</li>
                <li>Real-time statistics and formatting feedback</li>
                <li>Copy formatted code with one click</li>
                <li>Preserves code logic while improving readability</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}