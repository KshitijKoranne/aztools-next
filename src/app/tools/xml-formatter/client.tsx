"use client"

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, RefreshCw, FileCode, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const XmlFormatter = () => {
  const [xmlInput, setXmlInput] = useState("");
  const [formattedXml, setFormattedXml] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");
  const [indentSize, setIndentSize] = useState(2);
  const [sortAttributes, setSortAttributes] = useState(false);
  const { toast } = useToast();

  const formatXml = (xml: string, indent: number = 2, sortAttrs: boolean = false): string => {
    try {
      // Remove extra whitespace
      xml = xml.replace(/>\s*</g, '><');
      
      let formatted = '';
      let level = 0;
      const tab = ' '.repeat(indent);
      
      // Simple XML formatter
      let i = 0;
      while (i < xml.length) {
        if (xml[i] === '<') {
          // Find the end of the tag
          let tagEnd = xml.indexOf('>', i);
          if (tagEnd === -1) break;
          
          let tag = xml.substring(i, tagEnd + 1);
          
          // Check if it's a closing tag
          if (tag.startsWith('</')) {
            level--;
            formatted += tab.repeat(Math.max(0, level)) + tag + '\n';
          }
          // Check if it's a self-closing tag
          else if (tag.endsWith('/>')) {
            formatted += tab.repeat(level) + tag + '\n';
          }
          // Opening tag
          else {
            formatted += tab.repeat(level) + tag + '\n';
            level++;
          }
          
          i = tagEnd + 1;
        } else {
          // Handle text content
          let textEnd = xml.indexOf('<', i);
          if (textEnd === -1) textEnd = xml.length;
          
          let text = xml.substring(i, textEnd).trim();
          if (text) {
            formatted += tab.repeat(level) + text + '\n';
          }
          
          i = textEnd;
        }
      }
      
      return formatted.trim();
    } catch (error) {
      throw new Error('Failed to format XML');
    }
  };

  const validateXml = (xml: string): { isValid: boolean, error?: string } => {
    try {
      // Basic XML validation
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');
      
      // Check for parsing errors
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        return {
          isValid: false,
          error: parserError.textContent || 'XML parsing error'
        };
      }
      
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'XML validation failed'
      };
    }
  };

  const handleFormat = () => {
    if (!xmlInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter XML content to format",
        variant: "destructive"
      });
      return;
    }

    try {
      // Validate first
      const validation = validateXml(xmlInput);
      setIsValid(validation.isValid);
      
      if (!validation.isValid) {
        setError(validation.error || 'Invalid XML');
        setFormattedXml('');
        toast({
          title: "Invalid XML",
          description: validation.error || 'Please check your XML syntax',
          variant: "destructive"
        });
        return;
      }

      setError('');
      
      // Format the XML
      const formatted = formatXml(xmlInput, indentSize, sortAttributes);
      setFormattedXml(formatted);
      
      toast({
        title: "Success",
        description: "XML formatted successfully"
      });
    } catch (error) {
      setIsValid(false);
      setError(error instanceof Error ? error.message : 'Formatting failed');
      toast({
        title: "Error",
        description: "Failed to format XML",
        variant: "destructive"
      });
    }
  };

  const handleMinify = () => {
    if (!xmlInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter XML content to minify",
        variant: "destructive"
      });
      return;
    }

    try {
      // Validate first
      const validation = validateXml(xmlInput);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid XML');
        toast({
          title: "Invalid XML",
          description: validation.error || 'Please check your XML syntax',
          variant: "destructive"
        });
        return;
      }

      // Minify by removing unnecessary whitespace
      const minified = xmlInput
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim();
      
      setFormattedXml(minified);
      setIsValid(true);
      setError('');
      
      toast({
        title: "Success",
        description: "XML minified successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to minify XML",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = () => {
    if (formattedXml) {
      navigator.clipboard.writeText(formattedXml);
      toast({
        title: "Copied!",
        description: "Formatted XML copied to clipboard"
      });
    }
  };

  const clearAll = () => {
    setXmlInput("");
    setFormattedXml("");
    setIsValid(null);
    setError("");
  };

  const loadSample = () => {
    const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
<book id="1">
<title>The Great Gatsby</title>
<author>F. Scott Fitzgerald</author>
<year>1925</year>
<price currency="USD">12.99</price>
</book>
<book id="2">
<title>To Kill a Mockingbird</title>
<author>Harper Lee</author>
<year>1960</year>
<price currency="USD">14.99</price>
</book>
</catalog>`;
    setXmlInput(sampleXml);
  };

  return (
    <ToolLayout
      toolId="xml-formatter"
      categoryId="developer-tools"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              XML Formatter & Validator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Indent Size</Label>
                <div className="flex gap-2">
                  {[2, 4, 8].map(size => (
                    <Button
                      key={size}
                      variant={indentSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIndentSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="sortAttributes"
                  checked={sortAttributes}
                  onCheckedChange={setSortAttributes}
                />
                <Label htmlFor="sortAttributes">Sort Attributes</Label>
              </div>

              <div className="flex items-end gap-2">
                <Button variant="outline" onClick={loadSample} size="sm">
                  Load Sample
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleFormat} className="flex-1">
                Format XML
              </Button>
              <Button onClick={handleMinify} variant="outline">
                Minify
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>XML Input</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your XML content here..."
                value={xmlInput}
                onChange={(e) => setXmlInput(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  Formatted XML
                  {isValid !== null && (
                    isValid ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )
                  )}
                </div>
                {formattedXml && (
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-red-800">Validation Error</div>
                      <div className="text-sm text-red-700 mt-1">{error}</div>
                    </div>
                  </div>
                </div>
              ) : formattedXml ? (
                <Textarea
                  value={formattedXml}
                  readOnly
                  className="min-h-[400px] font-mono text-sm"
                />
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  <div className="text-center">
                    <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Formatted XML will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </ToolLayout>
  );
};

export default XmlFormatter;
