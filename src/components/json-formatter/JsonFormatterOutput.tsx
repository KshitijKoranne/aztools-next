import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clipboard, Download } from "lucide-react";

interface JsonFormatterOutputProps {
  outputJson: string;
  handleCopy: () => void;
  handleDownload: () => void;
}

export const JsonFormatterOutput = ({
  outputJson,
  handleCopy,
  handleDownload,
}: JsonFormatterOutputProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="outputJson">Result</Label>
        <div className="flex gap-2">
          {outputJson && (
            <>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleCopy}
                className="gap-2"
              >
                <Clipboard className="h-4 w-4" />
                Copy
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </>
          )}
        </div>
      </div>
      <Textarea
        id="outputJson"
        readOnly
        value={outputJson}
        className="min-h-[200px] font-mono text-sm"
      />
    </div>
  );
};