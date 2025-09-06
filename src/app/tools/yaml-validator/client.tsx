'use client'

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCode, Copy, CheckCircle, AlertCircle, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";
import yaml from "js-yaml";

interface ValidationResult {
  isValid: boolean;
  message: string;
  formatted?: string;
  error?: string;
}

export function YamlValidatorClient() {
  const [yamlInput, setYamlInput] = useState("");
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const validateYaml = () => {
    if (!yamlInput.trim()) {
      toast.error("Please enter YAML content to validate");
      return;
    }

    try {
      const parsed = yaml.load(yamlInput);
      const formatted = yaml.dump(parsed, { 
        indent: 2,
        lineWidth: 80,
        noRefs: true 
      });
      
      setValidationResult({
        isValid: true,
        message: "Valid YAML",
        formatted
      });
      
      toast.success("YAML is valid and formatted successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid YAML";
      setValidationResult({
        isValid: false,
        message: "Invalid YAML",
        error: errorMessage
      });
      
      toast.error("Invalid YAML format detected");
    }
  };

  const copyToClipboard = () => {
    if (validationResult?.formatted) {
      navigator.clipboard.writeText(validationResult.formatted);
      toast.success("Formatted YAML copied to clipboard");
    } else if (validationResult?.error) {
      navigator.clipboard.writeText(validationResult.error);
      toast.success("Error message copied to clipboard");
    }
  };

  const downloadYaml = () => {
    if (!validationResult?.formatted) return;
    
    const blob = new Blob([validationResult.formatted], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted.yaml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("YAML file downloaded successfully");
  };

  const clearAll = () => {
    setYamlInput("");
    setValidationResult(null);
  };

  const loadSample = () => {
    const sampleYaml = `# Sample YAML Configuration
app:
  name: MyApplication
  version: "1.0.0"
  description: A sample application configuration
  
database:
  host: localhost
  port: 5432
  username: admin
  password: secret
  ssl: true
  
features:
  - authentication
  - logging
  - monitoring
  
environments:
  development:
    debug: true
    log_level: debug
  production:
    debug: false
    log_level: error
    
settings:
  max_connections: 100
  timeout: 30
  retry_attempts: 3`;

    setYamlInput(sampleYaml);
    setValidationResult(null);
    toast.success("Sample YAML loaded");
  };

  return (
    <ToolLayout toolId="yaml-validator" categoryId="developer-tools">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              YAML Validator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your YAML content here..."
              value={yamlInput}
              onChange={(e) => setYamlInput(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />

            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {yamlInput.split('\n').length} lines
              </Badge>
              <Badge variant="outline">
                {new Blob([yamlInput]).size} bytes
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={validateYaml} 
                disabled={!yamlInput.trim()}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Validate YAML
              </Button>
              <Button variant="outline" onClick={loadSample}>
                Load Sample
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                Validation Result
                {validationResult && (
                  validationResult.isValid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )
                )}
              </div>
              {validationResult && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  {validationResult.formatted && (
                    <Button size="sm" variant="outline" onClick={downloadYaml}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {validationResult ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border ${
                  validationResult.isValid 
                    ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-400' 
                    : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-400'
                }`}>
                  <div className="flex items-center gap-2 font-medium">
                    {validationResult.isValid ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    {validationResult.message}
                  </div>
                </div>

                {validationResult.error && (
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Error Details:</h4>
                    <code className="text-sm text-red-600 dark:text-red-400">
                      {validationResult.error}
                    </code>
                  </div>
                )}

                {validationResult.formatted && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Formatted YAML:</h4>
                      <Badge variant="secondary">
                        {validationResult.formatted.split('\n').length} lines
                      </Badge>
                    </div>
                    <div className="rounded-lg border bg-muted/50 overflow-hidden">
                      <Textarea
                        value={validationResult.formatted}
                        readOnly
                        className="min-h-[300px] font-mono text-sm border-0 bg-transparent resize-none focus:ring-0"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No validation result yet</p>
                <p className="text-sm">
                  Enter YAML content and click "Validate YAML" to check syntax and format
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </ToolLayout>
  );
}