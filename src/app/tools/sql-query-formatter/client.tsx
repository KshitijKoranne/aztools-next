'use client'

import React, { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Copy, FileDown, Database, Settings, AlertCircle, CheckCircle, Wand2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface FormattingOptions {
  language: string;
  indentSize: number;
  uppercase: boolean;
  linesBetweenQueries: number;
  denseOperators: boolean;
  newlineBeforeOpenParen: boolean;
  newlineBeforeCloseParen: boolean;
}

export function SqlQueryFormatterClient() {
  const [sqlInput, setSqlInput] = useState('');
  const [formattedOutput, setFormattedOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<FormattingOptions>({
    language: 'sql',
    indentSize: 2,
    uppercase: true,
    linesBetweenQueries: 1,
    denseOperators: false,
    newlineBeforeOpenParen: false,
    newlineBeforeCloseParen: true
  });

  const formatSQL = useCallback((sql: string, options: FormattingOptions): string => {
    if (!sql.trim()) return '';

    try {
      let formatted = sql.trim();
      
      // Remove extra whitespace
      formatted = formatted.replace(/\s+/g, ' ');
      
      // Define SQL keywords
      const keywords = [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN',
        'GROUP BY', 'HAVING', 'ORDER BY', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER',
        'DROP', 'TABLE', 'VIEW', 'INDEX', 'DATABASE', 'SCHEMA', 'UNION', 'UNION ALL',
        'DISTINCT', 'AS', 'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE',
        'IS', 'NULL', 'NOT NULL', 'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'CHECK',
        'DEFAULT', 'AUTO_INCREMENT', 'UNIQUE', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
        'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'IF', 'LIMIT', 'OFFSET', 'TOP'
      ];
      
      // Apply uppercase/lowercase
      if (options.uppercase) {
        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
          formatted = formatted.replace(regex, keyword);
        });
      } else {
        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
          formatted = formatted.replace(regex, keyword.toLowerCase());
        });
      }
      
      const indent = ' '.repeat(options.indentSize);
      
      // Major clauses that should start on new lines
      const majorClauses = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'UNION'];
      
      majorClauses.forEach(clause => {
        const regex = new RegExp(`\\b${clause}\\b`, 'gi');
        formatted = formatted.replace(regex, `\n${clause}`);
      });
      
      // JOIN clauses
      const joinPattern = /\b(INNER|LEFT|RIGHT|FULL)\s+JOIN\b/gi;
      formatted = formatted.replace(joinPattern, '\n$1 JOIN');
      formatted = formatted.replace(/\bJOIN\b/gi, '\nJOIN');
      
      // Format SELECT list
      formatted = formatted.replace(/,\s*(?=[^()]*(?:\([^()]*\))*[^()]*$)/g, ',\n' + indent);
      
      // Format WHERE conditions
      formatted = formatted.replace(/\s+(AND|OR)\s+/gi, `\n${indent}$1 `);
      
      // Handle parentheses
      if (options.newlineBeforeOpenParen) {
        formatted = formatted.replace(/\s*\(/g, '\n(');
      }
      if (options.newlineBeforeCloseParen) {
        formatted = formatted.replace(/\)\s*/g, '\n)');
      }
      
      // Clean up extra newlines and spaces
      formatted = formatted.replace(/\n\s*\n/g, '\n');
      formatted = formatted.replace(/^\s+|\s+$/gm, '');
      
      // Apply dense operators option
      if (options.denseOperators) {
        formatted = formatted.replace(/\s*([=<>!]+)\s*/g, '$1');
      } else {
        formatted = formatted.replace(/([=<>!]+)/g, ' $1 ');
        formatted = formatted.replace(/\s+/g, ' ');
      }
      
      // Handle multiple queries
      const queries = formatted.split(';').filter(q => q.trim());
      const separator = '\n'.repeat(options.linesBetweenQueries + 1);
      formatted = queries.map(q => q.trim()).join(';' + separator);
      
      return formatted.trim();
      
    } catch (error) {
      throw new Error('Error formatting SQL: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, []);

  const handleFormat = useCallback(() => {
    if (!sqlInput.trim()) {
      setError('Please enter SQL query to format');
      setFormattedOutput('');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      try {
        const formatted = formatSQL(sqlInput, options);
        setFormattedOutput(formatted);
        setError('');
        toast.success("SQL query formatted successfully");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to format SQL';
        setError(errorMessage);
        setFormattedOutput('');
        toast.error(errorMessage);
      }
      
      setIsLoading(false);
    }, 300);
  }, [sqlInput, options, formatSQL]);

  const handleCopy = useCallback(async () => {
    if (!formattedOutput) return;
    
    try {
      await navigator.clipboard.writeText(formattedOutput);
      toast.success("Formatted SQL copied to clipboard");
    } catch {
      toast.error("Please copy manually");
    }
  }, [formattedOutput]);

  const handleDownload = useCallback(() => {
    if (!formattedOutput) return;
    
    const blob = new Blob([formattedOutput], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted_query.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Formatted SQL file downloaded successfully");
  }, [formattedOutput]);

  const handleExampleLoad = () => {
    const exampleSQL = `select u.id,u.name,u.email,p.title,p.content,count(c.id) as comment_count from users u inner join posts p on u.id=p.user_id left join comments c on p.id=c.post_id where u.active=1 and p.published_at is not null group by u.id,p.id having count(c.id)>0 order by p.published_at desc;`;
    setSqlInput(exampleSQL);
    toast.success("Example SQL loaded");
  };

  const isValidSQL = (sql: string): boolean => {
    if (!sql.trim()) return true;
    
    const sqlKeywords = ['select', 'insert', 'update', 'delete', 'create', 'alter', 'drop'];
    const lowerSQL = sql.toLowerCase().trim();
    
    return sqlKeywords.some(keyword => lowerSQL.includes(keyword));
  };

  const clearAll = () => {
    setSqlInput('');
    setFormattedOutput('');
    setError('');
  };

  const getDialectIcon = () => {
    switch (options.language) {
      case 'mysql': return '🐬';
      case 'postgresql': return '🐘';
      case 'sqlite': return '📱';
      case 'tsql': return '🏢';
      case 'oracle': return '🏛️';
      default: return '🗃️';
    }
  };

  return (
    <ToolLayout toolId="sql-query-formatter" categoryId="developer-tools">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  SQL Query Formatter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={handleExampleLoad}
                    variant="outline"
                    size="sm"
                  >
                    Load Example
                  </Button>
                  <Button 
                    onClick={clearAll}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
                
                <div className="relative">
                  <Textarea
                    placeholder="Paste your SQL query here..."
                    value={sqlInput}
                    onChange={(e) => setSqlInput(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                  {sqlInput && (
                    <div className="absolute top-2 right-2">
                      {isValidSQL(sqlInput) ? (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Valid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Check
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md">
                    <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </p>
                  </div>
                )}
                
                <Button 
                  onClick={handleFormat}
                  disabled={!sqlInput.trim() || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Formatting...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Format SQL
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Output Section */}
            {formattedOutput && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Formatted SQL Query</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCopy} variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button onClick={handleDownload} variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border bg-muted/50 overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted border-b">
                      <Database className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {getDialectIcon()} {options.language.toUpperCase()} Query
                      </span>
                      <Badge variant="secondary" className="ml-auto">
                        {formattedOutput.split('\n').length} lines
                      </Badge>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm">
                      <code className="language-sql">{formattedOutput}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Options Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Format Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>SQL Dialect</Label>
                  <Select 
                    value={options.language}
                    onValueChange={(value) => setOptions(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sql">
                        <span className="flex items-center gap-2">
                          🗃️ Standard SQL
                        </span>
                      </SelectItem>
                      <SelectItem value="mysql">
                        <span className="flex items-center gap-2">
                          🐬 MySQL
                        </span>
                      </SelectItem>
                      <SelectItem value="postgresql">
                        <span className="flex items-center gap-2">
                          🐘 PostgreSQL
                        </span>
                      </SelectItem>
                      <SelectItem value="sqlite">
                        <span className="flex items-center gap-2">
                          📱 SQLite
                        </span>
                      </SelectItem>
                      <SelectItem value="tsql">
                        <span className="flex items-center gap-2">
                          🏢 T-SQL (SQL Server)
                        </span>
                      </SelectItem>
                      <SelectItem value="oracle">
                        <span className="flex items-center gap-2">
                          🏛️ Oracle
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Indent Size: {options.indentSize} spaces</Label>
                  <Slider
                    value={[options.indentSize]}
                    onValueChange={([value]) => setOptions(prev => ({ ...prev, indentSize: value }))}
                    min={2}
                    max={8}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lines Between Queries: {options.linesBetweenQueries}</Label>
                  <Slider
                    value={[options.linesBetweenQueries]}
                    onValueChange={([value]) => setOptions(prev => ({ ...prev, linesBetweenQueries: value }))}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uppercase"
                      checked={options.uppercase}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, uppercase: !!checked }))
                      }
                    />
                    <Label htmlFor="uppercase" className="text-sm">
                      Uppercase keywords
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dense-operators"
                      checked={options.denseOperators}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, denseOperators: !!checked }))
                      }
                    />
                    <Label htmlFor="dense-operators" className="text-sm">
                      Dense operators (no spaces)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newline-open-paren"
                      checked={options.newlineBeforeOpenParen}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, newlineBeforeOpenParen: !!checked }))
                      }
                    />
                    <Label htmlFor="newline-open-paren" className="text-sm">
                      New line before (
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newline-close-paren"
                      checked={options.newlineBeforeCloseParen}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, newlineBeforeCloseParen: !!checked }))
                      }
                    />
                    <Label htmlFor="newline-close-paren" className="text-sm">
                      New line before )
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Empty State */}
        {!formattedOutput && !isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <Database className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Format SQL Queries</h3>
              <p className="text-muted-foreground mb-4">
                Paste your SQL query above and click format to beautify and organize your code
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Support for multiple SQL dialects</p>
                <p>• Customizable formatting options</p>
                <p>• Keyword case conversion</p>
                <p>• Proper indentation and line breaks</p>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </ToolLayout>
  );
}