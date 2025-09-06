'use client'

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Square, 
  Circle, 
  Type, 
  Download, 
  Copy, 
  RefreshCw,
  Code
} from "lucide-react";
import { toast } from "sonner";

interface SVGElement {
  id: string;
  type: 'rect' | 'circle' | 'text' | 'line';
  attributes: Record<string, string | number>;
  content?: string;
}

export function SvgCodeGeneratorClient() {
  const [svgElements, setSvgElements] = useState<SVGElement[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('rect');
  const [svgWidth, setSvgWidth] = useState(400);
  const [svgHeight, setSvgHeight] = useState(300);
  const [strokeColor, setStrokeColor] = useState('#3b82f6');
  const [fillColor, setFillColor] = useState('#e0f2fe');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [textContent, setTextContent] = useState('Hello SVG');
  const [fontSize, setFontSize] = useState(16);
  
  const svgRef = useRef<SVGSVGElement>(null);

  const tools = [
    { id: 'rect', name: 'Rectangle', icon: Square },
    { id: 'circle', name: 'Circle', icon: Circle },
    { id: 'text', name: 'Text', icon: Type },
  ];

  const generateId = () => `el_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  const addRectangle = () => {
    const element: SVGElement = {
      id: generateId(),
      type: 'rect',
      attributes: {
        x: 50,
        y: 50,
        width: 100,
        height: 60,
        fill: fillColor,
        stroke: strokeColor,
        'stroke-width': strokeWidth
      }
    };
    setSvgElements(prev => [...prev, element]);
    toast.success("Rectangle added");
  };

  const addCircle = () => {
    const element: SVGElement = {
      id: generateId(),
      type: 'circle',
      attributes: {
        cx: 100,
        cy: 100,
        r: 40,
        fill: fillColor,
        stroke: strokeColor,
        'stroke-width': strokeWidth
      }
    };
    setSvgElements(prev => [...prev, element]);
    toast.success("Circle added");
  };

  const addText = () => {
    const element: SVGElement = {
      id: generateId(),
      type: 'text',
      attributes: {
        x: 50,
        y: 50,
        fill: strokeColor,
        'font-size': fontSize,
        'font-family': 'Arial, sans-serif'
      },
      content: textContent
    };
    setSvgElements(prev => [...prev, element]);
    toast.success("Text added");
  };

  const generateSVGCode = () => {
    const elements = svgElements.map(element => {
      const attrs = Object.entries(element.attributes)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
      
      if (element.type === 'text') {
        return `  <text ${attrs}>${element.content || ''}</text>`;
      }
      return `  <${element.type} ${attrs} />`;
    }).join('\n');

    return `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
${elements}
</svg>`;
  };

  const handleCopyCode = () => {
    const code = generateSVGCode();
    navigator.clipboard.writeText(code);
    toast.success("SVG code copied to clipboard");
  };

  const handleDownloadSVG = () => {
    const code = generateSVGCode();
    const blob = new Blob([code], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated-svg.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("SVG file downloaded");
  };

  const clearCanvas = () => {
    setSvgElements([]);
    toast.success("Canvas cleared");
  };

  return (
    <ToolLayout toolId="svg-code-generator" categoryId="developer-tools">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              SVG Code Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Canvas Size */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={svgWidth}
                  onChange={(e) => setSvgWidth(Number(e.target.value))}
                  min={100}
                  max={800}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={svgHeight}
                  onChange={(e) => setSvgHeight(Number(e.target.value))}
                  min={100}
                  max={600}
                />
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stroke-color">Stroke Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="stroke-color"
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fill-color">Fill Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="fill-color"
                    type="color"
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stroke-width">Stroke Width</Label>
                <Input
                  id="stroke-width"
                  type="number"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  min={0}
                  max={10}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Input
                  id="font-size"
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  min={8}
                  max={48}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text-content">Text Content</Label>
              <Input
                id="text-content"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Enter text content"
              />
            </div>

            {/* Add Elements */}
            <div className="space-y-2">
              <Label>Add Elements</Label>
              <div className="flex flex-wrap gap-2">
                <Button onClick={addRectangle} size="sm" variant="outline">
                  <Square className="h-4 w-4 mr-1" />
                  Rectangle
                </Button>
                <Button onClick={addCircle} size="sm" variant="outline">
                  <Circle className="h-4 w-4 mr-1" />
                  Circle
                </Button>
                <Button onClick={addText} size="sm" variant="outline">
                  <Type className="h-4 w-4 mr-1" />
                  Text
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleCopyCode} disabled={svgElements.length === 0}>
                <Copy className="h-4 w-4 mr-1" />
                Copy Code
              </Button>
              <Button onClick={handleDownloadSVG} disabled={svgElements.length === 0}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button onClick={clearCanvas} variant="outline">
                <RefreshCw className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview and Code */}
        <div className="space-y-6">
          {/* Canvas Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Preview
                <Badge variant="secondary">{svgElements.length} elements</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-white">
                <svg
                  ref={svgRef}
                  width={Math.min(svgWidth, 400)}
                  height={Math.min(svgHeight, 300)}
                  className="border border-dashed border-gray-300"
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                >
                  {svgElements.map((element) => {
                    const props = element.attributes;
                    switch (element.type) {
                      case 'rect':
                        return <rect key={element.id} {...props} />;
                      case 'circle':
                        return <circle key={element.id} {...props} />;
                      case 'text':
                        return <text key={element.id} {...props}>{element.content}</text>;
                      default:
                        return null;
                    }
                  })}
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Generated Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Generated SVG Code
                {svgElements.length > 0 && (
                  <Button size="sm" variant="outline" onClick={handleCopyCode}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generateSVGCode()}
                readOnly
                className="min-h-[200px] font-mono text-sm"
                placeholder="SVG code will appear here..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}