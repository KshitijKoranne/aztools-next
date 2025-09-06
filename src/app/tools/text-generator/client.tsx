'use client'

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function TextGeneratorClient() {
  const [activeTab, setActiveTab] = useState("string");
  const [stringLength, setStringLength] = useState(10);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(false);
  const [listItems, setListItems] = useState("");
  const [listCount, setListCount] = useState(5);
  const [listPrefix, setListPrefix] = useState("");
  const [listSuffix, setListSuffix] = useState("");
  const [generated, setGenerated] = useState("");

  const generateString = () => {
    let chars = "";
    if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) chars += "0123456789";
    if (includeSpecial) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) {
      toast.error("Please select at least one character type");
      return;
    }

    let result = "";
    for (let i = 0; i < stringLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setGenerated(result);
    toast.success("String generated successfully");
  };

  const generateList = () => {
    if (!listItems.trim()) {
      toast.error("Please enter list items");
      return;
    }

    const items = listItems.split("\n").filter(item => item.trim());
    if (items.length === 0) {
      toast.error("Please enter valid list items");
      return;
    }

    let result = "";
    for (let i = 0; i < listCount; i++) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      result += `${listPrefix}${randomItem}${listSuffix}\n`;
    }

    setGenerated(result.trim());
    toast.success("List generated successfully");
  };

  const copyToClipboard = () => {
    if (generated) {
      navigator.clipboard.writeText(generated);
      toast.success("Generated text copied to clipboard");
    }
  };

  const clearAll = () => {
    setGenerated("");
    if (activeTab === "string") {
      setStringLength(10);
      setIncludeUppercase(true);
      setIncludeLowercase(true);
      setIncludeNumbers(true);
      setIncludeSpecial(false);
    } else {
      setListItems("");
      setListCount(5);
      setListPrefix("");
      setListSuffix("");
    }
  };

  return (
    <ToolLayout toolId="text-generator" categoryId="text-utilities">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Text Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="string">Random String</TabsTrigger>
                <TabsTrigger value="list">Random List</TabsTrigger>
              </TabsList>

              <TabsContent value="string" className="space-y-4">
                <div className="space-y-2">
                  <Label>String Length</Label>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={stringLength}
                    onChange={(e) => setStringLength(parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Character Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="uppercase"
                        checked={includeUppercase}
                        onCheckedChange={setIncludeUppercase}
                      />
                      <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lowercase"
                        checked={includeLowercase}
                        onCheckedChange={setIncludeLowercase}
                      />
                      <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="numbers"
                        checked={includeNumbers}
                        onCheckedChange={setIncludeNumbers}
                      />
                      <Label htmlFor="numbers">Numbers (0-9)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="special"
                        checked={includeSpecial}
                        onCheckedChange={setIncludeSpecial}
                      />
                      <Label htmlFor="special">Special Characters</Label>
                    </div>
                  </div>
                </div>

                <Button onClick={generateString} className="w-full">
                  Generate String
                </Button>
              </TabsContent>

              <TabsContent value="list" className="space-y-4">
                <div className="space-y-2">
                  <Label>List Items (one per line)</Label>
                  <Textarea
                    placeholder="Enter list items here..."
                    value={listItems}
                    onChange={(e) => setListItems(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Number of Items</Label>
                    <Input
                      type="number"
                      min="1"
                      max="1000"
                      value={listCount}
                      onChange={(e) => setListCount(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prefix (optional)</Label>
                    <Input
                      value={listPrefix}
                      onChange={(e) => setListPrefix(e.target.value)}
                      placeholder="e.g., Item-"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Suffix (optional)</Label>
                  <Input
                    value={listSuffix}
                    onChange={(e) => setListSuffix(e.target.value)}
                    placeholder="e.g., .txt"
                  />
                </div>

                <Button onClick={generateList} className="w-full">
                  Generate List
                </Button>
              </TabsContent>
            </Tabs>

            <div className="flex gap-4">
              <Button variant="outline" onClick={clearAll} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated Text
              {generated && (
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generated ? (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{generated}</code>
              </pre>
            ) : (
              <p className="text-muted-foreground">Generated text will appear here</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}