'use client'

import React, { useState, useRef } from 'react';
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScanText, Upload, Copy, Download, RefreshCw, Image as ImageIcon, FileText, Zap } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { toast } from 'sonner';

interface OcrResult {
  text: string;
  confidence: number;
  words: number;
  lines: number;
  processingTime: number;
}

const supportedLanguages = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fra', name: 'French' },
  { code: 'deu', name: 'German' },
  { code: 'ita', name: 'Italian' },
  { code: 'por', name: 'Portuguese' },
  { code: 'rus', name: 'Russian' },
  { code: 'jpn', name: 'Japanese' },
  { code: 'kor', name: 'Korean' },
  { code: 'chi_sim', name: 'Chinese (Simplified)' },
  { code: 'chi_tra', name: 'Chinese (Traditional)' },
  { code: 'ara', name: 'Arabic' },
  { code: 'hin', name: 'Hindi' },
];

export function OcrTextExtractorClient() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('eng');
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [processingMessage, setProcessingMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, BMP, or WebP)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Clear previous results
    setExtractedText('');
    setOcrResult(null);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const fakeEvent = {
        target: { files: [file] }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const performOCR = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessingMessage('Initializing OCR engine...');
    const startTime = Date.now();

    try {
      const worker = await createWorker(selectedLanguage, 1, {
        logger: (m) => {
          const progressMatch = m.progress * 100;
          setProgress(progressMatch);
          
          if (m.status === 'loading tesseract core') {
            setProcessingMessage('Loading Tesseract core...');
          } else if (m.status === 'initializing tesseract') {
            setProcessingMessage('Initializing Tesseract...');
          } else if (m.status === 'loading language traineddata') {
            setProcessingMessage(`Loading ${selectedLanguage.toUpperCase()} language data...`);
          } else if (m.status === 'initializing api') {
            setProcessingMessage('Initializing API...');
          } else if (m.status === 'recognizing text') {
            setProcessingMessage('Recognizing text...');
          }
        },
      });

      const { data } = await worker.recognize(selectedImage);
      await worker.terminate();
      
      const processingTime = (Date.now() - startTime) / 1000;
      const words = data.text.trim().split(/\s+/).filter(word => word.length > 0).length;
      const lines = data.text.split('\n').filter(line => line.trim().length > 0).length;

      const result: OcrResult = {
        text: data.text,
        confidence: data.confidence,
        words,
        lines,
        processingTime
      };

      setExtractedText(data.text);
      setOcrResult(result);
      
      if (data.text.trim()) {
        toast.success(`Text extracted successfully! Found ${words} words with ${result.confidence.toFixed(1)}% confidence`);
      } else {
        toast.error('No text found in the image. Try with a clearer image or different language.');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      toast.error('Failed to extract text. Please try again with a clearer image.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setProcessingMessage('');
    }
  };

  const copyToClipboard = async () => {
    if (!extractedText) {
      toast.error('No text to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(extractedText);
      toast.success('Text copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const downloadText = () => {
    if (!extractedText) {
      toast.error('No text to download');
      return;
    }

    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `extracted-text-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Text file downloaded');
  };

  const clearAll = () => {
    setSelectedImage(null);
    setImagePreview('');
    setExtractedText('');
    setOcrResult(null);
    setProgress(0);
    setProcessingMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Cleared all data');
  };

  return (
    <ToolLayout toolId="ocr-text-extractor" categoryId="text-utilities">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Image Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop your image here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports JPEG, PNG, GIF, BMP, WebP (max 10MB)
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {imagePreview && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <img
                      src={imagePreview}
                      alt="Selected image"
                      className="w-full max-h-64 object-contain border rounded-lg"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  OCR Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Language</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {supportedLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={performOCR}
                    disabled={!selectedImage || isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ScanText className="mr-2 h-4 w-4" />
                        Extract Text
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={clearAll}>
                    Clear
                  </Button>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} />
                    {processingMessage && (
                      <p className="text-xs text-muted-foreground">{processingMessage}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Extracted Text
                  </span>
                  {extractedText && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={copyToClipboard}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline" onClick={downloadText}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {extractedText ? (
                  <Textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Extracted text will appear here..."
                  />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <ScanText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>Upload an image and click "Extract Text" to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            {ocrResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Extraction Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{ocrResult.words}</div>
                      <div className="text-sm text-muted-foreground">Words Found</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{ocrResult.lines}</div>
                      <div className="text-sm text-muted-foreground">Lines</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {ocrResult.confidence.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Confidence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {ocrResult.processingTime.toFixed(1)}s
                      </div>
                      <div className="text-sm text-muted-foreground">Processing Time</div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <Badge variant={ocrResult.confidence > 80 ? "default" : ocrResult.confidence > 60 ? "secondary" : "destructive"}>
                      {ocrResult.confidence > 80 ? "High Quality" : ocrResult.confidence > 60 ? "Medium Quality" : "Low Quality"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}