'use client'

import React, { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Copy, FileDown, Code2, Settings, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ConversionOptions {
  interfaceName: string;
  makeOptional: boolean;
  useUnknown: boolean;
  sortKeys: boolean;
  includeDescription: boolean;
}

export function JsonToTypescriptClient() {
  const [jsonInput, setJsonInput] = useState('');
  const [typescriptOutput, setTypescriptOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ConversionOptions>({
    interfaceName: 'GeneratedInterface',
    makeOptional: false,
    useUnknown: false,
    sortKeys: true,
    includeDescription: true
  });

  const isValidJson = (str: string): boolean => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  const getTypeFromValue = (value: any, useUnknown: boolean): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    
    const type = typeof value;
    
    if (type === 'object') {
      if (Array.isArray(value)) {
        if (value.length === 0) return 'any[]';
        
        const elementTypes = [...new Set(value.map(item => getTypeFromValue(item, useUnknown)))];
        
        if (elementTypes.length === 1) {
          const elementType = elementTypes[0];
          return elementType.includes('{') ? `(${elementType})[]` : `${elementType}[]`;
        } else {
          return `(${elementTypes.join(' | ')})[]`;
        }
      }
      return generateInterfaceFromObject(value, '', useUnknown);
    }
    
    if (type === 'string') return 'string';
    if (type === 'number') return 'number';
    if (type === 'boolean') return 'boolean';
    
    return useUnknown ? 'unknown' : 'any';
  };

  const generateInterfaceFromObject = (obj: any, interfaceName: string, useUnknown: boolean): string => {
    const entries = Object.entries(obj);
    
    if (entries.length === 0) {
      return '{}';
    }
    
    const properties = entries.map(([key, value]) => {
      const type = getTypeFromValue(value, useUnknown);
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
      return `  ${safeKey}: ${type};`;
    });
    
    return `{\n${properties.join('\n')}\n}`;
  };

  const jsonToTypescriptInterface = useCallback((
    json: string, 
    options: ConversionOptions
  ): { typescript: string; error?: string } => {
    try {
      const parsed = JSON.parse(json);
      
      if (typeof parsed !== 'object' || parsed === null) {
        return { 
          typescript: '', 
          error: 'Input must be a JSON object or array' 
        };
      }
      
      let interfaceBody: string;
      let interfaceDeclaration: string;
      
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          interfaceDeclaration = `export type ${options.interfaceName} = any[];`;
        } else {
          const mergedObject = parsed.reduce((acc, item) => {
            if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
              return { ...acc, ...item };
            }
            return acc;
          }, {});
          
          if (Object.keys(mergedObject).length > 0) {
            interfaceBody = generateInterfaceFromObject(mergedObject, options.interfaceName, options.useUnknown);
            interfaceDeclaration = `export interface ${options.interfaceName} ${interfaceBody}`;
          } else {
            const elementType = getTypeFromValue(parsed[0], options.useUnknown);
            interfaceDeclaration = `export type ${options.interfaceName} = ${elementType}[];`;
          }
        }
      } else {
        const entries = Object.entries(parsed);
        
        if (options.sortKeys) {
          entries.sort(([a], [b]) => a.localeCompare(b));
        }
        
        const properties = entries.map(([key, value]) => {
          const type = getTypeFromValue(value, options.useUnknown);
          const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
          const optional = options.makeOptional ? '?' : '';
          return `  ${safeKey}${optional}: ${type};`;
        });
        
        interfaceBody = `{\n${properties.join('\n')}\n}`;
        interfaceDeclaration = `export interface ${options.interfaceName} ${interfaceBody}`;
      }
      
      let result = interfaceDeclaration || '';
      
      if (options.includeDescription) {
        const description = `/**\n * Generated TypeScript interface from JSON\n * @generated ${new Date().toISOString()}\n */\n`;
        result = description + result;
      }
      
      return { typescript: result };
      
    } catch (error) {
      return { 
        typescript: '', 
        error: error instanceof Error ? error.message : 'Invalid JSON format' 
      };
    }
  }, []);

  const handleConvert = useCallback(() => {
    if (!jsonInput.trim()) {
      setError('Please enter JSON data');
      setTypescriptOutput('');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      const result = jsonToTypescriptInterface(jsonInput, options);
      
      if (result.error) {
        setError(result.error);
        setTypescriptOutput('');
        toast.error(result.error);
      } else {
        setTypescriptOutput(result.typescript);
        setError('');
        toast.success("JSON converted to TypeScript interface successfully");
      }
      
      setIsLoading(false);
    }, 300);
  }, [jsonInput, options, jsonToTypescriptInterface]);

  const handleCopy = useCallback(async () => {
    if (!typescriptOutput) return;
    
    try {
      await navigator.clipboard.writeText(typescriptOutput);
      toast.success("TypeScript interface copied to clipboard");
    } catch {
      toast.error("Please copy manually");
    }
  }, [typescriptOutput]);

  const handleDownload = useCallback(() => {
    if (!typescriptOutput) return;
    
    const blob = new Blob([typescriptOutput], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${options.interfaceName}.ts`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`${options.interfaceName}.ts file downloaded successfully`);
  }, [typescriptOutput, options.interfaceName]);

  const handleExampleLoad = () => {
    const exampleJson = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      isActive: true,
      profile: {
        age: 30,
        avatar: "https://example.com/avatar.jpg",
        preferences: {
          theme: "dark",
          notifications: true
        }
      },
      tags: ["developer", "typescript", "react"],
      metadata: null
    };
    
    setJsonInput(JSON.stringify(exampleJson, null, 2));
    toast.success("Example JSON loaded");
  };

  const clearAll = () => {
    setJsonInput('');
    setTypescriptOutput('');
    setError('');
  };

  return (
    <ToolLayout toolId="json-to-typescript" categoryId="developer-tools">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  JSON to TypeScript Converter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={handleExampleLoad}
                    variant="outline"
                    size="sm"
                  >
                    Load Example
                  </Button>
                  <Button 
                    onClick={clearAll}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
                
                <div className="relative">
                  <Textarea
                    placeholder="Paste your JSON here..."
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                  {jsonInput && (
                    <div className="absolute top-2 right-2">
                      {isValidJson(jsonInput) ? (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Valid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Invalid
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md">
                    <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </p>
                  </div>
                )}
                
                <Button 
                  onClick={handleConvert}
                  disabled={!jsonInput.trim() || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Code2 className="h-4 w-4 mr-2" />
                      Convert to TypeScript
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Options Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Conversion Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="interface-name">Interface Name</Label>
                  <Input
                    id="interface-name"
                    value={options.interfaceName}
                    onChange={(e) => setOptions(prev => ({ ...prev, interfaceName: e.target.value }))}
                    placeholder="InterfaceName"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="make-optional"
                      checked={options.makeOptional}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, makeOptional: !!checked }))
                      }
                    />
                    <Label htmlFor="make-optional" className="text-sm">
                      Make properties optional
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="use-unknown"
                      checked={options.useUnknown}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, useUnknown: !!checked }))
                      }
                    />
                    <Label htmlFor="use-unknown" className="text-sm">
                      Use &apos;unknown&apos; instead of &apos;any&apos;
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sort-keys"
                      checked={options.sortKeys}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, sortKeys: !!checked }))
                      }
                    />
                    <Label htmlFor="sort-keys" className="text-sm">
                      Sort properties alphabetically
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-description"
                      checked={options.includeDescription}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, includeDescription: !!checked }))
                      }
                    />
                    <Label htmlFor="include-description" className="text-sm">
                      Include generated comment
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Output Section */}
        {typescriptOutput && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Generated TypeScript Interface</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCopy} variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button onClick={handleDownload} variant="outline" size="sm">
                    <FileDown className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted/50 overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 bg-muted border-b">
                  <Code2 className="h-4 w-4" />
                  <span className="text-sm font-medium">TypeScript Interface</span>
                  <Badge variant="secondary" className="ml-auto">
                    {options.interfaceName}.ts
                  </Badge>
                </div>
                <pre className="p-4 overflow-x-auto text-sm">
                  <code>{typescriptOutput}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!typescriptOutput && !isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <Code2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Convert JSON to TypeScript</h3>
              <p className="text-muted-foreground mb-4">
                Paste JSON data above and click convert to generate TypeScript interfaces
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Generates type-safe TypeScript interfaces</p>
                <p>• Handles nested objects and arrays</p>
                <p>• Customizable conversion options</p>
                <p>• Download as .ts file</p>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </ToolLayout>
  );
}