"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Clock, Copy, Download, Key, Plus, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

type TotpAccount = {
  id: string;
  name: string;
  secret: string;
  issuer?: string;
  digits: 6;
  period: 30;
  algorithm: "SHA-1";
};

const STORAGE_KEY = "aztools-totp-accounts";
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function getInitialAccounts(): TotpAccount[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((account): account is TotpAccount => (
      typeof account?.id === "string" &&
      typeof account.name === "string" &&
      typeof account.secret === "string"
    )).map((account) => ({
      id: account.id,
      name: account.name,
      secret: account.secret,
      issuer: typeof account.issuer === "string" ? account.issuer : undefined,
      digits: 6,
      period: 30,
      algorithm: "SHA-1",
    }));
  } catch {
    return [];
  }
}

function cleanSecret(secret: string) {
  return secret.replace(/[\s=-]/g, "").toUpperCase();
}

function decodeBase32(secret: string) {
  const cleaned = cleanSecret(secret);
  let bits = "";
  const bytes: number[] = [];

  for (const char of cleaned) {
    const value = BASE32_ALPHABET.indexOf(char);
    if (value === -1) {
      throw new Error("Secret key must be valid Base32.");
    }
    bits += value.toString(2).padStart(5, "0");
  }

  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(Number.parseInt(bits.slice(i, i + 8), 2));
  }

  if (bytes.length === 0) {
    throw new Error("Secret key is too short.");
  }

  return new Uint8Array(bytes);
}

function counterToBuffer(counter: number) {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  const high = Math.floor(counter / 0x100000000);
  const low = counter >>> 0;

  view.setUint32(0, high, false);
  view.setUint32(4, low, false);

  return buffer;
}

async function generateTotp(secret: string, timestamp = Date.now()) {
  const key = await crypto.subtle.importKey(
    "raw",
    decodeBase32(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const counter = Math.floor(timestamp / 1000 / 30);
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, counterToBuffer(counter)));
  const offset = signature[signature.length - 1]! & 0x0f;
  const binary =
    ((signature[offset]! & 0x7f) << 24) |
    ((signature[offset + 1]! & 0xff) << 16) |
    ((signature[offset + 2]! & 0xff) << 8) |
    (signature[offset + 3]! & 0xff);

  return (binary % 1_000_000).toString().padStart(6, "0");
}

function generateRandomSecret() {
  const random = new Uint8Array(20);
  crypto.getRandomValues(random);

  let bits = "";
  for (const byte of random) bits += byte.toString(2).padStart(8, "0");

  let secret = "";
  for (let i = 0; i + 5 <= bits.length; i += 5) {
    secret += BASE32_ALPHABET[Number.parseInt(bits.slice(i, i + 5), 2)];
  }

  return secret;
}

export default function Client() {
  const [accounts, setAccounts] = useState<TotpAccount[]>(getInitialAccounts);
  const [currentCodes, setCurrentCodes] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [showAddForm, setShowAddForm] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [issuerName, setIssuerName] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const progress = useMemo(() => (timeRemaining / 30) * 100, [timeRemaining]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  const refreshCodes = useCallback(async () => {
    const now = Date.now();
    const entries = await Promise.all(accounts.map(async (account) => {
      try {
        return [account.id, await generateTotp(account.secret, now)] as const;
      } catch {
        return [account.id, "Invalid"] as const;
      }
    }));

    setCurrentCodes(Object.fromEntries(entries));
    setTimeRemaining(30 - (Math.floor(now / 1000) % 30));
  }, [accounts]);

  useEffect(() => {
    const initial = window.setTimeout(() => {
      void refreshCodes();
    }, 0);
    const interval = window.setInterval(() => {
      void refreshCodes();
    }, 1000);

    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, [refreshCodes]);

  function addAccount() {
    const name = accountName.trim();
    const secret = cleanSecret(secretKey);

    if (!name) {
      toast.error("Account name is required.");
      return;
    }

    try {
      decodeBase32(secret);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid secret key.");
      return;
    }

    const account: TotpAccount = {
      id: crypto.randomUUID(),
      name,
      issuer: issuerName.trim() || undefined,
      secret,
      digits: 6,
      period: 30,
      algorithm: "SHA-1",
    };

    setAccounts((current) => [...current, account]);
    setAccountName("");
    setIssuerName("");
    setSecretKey("");
    setShowAddForm(false);
    toast.success("TOTP account added.");
  }

  function deleteAccount(id: string) {
    setAccounts((current) => current.filter((account) => account.id !== id));
    toast.success("TOTP account removed.");
  }

  async function copyCode(code: string, accountName: string) {
    if (!code || code === "Invalid") {
      toast.error("No valid code to copy.");
      return;
    }

    await navigator.clipboard.writeText(code);
    toast.success(`${accountName} code copied.`);
  }

  function exportAccounts() {
    const exportData = {
      accounts: accounts.map((account) => ({
        id: account.id,
        name: account.name,
        issuer: account.issuer,
        digits: account.digits,
        period: account.period,
        algorithm: account.algorithm,
        secret: "hidden",
      })),
      exportDate: new Date().toISOString(),
      note: "Secret keys are hidden. Re-enter secrets manually when restoring.",
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `totp-accounts-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success("Accounts exported.");
  }

  return (
    <ToolLayout toolId="totp-generator">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Two-Factor Authentication Generator
              </span>
              <span className="flex gap-2">
                <Button size="sm" onClick={() => setShowAddForm((value) => !value)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Account
                </Button>
                {accounts.length > 0 && (
                  <Button size="sm" variant="outline" onClick={exportAccounts}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                )}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time remaining
              </span>
              <span className="font-mono">{timeRemaining}s</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add TOTP Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="account-name">Account Name</Label>
                  <Input
                    id="account-name"
                    value={accountName}
                    onChange={(event) => setAccountName(event.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuer-name">Issuer</Label>
                  <Input
                    id="issuer-name"
                    value={issuerName}
                    onChange={(event) => setIssuerName(event.target.value)}
                    placeholder="GitHub"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secret-key">Secret Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="secret-key"
                    value={secretKey}
                    onChange={(event) => setSecretKey(event.target.value)}
                    placeholder="Base32 secret"
                    className="font-mono"
                  />
                  <Button variant="outline" size="icon" onClick={() => setSecretKey(generateRandomSecret())}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={addAccount}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Account
                </Button>
                <Button className="flex-1" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {accounts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <Card key={account.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="truncate text-base">{account.name}</CardTitle>
                      {account.issuer && <p className="truncate text-sm text-muted-foreground">{account.issuer}</p>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteAccount(account.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="mb-3 font-mono text-3xl font-bold text-primary">
                      {currentCodes[account.id] ?? "------"}
                    </div>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => copyCode(currentCodes[account.id] ?? "", account.name)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Code
                    </Button>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Algorithm</span>
                      <Badge variant="outline">{account.algorithm}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Digits</span>
                      <span>{account.digits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Period</span>
                      <span>{account.period}s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No TOTP Accounts</h3>
              <p className="mb-4 text-muted-foreground">
                Add an account to generate authenticator-compatible one-time codes.
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Security Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Secrets are stored only in this browser&apos;s local storage and never sent to a server.
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
