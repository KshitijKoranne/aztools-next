'use client'

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Upload, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type ColorBlindnessType = 
  | "normal" 
  | "protanopia" 
  | "deuteranopia" 
  | "tritanopia" 
  | "achromatopsia";

const colorBlindnessTypes = [
  { 
    id: "normal", 
    name: "Normal Vision",
    description: "Full color vision with no color blindness",
    prevalence: "Most people"
  },
  { 
    id: "protanopia", 
    name: "Protanopia",
    description: "Red-blind - difficulty distinguishing red from green",
    prevalence: "1% of males"
  },
  { 
    id: "deuteranopia", 
    name: "Deuteranopia", 
    description: "Green-blind - difficulty distinguishing red from green",
    prevalence: "1% of males"
  },
  { 
    id: "tritanopia", 
    name: "Tritanopia",
    description: "Blue-blind - difficulty distinguishing blue from yellow",
    prevalence: "0.003% of people"
  },
  { 
    id: "achromatopsia", 
    name: "Achromatopsia",
    description: "Complete color blindness - sees only in grayscale",
    prevalence: "0.003% of people"
  }
];

// Color transformation matrices for different types of color blindness
const filters = {
  normal: [
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 1, 0
  ],
  protanopia: [
    0.567, 0.433, 0, 0, 0,
    0.558, 0.442, 0, 0, 0,
    0, 0.242, 0.758, 0, 0,
    0, 0, 0, 1, 0
  ],
  deuteranopia: [
    0.625, 0.375, 0, 0, 0,
    0.7, 0.3, 0, 0, 0,
    0, 0.3, 0.7, 0, 0,
    0, 0, 0, 1, 0
  ],
  tritanopia: [
    0.95, 0.05, 0, 0, 0,
    0, 0.433, 0.567, 0, 0,
    0, 0.475, 0.525, 0, 0,
    0, 0, 0, 1, 0
  ],
  achromatopsia: [
    0.299, 0.587, 0.114, 0, 0,
    0.299, 0.587, 0.114, 0, 0,
    0.299, 0.587, 0.114, 0, 0,
    0, 0, 0, 1, 0
  ]
};

export function ColorBlindnessSimulatorClient() {
  const [image, setImage] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<ColorBlindnessType>("normal");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast.error("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Please select a file smaller than 10MB");
      return;
    }
    
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
        toast.success("Image uploaded successfully!");
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      toast.error("Failed to load image");
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };
  
  const applyFilter = (type: ColorBlindnessType) => {
    if (!canvasRef.current || !image) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      // Calculate dimensions to fit in container while maintaining aspect ratio
      const maxWidth = 600;
      const maxHeight = 400;
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      
      // Draw original image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Apply color filter
      if (type !== 'normal') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const matrix = filters[type];
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Apply transformation matrix
          data[i] = Math.min(255, Math.max(0, r * matrix[0] + g * matrix[1] + b * matrix[2] + matrix[3] * 255 + matrix[4]));
          data[i + 1] = Math.min(255, Math.max(0, r * matrix[5] + g * matrix[6] + b * matrix[7] + matrix[8] * 255 + matrix[9]));
          data[i + 2] = Math.min(255, Math.max(0, r * matrix[10] + g * matrix[11] + b * matrix[12] + matrix[13] * 255 + matrix[14]));
        }
        
        ctx.putImageData(imageData, 0, 0);
      }
    };
    img.onerror = () => {
      toast.error("Failed to process image");
    };
    img.src = image;
  };
  
  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `color-blindness-${activeType}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Image downloaded successfully!");
      }
    }, 'image/png');
  };
  
  const handleReset = () => {
    setImage(null);
    setActiveType("normal");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Simulator reset!");
  };
  
  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  useEffect(() => {
    if (image) {
      applyFilter(activeType);
    }
  }, [image, activeType]);
  
  return (
    <ToolLayout toolId="color-blindness-simulator" categoryId="color-tools">
      <div className="space-y-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              {image ? "Original Image" : "Image Upload"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!image ? (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <div className="space-y-4">
                  <Eye className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">Upload an image to simulate color blindness</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      See how your images appear to people with different types of color vision
                    </p>
                  </div>
                  <Button onClick={openFileInput} className="gap-2" disabled={isProcessing}>
                    <Upload className="h-4 w-4" />
                    {isProcessing ? "Processing..." : "Choose Image"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img 
                    src={image} 
                    alt="Original" 
                    className="max-w-full max-h-64 rounded-lg border shadow-lg"
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={openFileInput} variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Image
                  </Button>
                  <Button onClick={handleReset} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button onClick={handleDownload} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Vision Type Selector */}
        {image && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Vision Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeType} onValueChange={(value) => setActiveType(value as ColorBlindnessType)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                  {colorBlindnessTypes.map((type) => (
                    <TabsTrigger key={type.id} value={type.id} className="text-xs sm:text-sm">
                      {type.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {colorBlindnessTypes.map((type) => (
                  <TabsContent key={type.id} value={type.id} className="mt-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold mb-2">{type.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{type.description}</p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Prevalence:</strong> {type.prevalence}
                      </p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Simulation Results */}
        {image && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Simulation Result - {colorBlindnessTypes.find(t => t.id === activeType)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="border border-border rounded-lg shadow-lg max-w-full"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  This is how someone with {colorBlindnessTypes.find(t => t.id === activeType)?.name.toLowerCase()} would see your image.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </ToolLayout>
  );
}