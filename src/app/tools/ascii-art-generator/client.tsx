"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Download, Type, Upload } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CHARS = " .:-=+*#%@";
const FONT: Record<string, string[]> = {
  A: ["  #  ", " # # ", "#####", "#   #", "#   #"], B: ["#### ", "#   #", "#### ", "#   #", "#### "], C: [" ####", "#    ", "#    ", "#    ", " ####"],
  D: ["#### ", "#   #", "#   #", "#   #", "#### "], E: ["#####", "#    ", "###  ", "#    ", "#####"], F: ["#####", "#    ", "###  ", "#    ", "#    "],
  G: [" ####", "#    ", "#  ##", "#   #", " ####"], H: ["#   #", "#   #", "#####", "#   #", "#   #"], I: ["#####", "  #  ", "  #  ", "  #  ", "#####"],
  J: ["#####", "   # ", "   # ", "#  # ", " ##  "], K: ["#   #", "#  # ", "###  ", "#  # ", "#   #"], L: ["#    ", "#    ", "#    ", "#    ", "#####"],
  M: ["#   #", "## ##", "# # #", "#   #", "#   #"], N: ["#   #", "##  #", "# # #", "#  ##", "#   #"], O: [" ### ", "#   #", "#   #", "#   #", " ### "],
  P: ["#### ", "#   #", "#### ", "#    ", "#    "], Q: [" ### ", "#   #", "# # #", "#  ##", " ####"], R: ["#### ", "#   #", "#### ", "#  # ", "#   #"],
  S: [" ####", "#    ", " ### ", "    #", "#### "], T: ["#####", "  #  ", "  #  ", "  #  ", "  #  "], U: ["#   #", "#   #", "#   #", "#   #", " ### "],
  V: ["#   #", "#   #", "#   #", " # # ", "  #  "], W: ["#   #", "#   #", "# # #", "## ##", "#   #"], X: ["#   #", " # # ", "  #  ", " # # ", "#   #"],
  Y: ["#   #", " # # ", "  #  ", "  #  ", "  #  "], Z: ["#####", "   # ", "  #  ", " #   ", "#####"], " ": ["     ", "     ", "     ", "     ", "     "],
};

function textAscii(value: string) {
  return value.toUpperCase().split("\n").flatMap((line) => Array.from({ length: 5 }, (_, row) => line.split("").map((char) => FONT[char]?.[row] ?? FONT[" "]![row]).join(" "))).join("\n");
}

export default function Client() {
  const [tab, setTab] = useState("text");
  const [text, setText] = useState("HELLO");
  const [width, setWidth] = useState(80);
  const [output, setOutput] = useState(textAscii("HELLO"));

  function generateText() {
    setOutput(textAscii(text));
  }

  function imageToAscii(file: File | undefined) {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = width;
      canvas.height = Math.max(1, Math.floor((img.height / img.width) * width * 0.5));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let ascii = "";
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          const gray = ((data[i] ?? 0) + (data[i + 1] ?? 0) + (data[i + 2] ?? 0)) / 3;
          ascii += CHARS[Math.floor((gray / 255) * (CHARS.length - 1))];
        }
        ascii += "\n";
      }
      setOutput(ascii);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    toast.success("Copied.");
  }

  function download() {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ascii-art.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout toolId="ascii-art-generator">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Type className="h-5 w-5" />ASCII Art Generator</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid grid-cols-2"><TabsTrigger value="text">Text</TabsTrigger><TabsTrigger value="image">Image</TabsTrigger></TabsList>
              <TabsContent value="text" className="space-y-3"><Input value={text} onChange={(event) => setText(event.target.value)} /><Button onClick={generateText}>Generate Text ASCII</Button></TabsContent>
              <TabsContent value="image" className="space-y-3"><Label>Width: {width} chars</Label><Slider value={[width]} min={30} max={160} step={5} onValueChange={([next]) => setWidth(next ?? 80)} /><Label className="inline-flex cursor-pointer items-center gap-2"><Upload className="h-4 w-4" />Upload Image<Input className="hidden" type="file" accept="image/*" onChange={(event) => imageToAscii(event.target.files?.[0])} /></Label></TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card><CardHeader><CardTitle className="flex items-center justify-between gap-3">Output<span className="flex gap-2"><Button size="sm" variant="outline" onClick={copy}><Copy className="mr-2 h-4 w-4" />Copy</Button><Button size="sm" variant="outline" onClick={download}><Download className="mr-2 h-4 w-4" />Download</Button></span></CardTitle></CardHeader><CardContent><pre className="max-h-[520px] overflow-auto rounded-md bg-muted p-4 font-mono text-xs leading-tight">{output}</pre></CardContent></Card>
      </div>
    </ToolLayout>
  );
}
