'use client'

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Copy, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Download,
  Palette,
  Settings
} from "lucide-react";
import { toast } from "sonner";

interface ExtractedColor {
  hex: string;
  name: string;
  count: number;
  percentage: number;
}

export function ColorExtractorClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [samplingFactor, setSamplingFactor] = useState([10]);
  const [maxColors, setMaxColors] = useState([12]);

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, WebP, BMP)");
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Please select a file smaller than 10MB");
      return;
    }

    setIsLoading(true);
    setExtractedColors([]);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target?.result) {
        setIsLoading(false);
        return;
      }
      
      setImageUrl(event.target.result as string);
      toast.success("Image uploaded successfully. Processing colors...");
    };
    
    reader.onerror = () => {
      toast.error("Failed to read the image file.");
      setIsLoading(false);
    };
    
    reader.readAsDataURL(file);
  };

  // Process the image and extract colors when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => {
        extractColors(img);
      };
      img.onerror = () => {
        toast.error("Failed to load the image.");
        setIsLoading(false);
      };
      img.src = imageUrl;
    }
  }, [imageUrl, samplingFactor, maxColors]);

  const extractColors = (img: HTMLImageElement) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      toast.error("Could not access canvas context.");
      setIsLoading(false);
      return;
    }
    
    // Set canvas size
    const maxDimension = 500;
    let width = img.width;
    let height = img.height;
    
    if (width > height && width > maxDimension) {
      height = (height / width) * maxDimension;
      width = maxDimension;
    } else if (height > maxDimension) {
      width = (width / height) * maxDimension;
      height = maxDimension;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Draw image on canvas
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    
    // Get pixel data with sampling to improve performance
    const colorMap: Record<string, number> = {};
    const step = Math.max(1, Math.floor(samplingFactor[0]));
    
    try {
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const pixelData = ctx.getImageData(x, y, 1, 1).data;
          // Skip fully transparent pixels
          if (pixelData[3] === 0) continue;
          
          // Convert to hex
          const hex = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
          colorMap[hex] = (colorMap[hex] || 0) + 1;
        }
      }
      
      const totalPixels = Object.values(colorMap).reduce((sum, count) => sum + count, 0);
      
      // Sort colors by frequency and limit to maxColors
      const sortedColors = Object.entries(colorMap)
        .map(([hex, count], index) => ({ 
          hex, 
          count,
          percentage: (count / totalPixels) * 100,
          name: `Color ${index + 1}`
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, maxColors[0]);
      
      setExtractedColors(sortedColors);
      setIsLoading(false);
      
      if (sortedColors.length > 0) {
        toast.success(`Found ${sortedColors.length} dominant colors in the image!`);
      } else {
        toast.error("Could not extract colors from this image.");
      }
    } catch (error) {
      console.error("Error extracting colors:", error);
      toast.error("Failed to extract colors from the image.");
      setIsLoading(false);
    }
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color).then(() => {
      toast.success(`${color} copied to clipboard!`);
    });
  };

  const copyAllColors = () => {
    const colorsText = extractedColors.map(color => `${color.name}: ${color.hex} (${color.percentage.toFixed(1)}%)`).join('\n');
    navigator.clipboard.writeText(colorsText).then(() => {
      toast.success("All extracted colors copied to clipboard!");
    });
  };

  const clearImage = () => {
    setImageUrl(null);
    setExtractedColors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsLoading(false);
    toast.success("Image cleared!");
  };

  const saveColorPalette = () => {
    try {
      // Create a canvas to render the palette
      const paletteCanvas = document.createElement('canvas');
      const ctx = paletteCanvas.getContext('2d');
      if (!ctx) return;

      const colorCount = extractedColors.length;
      const width = 400;
      const height = 80;
      const colorWidth = width / colorCount;

      paletteCanvas.width = width;
      paletteCanvas.height = height;

      // Draw colors
      extractedColors.forEach((color, index) => {
        ctx.fillStyle = color.hex;
        ctx.fillRect(index * colorWidth, 0, colorWidth, height);
      });

      // Convert to blob and download
      paletteCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'color-palette.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success("Color palette saved as PNG!");
        }
      });
    } catch (error) {
      toast.error("Failed to save color palette.");
    }
  };

  return (
    <ToolLayout toolId="color-extractor" categoryId="color-tools">
      <div className="space-y-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Image Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              {!imageUrl ? (
                <div className="space-y-4">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">Upload an image to extract colors</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supports JPEG, PNG, GIF, WebP, and BMP files (max 10MB)
                    </p>
                  </div>
                  <Button onClick={openFileInput} className="gap-2">
                    <Upload className="h-4 w-4" />
                    Choose Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <img 
                    src={imageUrl} 
                    alt="Uploaded" 
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                  />
                  <div className="flex gap-2 justify-center">
                    <Button onClick={openFileInput} variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Image
                    </Button>
                    <Button onClick={clearImage} variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Settings */}
        {imageUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Extraction Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Sampling Factor: {samplingFactor[0]}px</Label>
                  <Slider
                    value={samplingFactor}
                    onValueChange={setSamplingFactor}
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower values = more precise, higher values = faster processing
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Max Colors: {maxColors[0]}</Label>
                  <Slider
                    value={maxColors}
                    onValueChange={setMaxColors}
                    max={24}
                    min={4}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of colors to extract
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Extracting colors from image...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {extractedColors.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Extracted Colors ({extractedColors.length})
                </CardTitle>
                <div className="flex gap-2">
                  <Button onClick={saveColorPalette} size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Save Palette
                  </Button>
                  <Button onClick={copyAllColors} size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {extractedColors.map((color, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div 
                      className="h-20 w-full"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-medium">{color.hex}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyColor(color.hex)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {color.percentage.toFixed(1)}% coverage
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {color.count.toLocaleString()} pixels
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hidden canvas for processing */}
        <canvas 
          ref={canvasRef} 
          style={{ display: 'none' }}
        />
      </div>
    </ToolLayout>
  );
}