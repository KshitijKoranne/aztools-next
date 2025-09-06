# AZ Tools Next.js - Tool Development Guide

This comprehensive guide covers everything you need to know to build new tools for the AZ Tools Next.js platform while maintaining consistency, quality, and the professional standards established across the codebase.

## 🎯 **Recent Updates & Learnings (August 2025)**

Based on our successful migration of **17 tools** (13 Text Utilities + 4 Developer Tools), we've established proven patterns and identified critical requirements for tool development.

### ⚠️ **Critical Registration Process**
**MOST IMPORTANT**: Every tool MUST be registered in `src/data/tools.ts` or it won't appear in navigation!

```typescript
// ADD TO: src/data/tools.ts
{
  id: "your-tool-id",           // Must match folder name exactly
  name: "Your Tool Name",       // Display name
  description: "Tool description for cards and SEO",
  category: "text-utilities",   // Must be valid category ID
  icon: YourIcon,              // Lucide React icon (imported at top)
  path: "/tools/your-tool-id"  // Must match URL path
}
```

### ✅ **Proven Successful Patterns**
From our **17 completed tools**, these patterns are proven to work:

#### **Tool Structure That Works:**
```
src/app/tools/your-tool-name/
├── client.tsx    # Client component with 'use client'
└── page.tsx      # Server component with metadata
```

#### **Component Architecture:**
- **Page Component**: Server-side metadata + imports client
- **Client Component**: All interactivity, state, and tool logic  
- **ToolLayout Wrapper**: Handles navigation, SEO, and consistent layout

### 🎨 **UI/UX Standards Established**
- **Responsive Design**: Must work perfectly on mobile (verified across 17 tools)
- **Toast Notifications**: Use `toast` from 'sonner' for user feedback
- **Color System**: Follow dark/light theme with shadcn/ui colors
- **Animation System**: Use Tailwind config animations (not CSS)

### 📱 **Mobile Responsiveness Requirements** ✅ VERIFIED ACROSS ALL TOOLS
Every tool MUST be mobile-compatible. **All 17 existing tools pass mobile compatibility audit**.

#### **Grid Layouts (REQUIRED):**
```typescript
// Two-column desktop, single column mobile
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

// Three-column desktop, responsive mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

#### **Container Patterns:**
```typescript
// Standard tool container
<div className="max-w-6xl mx-auto space-y-6">

// Use container class for consistent padding
<div className="container py-8 space-y-8">
```

#### **Button Responsive Design:**
```typescript
// Responsive button grid - touch-friendly on mobile
<div className="flex flex-wrap gap-2">
  <Button className="flex-1 min-w-[120px]">
    Action
  </Button>
</div>

// Icon-only buttons on desktop, hidden on mobile for space
<Button variant="outline" className="hidden sm:flex">
  <Icon className="h-4 w-4" />
</Button>
```

#### **Touch-Friendly Components:**
```typescript
// File upload areas - large touch targets
<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center
             hover:border-muted-foreground/50 transition-colors cursor-pointer
             min-h-[120px] flex items-center justify-center">
  
// Form inputs - proper mobile sizing
<Textarea className="min-h-[150px] text-sm" />
<Input className="h-10" />

// Navigation - mobile sheet menu
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
</Sheet>
```

#### **Typography & Spacing:**
```typescript
// Responsive text sizing
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
<p className="text-sm sm:text-base text-muted-foreground">

// Responsive spacing
<div className="p-4 sm:p-6 lg:p-8">
<div className="space-y-4 sm:space-y-6">
```

#### **Table & Data Display:**
```typescript
// Mobile-responsive data tables
<div className="overflow-x-auto">
  <table className="min-w-full">
    // Table content
  </table>
</div>

// Statistics cards - responsive grid
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
  <div className="text-center">
    <div className="text-lg sm:text-xl font-semibold">{value}</div>
    <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
  </div>
</div>
```

### 🔧 **Common Tool Patterns**
Based on 17 successful tool implementations:

#### **File Upload Pattern:**
```typescript
// Drag & drop with file validation
const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'text/plain'];
  if (!validTypes.includes(file.type)) {
    toast.error('Invalid file type');
    return;
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    toast.error('File too large (max 10MB)');
    return;
  }
};
```

#### **Processing State Pattern:**
```typescript
// Loading states with progress
const [isProcessing, setIsProcessing] = useState(false);
const [progress, setProgress] = useState(0);

