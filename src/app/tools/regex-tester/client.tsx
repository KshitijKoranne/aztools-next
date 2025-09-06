'use client'

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, Copy, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

interface MatchResult {
  match: string;
  index: number;
  groups?: string[];
}

export function RegexTesterClient() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState({
    global: true,
    caseInsensitive: false,
    multiline: false,
    unicode: false,
    sticky: false
  });
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState<string>("");

  const testRegex = () => {
    if (!pattern.trim()) {
      toast.error("Please enter a regular expression pattern");
      return;
    }

    if (!testString.trim()) {
      toast.error("Please enter test string to match against");
      return;
    }

    try {
      // Convert flags object to flag string
      const flagString = Object.entries(flags)
        .filter(([key, enabled]) => enabled)
        .map(([key]) => {
          switch (key) {
            case 'global': return 'g';
            case 'caseInsensitive': return 'i';
            case 'multiline': return 'm';
            case 'unicode': return 'u';
            case 'sticky': return 'y';
            default: return '';
          }
        })
        .join("");

      const regex = new RegExp(pattern, flagString);
      const results: MatchResult[] = [];
      let match;

      // Create highlighted text
      let highlighted = testString;
      const matchPositions: Array<{start: number, end: number}> = [];

      if (flags.global) {
        // Reset regex lastIndex for global flag
        regex.lastIndex = 0;
        while ((match = regex.exec(testString)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          matchPositions.push({
            start: match.index,
            end: match.index + match[0].length
          });
          
          // Prevent infinite loop on zero-length matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          matchPositions.push({
            start: match.index,
            end: match.index + match[0].length
          });
        }
      }

      // Create highlighted text
      if (matchPositions.length > 0) {
        // Sort positions by start index (reverse order for replacements)
        matchPositions.sort((a, b) => b.start - a.start);
        
        highlighted = testString;
        matchPositions.forEach(pos => {
          const before = highlighted.substring(0, pos.start);
          const match = highlighted.substring(pos.start, pos.end);
          const after = highlighted.substring(pos.end);
          highlighted = before + `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${match}</mark>` + after;
        });
      }

      setMatches(results);
      setHighlightedText(highlighted);
      setError(null);
      
      if (results.length > 0) {
        toast.success(`Found ${results.length} match${results.length === 1 ? '' : 'es'}`);
      } else {
        toast.error("No matches found");
      }
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      setMatches([]);
      setHighlightedText("");
      toast.error(`Invalid regular expression: ${errorMessage}`);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  const clearAll = () => {
    setPattern("");
    setTestString("");
    setMatches([]);
    setError(null);
    setHighlightedText("");
  };

  // Auto-test when pattern or test string changes
  useEffect(() => {
    if (pattern && testString) {
      const timeoutId = setTimeout(() => {
        testRegex();
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    } else {
      setMatches([]);
      setError(null);
      setHighlightedText("");
    }
  }, [pattern, testString, flags]);

  const getFlagString = () => {
    return Object.entries(flags)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => {
        switch (key) {
          case 'global': return 'g';
          case 'caseInsensitive': return 'i';
          case 'multiline': return 'm';
          case 'unicode': return 'u';
          case 'sticky': return 'y';
          default: return '';
        }
      })
      .join("");
  };

  return (
    <ToolLayout toolId="regex-tester" categoryId="developer-tools">
      <div className="space-y-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Regular Expression Tester
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pattern Input */}
            <div className="space-y-2">
              <Label htmlFor="pattern">Regular Expression Pattern</Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    id="pattern"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="Enter your regex pattern (e.g., \b\w+@\w+\.\w+\b)"
                    className="font-mono pr-16"
                  />
                  {getFlagString() && (
                    <Badge variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">
                      /{getFlagString()}
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => handleCopy(pattern, "Pattern")}
                  disabled={!pattern}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Flags */}
            <div className="space-y-2">
              <Label>Flags</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="global"
                    checked={flags.global}
                    onCheckedChange={(checked) => setFlags({ ...flags, global: checked })}
                  />
                  <Label htmlFor="global" className="text-sm">Global (g)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="caseInsensitive"
                    checked={flags.caseInsensitive}
                    onCheckedChange={(checked) => setFlags({ ...flags, caseInsensitive: checked })}
                  />
                  <Label htmlFor="caseInsensitive" className="text-sm">Case Insensitive (i)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="multiline"
                    checked={flags.multiline}
                    onCheckedChange={(checked) => setFlags({ ...flags, multiline: checked })}
                  />
                  <Label htmlFor="multiline" className="text-sm">Multiline (m)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="unicode"
                    checked={flags.unicode}
                    onCheckedChange={(checked) => setFlags({ ...flags, unicode: checked })}
                  />
                  <Label htmlFor="unicode" className="text-sm">Unicode (u)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sticky"
                    checked={flags.sticky}
                    onCheckedChange={(checked) => setFlags({ ...flags, sticky: checked })}
                  />
                  <Label htmlFor="sticky" className="text-sm">Sticky (y)</Label>
                </div>
              </div>
            </div>

            {/* Test String */}
            <div className="space-y-2">
              <Label htmlFor="testString">Test String</Label>
              <Textarea
                id="testString"
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter text to test against the pattern..."
                className="min-h-[150px] font-mono text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={testRegex} className="flex-1 sm:flex-none">
                <Search className="h-4 w-4 mr-2" />
                Test Regex
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive font-mono text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Highlighted Text */}
          {highlightedText && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  Highlighted Matches
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleCopy(testString, "Test string")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="bg-muted/50 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap border"
                  dangerouslySetInnerHTML={{ __html: highlightedText }}
                />
              </CardContent>
            </Card>
          )}

          {/* Match Results */}
          {matches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  Matches
                  <Badge variant="secondary">{matches.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {matches.map((match, index) => (
                    <div key={index} className="bg-muted/50 p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Match #{index + 1}
                        </span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleCopy(match.match, `Match ${index + 1}`)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="font-mono text-sm space-y-1">
                        <div>
                          <span className="text-muted-foreground">Text: </span>
                          <span className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">
                            {match.match}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Index: </span>
                          <span>{match.index}</span>
                        </div>
                        {match.groups && match.groups.length > 0 && (
                          <div>
                            <span className="text-muted-foreground">Groups: </span>
                            <span>{match.groups.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-2">Common Patterns</h4>
                <div className="space-y-1 font-mono text-xs">
                  <div><code>\d+</code> - One or more digits</div>
                  <div><code>\w+</code> - One or more word characters</div>
                  <div><code>\s+</code> - One or more whitespace</div>
                  <div><code>^</code> - Start of line</div>
                  <div><code>$</code> - End of line</div>
                  <div><code>.</code> - Any character</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Quantifiers</h4>
                <div className="space-y-1 font-mono text-xs">
                  <div><code>*</code> - Zero or more</div>
                  <div><code>+</code> - One or more</div>
                  <div><code>?</code> - Zero or one</div>
                  <div><code>{`{n}`}</code> - Exactly n times</div>
                  <div><code>{`{n,}`}</code> - n or more times</div>
                  <div><code>{`{n,m}`}</code> - Between n and m times</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}