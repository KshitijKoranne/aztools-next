"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Copy, Lock, Unlock, RefreshCw } from "lucide-react";
import { toast } from "sonner";

async function generateKey(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(password));
  return crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

export default function TextEncryptionClient() {
  const [activeTab, setActiveTab] = useState<"encrypt" | "decrypt">("encrypt");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const encrypt = async () => {
    if (!input.trim() || !password.trim()) {
      toast.error("Please enter both text and password");
      return;
    }
    try {
      setIsProcessing(true);
      const key = await generateKey(password);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        new TextEncoder().encode(input)
      );
      setOutput(btoa(String.fromCharCode(...iv, ...new Uint8Array(encrypted))));
      toast.success("Encrypted successfully");
    } catch {
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
      const bytes = Uint8Array.from(atob(input), (c) => c.charCodeAt(0));
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: bytes.slice(0, 12) },
        key,
        bytes.slice(12)
      );
      setOutput(new TextDecoder().decode(decrypted));
      toast.success("Decrypted successfully");
    } catch {
      toast.error("Decryption failed. Check password and encrypted text.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setPassword("");
  };

  const tabChange = (val: string) => {
    setActiveTab(val as "encrypt" | "decrypt");
    setInput("");
    setOutput("");
  };

  return (
    <ToolLayout toolId="text-encryption">
      <div className="max-w-3xl mx-auto">
        <Tabs value={activeTab} onValueChange={tabChange} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          </TabsList>

          {(["encrypt", "decrypt"] as const).map((mode) => (
            <TabsContent key={mode} value={mode} className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{mode === "encrypt" ? "Text to Encrypt" : "Encrypted Text"}</Label>
                  <Textarea
                    placeholder={mode === "encrypt" ? "Enter text to encrypt..." : "Enter encrypted text..."}
                    className="min-h-[150px] font-mono"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder={`Enter ${mode === "encrypt" ? "encryption" : "decryption"} password...`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === "encrypt" ? "new-password" : "current-password"}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={mode === "encrypt" ? encrypt : decrypt}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {mode === "encrypt" ? (
                      <><Lock className="mr-2 h-4 w-4" /> Encrypt</>
                    ) : (
                      <><Unlock className="mr-2 h-4 w-4" /> Decrypt</>
                    )}
                  </Button>
                  <Button variant="outline" onClick={clearAll} disabled={isProcessing}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Clear
                  </Button>
                </div>
              </div>

              {output && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{mode === "encrypt" ? "Encrypted Text" : "Decrypted Text"}</Label>
                    <Textarea value={output} readOnly className="min-h-[100px] font-mono" />
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      navigator.clipboard.writeText(output);
                      toast.success("Copied to clipboard");
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </ToolLayout>
  );
}
