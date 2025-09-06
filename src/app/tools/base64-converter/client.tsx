
"use client"

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RefreshCw, UploadCloud, FileDown, Trash, File, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const Base64Converter = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [textInput, setTextInput] = useState("");
  const [base64Output, setBase64Output] = useState("");
  const [encodedInput, setEncodedInput] = useState("");
  const [decodedOutput, setDecodedOutput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState("");
  const [urlSafe, setUrlSafe] = useState(true);
  const [showLineBreaks, setShowLineBreaks] = useState(false);
  const [filename, setFilename] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [fileSize, setFileSize] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const encodeText = () => {
    try {
      if (!textInput.trim()) {
        toast({
          title: "Error",
          description: "Please enter some text to encode",
          variant: "destructive",
        });
        return;
      }
      
      let encoded = btoa(textInput);
      
      if (urlSafe) {
        encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
      
      if (showLineBreaks) {
        encoded = encoded.match(/.{1,76}/g)?.join('\n') || encoded;
      }
      
      setBase64Output(encoded);
      
      toast({
        title: "Text Encoded",
        description: "Text successfully converted to Base64",
      });
    } catch (error) {
      toast({
        title: "Encoding Error",
        description: "Failed to encode text. Make sure it contains valid characters.",
        variant: "destructive",
      });
    }
  };

  const decodeBase64 = () => {
    try {
      if (!encodedInput.trim()) {
        toast({
          title: "Error",
          description: "Please enter Base64 text to decode",
          variant: "destructive",
        });
        return;
      }
      
      let normalized = encodedInput.replace(/-/g, '+').replace(/_/g, '/');
      
      normalized = normalized.replace(/\r?\n|\r/g, '');
      
      while (normalized.length % 4) {
        normalized += '=';
      }
      
      const decoded = atob(normalized);
      setDecodedOutput(decoded);
      
      toast({
        title: "Base64 Decoded",
        description: "Base64 successfully decoded to text",
      });
    } catch (error) {
      toast({
        title: "Decoding Error",
        description: "Failed to decode. Make sure the input is valid Base64.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setFilename(file.name);
      setMimeType(file.type || "application/octet-stream");
      setFileSize(file.size);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64 = event.target.result.toString().split(',')[1];
          setFileBase64(base64);
          
          toast({
            title: "File Loaded",
            description: `${file.name} (${formatFileSize(file.size)}) ready to convert`,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const downloadDecodedFile = () => {
    try {
      if (!fileBase64) {
        toast({
          title: "Error",
          description: "No file data to download",
          variant: "destructive",
        });
        return;
      }
      
      const byteCharacters = atob(fileBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "File Downloaded",
        description: `${filename} downloaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Download Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${description} copied to clipboard.`,
    });
  };

  const clearFileData = () => {
    setSelectedFile(null);
    setFileBase64("");
    setFilename("");
    setMimeType("");
    setFileSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <ToolLayout toolId="base64-converter" categoryId="developer-tools">
      <div className="max-w-3xl mx-auto">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "text" | "file")} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="text">Text Conversion</TabsTrigger>
            <TabsTrigger value="file">File Conversion</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-8 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text-input">Text to Encode</Label>
                  <Textarea
                    id="text-input"
                    placeholder="Enter plain text to encode to Base64..."
                    className="min-h-[150px] font-mono"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="url-safe" 
                      checked={urlSafe} 
                      onCheckedChange={(checked) => setUrlSafe(checked as boolean)} 
                    />
                    <Label htmlFor="url-safe" className="cursor-pointer">
                      URL-safe encoding (replace + with -, / with _, remove padding)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="line-breaks" 
                      checked={showLineBreaks} 
                      onCheckedChange={(checked) => setShowLineBreaks(checked as boolean)} 
                    />
                    <Label htmlFor="line-breaks" className="cursor-pointer">
                      Add line breaks (76 chars per line)
                    </Label>
                  </div>
                </div>
                
                <Button onClick={encodeText} className="w-full gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Encode to Base64
                </Button>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="base64-output">Base64 Result</Label>
                    {base64Output && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard(base64Output, "Base64 encoded text")}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id="base64-output"
                    placeholder="Encoded Base64 will appear here..."
                    className="min-h-[150px] font-mono"
                    value={base64Output}
                    readOnly
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base64-input">Base64 to Decode</Label>
                  <Textarea
                    id="base64-input"
                    placeholder="Enter Base64 text to decode..."
                    className="min-h-[150px] font-mono"
                    value={encodedInput}
                    onChange={(e) => setEncodedInput(e.target.value)}
                  />
                </div>
                
                <Button onClick={decodeBase64} className="w-full gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Decode from Base64
                </Button>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="decoded-output">Decoded Result</Label>
                    {decodedOutput && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard(decodedOutput, "Decoded text")}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id="decoded-output"
                    placeholder="Decoded text will appear here..."
                    className="min-h-[150px] font-mono"
                    value={decodedOutput}
                    readOnly
                  />
                </div>
              </div>
            </div>
            
          </TabsContent>
          
          <TabsContent value="file" className="space-y-6 mt-6">
            <div className="space-y-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelect} 
              />
              
              {!selectedFile ? (
                <div 
                  className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={triggerFileInput}
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium mb-1">Select a file to encode</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Any file type, up to 5MB recommended
                  </p>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <File className="h-4 w-4" />
                    Browse Files
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{filename}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {mimeType} • {fileSize ? formatFileSize(fileSize) : "Unknown size"}
                        </p>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={clearFileData}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="file-base64">Base64 Encoded File</Label>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(fileBase64, "Base64 encoded file")}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Base64
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      id="file-base64"
                      className="min-h-[200px] font-mono text-xs"
                      value={fileBase64}
                      readOnly
                    />
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <Button 
                      variant="default" 
                      className="gap-2"
                      onClick={downloadDecodedFile}
                    >
                      <FileDown className="h-4 w-4" />
                      Download File
                    </Button>
                    
                    <div className="text-sm text-muted-foreground bg-muted p-4 rounded-md">
                      <h3 className="font-medium mb-2">Data URI Format</h3>
                      <p className="font-mono text-xs break-all">
                        data:{mimeType};base64,{fileBase64.substring(0, 50)}...
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => copyToClipboard(
                          `data:${mimeType};base64,${fileBase64}`,
                          "Data URI"
                        )}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Data URI
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default Base64Converter;
