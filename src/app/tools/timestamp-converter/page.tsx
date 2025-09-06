
"use client"

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RefreshCw, Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Timestamp Converter - AZ Tools",
  description: "Convert Unix timestamps to human-readable dates and vice versa.",
  keywords: ["timestamp", "unix timestamp", "converter", "date", "time"],
};

const TimestampConverter = () => {
  const [timestamp, setTimestamp] = useState("");
  const [humanDate, setHumanDate] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [currentTimestamp, setCurrentTimestamp] = useState("");
  const [activeTab, setActiveTab] = useState("to-human");
  const { toast } = useToast();

  // Update current timestamp every second
  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000).toString());
    };
    
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const convertToHuman = () => {
    if (!timestamp.trim()) {
      toast({
        title: "Error",
        description: "Please enter a timestamp",
        variant: "destructive"
      });
      return;
    }

    try {
      let timestampNum = parseInt(timestamp);
      
      // Handle both seconds and milliseconds
      if (timestamp.length > 10) {
        timestampNum = Math.floor(timestampNum / 1000);
      }
      
      if (isNaN(timestampNum)) {
        throw new Error("Invalid timestamp format");
      }

      const date = new Date(timestampNum * 1000);
      
      if (isNaN(date.getTime())) {
        throw new Error("Invalid timestamp value");
      }

      // Format according to timezone
      let formattedDate;
      if (timezone === "UTC") {
        formattedDate = date.toISOString().replace('T', ' ').replace('Z', ' UTC');
      } else if (timezone === "local") {
        formattedDate = date.toLocaleString() + " (Local Time)";
      } else {
        // For specific timezones
        formattedDate = date.toLocaleString("en-US", { 
          timeZone: timezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) + ` (${timezone})`;
      }

      setHumanDate(formattedDate);
      
      toast({
        title: "Success",
        description: "Timestamp converted to human readable format"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to convert timestamp",
        variant: "destructive"
      });
    }
  };

  const convertToTimestamp = () => {
    if (!humanDate.trim()) {
      toast({
        title: "Error",
        description: "Please enter a date/time",
        variant: "destructive"
      });
      return;
    }

    try {
      const date = new Date(humanDate);
      
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }

      const timestampSeconds = Math.floor(date.getTime() / 1000);
      setTimestamp(timestampSeconds.toString());
      
      toast({
        title: "Success",
        description: "Date converted to timestamp"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to convert date",
        variant: "destructive"
      });
    }
  };

  const useCurrentTime = () => {
    setTimestamp(currentTimestamp);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Value copied to clipboard"
    });
  };

  const clearAll = () => {
    setTimestamp("");
    setHumanDate("");
  };

  const getRelativeTime = (timestampStr: string) => {
    if (!timestampStr) return "";
    
    try {
      let ts = parseInt(timestampStr);
      if (timestampStr.length > 10) {
        ts = Math.floor(ts / 1000);
      }
      
      const now = Math.floor(Date.now() / 1000);
      const diff = now - ts;
      
      if (Math.abs(diff) < 60) return "Just now";
      if (Math.abs(diff) < 3600) return `${Math.floor(Math.abs(diff) / 60)} minutes ${diff > 0 ? 'ago' : 'from now'}`;
      if (Math.abs(diff) < 86400) return `${Math.floor(Math.abs(diff) / 3600)} hours ${diff > 0 ? 'ago' : 'from now'}`;
      
      return `${Math.floor(Math.abs(diff) / 86400)} days ${diff > 0 ? 'ago' : 'from now'}`;
    } catch {
      return "";
    }
  };

  const getTimestampInfo = (timestampStr: string) => {
    if (!timestampStr) return null;
    
    try {
      const isMilliseconds = timestampStr.length > 10;
      let ts = parseInt(timestampStr);
      
      return {
        format: isMilliseconds ? "Milliseconds" : "Seconds",
        length: timestampStr.length,
        isValid: !isNaN(ts) && ts > 0
      };
    } catch {
      return null;
    }
  };

  const commonTimezones = [
    { value: "UTC", label: "UTC" },
    { value: "local", label: "Local Time" },
    { value: "America/New_York", label: "Eastern (New York)" },
    { value: "America/Chicago", label: "Central (Chicago)" },
    { value: "America/Denver", label: "Mountain (Denver)" },
    { value: "America/Los_Angeles", label: "Pacific (Los Angeles)" },
    { value: "Europe/London", label: "GMT (London)" },
    { value: "Europe/Paris", label: "CET (Paris)" },
    { value: "Asia/Tokyo", label: "JST (Tokyo)" },
    { value: "Asia/Shanghai", label: "CST (Shanghai)" },
    { value: "Asia/Kolkata", label: "IST (India)" },
    { value: "Australia/Sydney", label: "AEST (Sydney)" }
  ];

  const timestampInfo = getTimestampInfo(timestamp);

  return (
    <ToolLayout
      toolId="timestamp-converter"
      categoryId="data-tools"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timestamp Converter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-blue-800">Current Unix Timestamp</div>
                  <div className="text-lg font-mono text-blue-900">{currentTimestamp}</div>
                </div>
                <Button size="sm" onClick={useCurrentTime}>
                  Use Current
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="to-human">Timestamp → Human</TabsTrigger>
                <TabsTrigger value="to-timestamp">Human → Timestamp</TabsTrigger>
              </TabsList>

              <TabsContent value="to-human" className="space-y-4">
                <div className="space-y-2">
                  <Label>Unix Timestamp</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="1640995200 or 1640995200000"
                      value={timestamp}
                      onChange={(e) => setTimestamp(e.target.value)}
                      className="font-mono"
                    />
                    <Button onClick={convertToHuman}>
                      Convert
                    </Button>
                  </div>
                  {timestampInfo && (
                    <div className="text-xs text-muted-foreground">
                      Format: {timestampInfo.format} ({timestampInfo.length} digits)
                      {timestamp && ` • ${getRelativeTime(timestamp)}`}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {commonTimezones.map(tz => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {humanDate && (
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">Human Readable</div>
                          <div className="font-mono text-lg">{humanDate}</div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(humanDate)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="to-timestamp" className="space-y-4">
                <div className="space-y-2">
                  <Label>Date/Time</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="2024-01-01 12:00:00 or January 1, 2024"
                      value={humanDate}
                      onChange={(e) => setHumanDate(e.target.value)}
                    />
                    <Button onClick={convertToTimestamp}>
                      Convert
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Supports various formats: YYYY-MM-DD, MM/DD/YYYY, January 1 2024, etc.
                  </div>
                </div>

                {timestamp && (
                  <Card>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-muted-foreground">Unix Timestamp (seconds)</div>
                            <div className="font-mono text-lg">{timestamp}</div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(timestamp)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-muted-foreground">Unix Timestamp (milliseconds)</div>
                            <div className="font-mono text-lg">{timestamp}000</div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(timestamp + "000")}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={clearAll}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </ToolLayout>
  );
};

export default TimestampConverter;