// In processing function
setIsProcessing(true);
try {
  // Process with progress updates
  setProgress(50);
  // ... processing ...
  setProgress(100);
  toast.success('Processing complete!');
} catch (error) {
  toast.error('Processing failed');
} finally {
  setIsProcessing(false);
  setProgress(0);
}
```

#### **Download Pattern:**
```typescript
// File download with proper cleanup
const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success(`${filename} downloaded successfully`);
};
```

## 🏗️ Essential Next.js Architecture Requirements

### 1. **Always Use App Router Structure**

**✅ REQUIRED**: Every new tool MUST follow Next.js 15.5.2 App Router patterns for optimal SEO and performance.

```typescript
// File: src/app/tools/[tool-id]/page.tsx
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Metadata } from "next";

// Server-side metadata for SEO - CRITICAL for SEO improvements
export const metadata: Metadata = {
  title: "Tool Name - AZ Tools",
  description: "Tool description for SEO",
  keywords: ["keyword1", "keyword2"],
  openGraph: {
    title: "Tool Name - AZ Tools", 
    description: "Tool description for social sharing"
  }
};

const YourTool = () => {
  return (
    <ToolLayout
      toolId="your-tool-id"  // Must match tools.ts entry
      categoryId="category-id"  // Must match valid category
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Your tool content */}
      </div>
    </ToolLayout>
  );
};

export default YourTool;
```

**Benefits of Next.js App Router:**
- ✅ **Server-side rendering** - Google can crawl and index properly (vs React SPA issues)
- ✅ **Static generation** - Lightning fast loading with pre-built HTML
- ✅ **Built-in metadata API** - Perfect SEO meta tags per tool
- ✅ **Automatic code splitting** - Only load what's needed
- ✅ **Image optimization** - Next.js optimizes images automatically

### 2. **Client vs Server Components**

**✅ CRITICAL**: Understand when to use Client Components for interactivity:

```typescript
// For interactive tools, add "use client" at the top
"use client"

import { useState } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
// ... rest of imports

const InteractiveTool = () => {
  const [state, setState] = useState("");
  
  return (
    <ToolLayout toolId="tool-id" categoryId="category-id">
      {/* Interactive content */}
    </ToolLayout>
  );
};

export default InteractiveTool;
```

**When to use "use client":**
- ✅ Tools with form inputs, state management
- ✅ Tools with event handlers (onClick, onChange)
- ✅ Tools using React hooks (useState, useEffect)
- ❌ Static content, text display, layouts

### 3. **Container Structure Standards** 

**Main Container Pattern:**
```typescript
<div className="max-w-6xl mx-auto space-y-6">
  {/* Cards with space-y-6 spacing */}
</div>
```

**Grid Layouts (when needed):**
```typescript
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* For 2-column layouts */}
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* For 3-column layouts */}
</div>
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

### **❌ NEVER USE - Hardcoded Colors**

```typescript
// ❌ DON'T USE THESE:
"text-green-500"    // No dark mode variant
"text-red-500"      // No dark mode variant  
"bg-gray-100"       // Fixed gray, no theme awareness
"text-black"        // Fixed color
"text-white"        // Fixed color
"bg-blue-500"       // No dark mode consideration
```

## 🧩 Component Structure Best Practices

### **1. Card-Based Design Pattern**

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Standard Card Structure
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <IconComponent className="h-5 w-5" />
      Card Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

### **2. File Upload Pattern**

```typescript  
// Drag-and-drop upload area
<div className="border-2 border-dashed border-input rounded-lg p-8 text-center">
  <input
    type="file"
    accept="specific-mime-types"
    onChange={handleFileUpload}
    className="hidden"
    id="file-upload"
  />
  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
    <Upload className="h-12 w-12 text-muted-foreground" />
    <div>
      <p className="text-lg font-medium">
        {files.length > 0 ? `${files.length} files selected` : "Click to upload files"}
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        Description of accepted files and constraints
      </p>
    </div>
  </label>
</div>
```

## 🔧 Required Imports & Setup

### **Standard Imports for Next.js Tools**

```typescript
"use client" // Only if tool has interactivity

import { useState, useCallback, useEffect } from 'react'; // React hooks
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { IconName } from 'lucide-react';
import type { Metadata } from 'next'; // For SEO metadata
```

