# AZ Tools Next.js - Tool Development Guide

This comprehensive guide covers everything you need to know to build new tools for the AZ Tools Next.js platform while maintaining consistency, quality, and the professional standards established across the codebase.

## 🏗️ Next.js App Router Architecture

### 1. **Required File Structure**

Every tool must follow the Next.js App Router pattern:

```
src/app/tools/your-tool-id/
├── page.tsx      # Server Component with metadata
└── client.tsx    # Client Component with 'use client'
```

### 2. **Page Component (page.tsx)**

```typescript
import { Metadata } from 'next';
import YourToolClient from './client';

export const metadata: Metadata = {
  title: "Your Tool Name - AZ Tools",
  description: "Brief description of what your tool does for SEO and social media.",
  keywords: ["keyword1", "keyword2", "tool-related", "keywords"],
};

export default function YourToolPage() {
  return <YourToolClient />;
}
```

### 3. **Client Component (client.tsx)**

```typescript
'use client'

import { useState } from 'react';
import { ToolLayout } from "@/components/layouts/ToolLayout";
// ... other imports

export default function YourToolClient() {
  // Component logic here
  
  return (
    <ToolLayout
      toolId="your-tool-id"    // Must match directory name
      categoryId="category-id"  // Must match valid category
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Your tool content */}
      </div>
    </ToolLayout>
  );
}
```

## 🎨 Dark/Light Mode Color Standards

### **✅ ALWAYS USE - Theme-Aware Colors**

```typescript
// Text Colors
"text-foreground"           // Primary text
"text-muted-foreground"     // Secondary text
"text-destructive"          // Error text
"text-green-600 dark:text-green-400"     // Success (manual dark variant)
"text-red-600 dark:text-red-400"         // Error (manual dark variant)
"text-yellow-600 dark:text-yellow-400"   // Warning (manual dark variant)
"text-blue-600 dark:text-blue-400"       // Info (manual dark variant)

// Background Colors
"bg-background"             // Page background
"bg-muted"                 // Card backgrounds
"bg-muted/50"              // Subtle backgrounds
"bg-destructive/10"        // Error backgrounds
"bg-green-50 dark:bg-green-900/10"       // Success backgrounds
"bg-red-50 dark:bg-red-900/10"           // Error backgrounds
"bg-yellow-50 dark:bg-yellow-900/10"     // Warning backgrounds

// Border Colors
"border"                   // Default borders
"border-destructive/20"    // Error borders
"border-green-200 dark:border-green-800" // Success borders
"border-red-200 dark:border-red-800"     // Error borders
```

## 🧩 Component Structure Best Practices

### **Standard Imports for New Tools**

```typescript
'use client'

import { useState, useCallback, useEffect } from 'react';
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { IconName } from 'lucide-react';
```

### **Toast Notifications (Sonner)**

```typescript
import { toast } from 'sonner';

// Success toast
toast.success("Operation completed successfully");

// Error toast  
toast.error("Something went wrong");

// Info toast
toast.info("Information message");

// Warning toast
toast.warning("Warning message");
```

## 🚀 **NEXT.JS TOOL CREATION TEMPLATE**

### **Complete Template Example**

```typescript
// page.tsx
import { Metadata } from 'next';
import YourToolClient from './client';

export const metadata: Metadata = {
  title: "Your Tool Name - AZ Tools",
  description: "Brief, SEO-optimized description of what your tool does for users.",
  keywords: ["keyword1", "keyword2", "relevant", "search", "terms"],
};

export default function YourToolPage() {
  return <YourToolClient />;
}
```

```typescript
// client.tsx
'use client'

import { useState } from 'react';
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ToolIcon } from 'lucide-react'; // Replace with appropriate icon

export default function YourToolClient() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!input.trim()) {
      toast.error("Please enter some input");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Your tool logic here
      const processedResult = input.toUpperCase(); // Example processing
      setResult(processedResult);
      toast.success("Processing completed successfully");
    } catch (error) {
      console.error('Processing error:', error);
      toast.error("An error occurred during processing");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  return (
    <ToolLayout
      toolId="your-tool-id"     // ✅ Must match directory name exactly
      categoryId="category-id"   // ✅ Must match valid category ID
    >
      <div className="max-w-6xl mx-auto space-y-6">
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ToolIcon className="h-5 w-5" />
              Your Tool Name
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input">Input</Label>
              <Input
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your input here..."
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleProcess} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Process"}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap">{result}</pre>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </ToolLayout>
  );
}
```

## 📋 Pre-Submission Checklist

### **✅ CRITICAL REQUIREMENTS**
- [ ] Created both `page.tsx` and `client.tsx` files
- [ ] Client component starts with `'use client'`
- [ ] Uses `ToolLayout` with correct `toolId` and `categoryId`
- [ ] ToolId matches directory name exactly
- [ ] Container uses `<div className="max-w-6xl mx-auto space-y-6">`
- [ ] Metadata includes title, description, and keywords

### **✅ FUNCTIONALITY STANDARDS**
- [ ] Error handling with toast notifications using Sonner
- [ ] Loading states for async operations
- [ ] Proper input validation
- [ ] Memory cleanup (`URL.revokeObjectURL` for file processing)
- [ ] Accessibility: Proper Label associations (`htmlFor` + `id`)

## 🎯 Popular Client-Side Libraries

```typescript
// PDF Processing
import PDFMerger from 'pdf-merger-js';  // PDF merging
import { PDFDocument } from 'pdf-lib';   // PDF manipulation

// Charts and Visualization
import { LineChart, BarChart, PieChart } from 'recharts';

// Image Processing
import { Pica } from 'pica';              // Image resizing
import imageCompression from 'browser-image-compression';

// File Processing
import JSZip from 'jszip';                // Archive creation
```

---

This Next.js development guide ensures every new tool maintains professional quality while leveraging Next.js App Router features.

**Key Differences from React Vite:**
- **App Router Structure**: Separate page and client components
- **Built-in SEO**: Metadata API instead of React Helmet  
- **Static Generation**: Pre-rendered pages for better performance
- **Sonner Toasts**: Modern toast notifications

---

*Last Updated: 2025-01-09*  
*Version: 3.0 - Next.js App Router Guide*