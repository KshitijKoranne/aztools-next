'use client'

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Copy, Plus, Trash2, RotateCcw, Palette } from "lucide-react";
import { toast } from "sonner";

export function GradientGeneratorClient() {
  const [colors, setColors] = useState(["#3b82f6", "#9333ea"]);
  const [gradientType, setGradientType] = useState("linear");
  const [direction, setDirection] = useState("to right");
  const [angle, setAngle] = useState([90]);
  const [cssCode, setCssCode] = useState("");
  const [radialShape, setRadialShape] = useState("circle");
  const [radialPosition, setRadialPosition] = useState("center");

  const directions = [
    { value: "to top", label: "To Top" },
    { value: "to right", label: "To Right" },
    { value: "to bottom", label: "To Bottom" },
    { value: "to left", label: "To Left" },
    { value: "to top right", label: "To Top Right" },
    { value: "to top left", label: "To Top Left" },
    { value: "to bottom right", label: "To Bottom Right" },
    { value: "to bottom left", label: "To Bottom Left" },
    { value: "custom", label: "Custom Angle" }
  ];

  const radialShapes = [
    { value: "circle", label: "Circle" },
    { value: "ellipse", label: "Ellipse" }
  ];

  const radialPositions = [
    { value: "center", label: "Center" },
    { value: "top", label: "Top" },
    { value: "bottom", label: "Bottom" },
    { value: "left", label: "Left" },
    { value: "right", label: "Right" },
    { value: "top left", label: "Top Left" },
    { value: "top right", label: "Top Right" },
    { value: "bottom left", label: "Bottom Left" },
    { value: "bottom right", label: "Bottom Right" }
  ];

  const generateGradientCSS = () => {
    let gradientCSS = "";
    
    if (gradientType === "linear") {
      const directionValue = direction === "custom" ? `${angle[0]}deg` : direction;
      gradientCSS = `background: linear-gradient(${directionValue}, ${colors.join(", ")});`;
    } else {
      gradientCSS = `background: radial-gradient(${radialShape} at ${radialPosition}, ${colors.join(", ")});`;
    }
    
    setCssCode(gradientCSS);
    return gradientCSS;
  };

  const getGradientStyle = () => {
    if (gradientType === "linear") {
      const directionValue = direction === "custom" ? `${angle[0]}deg` : direction;
      return { background: `linear-gradient(${directionValue}, ${colors.join(", ")})` };
    } else {
      return { background: `radial-gradient(${radialShape} at ${radialPosition}, ${colors.join(", ")})` };
    }
  };

  useEffect(() => {
    generateGradientCSS();
  }, [colors, gradientType, direction, angle, radialShape, radialPosition]);

  const addColor = () => {
    if (colors.length < 6) {
      setColors([...colors, "#ff0000"]);
      toast.success("Color added to gradient!");
    } else {
      toast.error("Maximum 6 colors allowed");
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      const newColors = colors.filter((_, i) => i !== index);
      setColors(newColors);
      toast.success("Color removed from gradient!");
    } else {
      toast.error("Minimum 2 colors required");
    }
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(cssCode).then(() => {
      toast.success("CSS code copied to clipboard!");
    });
  };

  const resetGradient = () => {
    setColors(["#3b82f6", "#9333ea"]);
    setGradientType("linear");
    setDirection("to right");
    setAngle([90]);
    setRadialShape("circle");
    setRadialPosition("center");
    toast.success("Gradient reset to default!");
  };

  const presetGradients = [
    { name: "Ocean", colors: ["#667eea", "#764ba2"] },
    { name: "Sunset", colors: ["#ff7e5f", "#feb47b"] },
    { name: "Emerald", colors: ["#11998e", "#38ef7d"] },
    { name: "Purple", colors: ["#667eea", "#764ba2"] },
    { name: "Fire", colors: ["#ff416c", "#ff4b2b"] },
    { name: "Sky", colors: ["#74b9ff", "#0984e3"] }
  ];

  const applyPreset = (preset: { colors: string[] }) => {
    setColors(preset.colors);
    toast.success(`${preset.name || 'Preset'} gradient applied!`);
  };

  return (
    <ToolLayout toolId="gradient-generator" categoryId="color-tools">
      <div className="space-y-6">
        {/* Gradient Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Gradient Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="w-full h-48 rounded-lg border border-border shadow-inner"
              style={getGradientStyle()}
            />
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Type and Direction */}
          <Card>
            <CardHeader>
              <CardTitle>Gradient Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={gradientType} onValueChange={setGradientType} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="linear">Linear</TabsTrigger>
                  <TabsTrigger value="radial">Radial</TabsTrigger>
                </TabsList>
                
                <TabsContent value="linear" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Direction</Label>
                    <Select value={direction} onValueChange={setDirection}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {directions.map(dir => (
                          <SelectItem key={dir.value} value={dir.value}>
                            {dir.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {direction === "custom" && (
                    <div className="space-y-2">
                      <Label>Angle: {angle[0]}°</Label>
                      <Slider
                        value={angle}
                        onValueChange={setAngle}
                        max={360}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="radial" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Shape</Label>
                    <Select value={radialShape} onValueChange={setRadialShape}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {radialShapes.map(shape => (
                          <SelectItem key={shape.value} value={shape.value}>
                            {shape.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Select value={radialPosition} onValueChange={setRadialPosition}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {radialPositions.map(pos => (
                          <SelectItem key={pos.value} value={pos.value}>
                            {pos.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Colors
                <div className="flex gap-2">
                  <Button size="sm" onClick={addColor} disabled={colors.length >= 6}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetGradient}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="w-12 h-10 rounded-md border border-border cursor-pointer"
                  />
                  <Input
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="font-mono flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeColor(index)}
                    disabled={colors.length <= 2}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Preset Gradients */}
        <Card>
          <CardHeader>
            <CardTitle>Preset Gradients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {presetGradients.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="group relative h-16 rounded-lg border border-border overflow-hidden hover:scale-105 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, ${preset.colors.join(", ")})`
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{preset.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CSS Output */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              CSS Code
              <Button onClick={copyCSS} size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy CSS
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{cssCode}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}