### **Toast Notifications (using Sonner)**

```typescript
const { toast } = useToast();

// Success toast
toast({
  title: "Success!",
  description: "Operation completed successfully"
});

// Error toast  
toast({
  title: "Error",
  description: "Something went wrong",
  variant: "destructive"
});
```

## 🚀 Next.js-Specific SEO Implementation

### **1. Metadata API (Server-Side SEO)**

```typescript
// At the top of each tool page - CRITICAL for SEO
export const metadata: Metadata = {
  title: "Tool Name - AZ Tools",
  description: "Detailed tool description with keywords for SEO",
  keywords: [
    'primary keyword',
    'secondary keyword', 
    'tool specific terms',
    'category terms'
  ],
  authors: [{ name: 'KSK Labs' }],
  openGraph: {
    title: 'Tool Name - AZ Tools',
    description: 'Tool description for social media sharing',
    type: 'website',
    locale: 'en_US',
    siteName: 'AZ Tools'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tool Name - AZ Tools',
    description: 'Tool description for Twitter sharing'
  }
};
```

**SEO Benefits vs Original React SPA:**
- ✅ **Server-rendered meta tags** - Google sees complete HTML
- ✅ **Static generation** - Lightning fast page loads
- ✅ **Better crawlability** - Search engines can index properly
- ✅ **Rich snippets** - Enhanced search results
- ✅ **Social media optimization** - Perfect Open Graph tags

### **2. Dynamic Route Structure**

```bash
# File structure for tools
src/app/tools/
├── text-formatter/
│   └── page.tsx
├── json-formatter/
│   └── page.tsx
└── [tool-id]/
    └── page.tsx  # Dynamic route for future tools
```

## 📱 Mobile Responsiveness Standards

### **Grid Breakpoints**
```typescript
// Always start mobile-first  
"grid-cols-1"                    // Mobile: single column
"md:grid-cols-2"                 // Tablet: two columns
"lg:grid-cols-3"                 // Desktop: three columns

// Input groups
"grid-cols-1 md:grid-cols-2 gap-4"   // Form inputs
"grid-cols-2 md:grid-cols-4 gap-4"   // Stats display
```

### **Spacing Consistency**
```typescript
"space-y-6"     // Main section spacing
"space-y-4"     // Card content spacing  
"space-y-2"     // List item spacing
"gap-6"         // Grid gaps (main)
"gap-4"         // Grid gaps (content)
"gap-2"         // Inline element gaps
```

## 🎯 Next.js Tool Registration Process

### **Step 1**: Add to `/src/data/tools.ts`
```typescript
{
  id: "your-tool-id",
  name: "Your Tool Name",
  description: "Brief description of what the tool does",
  category: "category-id", 
  icon: IconComponent,
  path: "/tools/your-tool-id"
}
```

### **Step 2**: Create tool page
```bash
# Create the file
mkdir -p src/app/tools/your-tool-id
touch src/app/tools/your-tool-id/page.tsx
```

### **Step 3**: Implement tool with Next.js patterns
```typescript  
// src/app/tools/your-tool-id/page.tsx
"use client"

import { ToolLayout } from "@/components/layouts/ToolLayout";
// ... implement tool following this guide
```

**No routing configuration needed** - Next.js App Router handles this automatically!

## 📊 Error Handling Standards

### **File Validation Pattern**
```typescript
const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  
  if (!file) return;
  
  // File type validation
  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!validTypes.includes(file.type)) {
    toast({
      title: "Invalid File Type",
      description: "Please select a valid image file (JPEG, PNG, GIF)",
      variant: "destructive"
    });
    return;
  }
  
  // File size validation  
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    toast({
      title: "File Too Large",
      description: "Please select a file smaller than 50MB", 
      variant: "destructive"
    });
    return;
  }
  
  // Process file
  setFile(file);
};
```

### **Processing State Management**
```typescript
const [isProcessing, setIsProcessing] = useState(false);

const handleProcess = async () => {
  setIsProcessing(true);
  
  try {
    // Processing logic
    const result = await processData();
    
    toast({
      title: "Success!",
      description: "Processing completed successfully"
    });
  } catch (error) {
    console.error('Processing error:', error);
    toast({
      title: "Processing Failed", 
      description: error instanceof Error ? error.message : "An unexpected error occurred",
      variant: "destructive"
    });
  } finally {
    setIsProcessing(false);
  }
};
```

