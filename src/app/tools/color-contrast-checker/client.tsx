'use client'

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, RefreshCw, Eye, Info } from "lucide-react";
import { toast } from "sonner";

interface ContrastResult {
  ratio: number;
  AA: boolean;
  AALarge: boolean;
  AAA: boolean;
  AAALarge: boolean;
}

export function ColorContrastCheckerClient() {
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [contrastResult, setContrastResult] = useState<ContrastResult>({
    ratio: 21,
    AA: true,
    AALarge: true,
    AAA: true,
    AAALarge: true
  });
  const [recentColors, setRecentColors] = useState<string[]>([]);

  const getLuminance = (hex: string): number => {
    let r = 0, g = 0, b = 0;
    
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } 
    else if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    } else {
      return 0;
    }
    
    const rRatio = r / 255;
    const gRatio = g / 255;
    const bRatio = b / 255;
    
    const rLum = rRatio <= 0.03928 ? rRatio / 12.92 : Math.pow((rRatio + 0.055) / 1.055, 2.4);
    const gLum = gRatio <= 0.03928 ? gRatio / 12.92 : Math.pow((gRatio + 0.055) / 1.055, 2.4);
    const bLum = bRatio <= 0.03928 ? bRatio / 12.92 : Math.pow((bRatio + 0.055) / 1.055, 2.4);
    
    return 0.2126 * rLum + 0.7152 * gLum + 0.0722 * bLum;
  };

  const calculateContrastRatio = (color1: string, color2: string): ContrastResult => {
    try {
      const luminance1 = getLuminance(color1);
      const luminance2 = getLuminance(color2);
      
      const light = Math.max(luminance1, luminance2);
      const dark = Math.min(luminance1, luminance2);
      
      const ratio = (light + 0.05) / (dark + 0.05);
      
      return {
        ratio: parseFloat(ratio.toFixed(2)),
        AA: ratio >= 4.5,
        AALarge: ratio >= 3,
        AAA: ratio >= 7,
        AAALarge: ratio >= 4.5
      };
    } catch (err) {
      return { ratio: 0, AA: false, AALarge: false, AAA: false, AAALarge: false };
    }
  };

  const isValidHex = (color: string): boolean => {
    return /^#([A-Fa-f0-9]{3}){1,2}$/.test(color);
  };

  useEffect(() => {
    if (isValidHex(foreground) && isValidHex(background)) {
      const result = calculateContrastRatio(foreground, background);
      setContrastResult(result);
      
      setRecentColors(prev => {
        const newColors = [...prev];
        if (!newColors.includes(foreground)) {
          newColors.unshift(foreground);
        }
        if (!newColors.includes(background)) {
          newColors.unshift(background);
        }
        return newColors.slice(0, 10);
      });
    }
  }, [foreground, background]);

  const handleColorChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.startsWith("#")) {
      setter(value);
    } else {
      setter(`#${value}`);
    }
  };

  const handleColorPickerChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  const swapColors = () => {
    const temp = foreground;
    setForeground(background);
    setBackground(temp);
    toast.success("Colors swapped!");
  };

  const useRecentColor = (color: string, target: 'foreground' | 'background') => {
    if (target === 'foreground') {
      setForeground(color);
    } else {
      setBackground(color);
    }
    toast.success(`${target} color updated to ${color}`);
  };

  const getAccessibilityText = (result: ContrastResult) => {
    if (result.AAA) return "AAA - Excellent";
    if (result.AA) return "AA - Good";
    if (result.AALarge) return "AA Large Text Only";
    return "Fails WCAG Standards";
  };

  const getAccessibilityColor = (result: ContrastResult) => {
    if (result.AAA) return "text-green-600 dark:text-green-400";
    if (result.AA) return "text-blue-600 dark:text-blue-400";
    if (result.AALarge) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <ToolLayout toolId="color-contrast-checker" categoryId="color-tools">
      <div className="space-y-6">
        <Tabs defaultValue="checker" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="checker">Contrast Checker</TabsTrigger>
            <TabsTrigger value="guide">WCAG Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="checker" className="space-y-6">
            {/* Color Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Text Color (Foreground)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="foreground">HEX Color Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="foreground"
                        value={foreground}
                        onChange={handleColorChange(setForeground)}
                        className="font-mono"
                        placeholder="#000000"
                      />
                      <input
                        type="color"
                        value={isValidHex(foreground) ? foreground : "#000000"}
                        onChange={handleColorPickerChange(setForeground)}
                        className="w-12 h-10 rounded-md border border-border cursor-pointer"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Background Color</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="background">HEX Color Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="background"
                        value={background}
                        onChange={handleColorChange(setBackground)}
                        className="font-mono"
                        placeholder="#ffffff"
                      />
                      <input
                        type="color"
                        value={isValidHex(background) ? background : "#ffffff"}
                        onChange={handleColorPickerChange(setBackground)}
                        className="w-12 h-10 rounded-md border border-border cursor-pointer"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <Button onClick={swapColors} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Swap Colors
                  </Button>
                  
                  {!isValidHex(foreground) || !isValidHex(background) ? (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      Please enter valid HEX color values
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* Preview and Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Color Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="p-8 rounded-lg border-2 border-border text-center"
                    style={{ 
                      backgroundColor: isValidHex(background) ? background : "#ffffff",
                      color: isValidHex(foreground) ? foreground : "#000000" 
                    }}
                  >
                    <div className="space-y-3">
                      <div className="text-2xl font-bold">Sample Heading</div>
                      <div className="text-base">This is regular text content that shows how readable your color combination will be for users.</div>
                      <div className="text-sm">Small text example</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contrast Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Contrast Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Contrast Ratio</span>
                      <span className="text-xl font-bold">{contrastResult.ratio}:1</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                        style={{ width: `${Math.min(100, (contrastResult.ratio / 21) * 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {contrastResult.AA ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                        <span className="font-medium">WCAG AA</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Normal text (4.5:1)</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {contrastResult.AALarge ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                        <span className="font-medium">WCAG AA Large</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Large text (3:1)</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {contrastResult.AAA ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                        <span className="font-medium">WCAG AAA</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Normal text (7:1)</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {contrastResult.AAALarge ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                        <span className="font-medium">WCAG AAA Large</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Large text (4.5:1)</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className={`font-semibold ${getAccessibilityColor(contrastResult)}`}>
                      {getAccessibilityText(contrastResult)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Colors */}
            {recentColors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Colors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {recentColors.map((color, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                        <div 
                          className="w-6 h-6 rounded-md border"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-mono text-xs">{color}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => useRecentColor(color, 'foreground')}
                            className="h-6 px-2 text-xs"
                          >
                            Text
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => useRecentColor(color, 'background')}
                            className="h-6 px-2 text-xs"
                          >
                            BG
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="guide">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  WCAG Accessibility Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">What are WCAG Standards?</h3>
                  <p className="text-muted-foreground">
                    The Web Content Accessibility Guidelines (WCAG) are developed by the World Wide Web Consortium (W3C) 
                    to make web content accessible to people with disabilities, including visual impairments.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contrast Requirements</h3>
                  
                  <div className="grid gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">WCAG AA (Minimum Level)</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Normal text: 4.5:1 contrast ratio</li>
                        <li>• Large text (18pt+ or 14pt+ bold): 3:1 contrast ratio</li>
                        <li>• Required for legal compliance in many jurisdictions</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">WCAG AAA (Enhanced Level)</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Normal text: 7:1 contrast ratio</li>
                        <li>• Large text (18pt+ or 14pt+ bold): 4.5:1 contrast ratio</li>
                        <li>• Highest level of accessibility compliance</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Why Does This Matter?</h4>
                  <p className="text-sm text-muted-foreground">
                    Proper contrast ensures your content is readable by users with visual impairments, color blindness, 
                    or those using devices in bright environments. It also improves readability for all users and 
                    demonstrates commitment to inclusive design.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Tips for Better Contrast</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Test your color combinations early in the design process</li>
                    <li>• Consider users with color vision deficiencies</li>
                    <li>• Use tools like this checker to verify compliance</li>
                    <li>• Don't rely solely on color to convey information</li>
                    <li>• Test on different devices and lighting conditions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
}