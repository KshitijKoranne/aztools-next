import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

interface JsonFormatterActionsProps {
  indentation: string;
  setIndentation: (value: string) => void;
  handleAction: () => void;
  isProcessing?: boolean; // Keep this for future use but mark as optional
  activeTab: string;
}

export const JsonFormatterActions = ({
  indentation,
  setIndentation,
  handleAction,
  activeTab,
}: JsonFormatterActionsProps) => {
  return (
    <>
      {activeTab === "beautify" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="indentation">Indentation</Label>
            <Select value={indentation} onValueChange={setIndentation}>
              <SelectTrigger id="indentation">
                <SelectValue placeholder="Select indentation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spaces</SelectItem>
                <SelectItem value="4">4 spaces</SelectItem>
                <SelectItem value="8">8 spaces</SelectItem>
                <SelectItem value="0">No indentation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAction} className="w-full gap-2">
            <RefreshCw className="h-4 w-4" />
            Beautify JSON
          </Button>
        </div>
      )}

      {activeTab === "minify" && (
        <Button onClick={handleAction} className="w-full gap-2">
          <RefreshCw className="h-4 w-4" />
          Minify JSON
        </Button>
      )}

      {activeTab === "validate" && (
        <Button onClick={handleAction} className="w-full gap-2">
          <RefreshCw className="h-4 w-4" />
          Validate JSON
        </Button>
      )}
    </>
  );
};