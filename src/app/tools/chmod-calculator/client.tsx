"use client";

import { useMemo, useState } from "react";
import { Copy, Terminal } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Role = "owner" | "group" | "other";
type Perm = "read" | "write" | "execute";

const roles: Role[] = ["owner", "group", "other"];
const perms: Array<[Perm, string, number]> = [["read", "Read", 4], ["write", "Write", 2], ["execute", "Execute", 1]];

function fromOctal(octal: string) {
  const digits = octal.replace(/[^0-7]/g, "").slice(-3).padStart(3, "0");
  return Object.fromEntries(roles.map((role, index) => {
    const digit = Number(digits[index]);
    return [role, { read: Boolean(digit & 4), write: Boolean(digit & 2), execute: Boolean(digit & 1) }];
  })) as Record<Role, Record<Perm, boolean>>;
}

function toOctal(state: Record<Role, Record<Perm, boolean>>) {
  return roles.map((role) => perms.reduce((sum, [perm,, value]) => sum + (state[role][perm] ? value : 0), 0)).join("");
}

export default function Client() {
  const [permissions, setPermissions] = useState(() => fromOctal("755"));
  const octal = useMemo(() => toOctal(permissions), [permissions]);
  const symbolic = useMemo(() => roles.map((role) => `${permissions[role].read ? "r" : "-"}${permissions[role].write ? "w" : "-"}${permissions[role].execute ? "x" : "-"}`).join(""), [permissions]);

  function setFromOctal(value: string) {
    setPermissions(fromOctal(value));
  }

  function toggle(role: Role, perm: Perm, checked: boolean) {
    setPermissions((current) => ({ ...current, [role]: { ...current[role], [perm]: checked } }));
  }

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    toast.success("Copied.");
  }

  return (
    <ToolLayout toolId="chmod-calculator">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Terminal className="h-5 w-5" />CHMOD Calculator</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Octal Permission</Label>
              <Input value={octal} onChange={(event) => setFromOctal(event.target.value)} className="max-w-40 font-mono text-lg" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {roles.map((role) => (
                <div key={role} className="rounded-md border p-4">
                  <div className="mb-3 font-medium capitalize">{role}</div>
                  <div className="space-y-3">
                    {perms.map(([perm, label]) => (
                      <label key={perm} className="flex items-center gap-2 text-sm">
                        <Checkbox checked={permissions[role][perm]} onCheckedChange={(value) => toggle(role, perm, Boolean(value))} />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Result</CardTitle></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {[
              ["Octal", octal],
              ["Symbolic", symbolic],
              ["Command", `chmod ${octal} file`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border p-4">
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="mt-1 break-all font-mono text-lg font-semibold">{value}</div>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => copy(value)}><Copy className="mr-2 h-4 w-4" />Copy</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
