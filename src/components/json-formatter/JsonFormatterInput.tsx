import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JsonFormatterInputProps {
  inputJson: string;
  setInputJson: (value: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const JsonFormatterInput = ({
  inputJson,
  setInputJson,
  fileInputRef,
  handleFileUpload,
}: JsonFormatterInputProps) => {
  return (
    <div className="space-y-2 mb-6">
      <div className="flex justify-between items-center">
        <Label htmlFor="inputJson">Input JSON</Label>
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload JSON
          </Button>
        </label>
      </div>
      <Textarea
        id="inputJson"
        value={inputJson}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputJson(e.target.value)}
        className="min-h-[200px] font-mono text-sm"
        placeholder="Paste your JSON here..."
      />
    </div>
  );
};