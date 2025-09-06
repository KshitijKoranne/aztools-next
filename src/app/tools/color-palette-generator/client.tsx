'use client'

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RefreshCw, ChevronRight, ChevronLeft, Palette } from "lucide-react";
import { toast } from "sonner";

interface ColorItem {
  hex: string;
  name: string;
}

export function ColorPaletteGeneratorClient() {
  const [baseColor, setBaseColor] = useState("#3498db");
  const [paletteType, setPaletteType] = useState<"monochromatic" | "analogous" | "complementary" | "triadic" | "tetradic">("monochromatic");
  const [colorCount, setColorCount] = useState(5);
  const [palette, setPalette] = useState<ColorItem[]>([]);

  const isValidHex = (hex: string) => /^#?([0-9A-F]{3}){1,2}$/i.test(hex);

  const hexToHsl = (hex: string): [number, number, number] => {
    hex = hex.replace(/^#/, '');
    
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

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

    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h: number, s: number, l: number): string => {
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

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  };

  const generateMonochromaticPalette = (baseHsl: [number, number, number], count: number): ColorItem[] => {
    const [h, s, l] = baseHsl;
    const step = 100 / (count + 1);
    return Array.from({ length: count }, (_, i) => {
      const lightness = Math.min(Math.max(step * (i + 1), 10), 90);
      return {
        hex: hslToHex(h, s, lightness),
        name: `Shade ${i + 1}`
      };
    });
  };

  const generateAnalogousPalette = (baseHsl: [number, number, number], count: number): ColorItem[] => {
    const [h, s, l] = baseHsl;
    const step = 30 / Math.floor(count / 2);
    
    return Array.from({ length: count }, (_, i) => {
      const hue = (h + step * (i - Math.floor(count / 2))) % 360;
      return {
        hex: hslToHex(hue < 0 ? hue + 360 : hue, s, l),
        name: `Analogous ${i + 1}`
      };
    });
  };

  const generateComplementaryPalette = (baseHsl: [number, number, number], count: number): ColorItem[] => {
    const [h, s, l] = baseHsl;
    const complement = (h + 180) % 360;
    
    const result: ColorItem[] = [
      { hex: hslToHex(h, s, l), name: "Base" },
      { hex: hslToHex(complement, s, l), name: "Complement" }
    ];
    
    if (count > 2) {
      for (let i = 2; i < count; i++) {
        const isBaseVariation = i % 2 === 0;
        const baseH = isBaseVariation ? h : complement;
        const lightness = l + (isBaseVariation ? 15 : -15);
        result.push({
          hex: hslToHex(baseH, s, Math.min(Math.max(lightness, 10), 90)),
          name: `${isBaseVariation ? "Base" : "Complement"} Variation ${Math.floor(i/2) + 1}`
        });
      }
    }
    
    return result;
  };

  const generateTriadicPalette = (baseHsl: [number, number, number], count: number): ColorItem[] => {
    const [h, s, l] = baseHsl;
    const secondHue = (h + 120) % 360;
    const thirdHue = (h + 240) % 360;
    
    const baseColors = [
      { hex: hslToHex(h, s, l), name: "Primary" },
      { hex: hslToHex(secondHue, s, l), name: "Secondary" },
      { hex: hslToHex(thirdHue, s, l), name: "Tertiary" }
    ];
    
    if (count <= 3) return baseColors.slice(0, count);
    
    const result = [...baseColors];
    
    for (let i = 3; i < count; i++) {
      const baseIndex = i % 3;
      const baseH = baseIndex === 0 ? h : baseIndex === 1 ? secondHue : thirdHue;
      const saturation = Math.min(Math.max(s - 10, 0), 100);
      const lightness = Math.min(Math.max(l + 10, 0), 100);
      
      result.push({
        hex: hslToHex(baseH, saturation, lightness),
        name: `${baseIndex === 0 ? "Primary" : baseIndex === 1 ? "Secondary" : "Tertiary"} Variation ${Math.floor(i/3) + 1}`
      });
    }
    
    return result;
  };

  const generateTetradicPalette = (baseHsl: [number, number, number], count: number): ColorItem[] => {
    const [h, s, l] = baseHsl;
    const secondHue = (h + 90) % 360;
    const thirdHue = (h + 180) % 360;
    const fourthHue = (h + 270) % 360;
    
    const baseColors = [
      { hex: hslToHex(h, s, l), name: "First" },
      { hex: hslToHex(secondHue, s, l), name: "Second" },
      { hex: hslToHex(thirdHue, s, l), name: "Third" },
      { hex: hslToHex(fourthHue, s, l), name: "Fourth" }
    ];
    
    if (count <= 4) return baseColors.slice(0, count);
    
    const result = [...baseColors];
    
    for (let i = 4; i < count; i++) {
      const baseIndex = i % 4;
      const baseH = baseIndex === 0 ? h : baseIndex === 1 ? secondHue : baseIndex === 2 ? thirdHue : fourthHue;
      const variation = Math.floor(i / 4);
      const lightness = Math.min(Math.max(l + (variation * 10), 10), 90);
      
      result.push({
        hex: hslToHex(baseH, s, lightness),
        name: `${baseColors[baseIndex].name} Variation ${variation + 1}`
      });
    }
    
    return result;
  };

  const generatePalette = () => {
    try {
      if (!isValidHex(baseColor)) {
        toast.error("Please enter a valid HEX color code (e.g., #3498db)");
        return;
      }
      
      const normalizedHex = baseColor.startsWith('#') ? baseColor : `#${baseColor}`;
      setBaseColor(normalizedHex);
      
      const baseHsl = hexToHsl(normalizedHex);
      let newPalette: ColorItem[] = [];
      
      switch (paletteType) {
        case "monochromatic":
          newPalette = generateMonochromaticPalette(baseHsl, colorCount);
          break;
        case "analogous":
          newPalette = generateAnalogousPalette(baseHsl, colorCount);
          break;
        case "complementary":
          newPalette = generateComplementaryPalette(baseHsl, colorCount);
          break;
        case "triadic":
          newPalette = generateTriadicPalette(baseHsl, colorCount);
          break;
        case "tetradic":
          newPalette = generateTetradicPalette(baseHsl, colorCount);
          break;
      }
      
      setPalette(newPalette);
      toast.success(`Created a ${paletteType} color palette with ${newPalette.length} colors!`);
    } catch (error) {
      toast.error("Failed to generate color palette. Please check your input.");
    }
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color).then(() => {
      toast.success(`${color} copied to clipboard!`);
    });
  };

  const copyPalette = () => {
    const paletteText = palette.map(color => `${color.name}: ${color.hex}`).join('\n');
    navigator.clipboard.writeText(paletteText).then(() => {
      toast.success("Full color palette copied to clipboard!");
    });
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseColor(e.target.value);
  };

  return (
    <ToolLayout toolId="color-palette-generator" categoryId="color-tools">
      <div className="space-y-6">
        {/* Base Color Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Base Color
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="base-color">HEX Color Code</Label>
              <div className="flex gap-2">
                <Input
                  id="base-color"
                  placeholder="#3498db"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="flex-1 font-mono"
                />
                <input
                  type="color"
                  value={baseColor}
                  onChange={handleColorPickerChange}
                  className="w-12 h-10 rounded-md border border-border cursor-pointer"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Palette Configuration */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={paletteType} onValueChange={(v) => setPaletteType(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                <TabsTrigger value="monochromatic" className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">Monochromatic</span>
                  <span className="sm:hidden">Mono</span>
                </TabsTrigger>
                <TabsTrigger value="analogous" className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">Analogous</span>
                  <span className="sm:hidden">Analog</span>
                </TabsTrigger>
                <TabsTrigger value="complementary" className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">Complementary</span>
                  <span className="sm:hidden">Comp</span>
                </TabsTrigger>
                <TabsTrigger value="triadic" className="text-xs sm:text-sm">Triadic</TabsTrigger>
                <TabsTrigger value="tetradic" className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">Tetradic</span>
                  <span className="sm:hidden">Tetra</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="monochromatic" className="p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Uses various shades and tints of a single hue, creating a harmonious and sophisticated palette.
                </p>
              </TabsContent>
              
              <TabsContent value="analogous" className="p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Uses colors that are adjacent on the color wheel, creating pleasing and comfortable designs.
                </p>
              </TabsContent>
              
              <TabsContent value="complementary" className="p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Uses colors opposite each other on the color wheel, creating high contrast and vibrant looks.
                </p>
              </TabsContent>
              
              <TabsContent value="triadic" className="p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Uses three colors equally spaced around the color wheel, offering strong visual contrast while retaining harmony.
                </p>
              </TabsContent>
              
              <TabsContent value="tetradic" className="p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Uses four colors arranged into two complementary pairs, offering plenty of possibilities for variation.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Color Count Selection */}
        <Card>
          <CardContent className="space-y-4 p-4">
            <div className="space-y-2">
              <Label>Number of Colors: {colorCount}</Label>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setColorCount(Math.max(colorCount - 1, 2))}
                  disabled={colorCount <= 2}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex flex-wrap gap-1 flex-1 justify-center">
                  {[2, 3, 4, 5, 6, 7, 8].map(num => (
                    <Button
                      key={num}
                      variant={colorCount === num ? "default" : "outline"}
                      size="sm"
                      onClick={() => setColorCount(num)}
                      className="w-10 h-10"
                    >
                      {num}
                    </Button>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setColorCount(Math.min(colorCount + 1, 8))}
                  disabled={colorCount >= 8}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button onClick={generatePalette} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate {paletteType.charAt(0).toUpperCase() + paletteType.slice(1)} Palette
            </Button>
          </CardContent>
        </Card>

        {/* Generated Palette */}
        {palette.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Generated Palette</CardTitle>
                <Button size="sm" variant="outline" onClick={copyPalette}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {palette.map((color, index) => (
                  <div key={index} className="space-y-2">
                    <div 
                      className="h-24 rounded-lg border border-border shadow-inner flex items-end p-3"
                      style={{ backgroundColor: color.hex }}
                    >
                      <span className="text-xs font-mono px-2 py-1 rounded bg-white/90 text-black backdrop-blur-sm border">
                        {color.hex}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{color.name}</span>
                      <Button 
                        size="sm"
                        variant="ghost" 
                        onClick={() => copyColor(color.hex)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}