"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Check, X, AlertTriangle, Eye, EyeOff } from "lucide-react";

function analyze(pwd: string) {
  let score = 0;
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (pwd.length >= 8) score += 25; else issues.push("Minimum 8 characters required");
  if (pwd.length >= 12) score += 10;
  if (/[a-z]/.test(pwd)) score += 5; else issues.push("Add lowercase letters");
  if (/[A-Z]/.test(pwd)) score += 5; else issues.push("Add uppercase letters");
  if (/\d/.test(pwd)) score += 10; else issues.push("Add numbers");
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) score += 15; else issues.push("Add special characters");
  if (/(.)(\1{2,})/.test(pwd)) { score -= 10; issues.push("Avoid repeating characters"); }
  if (/(abc|bcd|123|234|qwerty|password|admin)/i.test(pwd)) { score -= 15; issues.push("Avoid common patterns"); }
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd) && /\d/.test(pwd) && /[!@#$%^&*]/.test(pwd)) score += 10;

  score = Math.max(0, Math.min(100, score));

  if (pwd.length < 12) suggestions.push("Use at least 12 characters");
  if (!/[!@#$%^&*]/.test(pwd)) suggestions.push("Add special characters");
  suggestions.push("Use a unique password for each account");

  const strength = score >= 90 ? "Very Strong" : score >= 75 ? "Strong" : score >= 60 ? "Good" : score >= 40 ? "Fair" : score >= 20 ? "Weak" : "Very Weak";
  const timeToHack = score >= 80 ? "Centuries" : score >= 60 ? "Years" : score >= 40 ? "Months" : score >= 20 ? "Days" : "Minutes";

  return { score, strength, issues, suggestions, timeToHack };
}

const STRENGTH_COLORS: Record<string, string> = {
  "Very Strong": "text-green-600 dark:text-green-400",
  "Strong": "text-green-600 dark:text-green-400",
  "Good": "text-blue-600 dark:text-blue-400",
  "Fair": "text-yellow-600 dark:text-yellow-400",
  "Weak": "text-orange-600 dark:text-orange-400",
  "Very Weak": "text-red-600 dark:text-red-400",
};

export default function Client() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const result = password ? analyze(password) : null;

  return (
    <ToolLayout toolId="password-strength-checker">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Password Strength Checker</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input type={show ? "text" : "password"} placeholder="Enter your password..." value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
              <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShow(!show)}>
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {result && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Strength</span>
                    <Badge className={STRENGTH_COLORS[result.strength]}>{result.strength}</Badge>
                  </div>
                  <Progress value={result.score} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground"><span>0</span><span>{result.score}/100</span><span>100</span></div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader><CardTitle className="text-sm flex items-center gap-2"><X className="h-4 w-4 text-red-500" /> Issues ({result.issues.length})</CardTitle></CardHeader>
                    <CardContent>
                      {result.issues.length === 0
                        ? <div className="flex items-center gap-2 text-green-600 text-sm"><Check className="h-4 w-4" />No issues!</div>
                        : <ul className="space-y-1 text-sm">{result.issues.map((i, k) => <li key={k} className="flex items-start gap-2"><X className="h-3 w-3 text-red-500 mt-0.5 shrink-0" />{i}</li>)}</ul>}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-yellow-500" /> Suggestions</CardTitle></CardHeader>
                    <CardContent><ul className="space-y-1 text-sm">{result.suggestions.slice(0, 5).map((s, k) => <li key={k} className="flex items-start gap-2"><AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 shrink-0" />{s}</li>)}</ul></CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Estimated time to crack</p>
                    <p className="text-2xl font-bold">{result.timeToHack}</p>
                    <p className="text-xs text-muted-foreground mt-1">Based on brute-force estimates</p>
                  </CardContent>
                </Card>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