## 🚀 Performance Best Practices

### **1. Lazy Loading for Heavy Operations**
```typescript
"use client"

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <div>Loading...</div>
});

const [isReady, setIsReady] = useState(false);

useEffect(() => {
  // Load heavy libraries or initialize complex operations
  const initializeTool = async () => {
    // Lazy load heavy dependencies
    const { HeavyLibrary } = await import('heavy-library');
    setIsReady(true);
  };
  
  initializeTool();
}, []);
```

### **2. Next.js Image Optimization**
```typescript
import Image from 'next/image';

// Use Next.js Image component for automatic optimization
<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority // For above-the-fold images
  placeholder="blur" // For better UX
  blurDataURL="data:image/jpeg;base64,..." // Placeholder
/>
```

## 🎯 **NEW TOOL CREATION TEMPLATE (Next.js)**

### **🚨 CRITICAL: Tool Registration Process**

**BEFORE implementing any tool, you MUST register it in `/src/data/tools.ts`:**

```typescript
// 1. Add to tools array with exact matching toolId and categoryId
{
  id: "your-tool-id",           // Must match ToolLayout toolId exactly
  name: "Your Tool Name",       // Display name for UI
  description: "Tool description for cards and SEO",
  category: "category-id",      // Must match ToolLayout categoryId exactly
  icon: IconComponent,          // Import the icon from lucide-react
  path: "/tools/your-tool-id"   // Must match folder structure
},
```

**⚠️ Common Registration Mistakes:**
- ❌ Creating tool files without registering in tools.ts
- ❌ Mismatched toolId between ToolLayout and tools.ts entry
- ❌ Wrong category name causing tools to not appear in categories
- ❌ Missing icon import causing build errors
- ❌ Incorrect path structure breaking navigation

**✅ Registration Checklist:**
- [ ] Tool added to tools array in `/src/data/tools.ts`
- [ ] toolId matches exactly between ToolLayout and tools.ts
- [ ] categoryId matches exactly between ToolLayout and tools.ts  
- [ ] Icon imported at top of tools.ts file
- [ ] Path follows `/tools/tool-id` pattern
- [ ] Description is SEO-friendly and descriptive

### **Step 1: Copy This Template**

```typescript
/**
 * REPLACE ALL PLACEHOLDERS:
 * - YOUR_TOOL_ID: Must match exactly with tools.ts entry
 * - YOUR_CATEGORY_ID: Must match exactly with tools.ts entry
 * - YourToolName: Component name in PascalCase
 * - ToolIcon: Import appropriate icon from lucide-react
 */

"use client"

import { useState } from 'react';
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { ToolIcon } from 'lucide-react'; // Replace ToolIcon with appropriate icon
import type { Metadata } from 'next';

// ✅ CRITICAL: Server-side metadata for SEO
export const metadata: Metadata = {
  title: "Tool Name - AZ Tools",
  description: "Detailed description of what this tool does for SEO",
  keywords: ['keyword1', 'keyword2', 'tool-specific-terms'],
  openGraph: {
    title: 'Tool Name - AZ Tools',
    description: 'Tool description for social sharing'
  }
};

export default function YourToolName() {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleProcess = () => {
    // Your tool logic here
    toast({
      title: "Success!",
      description: "Processing completed"
    });
  };

  return (
    <ToolLayout
      toolId="YOUR_TOOL_ID"           // ✅ REQUIRED: Must match tools.ts entry exactly
      categoryId="YOUR_CATEGORY_ID"   // ✅ REQUIRED: Must match tools.ts entry exactly  
    >
      {/* ✅ REQUIRED: Always start with this container structure */}
      <div className="max-w-6xl mx-auto space-y-6">
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ToolIcon className="h-5 w-5" />
              Your Tool Name
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="input">Input</Label>
              <Input
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your input"
              />
            </div>
            <Button onClick={handleProcess}>
              Process
            </Button>
          </CardContent>
        </Card>

        {/* Add more cards as needed with space-y-6 spacing */}
        {/* ❌ DO NOT ADD: "How to use", "About", "Instructions", "Tips" sections */}
        
      </div>
    </ToolLayout>
  );
}
```

