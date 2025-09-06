'use client'

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Lock, Unlock, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export function TextEncryptionClient() {
  const [activeTab, setActiveTab] = useState<"encrypt" | "decrypt">("encrypt");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const generateKey = async (password: string): Promise<CryptoKey> => {
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', passwordData);
    return crypto.subtle.importKey(
      'raw',
      hash,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  };

  const encrypt = async () => {
    if (!input.trim() || !password.trim()) {
      toast.error("Please enter both text and password");
      return;
    }

    try {
      setIsProcessing(true);
      const key = await generateKey(password);
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );

      const encryptedArray = new Uint8Array(encryptedData);
      const result = btoa(String.fromCharCode(...iv, ...encryptedArray));
      setOutput(result);
      
      toast.success("Text encrypted successfully");
    } catch (error) {
      toast.error("Failed to encrypt text");
    } finally {
      setIsProcessing(false);
    }
  };

  const decrypt = async () => {
    if (!input.trim() || !password.trim()) {
      toast.error("Please enter both encrypted text and password");
      return;
    }

    try {
      setIsProcessing(true);
      const key = await generateKey(password);
      const encryptedData = Uint8Array.from(atob(input), c => c.charCodeAt(0));
      const iv = encryptedData.slice(0, 12);
      const data = encryptedData.slice(12);

      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );

      const decoder = new TextDecoder();
      const result = decoder.decode(decryptedData);
      setOutput(result);
      
      toast.success("Text decrypted successfully");
    } catch (error) {
      toast.error("Failed to decrypt text. Make sure the password is correct.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (!output) {
      toast.error("No text to copy");
      return;
    }
    navigator.clipboard.writeText(output);
    toast.success("Text copied to clipboard");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setPassword("");
  };

  return (
    <ToolLayout toolId="text-encryption" categoryId="text-utilities">
      <div className="max-w-3xl mx-auto">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "encrypt" | "decrypt")} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          </TabsList>
          
          <TabsContent value="encrypt" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="encrypt-input">Text to Encrypt</Label>
                <Textarea
                  id="encrypt-input"
                  placeholder="Enter text to encrypt..."
                  className="min-h-[150px] font-mono"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="encrypt-password">Password</Label>
                <Input
                  id="encrypt-password"
                  type="password"
                  placeholder="Enter encryption password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={encrypt}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Encrypt
                </Button>
                <Button
                  variant="outline"
                  onClick={clearAll}
                  disabled={isProcessing}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>

            {output && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="encrypt-output">Encrypted Text</Label>
                  <Textarea
                    id="encrypt-output"
                    value={output}
                    readOnly
                    className="min-h-[100px] font-mono"
                  />
                </div>
                <Button
                  variant="secondary"
                  onClick={copyToClipboard}
                  className="w-full"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="decrypt" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="decrypt-input">Encrypted Text</Label>
                <Textarea
                  id="decrypt-input"
                  placeholder="Enter encrypted text..."
                  className="min-h-[150px] font-mono"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="decrypt-password">Password</Label>
                <Input
                  id="decrypt-password"
                  type="password"
                  placeholder="Enter decryption password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={decrypt}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <Unlock className="mr-2 h-4 w-4" />
                  Decrypt
                </Button>
                <Button
                  variant="outline"
                  onClick={clearAll}
                  disabled={isProcessing}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>

            {output && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="decrypt-output">Decrypted Text</Label>
                  <Textarea
                    id="decrypt-output"
                    value={output}
                    readOnly
                    className="min-h-[100px] font-mono"
                  />
                </div>
                <Button
                  variant="secondary"
                  onClick={copyToClipboard}
                  className="w-full"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
}