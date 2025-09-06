import { 
  Type, 
  AlignLeft, 
  ArrowUpDown, 
  Hash, 
  FileText, 
  Globe, 
  FileCode,
  FilePlus,
  Image,
  Quote,
  FileEdit,
  Braces,
  Terminal,
  Lock,
  Database,
  RefreshCw,
  Shield,
  BarChart3,
  DollarSign,
  TrendingUp,
  Code,
  Volume2,
  Palette,
  ScanText,
  GitBranch,
  Key,
  ExternalLink,
  Minimize2,
  BookOpen,
  Code2,
  Clock,
  Eye,
  Droplets,
  Pipette,
  Target,
  ArrowRightLeft,
  Calculator,
  Percent
} from "lucide-react";
import * as React from "react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const categories: Category[] = [
  {
    id: "text-utilities",
    name: "Text Utilities",
    description: "Transform, format, and analyze text with these handy tools.",
    icon: Type
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    description: "Essential utilities for developers to streamline workflow.",
    icon: FileCode
  },
  {
    id: "color-tools",
    name: "Color Tools",
    description: "Create, convert, and analyze colors for your projects.",
    icon: Hash
  },
  {
    id: "calculators",
    name: "Calculators",
    description: "Calculate conversions, percentages, and more.",
    icon: ArrowUpDown
  },
  {
    id: "it-tools",
    name: "IT Tools",
    description: "Specialized tools for IT professionals.",
    icon: FileText
  },
  {
    id: "pdf-tools",
    name: "PDF Tools",
    description: "Work with PDF documents efficiently.",
    icon: FilePlus
  },
  {
    id: "image-tools",
    name: "Image Tools",
    description: "Edit, convert, and optimize images.",
    icon: Image
  },
  {
    id: "seo-tools",
    name: "SEO Tools",
    description: "Optimize your website's search engine performance.",
    icon: Globe
  },
  {
    id: "security-tools",
    name: "Security Tools",
    description: "Security and privacy utilities for safe computing.",
    icon: Shield
  },
  {
    id: "content-tools",
    name: "Content Tools", 
    description: "Generate and create content for websites and applications.",
    icon: FileEdit
  },
  {
    id: "data-tools",
    name: "Data Tools",
    description: "Convert and manipulate data between different formats.",
    icon: Database
  },
  {
    id: "time-tools",
    name: "Time Tools",
    description: "Tools for time-related operations.",
    icon: Clock
  },
  {
    id: "finance-tools",
    name: "Finance Tools",
    description: "Financial calculations and currency management tools.",
    icon: DollarSign
  },
  {
    id: "productivity-tools",
    name: "Productivity Tools",
    description: "Tools to boost productivity and manage time effectively.",
    icon: TrendingUp
  },
  {
    id: "random-tools",
    name: "Random Tools",
    description: "Generate random data, numbers, strings, and more for testing and creativity.",
    icon: RefreshCw
  }
];

