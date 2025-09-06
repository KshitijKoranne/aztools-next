'use client'

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RefreshCw, Palette, Pipette } from "lucide-react";
import { toast } from "sonner";

export function ColorConverterClient() {
  const [hex, setHex] = useState("#3498db");
  const [rgb, setRgb] = useState("52, 152, 219");
  const [hsl, setHsl] = useState("204, 70%, 53%");
  const [activeTab, setActiveTab] = useState("hex-to-rgb");

  // Validation functions
  const isValidHex = (hex: string) => /^#?([0-9A-F]{3}){1,2}$/i.test(hex);

  const isValidRgb = (rgb: string) => {
    const parts = rgb.split(",").map(part => parseInt(part.trim(), 10));
    return parts.length === 3 && parts.every(part => !isNaN(part) && part >= 0 && part <= 255);
  };

  const isValidHsl = (hsl: string) => {
    const parts = hsl.split(",").map(part => parseFloat(part.trim().replace('%', '')));
    return parts.length === 3 && 
           !isNaN(parts[0]) && parts[0] >= 0 && parts[0] <= 360 &&
           !isNaN(parts[1]) && parts[1] >= 0 && parts[1] <= 100 &&
           !isNaN(parts[2]) && parts[2] >= 0 && parts[2] <= 100;
  };

  // Conversion functions
  const hexToRgb = (hex: string) => {
    hex = hex.replace(/^#/, '');
    
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  };

  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex);
    return rgbToHsl(rgb);
  };

  const rgbToHex = (rgb: string) => {
    const [r, g, b] = rgb.split(',').map(n => parseInt(n.trim(), 10));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  };

  const rgbToHsl = (rgb: string) => {
    let [r, g, b] = rgb.split(',').map(n => parseInt(n.trim(), 10));
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h}, ${s}%, ${l}%`;
  };

  const hslToRgb = (hsl: string) => {
    let [h, s, l] = hsl.split(',').map(n => parseFloat(n.trim().replace('%', '')));
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`;
  };

  const hslToHex = (hsl: string) => {
    const rgb = hslToRgb(hsl);
    return rgbToHex(rgb);
  };

  const handleConvert = () => {
    try {
      if (activeTab === "hex-to-rgb") {
        if (!isValidHex(hex)) {
          toast.error("Please enter a valid HEX color code (e.g., #3498db)");
          return;
        }
        const normalizedHex = hex.startsWith('#') ? hex : `#${hex}`;
        setHex(normalizedHex);
        setRgb(hexToRgb(normalizedHex));
        setHsl(hexToHsl(normalizedHex));
      } else if (activeTab === "rgb-to-hex") {
        if (!isValidRgb(rgb)) {
          toast.error("Please enter valid RGB values (e.g., 52, 152, 219)");
          return;
        }
        setHex(rgbToHex(rgb));
        setHsl(rgbToHsl(rgb));
      } else if (activeTab === "hsl-to-hex") {
        if (!isValidHsl(hsl)) {
          toast.error("Please enter valid HSL values (e.g., 204, 70%, 53%)");
          return;
        }
        setRgb(hslToRgb(hsl));
        setHex(hslToHex(hsl));
      }

      toast.success("Color converted successfully!");
    } catch (error) {
      toast.error("Conversion failed. Please check your input values.");
    }
  };

  const copyToClipboard = (value: string, format: string) => {
    navigator.clipboard.writeText(value).then(() => {
      toast.success(`${format} color code copied to clipboard!`);
    });
  };

  const generateRandomColor = () => {
    const randomHex = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
    setHex(randomHex);
    setRgb(hexToRgb(randomHex));
    setHsl(hexToHsl(randomHex));
    toast.success("Random color generated!");
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const colorValue = e.target.value;
    setHex(colorValue);
    setRgb(hexToRgb(colorValue));
    setHsl(hexToHsl(colorValue));
  };

  // Get current color for preview
  const getCurrentColor = () => {
    try {
      if (isValidHex(hex)) return hex;
      if (isValidRgb(rgb)) return rgbToHex(rgb);
      if (isValidHsl(hsl)) return hslToHex(hsl);
      return "#3498db";
    } catch {
      return "#3498db";
    }
  };

  return (
    <ToolLayout toolId="color-converter" categoryId="color-tools">
      <div className="space-y-6">
        {/* Color Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div 
                className="w-32 h-32 rounded-lg border border-border shadow-inner"
                style={{ backgroundColor: getCurrentColor() }}
              ></div>
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={getCurrentColor()}
                    onChange={handleColorPickerChange}
                    className="w-12 h-12 rounded-md border border-border cursor-pointer"
                  />
                  <Label>Color Picker</Label>
                </div>
                <Button onClick={generateRandomColor} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Random Color
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Converter */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="hex-to-rgb" className="text-xs sm:text-sm">HEX → RGB/HSL</TabsTrigger>
                <TabsTrigger value="rgb-to-hex" className="text-xs sm:text-sm">RGB → HEX/HSL</TabsTrigger>
                <TabsTrigger value="hsl-to-hex" className="text-xs sm:text-sm">HSL → HEX/RGB</TabsTrigger>
              </TabsList>

              <TabsContent value="hex-to-rgb" className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hex-input">HEX Color Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="hex-input"
                      value={hex}
                      onChange={(e) => setHex(e.target.value)}
                      placeholder="#3498db"
                      className="font-mono"
                    />
                    <Button onClick={() => copyToClipboard(hex, "HEX")} variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button onClick={handleConvert} className="w-full">
                  <Pipette className="mr-2 h-4 w-4" />
                  Convert to RGB & HSL
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>RGB</Label>
                    <div className="flex gap-2">
                      <Input value={rgb} readOnly className="font-mono bg-muted" />
                      <Button onClick={() => copyToClipboard(rgb, "RGB")} variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>HSL</Label>
                    <div className="flex gap-2">
                      <Input value={hsl} readOnly className="font-mono bg-muted" />
                      <Button onClick={() => copyToClipboard(hsl, "HSL")} variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rgb-to-hex" className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rgb-input">RGB Values</Label>
                  <div className="flex gap-2">
                    <Input
                      id="rgb-input"
                      value={rgb}
                      onChange={(e) => setRgb(e.target.value)}
                      placeholder="52, 152, 219"
                      className="font-mono"
                    />
                    <Button onClick={() => copyToClipboard(rgb, "RGB")} variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button onClick={handleConvert} className="w-full">
                  <Pipette className="mr-2 h-4 w-4" />
                  Convert to HEX & HSL
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>HEX</Label>
                    <div className="flex gap-2">
                      <Input value={hex} readOnly className="font-mono bg-muted" />
                      <Button onClick={() => copyToClipboard(hex, "HEX")} variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>HSL</Label>
                    <div className="flex gap-2">
                      <Input value={hsl} readOnly className="font-mono bg-muted" />
                      <Button onClick={() => copyToClipboard(hsl, "HSL")} variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hsl-to-hex" className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hsl-input">HSL Values</Label>
                  <div className="flex gap-2">
                    <Input
                      id="hsl-input"
                      value={hsl}
                      onChange={(e) => setHsl(e.target.value)}
                      placeholder="204, 70%, 53%"
                      className="font-mono"
                    />
                    <Button onClick={() => copyToClipboard(hsl, "HSL")} variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button onClick={handleConvert} className="w-full">
                  <Pipette className="mr-2 h-4 w-4" />
                  Convert to HEX & RGB
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>HEX</Label>
                    <div className="flex gap-2">
                      <Input value={hex} readOnly className="font-mono bg-muted" />
                      <Button onClick={() => copyToClipboard(hex, "HEX")} variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>RGB</Label>
                    <div className="flex gap-2">
                      <Input value={rgb} readOnly className="font-mono bg-muted" />
                      <Button onClick={() => copyToClipboard(rgb, "RGB")} variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}