'use client'

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash, Send, Globe, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface KeyValue {
  key: string;
  value: string;
}

export function ApiTesterClient() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState<KeyValue[]>([{ key: "", value: "" }]);
  const [params, setParams] = useState<KeyValue[]>([{ key: "", value: "" }]);
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});

  const handleAddHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const handleRemoveHeader = (index: number) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
  };

  const handleHeaderChange = (index: number, field: "key" | "value", value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const handleAddParam = () => {
    setParams([...params, { key: "", value: "" }]);
  };

  const handleRemoveParam = (index: number) => {
    const newParams = [...params];
    newParams.splice(index, 1);
    setParams(newParams);
  };

  const handleParamChange = (index: number, field: "key" | "value", value: string) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  const buildUrl = () => {
    let finalUrl = url.trim();
    const validParams = params.filter(p => p.key.trim() && p.value.trim());
    
    if (validParams.length > 0) {
      const urlParams = new URLSearchParams();
      validParams.forEach(p => urlParams.append(p.key, p.value));
      const separator = finalUrl.includes('?') ? '&' : '?';
      finalUrl += separator + urlParams.toString();
    }
    
    return finalUrl;
  };

  const handleSendRequest = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setLoading(true);
    setResponse("");
    setResponseTime(null);
    setStatusCode(null);
    setResponseHeaders({});

    const startTime = Date.now();

    try {
      const finalUrl = buildUrl();
      const validHeaders = headers.filter(h => h.key.trim() && h.value.trim());
      const headerObj = validHeaders.reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

      const requestOptions: RequestInit = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...headerObj
        }
      };

      if (method !== 'GET' && method !== 'HEAD' && requestBody.trim()) {
        requestOptions.body = requestBody;
      }

      const response = await fetch(finalUrl, requestOptions);
      const endTime = Date.now();
      
      setResponseTime(endTime - startTime);
      setStatusCode(response.status);

      // Get response headers
      const respHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        respHeaders[key] = value;
      });
      setResponseHeaders(respHeaders);

      // Get response body
      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType?.includes('application/json')) {
        responseData = await response.json();
        setResponse(JSON.stringify(responseData, null, 2));
      } else {
        responseData = await response.text();
        setResponse(responseData);
      }

      if (response.ok) {
        toast.success(`Request completed successfully (${response.status})`);
      } else {
        toast.error(`Request failed with status ${response.status}`);
      }

    } catch (error) {
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setStatusCode(0);
      
      let errorMessage = 'Request failed';
      if (error instanceof Error) {
        if (error.message.includes('CORS')) {
          errorMessage = 'CORS error: This request is blocked by browser security. Try using a CORS proxy or server-side request.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error: Unable to reach the server. Check your internet connection or the URL.';
        } else {
          errorMessage = error.message;
        }
      }

      setResponse(JSON.stringify({ 
        error: errorMessage,
        type: 'Client Error',
        timestamp: new Date().toISOString()
      }, null, 2));
      
      toast.error(errorMessage);
    }

    setLoading(false);
  };

  const clearAll = () => {
    setUrl("");
    setMethod("GET");
    setHeaders([{ key: "", value: "" }]);
    setParams([{ key: "", value: "" }]);
    setRequestBody("");
    setResponse("");
    setResponseTime(null);
    setStatusCode(null);
    setResponseHeaders({});
  };

  const getStatusBadgeColor = () => {
    if (!statusCode) return "bg-gray-100 text-gray-800";
    if (statusCode >= 200 && statusCode < 300) return "bg-green-100 text-green-800";
    if (statusCode >= 300 && statusCode < 400) return "bg-yellow-100 text-yellow-800";
    if (statusCode >= 400 && statusCode < 500) return "bg-orange-100 text-orange-800";
    if (statusCode >= 500) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <ToolLayout toolId="api-tester" categoryId="developer-tools">
      <div className="space-y-6">
        {/* Request Builder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              API Tester
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="w-full sm:w-32">
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="HEAD">HEAD</SelectItem>
                    <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                placeholder="https://api.example.com/endpoint"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSendRequest} disabled={loading} className="w-full sm:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </>
                )}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Request Configuration */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="params" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="params">Query Params</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
                <TabsTrigger value="body">Request Body</TabsTrigger>
              </TabsList>

              <TabsContent value="params" className="p-4 space-y-3">
                <div className="space-y-2">
                  {params.map((param, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Parameter name"
                        value={param.key}
                        onChange={(e) => handleParamChange(index, "key", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={param.value}
                        onChange={(e) => handleParamChange(index, "value", e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveParam(index)}
                        disabled={params.length === 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddParam}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Parameter
                </Button>
              </TabsContent>

              <TabsContent value="headers" className="p-4 space-y-3">
                <div className="space-y-2">
                  {headers.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Header name"
                        value={header.key}
                        onChange={(e) => handleHeaderChange(index, "key", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={header.value}
                        onChange={(e) => handleHeaderChange(index, "value", e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveHeader(index)}
                        disabled={headers.length === 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddHeader}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Header
                </Button>
              </TabsContent>

              <TabsContent value="body" className="p-4">
                <Textarea
                  placeholder="Enter request body (JSON, XML, form data, etc.)"
                  className="min-h-[200px] font-mono text-sm"
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Response */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Response
              {(statusCode !== null || responseTime !== null) && (
                <div className="flex items-center gap-2">
                  {statusCode !== null && (
                    <Badge className={getStatusBadgeColor()}>
                      {statusCode === 0 ? (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Error
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {statusCode}
                        </>
                      )}
                    </Badge>
                  )}
                  {responseTime !== null && (
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      {responseTime}ms
                    </Badge>
                  )}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="body" className="w-full">
              <TabsList>
                <TabsTrigger value="body">Response Body</TabsTrigger>
                <TabsTrigger value="headers">Response Headers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="body">
                <Textarea
                  placeholder="Response will appear here..."
                  className="min-h-[300px] font-mono text-sm"
                  value={response}
                  readOnly
                />
              </TabsContent>
              
              <TabsContent value="headers">
                <div className="space-y-2">
                  {Object.keys(responseHeaders).length > 0 ? (
                    Object.entries(responseHeaders).map(([key, value]) => (
                      <div key={key} className="flex gap-2 p-2 border rounded">
                        <div className="font-mono text-sm font-medium min-w-0 flex-1">
                          {key}:
                        </div>
                        <div className="font-mono text-sm text-muted-foreground flex-2">
                          {value}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Response headers will appear here
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

      </div>
    </ToolLayout>
  );
}