export const tools: Tool[] = [
  // Text Utilities
  {
    id: "text-formatter",
    name: "Text Formatter",
    description: "Format, beautify, and organize plain text content.",
    category: "text-utilities",
    icon: AlignLeft,
    path: "/tools/text-formatter"
  },
  {
    id: "text-generator",
    name: "Text Generator",
    description: "Generate random strings and lists with customizable options.",
    category: "text-utilities",
    icon: Quote,
    path: "/tools/text-generator"
  },
  {
    id: "text-diff",
    name: "Text Diff",
    description: "Compare two texts and highlight the differences between them.",
    category: "text-utilities",
    icon: FileText,
    path: "/tools/text-diff"
  },
  {
    id: "text-encryption",
    name: "Text Encryption",
    description: "Encrypt and decrypt text using AES-GCM encryption.",
    category: "text-utilities",
    icon: Lock,
    path: "/tools/text-encryption"
  },
  {
    id: "text-statistics",
    name: "Text Statistics Analyzer",
    description: "Count words, characters, sentences, and analyze text readability.",
    category: "text-utilities",
    icon: BarChart3,
    path: "/tools/text-statistics"
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text to different cases: uppercase, lowercase, title case, and more.",
    category: "text-utilities",
    icon: Type,
    path: "/tools/case-converter"
  },
  {
    id: "word-frequency",
    name: "Word Frequency Analyzer",
    description: "Analyze word frequency in text and discover the most common words with statistics.",
    category: "text-utilities",
    icon: BarChart3,
    path: "/tools/word-frequency"
  },
  {
    id: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text with customizable word, sentence, and paragraph counts.",
    category: "text-utilities",
    icon: FileText,
    path: "/tools/lorem-ipsum-generator"
  },
  {
    id: "duplicate-line-remover",
    name: "Duplicate Line Remover",
    description: "Remove duplicate lines from text with advanced processing options and statistics.",
    category: "text-utilities",
    icon: RefreshCw,
    path: "/tools/duplicate-line-remover"
  },
  {
    id: "text-to-speech",
    name: "Text-to-Speech Generator",
    description: "Convert text to speech with customizable voice, rate, pitch, and volume settings.",
    category: "text-utilities",
    icon: Volume2,
    path: "/tools/text-to-speech"
  },
  {
    id: "word-cloud-generator",
    name: "Word Cloud Generator",
    description: "Generate beautiful word clouds from text with customizable colors, fonts, and settings.",
    category: "text-utilities",
    icon: Palette,
    path: "/tools/word-cloud-generator"
  },
  {
    id: "markdown-editor",
    name: "Markdown Editor",
    description: "Create and edit Markdown documents with live HTML preview and export options.",
    category: "text-utilities",
    icon: FileEdit,
    path: "/tools/markdown-editor"
  },
  {
    id: "ocr-text-extractor",
    name: "OCR Text Extractor",
    description: "Extract text from images using advanced OCR technology with multi-language support.",
    category: "text-utilities",
    icon: ScanText,
    path: "/tools/ocr-text-extractor"
  },
  
  // Developer Tools - Complete set of 17 tools
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate and beautify JSON with syntax highlighting.",
    category: "developer-tools",
    icon: Braces,
    path: "/tools/json-formatter"
  },
  {
    id: "svg-code-generator",
    name: "SVG Code Generator",
    description: "Create and generate SVG graphics with visual editor and live code output.",
    category: "developer-tools",
    icon: Code,
    path: "/tools/svg-code-generator"
  },
  {
    id: "url-encoder",
    name: "URL Encoder/Decoder",
    description: "Encode and decode URL components easily.",
    category: "developer-tools",
    icon: Code,
    path: "/tools/url-encoder"
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    description: "Test and debug regular expressions with live feedback.",
    category: "developer-tools",
    icon: Terminal,
    path: "/tools/regex-tester"
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode and verify JSON Web Tokens (JWT).",
    category: "developer-tools",
    icon: Lock,
    path: "/tools/jwt-decoder"
  },
  {
    id: "gitignore-generator",
    name: "Gitignore Generator",
    description: "Generate .gitignore files for various project types.",
    category: "developer-tools",
    icon: GitBranch,
    path: "/tools/gitignore-generator"
  },
  {
    id: "hash-generator",
    name: "Hash Generator",
    description: "Generate various hash values (MD5, SHA1, SHA256, etc.) from text input.",
    category: "developer-tools",
    icon: Key,
    path: "/tools/hash-generator"
  },
  {
    id: "csv-viewer",
    name: "CSV Viewer",
    description: "View and analyze CSV files with sorting and filtering capabilities.",
    category: "developer-tools",
    icon: FileText,
    path: "/tools/csv-viewer"
  },
  {
    id: "api-tester",
    name: "API Tester",
    description: "Test and debug API endpoints with various HTTP methods.",
    category: "developer-tools",
    icon: ExternalLink,
    path: "/tools/api-tester"
  },
  {
    id: "code-beautifier",
    name: "Code Beautifier",
    description: "Format and beautify code in various languages (JSON, SQL, JavaScript, HTML).",
    category: "developer-tools",
    icon: FileCode,
    path: "/tools/code-beautifier"
  },
  {
    id: "code-minifier",
    name: "Code Minifier",
    description: "Minify JavaScript, CSS, and HTML code to reduce file size.",
    category: "developer-tools",
    icon: FileCode,
    path: "/tools/code-minifier"
  },
  {
    id: "yaml-validator",
    name: "YAML Validator",
    description: "Validate and format YAML files with syntax highlighting.",
    category: "developer-tools",
    icon: FileCode,
    path: "/tools/yaml-validator"
  },
  {
    id: "css-formatter",
    name: "CSS Formatter",
    description: "Format, beautify, and minify CSS code with customizable options.",
    category: "developer-tools",
    icon: Minimize2,
    path: "/tools/css-formatter"
  },
  {
    id: "markdown-to-html",
    name: "Markdown to HTML Converter",
    description: "Convert Markdown documents to HTML with live preview and CSS styling options.",
    category: "developer-tools",
    icon: BookOpen,
    path: "/tools/markdown-to-html"
  },
  {
    id: "http-headers-viewer",
    name: "HTTP Headers Viewer",
    description: "Analyze HTTP response headers, security configuration, and CORS policies for any website.",
    category: "developer-tools",
    icon: Globe,
    path: "/tools/http-headers-viewer"
  },
  {
    id: "json-to-typescript",
    name: "JSON to TypeScript Interface",
    description: "Convert JSON objects to TypeScript interfaces with advanced options and customization.",
    category: "developer-tools",
    icon: Code2,
    path: "/tools/json-to-typescript"
  },
  {
    id: "sql-formatter",
    name: "SQL Query Formatter",
    description: "Format, beautify, and optimize SQL queries with advanced formatting options for multiple dialects.",
    category: "developer-tools",
    icon: Database,
    path: "/tools/sql-formatter"
  },
  {
    id: "base64-converter",
    name: "Base64 Converter",
    description: "Encode and decode text and files to and from Base64.",
    category: "developer-tools",
    icon: RefreshCw,
    path: "/tools/base64-converter"
  },
  {
    id: "xml-formatter",
    name: "XML Formatter",
    description: "Format, validate, and beautify your XML code.",
    category: "developer-tools",
    icon: FileCode,
    path: "/tools/xml-formatter"
  },

  // Color Tools
  {
    id: "color-converter",
    name: "Color Converter",
    description: "Convert colors between HEX, RGB, and HSL formats with visual preview.",
    category: "color-tools",
    icon: Palette,
    path: "/tools/color-converter"
  },
  {
    id: "color-palette-generator",
    name: "Color Palette Generator",
    description: "Generate beautiful color palettes using monochromatic, analogous, complementary, triadic, and tetradic schemes.",
    category: "color-tools",
    icon: RefreshCw,
    path: "/tools/color-palette-generator"
  },
  {
    id: "color-contrast-checker",
    name: "Color Contrast Checker",
    description: "Check color contrast ratios for WCAG AA and AAA accessibility compliance standards.",
    category: "color-tools",
    icon: Eye,
    path: "/tools/color-contrast-checker"
  },
  {
    id: "gradient-generator",
    name: "Gradient Generator",
    description: "Create beautiful CSS gradients with live preview. Generate linear and radial gradients with custom colors and directions.",
    category: "color-tools",
    icon: Droplets,
    path: "/tools/gradient-generator"
  },
  {
    id: "color-mixer",
    name: "Color Mixer",
    description: "Mix and blend two colors together with adjustable ratios. Get real-time results with HEX and RGB values.",
    category: "color-tools",
    icon: Palette,
    path: "/tools/color-mixer"
  },
  {
    id: "color-extractor",
    name: "Color Extractor",
    description: "Extract dominant colors from any image. Upload photos and get color palettes with hex codes and usage percentages.",
    category: "color-tools",
    icon: Pipette,
    path: "/tools/color-extractor"
  },
  {
    id: "color-blindness-simulator",
    name: "Color Blindness Simulator",
    description: "Simulate how images appear to people with different types of color blindness. Test protanopia, deuteranopia, tritanopia, and achromatopsia.",
    category: "color-tools",
    icon: Eye,
    path: "/tools/color-blindness-simulator"
  },

  // Calculators
  {
    id: "unit-converter",
    name: "Unit Converter",
    description: "Convert between different units of measurement including length, weight, volume, temperature, area, time, speed, data, and currency.",
    category: "calculators",
    icon: ArrowRightLeft,
    path: "/tools/unit-converter"
  },
  {
    id: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Calculate percentages, percentage changes, and percentage of values with multiple calculation methods.",
    category: "calculators",
    icon: Percent,
    path: "/tools/percentage-calculator"
  },
  {
    id: "discount-calculator",
    name: "Discount Calculator",
    description: "Calculate sale prices, discounts, and taxes. Find final prices after applying various discount percentages.",
    category: "calculators",
    icon: Calculator,
    path: "/tools/discount-calculator"
  }
];

export const getToolById = (id: string) => {
  return tools.find(tool => tool.id === id);
};

export const getToolsByCategory = (categoryId: string) => {
  return tools.filter(tool => tool.category === categoryId);
};

export const getCategoryById = (id: string) => {
  return categories.find(category => category.id === id);
};