'use client'

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JsonFormatterInput } from "@/components/json-formatter/JsonFormatterInput";
import { JsonFormatterActions } from "@/components/json-formatter/JsonFormatterActions";
import { JsonFormatterOutput } from "@/components/json-formatter/JsonFormatterOutput";
import { 
  showValidationErrorToast, 
  showProcessingErrorToast, 
  showCopySuccessToast, 
  showDownloadSuccessToast,
  showUploadSuccessToast,
  showInfoToast
} from "@/utils/toastMessages";
import { validateNotEmpty, validateJson as validateJsonFormat, validateFileSize, validateFileType } from "@/utils/validation";
import { Braces } from "lucide-react";

export function JsonFormatterClient() {
  const [inputJson, setInputJson] = useState("");
  const [outputJson, setOutputJson] = useState("");
  const [indentation, setIndentation] = useState("2");
  const [activeTab, setActiveTab] = useState("beautify");
  const [jsonError, setJsonError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    const sizeError = validateFileSize(file, 10);
    if (sizeError) {
      showValidationErrorToast(sizeError);
      return;
    }

    // Validate file type
    const typeError = validateFileType(file, ['application/json', 'text/plain']);
    if (typeError) {
      showValidationErrorToast(typeError);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputJson(content);
      showUploadSuccessToast(file.name);
    };
    reader.readAsText(file);
  };

  const beautifyJson = () => {
    // Validate input is not empty
    const emptyError = validateNotEmpty(inputJson, "JSON input");
    if (emptyError) {
      showValidationErrorToast(emptyError);
      return;
    }

    // Validate JSON format
    const jsonError = validateJsonFormat(inputJson);
    if (jsonError) {
      setJsonError(jsonError);
      showProcessingErrorToast(jsonError);
      return;
    }

    try {
      const parsedJson = JSON.parse(inputJson);
      const formattedJson = JSON.stringify(parsedJson, null, parseInt(indentation));
      setOutputJson(formattedJson);
      setJsonError("");
      showInfoToast("JSON formatted successfully");
    } catch (error) {
      setJsonError(`Invalid JSON: ${(error as Error).message}`);
      showProcessingErrorToast((error as Error).message);
    }
  };

  const minifyJson = () => {
    // Validate input is not empty
    const emptyError = validateNotEmpty(inputJson, "JSON input");
    if (emptyError) {
      showValidationErrorToast(emptyError);
      return;
    }

    // Validate JSON format
    const jsonError = validateJsonFormat(inputJson);
    if (jsonError) {
      setJsonError(jsonError);
      showProcessingErrorToast(jsonError);
      return;
    }

    try {
      const parsedJson = JSON.parse(inputJson);
      const minifiedJson = JSON.stringify(parsedJson);
      setOutputJson(minifiedJson);
      setJsonError("");
      showInfoToast("JSON minified successfully");
    } catch (error) {
      setJsonError(`Invalid JSON: ${(error as Error).message}`);
      showProcessingErrorToast((error as Error).message);
    }
  };

  const validateJsonInput = () => {
    // Validate input is not empty
    const emptyError = validateNotEmpty(inputJson, "JSON input");
    if (emptyError) {
      showValidationErrorToast(emptyError);
      return;
    }

    // Validate JSON format
    const jsonError = validateJsonFormat(inputJson);
    if (jsonError) {
      setJsonError(jsonError);
      setOutputJson(`Error: ${jsonError}`);
      showProcessingErrorToast(jsonError);
      return;
    }

    setJsonError("");
    setOutputJson("JSON is valid");
    showInfoToast("JSON validation successful");
  };

  const handleCopy = () => {
    if (!outputJson) {
      showValidationErrorToast("No output to copy");
      return;
    }
    navigator.clipboard.writeText(outputJson).then(() => {
      showCopySuccessToast();
    }).catch(() => {
      showProcessingErrorToast("Failed to copy to clipboard");
    });
  };

  const handleDownload = () => {
    if (!outputJson) {
      showValidationErrorToast("No output to download");
      return;
    }

    const blob = new Blob([outputJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showDownloadSuccessToast("formatted.json");
  };

  const handleAction = () => {
    switch (activeTab) {
      case "beautify":
        beautifyJson();
        break;
      case "minify":
        minifyJson();
        break;
      case "validate":
        validateJsonInput();
        break;
    }
  };

  return (
    <ToolLayout toolId="json-formatter" categoryId="developer-tools">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Braces className="h-5 w-5" />
              JSON Formatter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <JsonFormatterInput
              inputJson={inputJson}
              setInputJson={setInputJson}
              fileInputRef={fileInputRef}
              handleFileUpload={handleFileChange}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
                <TabsTrigger value="beautify">Beautify</TabsTrigger>
                <TabsTrigger value="minify">Minify</TabsTrigger>
                <TabsTrigger value="validate">Validate</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4 mt-4">
                <JsonFormatterActions
                  indentation={indentation}
                  setIndentation={setIndentation}
                  handleAction={handleAction}
                  activeTab={activeTab}
                />
              </TabsContent>
            </Tabs>

            <JsonFormatterOutput
              outputJson={outputJson}
              handleCopy={handleCopy}
              handleDownload={handleDownload}
            />
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}