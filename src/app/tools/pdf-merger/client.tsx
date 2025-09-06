'use client'

import { useState } from 'react';
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Upload, Download, Trash, ArrowUp, ArrowDown, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
// @ts-ignore - pdf-merger-js doesn't have TypeScript definitions
import PDFMerger from "pdf-merger-js";

interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function PdfMerger() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdf, setMergedPdf] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  
  // Merge options
  const [includeBookmarks, setIncludeBookmarks] = useState(true);
  const [optimizeOutput, setOptimizeOutput] = useState(true);
  const [addMetadata, setAddMetadata] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const newFiles: PdfFile[] = selectedFiles.map(file => {
      // Validate file type
      if (file.type !== "application/pdf") {
        toast.error(`${file.name} is not a PDF file`);
        return null;
      }

      // Validate file size (50MB limit for client-side processing)
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 50MB. Please use smaller files for optimal browser performance.`);
        return null;
      }

      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size
      };
    }).filter((file): file is PdfFile => file !== null);

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      setMergedPdf(null);
      setMetadata(null);
      
      toast.success(`${newFiles.length} PDF file(s) added successfully`);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleMoveFile = (id: string, direction: "up" | "down") => {
    setFiles(prev => {
      const index = prev.findIndex(file => file.id === id);
      if (index === -1) return prev;

      const newFiles = [...prev];
      const newIndex = direction === "up" ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= newFiles.length) return prev;

      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      return newFiles;
    });
  };

  const handleMerge = async () => {
    if (files.length === 0) {
      toast.error("Please select PDF files to merge");
      return;
    }

    if (files.length < 2) {
      toast.error("Please select at least 2 PDF files to merge");
      return;
    }

    setIsProcessing(true);

    try {
      // Create new PDF merger instance
      const merger = new PDFMerger();
      
      let totalPages = 0;
      const sourceFiles = [];

      // Process each file
      for (const fileInfo of files) {
        try {
          // Convert file to array buffer
          const arrayBuffer = await fileInfo.file.arrayBuffer();
          
          // Add to merger
          await merger.add(arrayBuffer);
          
          // Count pages for metadata (approximate)
          const uint8Array = new Uint8Array(arrayBuffer);
          const pageMatches = new TextDecoder().decode(uint8Array).match(/\/Type\s*\/Page\b/g);
          const pageCount = pageMatches ? pageMatches.length : 1;
          
          totalPages += pageCount;
          sourceFiles.push({
            name: fileInfo.name,
            pages: pageCount
          });
          
        } catch (fileError) {
          console.error(`Error processing ${fileInfo.name}:`, fileError);
          toast.error(`Failed to process ${fileInfo.name}. Please ensure it's a valid PDF.`);
          setIsProcessing(false);
          return;
        }
      }

      // Save merged PDF as buffer
      const mergedPdfBuffer = await merger.saveAsBuffer();
      
      // Create blob and data URL
      const blob = new Blob([mergedPdfBuffer], { type: 'application/pdf' });
      const pdfDataUrl = URL.createObjectURL(blob);
      
      setMergedPdf(pdfDataUrl);
      setMetadata({
        total_pages: totalPages,
        input_files_count: files.length,
        output_size: mergedPdfBuffer.byteLength,
        source_files: sourceFiles
      });

      toast.success(`${files.length} PDF files merged successfully with ${totalPages} total pages`);

    } catch (error) {
      console.error('Error merging PDFs:', error);
      toast.error(error instanceof Error ? error.message : "Failed to merge PDF files. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setFiles([]);
    setMergedPdf(null);
    setMetadata(null);
  };

  const downloadPdf = () => {
    if (mergedPdf) {
      const link = document.createElement('a');
      link.href = mergedPdf;
      link.download = `merged_${files.length}_files.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Merged PDF downloaded successfully");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ToolLayout toolId="pdf-merger" categoryId="pdf-tools">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              PDF Merger
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-input rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">
                    {files.length > 0 ? `${files.length} files selected` : "Click to upload PDF files"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select multiple PDF files to merge (up to 50MB each, processed in your browser)
                  </p>
                </div>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Files to Merge ({files.length})</h3>
                  <Button variant="outline" size="sm" onClick={handleClear}>
                    <Trash className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>

                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {index + 1}
                        </span>
                        <FileText className="h-4 w-4 text-red-600" />
                        <div>
                          <div className="text-sm font-medium">{file.name}</div>
                          <div className="text-xs text-muted-foreground">{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveFile(file.id, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveFile(file.id, "down")}
                          disabled={index === files.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(file.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="bookmarks"
                      checked={includeBookmarks}
                      onCheckedChange={setIncludeBookmarks}
                    />
                    <Label htmlFor="bookmarks" className="text-sm">Add bookmarks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="optimize"
                      checked={optimizeOutput}
                      onCheckedChange={setOptimizeOutput}
                    />
                    <Label htmlFor="optimize" className="text-sm">Optimize output</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="metadata"
                      checked={addMetadata}
                      onCheckedChange={setAddMetadata}
                    />
                    <Label htmlFor="metadata" className="text-sm">Include metadata</Label>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button 
                    onClick={handleMerge} 
                    disabled={files.length < 2 || isProcessing}
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Merging PDFs...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Merge {files.length} PDFs
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {mergedPdf && metadata && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Merged PDF Ready</span>
                <Button onClick={downloadPdf}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium">Total Pages</div>
                  <div className="text-muted-foreground">{metadata.total_pages}</div>
                </div>
                <div>
                  <div className="font-medium">Files Merged</div>
                  <div className="text-muted-foreground">{metadata.input_files_count}</div>
                </div>
                <div>
                  <div className="font-medium">Output Size</div>
                  <div className="text-muted-foreground">{formatFileSize(metadata.output_size)}</div>
                </div>
                <div>
                  <div className="font-medium">Compression</div>
                  <div className="text-muted-foreground">
                    {metadata.compression_ratio > 0 ? `${metadata.compression_ratio}% smaller` : 'No compression'}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Source Files:</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {metadata.source_files.map((file: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span>{file.name}</span>
                      <span>{file.pages} pages</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </ToolLayout>
  );
}