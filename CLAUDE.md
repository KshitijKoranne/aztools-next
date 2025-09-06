# Claude Development Context - AZ Tools Next.js

## Project Overview
**AZ Tools Next.js** is the modern Next.js 15+ migration of the professional online toolkit featuring 60+ tools for developers, creators, and professionals. This version implements Next.js App Router architecture while maintaining the sophisticated, SEO-optimized platform with client-side processing capabilities.

## Architecture & Technology Stack
- **Frontend**: Next.js 15.5.2, React 19, TypeScript
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Routing**: Next.js App Router (Static Generation)
- **State Management**: React hooks and context
- **Client-Side Processing**: Browser-based libraries for privacy and reliability
- **Deployment**: Vercel platform (recommended) or any Next.js hosting
- **SEO**: Next.js built-in metadata API with structured data

## Current Migration Status

### ✅ Completed Categories:
1. **Calculator Tools** (7 tools) - All advanced calculator tools with interactive charts and currency support
   - Percentage Calculator (5 calculation types)
   - Discount Calculator (4 modes)
   - BMI Calculator (metric/imperial, visual charts)
   - Loan Calculator (amortization schedules, charts, CSV export)
   - Tip Calculator (bill splitting)
   - Investment Calculator (compound interest, strategy modes)
   - Compound Interest Calculator (multiple compounding frequencies)

2. **PDF Tools** (1 tool started)
   - PDF Merger (client-side merging with pdf-merger-js)

### 🔄 In Progress:
- PDF Tools category completion (4 remaining tools)

### 📋 Pending Categories (from React Vite version):
- Text Utilities
- Developer Tools  
- Color Tools
- Image Tools
- SEO Tools
- Security Tools
- Content Tools
- Data Tools
- IT Tools

## Technology Improvements in Next.js Version

### Next.js App Router Benefits:
- **Static Generation**: Pre-rendered pages for better SEO and performance
- **Built-in SEO**: Native metadata API replacing React Helmet
- **File-Based Routing**: Automatic routing with page.tsx structure
- **Server Components**: Optimal performance with selective client components
- **Image Optimization**: Built-in next/image optimization
- **Bundle Optimization**: Automatic code splitting and tree shaking

### Client-Side Architecture (Maintained):
- **pdf-merger-js**: 100% reliable PDF processing without server dependencies
- **recharts**: Advanced interactive charts for calculators
- **Browser Processing**: Files processed entirely in browser for privacy
- **Zero Network Dependency**: Complete tool functionality without backend calls
- **Instant Processing**: No server latency or cold start delays

## File Structure (Next.js App Router)

### Core Structure:
```
src/
├── app/
│   ├── tools/
│   │   ├── [tool-name]/
│   │   │   ├── page.tsx      # Metadata + Server Component
│   │   │   └── client.tsx    # Client Component with 'use client'
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles
├── components/
│   ├── layouts/
│   │   └── ToolLayout.tsx    # Tool wrapper component
│   └── ui/                   # shadcn/ui components
└── utils/                    # Utility functions
    └── currency.ts           # Currency formatting utilities
```

### Tool Implementation Pattern:
Each tool follows the Next.js App Router pattern:
- `page.tsx`: Server component with metadata export
- `client.tsx`: Client component with 'use client' directive for interactivity

## Dependencies Added for Next.js

### Production Dependencies:
```json
{
  "pdf-merger-js": "^5.1.2",     // Client-side PDF processing
  "recharts": "^3.1.2",          // Interactive charts
  "sonner": "^2.0.7",            // Toast notifications
  "lucide-react": "^0.542.0",    // Icons
  "next-themes": "^0.4.6"        // Dark/light theme support
}
```

### UI Components (shadcn/ui):
- Card, Button, Input, Label
- Tabs, Select, Slider, Switch
- All components properly configured for Next.js

## Migration Accomplishments

### Phase 1: Calculator Tools Complete (7/7)
- **Advanced Financial Calculators**: Loan calculator with amortization schedules and interactive charts
- **Multi-Currency Support**: Full currency conversion and formatting
- **Interactive Visualizations**: Recharts integration for data visualization
- **Real-Time Calculations**: Live updates as users modify parameters
- **Export Functionality**: CSV export for detailed amortization schedules
- **Mobile Responsive**: All calculators optimized for mobile devices

### Phase 2: PDF Tools Started (1/5)
- **PDF Merger**: Complete client-side PDF merging with metadata display
- **File Management**: Drag & drop, reordering, validation
- **Processing Options**: Bookmarks, optimization, metadata inclusion
- **Privacy-First**: All processing in browser, no server uploads

