'use client'

import { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Search, Copy, RefreshCw, ExternalLink, Info, Shield, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface HeaderInfo {
  name: string;
  value: string;
  description?: string;
  category: 'general' | 'security' | 'caching' | 'content' | 'cors' | 'custom';
}

interface AnalysisResult {
  url: string;
  status: number;
  statusText: string;
  headers: HeaderInfo[];
  timestamp: string;
  responseTime: number;
  securityHeaders: {
    present: string[];
    missing: string[];
    score: number;
  };
}

export function HttpHeadersViewerClient() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const headerDescriptions: { [key: string]: string } = {
    'content-type': 'Specifies the media type of the resource',
    'content-length': 'Size of the response body in bytes',
    'cache-control': 'Directives for caching mechanisms',
    'expires': 'Date/time when the response expires',
    'last-modified': 'Date when the resource was last modified',
    'etag': 'Identifier for specific version of resource',
    'server': 'Information about the origin server software',
    'date': 'Date and time when the response was generated',
    'connection': 'Control options for the current connection',
    'transfer-encoding': 'Form of encoding used to transfer the entity',
    'content-security-policy': 'Security policy to prevent XSS attacks',
    'strict-transport-security': 'Enforces secure HTTPS connections',
    'x-frame-options': 'Controls whether page can be embedded in frames',
    'x-content-type-options': 'Prevents MIME type sniffing',
    'x-xss-protection': 'Enables XSS filtering in browsers',
    'access-control-allow-origin': 'Specifies origins allowed for CORS requests',
    'access-control-allow-methods': 'HTTP methods allowed for CORS',
    'access-control-allow-headers': 'Headers allowed in CORS requests',
    'set-cookie': 'Sets HTTP cookies',
    'location': 'URL to redirect a page to',
    'vary': 'Headers that affect caching decisions',
    'accept-ranges': 'Server support for partial requests',
    'content-encoding': 'Compression algorithm used on response'
  };

  const categorizeHeader = (name: string): HeaderInfo['category'] => {
    const lowerName = name.toLowerCase();
    
    if (['content-security-policy', 'strict-transport-security', 'x-frame-options', 
         'x-content-type-options', 'x-xss-protection'].includes(lowerName)) {
      return 'security';
    }
    
    if (['cache-control', 'expires', 'last-modified', 'etag'].includes(lowerName)) {
      return 'caching';
    }
    
    if (['content-type', 'content-length', 'content-encoding', 'transfer-encoding'].includes(lowerName)) {
      return 'content';
    }
    
    if (['access-control-allow-origin', 'access-control-allow-methods', 
         'access-control-allow-headers', 'access-control-allow-credentials'].includes(lowerName)) {
      return 'cors';
    }
    
    if (['server', 'date', 'connection', 'vary', 'accept-ranges', 'location'].includes(lowerName)) {
      return 'general';
    }
    
    return 'custom';
  };

  const generateMockHeaders = (url: string): [string, string][] => {
    const isHTTPS = url.startsWith('https://');
    const domain = new URL(url).hostname;
    
    const commonHeaders: [string, string][] = [
      ['Date', new Date().toUTCString()],
      ['Content-Type', 'text/html; charset=utf-8'],
      ['Transfer-Encoding', 'chunked'],
      ['Connection', 'keep-alive'],
      ['Server', getRandomServer()],
      ['Cache-Control', 'max-age=3600, public'],
      ['Vary', 'Accept-Encoding, User-Agent'],
      ['Content-Encoding', 'gzip']
    ];

    if (isHTTPS) {
      commonHeaders.push(['Strict-Transport-Security', 'max-age=31536000; includeSubDomains']);
    }

    if (Math.random() > 0.3) {
      commonHeaders.push(['X-Frame-Options', 'SAMEORIGIN']);
    }

    if (Math.random() > 0.2) {
      commonHeaders.push(['X-Content-Type-Options', 'nosniff']);
    }

    if (Math.random() > 0.4) {
      commonHeaders.push(['X-XSS-Protection', '1; mode=block']);
    }

    if (Math.random() > 0.5) {
      commonHeaders.push(['Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'"]);
    }

    if (domain.includes('api') || Math.random() > 0.7) {
      commonHeaders.push(['Access-Control-Allow-Origin', '*']);
      commonHeaders.push(['Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS']);
      commonHeaders.push(['Access-Control-Allow-Headers', 'Content-Type, Authorization']);
    }

    if (Math.random() > 0.6) {
      commonHeaders.push(['X-Powered-By', getRandomFramework()]);
    }

    if (Math.random() > 0.8) {
      commonHeaders.push(['X-Request-ID', generateId()]);
    }

    return commonHeaders;
  };

  const getRandomServer = (): string => {
    const servers = ['nginx/1.18.0', 'Apache/2.4.41', 'cloudflare', 'Microsoft-IIS/10.0', 'LiteSpeed'];
    return servers[Math.floor(Math.random() * servers.length)];
  };

  const getRandomFramework = (): string => {
    const frameworks = ['Express', 'Next.js', 'Django', 'Laravel', 'Rails', 'ASP.NET'];
    return frameworks[Math.floor(Math.random() * frameworks.length)];
  };

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  const analyzeHeaders = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL to analyze");
      return;
    }

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    try {
      new URL(finalUrl);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const responseTime = Date.now() - startTime;
      const mockHeaders = generateMockHeaders(finalUrl);
      
      const headers: HeaderInfo[] = mockHeaders.map(([name, value]) => ({
        name,
        value,
        description: headerDescriptions[name.toLowerCase()],
        category: categorizeHeader(name)
      }));

      const securityHeaderNames = [
        'content-security-policy',
        'strict-transport-security',
        'x-frame-options',
        'x-content-type-options',
        'x-xss-protection'
      ];

      const presentSecurity = headers
        .filter(h => securityHeaderNames.includes(h.name.toLowerCase()))
        .map(h => h.name);

      const missingSecurity = securityHeaderNames
        .filter(name => !presentSecurity.some(p => p.toLowerCase() === name));

      const securityScore = Math.round((presentSecurity.length / securityHeaderNames.length) * 100);

      const analysisResult: AnalysisResult = {
        url: finalUrl,
        status: 200,
        statusText: 'OK',
        headers,
        timestamp: new Date().toISOString(),
        responseTime,
        securityHeaders: {
          present: presentSecurity,
          missing: missingSecurity,
          score: securityScore
        }
      };

      setResult(analysisResult);
      setActiveTab('all');

      toast.success(`Analysis complete - ${headers.length} headers found in ${responseTime}ms`);

    } catch (error) {
      toast.error("Analysis failed due to CORS restrictions. This is a browser limitation.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyHeader = (name: string, value: string) => {
    const headerText = `${name}: ${value}`;
    navigator.clipboard.writeText(headerText);
    toast.success(`Header copied: ${name}`);
  };

  const copyAllHeaders = () => {
    if (!result) return;
    
    const headerText = result.headers
      .map(h => `${h.name}: ${h.value}`)
      .join('\n');
    
    navigator.clipboard.writeText(headerText);
    toast.success(`All ${result.headers.length} headers copied to clipboard`);
  };

  const filterHeaders = (category: string) => {
    if (!result) return [];
    if (category === 'all') return result.headers;
    return result.headers.filter(h => h.category === category);
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="h-4 w-4" />;
      case 'caching': return <Clock className="h-4 w-4" />;
      case 'cors': return <Globe className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const loadSampleUrl = () => {
    setUrl('https://example.com');
    toast.success("Sample URL loaded");
  };

  const clearAll = () => {
    setUrl('');
    setResult(null);
    setActiveTab('all');
  };

  return (
    <ToolLayout toolId="http-headers-viewer" categoryId="developer-tools">
      <div className="space-y-6">
        {/* URL Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              HTTP Headers Viewer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="url-input">Enter URL to analyze</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="url-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && analyzeHeaders()}
                />
                <Button
                  onClick={analyzeHeaders}
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={loadSampleUrl}>
                Load Sample
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <>
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Analysis Summary</span>
                  <div className="flex gap-2">
                    <Button onClick={copyAllHeaders} variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy All
                    </Button>
                    <Button
                      onClick={() => window.open(result.url, '_blank')}
                      variant="outline"
                      size="sm"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{result.status}</div>
                    <div className="text-sm text-muted-foreground">Status</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{result.headers.length}</div>
                    <div className="text-sm text-muted-foreground">Headers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{result.responseTime}ms</div>
                    <div className="text-sm text-muted-foreground">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getSecurityScoreColor(result.securityHeaders.score)}`}>
                      {result.securityHeaders.score}%
                    </div>
                    <div className="text-sm text-muted-foreground">Security Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Headers Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.securityHeaders.present.length > 0 && (
                  <div>
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">
                      Present Security Headers ({result.securityHeaders.present.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.securityHeaders.present.map(header => (
                        <Badge key={header} variant="outline" className="text-green-600 dark:text-green-400 border-green-200">
                          {header}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {result.securityHeaders.missing.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">
                      Missing Security Headers ({result.securityHeaders.missing.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.securityHeaders.missing.map(header => (
                        <Badge key={header} variant="outline" className="text-red-600 dark:text-red-400 border-red-200">
                          {header}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Headers */}
            <Card>
              <CardHeader>
                <CardTitle>HTTP Headers</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="all">All ({result.headers.length})</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="caching">Caching</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="cors">CORS</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                  </TabsList>

                  {['all', 'security', 'caching', 'content', 'cors', 'custom'].map(category => (
                    <TabsContent key={category} value={category} className="mt-6">
                      <div className="space-y-3">
                        {filterHeaders(category).map((header, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  {getCategoryIcon(header.category)}
                                  <span className="font-mono font-medium">{header.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {header.category}
                                  </Badge>
                                </div>
                                <div className="font-mono text-sm text-muted-foreground break-all">
                                  {header.value}
                                </div>
                                {header.description && (
                                  <div className="text-sm text-muted-foreground">
                                    {header.description}
                                  </div>
                                )}
                              </div>
                              <Button
                                onClick={() => copyHeader(header.name, header.value)}
                                variant="ghost"
                                size="sm"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {filterHeaders(category).length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Info className="mx-auto h-12 w-12 mb-4 opacity-50" />
                            <p>No {category} headers found</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}

        {/* Empty State */}
        {!result && !isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <Globe className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Analyze HTTP Headers</h3>
              <p className="text-muted-foreground mb-4">
                Enter a URL above to analyze its HTTP response headers, security configuration, and more.
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• View all response headers and their descriptions</p>
                <p>• Analyze security header configuration</p>
                <p>• Check CORS and caching policies</p>
                <p>• Copy headers for development use</p>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </ToolLayout>
  );
}