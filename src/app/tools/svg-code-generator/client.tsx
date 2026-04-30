"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Square, Circle, Minus, Type, Download, Copy, Trash2, Undo, Code } from "lucide-react";
import { toast } from "sonner";

interface SvgEl {
  id: string;
  type: "rect" | "circle" | "ellipse" | "line" | "text";
  attrs: Record<string, string | number>;
  content?: string;
}

const uid = () => `el_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export default function SvgCodeGeneratorClient() {
  const [elements, setElements] = useState<SvgEl[]>([]);
  const [tool, setTool] = useState("rect");
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [stroke, setStroke] = useState("#000000");
  const [fill, setFill] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [textVal, setTextVal] = useState("Text");
  const [fontSize, setFontSize] = useState(16);
  const [isDrawing, setIsDrawing] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getSvgPoint = (e: React.MouseEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) };
  };

  const onMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const pt = getSvgPoint(e);
    if (tool === "text") {
      setElements((prev) => [...prev, { id: uid(), type: "text", attrs: { x: pt.x, y: pt.y, fill: stroke, "font-size": fontSize, "font-family": "Arial, sans-serif" }, content: textVal }]);
      return;
    }
    setStart(pt);
    setIsDrawing(true);
  };

  const onMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || !start) return;
    const pt = getSvgPoint(e);
    const el: SvgEl = { id: uid(), type: tool as SvgEl["type"], attrs: {} };
    switch (tool) {
      case "rect":
        el.attrs = { x: Math.min(start.x, pt.x), y: Math.min(start.y, pt.y), width: Math.abs(pt.x - start.x), height: Math.abs(pt.y - start.y), fill, stroke, "stroke-width": strokeWidth };
        break;
      case "circle": {
        const r = Math.round(Math.hypot(pt.x - start.x, pt.y - start.y) / 2);
        el.attrs = { cx: Math.round((start.x + pt.x) / 2), cy: Math.round((start.y + pt.y) / 2), r, fill, stroke, "stroke-width": strokeWidth };
        break;
      }
      case "ellipse":
        el.attrs = { cx: Math.round((start.x + pt.x) / 2), cy: Math.round((start.y + pt.y) / 2), rx: Math.round(Math.abs(pt.x - start.x) / 2), ry: Math.round(Math.abs(pt.y - start.y) / 2), fill, stroke, "stroke-width": strokeWidth };
        break;
      case "line":
        el.attrs = { x1: start.x, y1: start.y, x2: pt.x, y2: pt.y, stroke, "stroke-width": strokeWidth };
        break;
    }
    setElements((prev) => [...prev, el]);
    setIsDrawing(false);
    setStart(null);
  };

  const svgCode = () => {
    const body = elements.map((el) => {
      const attrStr = Object.entries(el.attrs).map(([k, v]) => `${k}="${v}"`).join(" ");
      return el.type === "text" ? `  <text ${attrStr}>${el.content}</text>` : `  <${el.type} ${attrStr} />`;
    }).join("\n");
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n${body}\n</svg>`;
  };

  const copy = async () => {
    await navigator.clipboard.writeText(svgCode());
    toast.success("SVG code copied");
  };

  const download = () => {
    const blob = new Blob([svgCode()], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "generated.svg";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  };

  const TOOLS = [
    { id: "rect", label: "Rectangle", icon: Square },
    { id: "circle", label: "Circle", icon: Circle },
    { id: "ellipse", label: "Ellipse", icon: Circle },
    { id: "line", label: "Line", icon: Minus },
    { id: "text", label: "Text", icon: Type },
  ];

  return (
    <ToolLayout toolId="svg-code-generator">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle className="flex items-center gap-2"><Code className="h-5 w-5" /> Controls</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Canvas Size</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-xs">Width</Label><Input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min="50" max="1000" /></div>
                  <div><Label className="text-xs">Height</Label><Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min="50" max="1000" /></div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Tools</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TOOLS.map(({ id, label, icon: Icon }) => (
                    <Button key={id} variant={tool === id ? "default" : "outline"} size="sm" onClick={() => setTool(id)} className="flex items-center gap-1 text-xs">
                      <Icon className="h-3 w-3" /> {label}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label>Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Stroke Color</Label>
                    <div className="flex gap-1">
                      <Input type="color" value={stroke} onChange={(e) => setStroke(e.target.value)} className="h-8 w-12 p-1" />
                      <Input type="number" value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} min="0" max="20" className="h-8" placeholder="px" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Fill Color</Label>
                    <Input type="color" value={fill} onChange={(e) => setFill(e.target.value)} className="h-8 w-full p-1" />
                  </div>
                </div>
                {tool === "text" && (
                  <div className="space-y-2">
                    <div><Label className="text-xs">Text Content</Label><Input value={textVal} onChange={(e) => setTextVal(e.target.value)} /></div>
                    <div><Label className="text-xs">Font Size</Label><Input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} min="8" max="72" /></div>
                  </div>
                )}
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => setElements((p) => p.slice(0, -1))}><Undo className="h-3 w-3 mr-1" /> Undo</Button>
                <Button variant="outline" size="sm" onClick={() => setElements([])}><Trash2 className="h-3 w-3 mr-1" /> Clear</Button>
              </div>
            </CardContent>
          </Card>

          {/* Canvas + Code */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  SVG Canvas
                  <div className="flex gap-2">
                    <Button size="sm" onClick={copy}><Copy className="h-3 w-3 mr-1" /> Copy Code</Button>
                    <Button size="sm" onClick={download}><Download className="h-3 w-3 mr-1" /> Download</Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-2 overflow-auto bg-muted/30">
                  <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`}
                    className="border bg-white cursor-crosshair select-none"
                    onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={() => { setIsDrawing(false); setStart(null); }}>
                    {elements.map((el) => {
                      const p = el.attrs;
                      switch (el.type) {
                        case "rect": return <rect key={el.id} {...(p as React.SVGProps<SVGRectElement>)} />;
                        case "circle": return <circle key={el.id} {...(p as React.SVGProps<SVGCircleElement>)} />;
                        case "ellipse": return <ellipse key={el.id} {...(p as React.SVGProps<SVGEllipseElement>)} />;
                        case "line": return <line key={el.id} {...(p as React.SVGProps<SVGLineElement>)} />;
                        case "text": return <text key={el.id} {...(p as React.SVGProps<SVGTextElement>)}>{el.content}</text>;
                      }
                    })}
                  </svg>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Click and drag to draw. Click to place text.</p>
                {elements.length > 0 && (
                  <div className="mt-3 text-sm text-muted-foreground">{elements.length} element(s)</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Generated SVG Code</CardTitle></CardHeader>
              <CardContent>
                <Textarea value={svgCode()} readOnly className="font-mono text-sm min-h-[180px]" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