### **Step 2: Create the file structure**
```bash
mkdir -p src/app/tools/your-tool-id
# Create src/app/tools/your-tool-id/page.tsx with above template
```

### **Step 3: Register in tools.ts**
```typescript
// Add to src/data/tools.ts
{
  id: "your-tool-id",
  name: "Your Tool Name",
  description: "Brief description of what the tool does",
  category: "category-id",
  icon: IconComponent,
  path: "/tools/your-tool-id"
}
```

**No additional routing needed** - Next.js App Router handles everything!

## 🎯 Quality Standards Checklist

### **✅ Next.js Architecture Requirements**
- [ ] Uses Next.js 15.5.2 App Router structure
- [ ] Server-side metadata for SEO implemented
- [ ] "use client" only when needed for interactivity
- [ ] ToolLayout component used correctly
- [ ] Registered in tools.ts

### **✅ Design Standards** 
- [ ] Uses theme-aware colors only
- [ ] No hardcoded colors (text-green-500, bg-gray-100, etc.)
- [ ] Consistent spacing (space-y-6, gap-4, etc.)  
- [ ] Mobile-responsive design
- [ ] Proper card-based layout

### **✅ Functionality Standards**
- [ ] Proper error handling with toast notifications
- [ ] Loading states for async operations
- [ ] File validation (type, size) 
- [ ] Memory cleanup (URL.revokeObjectURL)
- [ ] Keyboard navigation support

### **✅ SEO & Performance**
- [ ] Server-side metadata implemented
- [ ] Static generation where possible
- [ ] Image optimization with Next.js Image
- [ ] Lazy loading for heavy components
- [ ] Works in both light and dark modes

## 🔄 Migration Benefits Summary

### **Original React SPA Problems → Next.js Solutions**
❌ **Client-side rendering** → ✅ **Server-side rendering**  
❌ **Dynamic meta tags** → ✅ **Server-side metadata**  
❌ **Poor SEO indexing** → ✅ **Perfect Google crawling**  
❌ **Slow initial loads** → ✅ **Static generation + fast loading**  
❌ **Complex routing setup** → ✅ **File-based routing**  
❌ **Manual optimization** → ✅ **Built-in optimizations**

---

This guide ensures every new tool maintains the professional quality and consistency that makes AZ Tools a world-class platform while leveraging Next.js 15.5.2 for superior SEO performance.

**Remember**: 
- **Next.js App Router** is the foundation for SEO success
- **Server-side metadata** solves the original SPA indexing issues  
- **"use client"** only when you need interactivity
- **Quality over speed** - take time to implement properly

## ❌ **STRICTLY PROHIBITED SECTIONS** 

**DO NOT ADD ANY OF THE FOLLOWING SECTIONS TO TOOLS:**

- ❌ **"About [Tool Name]" sections**
- ❌ **"How to use" sections**
- ❌ **"Instructions" sections** 
- ❌ **"Tips" sections**
- ❌ **"Usage" sections**
- ❌ **"Help" sections with explanatory content**

**WHY:** Tools should be intuitive and self-explanatory. Users should be able to understand and use the tool immediately without reading instructions. The interface itself should guide the user.

**EXAMPLES OF PROHIBITED CONTENT:**
```jsx
// ❌ DO NOT ADD THESE
<Card>
  <CardHeader>
    <CardTitle>About API Tester</CardTitle>
  </CardHeader>
  <CardContent>
    <p>This tool allows you to test REST APIs...</p>
  </CardContent>
</Card>

<Card>
  <CardTitle>How to Use</CardTitle>
  <CardContent>
    <p>Follow these steps...</p>
  </CardContent>
</Card>

<div>
  <h3>Instructions:</h3>
  <ul>
    <li>Step 1: Enter your data</li>
    <li>Step 2: Click process</li>
  </ul>
</div>
```

**FOCUS ON:** Clean, intuitive interfaces where the functionality is immediately obvious from the UI elements themselves.

**COMPLIANCE VERIFIED:** All existing tools have been audited and cleaned of prohibited content as of 2025-08-31.

---

*Last Updated: 2025-08-31*  
*Version: 1.1 - Next.js 15.5.2 Guide + Prohibited Sections*  
*Status: Complete Development Guidelines for Next.js Migration*