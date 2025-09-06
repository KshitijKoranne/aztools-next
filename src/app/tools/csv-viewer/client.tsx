'use client'

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Search, X, ChevronLeft, ChevronRight, Table as TableIcon } from "lucide-react";
import { toast } from "sonner";

export function CsvViewerClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const parseCSV = (text: string): string[][] => {
    const rows: string[][] = [];
    let current = '';
    let inQuotes = false;
    const currentRow: string[] = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      
      if (char === '"' && inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        currentRow.push(current);
        current = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (current !== '' || currentRow.length > 0) {
          currentRow.push(current);
          if (currentRow.some(field => field.trim() !== '')) {
            rows.push([...currentRow]);
          }
          currentRow.length = 0;
          current = '';
        }
        
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
      } else {
        current += char;
      }
    }
    
    if (current !== '' || currentRow.length > 0) {
      currentRow.push(current);
      rows.push([...currentRow]);
    }
    
    return rows;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error("Please select a CSV file");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = parseCSV(text);
        
        if (rows.length > 0) {
          setHeaders(rows[0]);
          setCsvData(rows.slice(1));
          
          toast.success(`CSV loaded successfully - ${rows.length - 1} rows of data`);
          setCurrentPage(1);
          setSearchTerm("");
        } else {
          toast.error("The CSV file appears to be empty");
        }
      } catch (error) {
        toast.error("Failed to parse CSV file");
      }
    };
    
    reader.onerror = () => {
      toast.error("Failed to read the file");
    };
    
    reader.readAsText(file);
  };

  const handleDownloadCSV = () => {
    if (csvData.length === 0) return;
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => {
        if (cell.includes('"') || cell.includes(',') || cell.includes('\n')) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("CSV file downloaded successfully");
  };

  const filteredData = csvData.filter(row =>
    row.some(cell => 
      cell.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const clearAll = () => {
    setCsvData([]);
    setHeaders([]);
    setFileName("");
    setSearchTerm("");
    setCurrentPage(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const nextPage = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <ToolLayout toolId="csv-viewer" categoryId="developer-tools">
      <div className="grid grid-cols-1 gap-6">
        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TableIcon className="h-5 w-5" />
              CSV Viewer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV File
              </Button>
              
              {csvData.length > 0 && (
                <>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{fileName}</Badge>
                    <Badge variant="outline">{filteredData.length} rows</Badge>
                  </div>
                  
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search in data..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setSearchTerm("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleDownloadCSV}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearAll}
                    >
                      Clear All
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Data Display */}
        {csvData.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Data Table
                {searchTerm && (
                  <Badge variant="secondary">
                    {filteredData.length} of {csvData.length} rows
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.map((header, index) => (
                        <TableHead key={index} className="font-medium">
                          {header || `Column ${index + 1}`}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {headers.map((_, cellIndex) => (
                            <TableCell key={cellIndex} className="max-w-xs truncate">
                              {row[cellIndex] || ""}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={headers.length} className="text-center py-8">
                          {searchTerm ? "No results found for your search" : "No data available"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {filteredData.length > rowsPerPage && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {Math.min(filteredData.length, (currentPage - 1) * rowsPerPage + 1)}-
                    {Math.min(filteredData.length, currentPage * rowsPerPage)} of {filteredData.length} rows
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {pageCount}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextPage}
                      disabled={currentPage === pageCount}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <TableIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Upload a CSV File</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload your CSV file to view, search, and analyze its contents with our advanced table viewer.
                  </p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Select CSV File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

    </ToolLayout>
  );
}