### Key Technical Achievements:
1. **Next.js 15 Migration**: Successfully migrated to latest Next.js with App Router
2. **React 19 Compatibility**: Updated to latest React version
3. **Performance Optimization**: Static generation with selective client components  
4. **SEO Enhancement**: Native Next.js metadata API implementation
5. **Type Safety**: Full TypeScript implementation with proper types
6. **Component Architecture**: Clean separation of server and client components

## Quality Standards Maintained

### Code Quality:
- **TypeScript First**: Full type safety throughout application
- **Component Patterns**: Consistent file structure and naming conventions
- **Error Handling**: Comprehensive error handling with toast notifications
- **Accessibility**: WCAG compliance with semantic HTML
- **Performance**: Optimized bundle sizes and loading strategies

### User Experience:
- **Privacy First**: Client-side processing for sensitive operations
- **Professional UI**: Consistent shadcn/ui design system
- **Mobile Responsive**: Mobile-first approach with proper breakpoints
- **Dark/Light Themes**: System preference detection and manual toggle
- **Real-Time Feedback**: Loading states and progress indicators

### SEO Optimization:
- **Static Generation**: Pre-rendered pages for search engines
- **Metadata API**: Proper meta tags, Open Graph, and Twitter Cards
- **Structured Data**: Schema.org markup for rich snippets
- **Clean URLs**: SEO-friendly routing structure
- **Performance**: Core Web Vitals optimization

## Development Guidelines

### Tool Development Pattern:
1. **Create Directory**: `/src/app/tools/[tool-name]/`
2. **Page Component**: Server component with metadata export
3. **Client Component**: Interactive component with 'use client'
4. **ToolLayout Usage**: Consistent wrapper for all tools
5. **Toast Notifications**: Use Sonner for user feedback
6. **Type Safety**: Proper TypeScript interfaces and types

### Migration Process:
1. **Read Original Tool**: Analyze React Vite implementation
2. **Install Dependencies**: Add any required npm packages
3. **Create Structure**: Set up Next.js App Router files
4. **Convert Patterns**: Adapt React Vite patterns to Next.js
5. **Test Functionality**: Ensure all features work correctly
6. **Update Documentation**: Track progress and changes

## Next Development Priorities

### Immediate (Phase 2 Completion):
1. **Complete PDF Tools**: Port remaining 4 PDF tools
2. **Text Utilities**: Port high-value text processing tools
3. **Developer Tools**: Port code formatting and validation tools

### Medium Term:
1. **Color Tools**: Port color conversion and palette tools
2. **Image Tools**: Implement client-side image processing
3. **Generator Tools**: Port various generator utilities

### Long Term:
1. **Performance Optimization**: Core Web Vitals improvements
2. **PWA Enhancement**: Offline functionality implementation
3. **Analytics Integration**: User behavior tracking
4. **Advanced Features**: Additional client-side processing libraries

## Key Metrics & Achievements

### Current Status:
- **8+ Tools Ported**: Calculator and PDF tools categories
- **100% Client-Side**: All tools work without server dependencies
- **TypeScript Coverage**: Full type safety implementation
- **Performance**: Optimized loading with Next.js features
- **SEO Ready**: Proper metadata and structure
- **Mobile Optimized**: Responsive design across all tools

### Technical Improvements:
- **Modern Architecture**: Next.js 15 App Router implementation
- **Better Performance**: Static generation and optimization
- **Enhanced SEO**: Native metadata API usage
- **Improved DX**: Better development experience with TypeScript
- **Future-Proof**: Built on latest React and Next.js versions

## Important Technical Notes

### Next.js App Router:
- **Server Components**: Default for pages, client components for interactivity
- **Metadata API**: Centralized SEO management per page
- **Static Generation**: Pre-rendered pages for optimal performance
- **File-Based Routing**: Automatic routing based on file structure

### Client-Side Processing:
- **Privacy Benefits**: No server uploads, complete user privacy
- **Reliability**: No server errors or deployment issues
- **Performance**: Instant processing without network latency
- **Scalability**: No backend resource limitations

### Development Experience:
- **Hot Reload**: Fast development with Next.js dev server
- **TypeScript Integration**: Built-in TypeScript support
- **Error Handling**: Comprehensive error boundaries and logging
- **Testing Ready**: Structure prepared for unit and integration tests

---

*Last Updated: 2025-01-09*  
*Project Status: Active Migration - Calculator & PDF Tools Complete*  
*Next.js Version: 15.5.2 with App Router*  
*Migration Progress: 8+ tools ported, 50+ remaining*