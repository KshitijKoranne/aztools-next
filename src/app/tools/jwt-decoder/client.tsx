'use client'

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface DecodedJWT {
  header: any;
  payload: any;
  signature: string;
  isValid: boolean;
  error?: string;
}

interface JWTClaims {
  iss?: string; // Issuer
  sub?: string; // Subject
  aud?: string | string[]; // Audience
  exp?: number; // Expiration Time
  nbf?: number; // Not Before
  iat?: number; // Issued At
  jti?: string; // JWT ID
}

export function JwtDecoderClient() {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);

  const decodeJWT = (token: string): DecodedJWT | null => {
    if (!token.trim()) {
      return null;
    }

    try {
      const [headerB64, payloadB64, signature] = token.split(".");
      
      if (!headerB64 || !payloadB64 || !signature) {
        throw new Error("Invalid JWT format - token must have 3 parts separated by dots");
      }

      // Add padding if necessary
      const addPadding = (str: string) => {
        const pad = str.length % 4;
        if (pad) {
          str += '='.repeat(4 - pad);
        }
        return str;
      };

      const header = JSON.parse(atob(addPadding(headerB64)));
      const payload = JSON.parse(atob(addPadding(payloadB64)));

      return {
        header,
        payload,
        signature,
        isValid: true
      };
    } catch (error) {
      return {
        header: null,
        payload: null,
        signature: "",
        isValid: false,
        error: (error as Error).message
      };
    }
  };

  const handleDecode = () => {
    if (!input.trim()) {
      toast.error("Please enter a JWT token");
      return;
    }

    const result = decodeJWT(input);
    setDecoded(result);
    
    if (result?.isValid) {
      toast.success("JWT decoded successfully");
    } else {
      toast.error(`Invalid JWT: ${result?.error}`);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  const clearAll = () => {
    setInput("");
    setDecoded(null);
  };

  // Auto-decode when input changes
  useEffect(() => {
    if (input.trim()) {
      const timeoutId = setTimeout(() => {
        const result = decodeJWT(input);
        setDecoded(result);
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    } else {
      setDecoded(null);
    }
  }, [input]);

  const formatTimestamp = (timestamp: number) => {
    try {
      return new Date(timestamp * 1000).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const isExpired = (exp?: number) => {
    if (!exp) return null;
    return Date.now() / 1000 > exp;
  };

  const getClaimInfo = (payload: JWTClaims) => {
    const claims = [];
    
    if (payload.iss) claims.push({ key: 'Issuer (iss)', value: payload.iss });
    if (payload.sub) claims.push({ key: 'Subject (sub)', value: payload.sub });
    if (payload.aud) claims.push({ 
      key: 'Audience (aud)', 
      value: Array.isArray(payload.aud) ? payload.aud.join(', ') : payload.aud 
    });
    if (payload.exp) claims.push({ 
      key: 'Expires (exp)', 
      value: `${formatTimestamp(payload.exp)} (${payload.exp})`,
      isExpired: isExpired(payload.exp)
    });
    if (payload.nbf) claims.push({ 
      key: 'Not Before (nbf)', 
      value: `${formatTimestamp(payload.nbf)} (${payload.nbf})`
    });
    if (payload.iat) claims.push({ 
      key: 'Issued At (iat)', 
      value: `${formatTimestamp(payload.iat)} (${payload.iat})`
    });
    if (payload.jti) claims.push({ key: 'JWT ID (jti)', value: payload.jti });

    return claims;
  };

  return (
    <ToolLayout toolId="jwt-decoder" categoryId="developer-tools">
      <div className="space-y-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              JWT Decoder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jwt-input">JWT Token</Label>
              <Textarea
                id="jwt-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                className="min-h-[120px] font-mono text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleDecode} className="flex-1 sm:flex-none">
                Decode JWT
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {decoded && (
          <div className="space-y-6">
            {/* Validation Status */}
            <Card className={decoded.isValid ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {decoded.isValid ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Valid JWT Token
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      Invalid JWT Token
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              {!decoded.isValid && (
                <CardContent>
                  <p className="text-red-600 dark:text-red-400 font-mono text-sm">
                    {decoded.error}
                  </p>
                </CardContent>
              )}
            </Card>

            {decoded.isValid && (
              <>
                {/* JWT Claims Summary */}
                {decoded.payload && (
                  <Card>
                    <CardHeader>
                      <CardTitle>JWT Claims Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {getClaimInfo(decoded.payload).map((claim, index) => (
                          <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-muted/50 rounded-lg">
                            <div className="font-medium min-w-[140px]">{claim.key}:</div>
                            <div className="flex-1 font-mono text-sm break-all">
                              {claim.value}
                            </div>
                            {claim.isExpired !== undefined && (
                              <Badge variant={claim.isExpired ? "destructive" : "secondary"}>
                                {claim.isExpired ? "Expired" : "Valid"}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Header Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Header
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleCopy(JSON.stringify(decoded.header, null, 2), "Header")}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm border">
                      <code>{JSON.stringify(decoded.header, null, 2)}</code>
                    </pre>
                  </CardContent>
                </Card>

                {/* Payload Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Payload
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleCopy(JSON.stringify(decoded.payload, null, 2), "Payload")}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm border">
                      <code>{JSON.stringify(decoded.payload, null, 2)}</code>
                    </pre>
                  </CardContent>
                </Card>

                {/* Signature Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Signature (Base64 Encoded)
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleCopy(decoded.signature, "Signature")}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-4 rounded-lg border">
                      <code className="text-sm break-all">{decoded.signature}</code>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

      </div>
    </ToolLayout>
  );
}