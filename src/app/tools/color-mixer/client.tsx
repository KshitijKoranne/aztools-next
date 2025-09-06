'use client'

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Copy, Palette, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function ColorMixerClient() {
  const [color1, setColor1] = useState("#ff0000");
  const [color2, setColor2] = useState("#0000ff");
  const [ratio, setRatio] = useState([50]);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("").toUpperCase();
  };

  const mixColors = () => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const mixRatio = ratio[0] / 100;
    
    const mixed = {
      r: rgb1.r * (1 - mixRatio) + rgb2.r * mixRatio,
      g: rgb1.g * (1 - mixRatio) + rgb2.g * mixRatio,
      b: rgb1.b * (1 - mixRatio) + rgb2.b * mixRatio
    };
    
    return {
      hex: rgbToHex(mixed.r, mixed.g, mixed.b),
      rgb: `${Math.round(mixed.r)}, ${Math.round(mixed.g)}, ${Math.round(mixed.b)}`,
      rgbObj: { r: Math.round(mixed.r), g: Math.round(mixed.g), b: Math.round(mixed.b) }
    };
  };

  const mixedResult = mixColors();

  const copyColor = (value: string, format: string) => {
    navigator.clipboard.writeText(value).then(() => {
      toast.success(`${format} color copied to clipboard!`);
    });
  };

  const swapColors = () => {
    const temp = color1;
    setColor1(color2);
    setColor2(temp);
    toast.success("Colors swapped!");
  };

  const resetColors = () => {
    setColor1("#ff0000");
    setColor2("#0000ff");
    setRatio([50]);
    toast.success("Colors reset to default!");
  };

  const isValidHex = (hex: string) => /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);

  const handleColorChange = (setter: (color: string) => void, value: string) => {
    if (value.startsWith('#')) {
      setter(value);
    } else {
      setter(`#${value}`);
    }
  };

  return (
    <ToolLayout toolId="color-mixer" categoryId="color-tools">
      <div className="space-y-6">
        {/* Color Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Source Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Color 1</Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="w-16 h-10 rounded-md border border-border cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={color1}
                    onChange={(e) => handleColorChange(setColor1, e.target.value)}
                    className="flex-1 font-mono"
                    placeholder="#ff0000"
                  />
                </div>
                <div 
                  className="w-full h-12 rounded-lg border border-border"
                  style={{ backgroundColor: isValidHex(color1) ? color1 : '#ff0000' }}
                />
              </div>

              <div className="space-y-3">
                <Label>Color 2</Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="w-16 h-10 rounded-md border border-border cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={color2}
                    onChange={(e) => handleColorChange(setColor2, e.target.value)}
                    className="flex-1 font-mono"
                    placeholder="#0000ff"
                  />
                </div>
                <div 
                  className="w-full h-12 rounded-lg border border-border"
                  style={{ backgroundColor: isValidHex(color2) ? color2 : '#0000ff' }}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={swapColors} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Swap
                </Button>
                <Button onClick={resetColors} variant="outline" size="sm">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mixed Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="w-full h-32 rounded-lg border border-border shadow-inner"
                style={{ backgroundColor: mixedResult.hex }}
              />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">HEX</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{mixedResult.hex}</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyColor(mixedResult.hex, 'HEX')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">RGB</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">rgb({mixedResult.rgb})</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyColor(`rgb(${mixedResult.rgb})`, 'RGB')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mixing Ratio Control */}
        <Card>
          <CardHeader>
            <CardTitle>Mixing Ratio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Color 1 ({100 - ratio[0]}%)</span>
                <span>Color 2 ({ratio[0]}%)</span>
              </div>
              
              <div className="relative">
                <Slider
                  value={ratio}
                  onValueChange={setRatio}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                  <span>100% Color 1</span>
                  <span>50/50 Mix</span>
                  <span>100% Color 2</span>
                </div>
              </div>
            </div>

            {/* Visual representation of the mix */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Mix Preview</div>
              <div className="flex h-6 rounded-lg overflow-hidden border border-border">
                <div 
                  className="transition-all duration-200"
                  style={{ 
                    backgroundColor: color1, 
                    width: `${100 - ratio[0]}%` 
                  }}
                />
                <div 
                  className="transition-all duration-200"
                  style={{ 
                    backgroundColor: color2, 
                    width: `${ratio[0]}%` 
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Mix Presets */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Mix Ratios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: '25% / 75%', value: 25 },
                { label: '50% / 50%', value: 50 },
                { label: '75% / 25%', value: 75 },
                { label: '90% / 10%', value: 90 }
              ].map((preset) => (
                <Button
                  key={preset.value}
                  variant={ratio[0] === preset.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRatio([preset.value])}
                  className="text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}