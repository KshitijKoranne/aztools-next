import { 
  Type, 
  AlignLeft, 
  ArrowUpDown, 
  Hash, 
  FileText, 
  Globe, 
  Search, 
  Code, 
  Languages, 
  LayoutGrid, 
  Heading1,
  FileCode,
  FilePlus,
  Image,
  Quote,
  FileEdit,
  Braces,
  Terminal,
  Lock,
  GitBranch,
  Key,
  Database,
  ExternalLink,
  Palette,
  Paintbrush,
  Pipette,
  Gauge,
  DropletIcon,
  ImageIcon,
  Eye,
  Ruler,
  Percent,
  Calculator,
  GraduationCap,
  Scale,
  CircleDollarSign,
  FileDigit,
  KeyRound,
  RefreshCw,
  Server,
  Clock,
  Shield,
  QrCode,
  Scan,
  Scissors,
  FileImage,
  ImageDown,
  Crop,
  FlipHorizontal,
  Zap,
  Minimize2,
  BookOpen,
  BarChart3,
  Droplets,
  Users,
  FolderEdit,
  FileType,
  DollarSign,
  Archive,
  ScanText,
  Timer,
  TrendingUp,
  ShieldCheck,
  GitFork,
  MapPin,
  Cloud,
  Volume2,
  Trash2,
  Code2,
  Mail,
  Receipt
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
  path: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
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
    id: "markdown-editor",
    name: "Markdown Editor",
    description: "Create and preview Markdown documents with live preview.",
    category: "text-utilities",
    icon: FileEdit,
    path: "/tools/markdown-editor"
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
  
  // Developer Tools
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
    id: "uuid-generator",
    name: "UUID Generator and Validator",
    description: "Generate UUID v4 identifiers in bulk and validate existing UUID or GUID values.",
    category: "developer-tools",
    icon: KeyRound,
    path: "/tools/uuid-generator"
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
    name: "Markdown to HTML",
    description: "Convert Markdown text to HTML with live preview support.",
    category: "developer-tools",
    icon: BookOpen,
    path: "/tools/markdown-to-html"
  },
  {
    id: "html-entity-converter",
    name: "HTML Entity Encoder and Decoder",
    description: "Encode text into HTML entities or decode entities back to readable content.",
    category: "developer-tools",
    icon: Code,
    path: "/tools/html-entity-converter"
  },
  
  // Color Tools
  {
    id: "color-converter",
    name: "Color Converter",
    description: "Convert colors between HEX, RGB, HSL, and more.",
    category: "color-tools",
    icon: Palette,
    path: "/tools/color-converter"
  },
  {
    id: "color-palette-generator",
    name: "Color Palette Generator",
    description: "Create harmonious color palettes for your projects.",
    category: "color-tools",
    icon: Paintbrush,
    path: "/tools/color-palette-generator"
  },
  {
    id: "color-extractor",
    name: "Color Extractor",
    description: "Extract dominant colors from images.",
    category: "color-tools",
    icon: Pipette,
    path: "/tools/color-extractor"
  },
  {
    id: "color-contrast-checker",
    name: "Color Contrast Checker",
    description: "Check color contrast for accessibility compliance (WCAG).",
    category: "color-tools",
    icon: Gauge,
    path: "/tools/color-contrast-checker"
  },
  {
    id: "gradient-generator",
    name: "Gradient Generator",
    description: "Create and customize beautiful gradients for your designs.",
    category: "color-tools",
    icon: DropletIcon,
    path: "/tools/gradient-generator"
  },
  {
    id: "image-color-picker",
    name: "Image Color Picker",
    description: "Pick exact colors from any uploaded image.",
    category: "color-tools",
    icon: ImageIcon,
    path: "/tools/image-color-picker"
  },
  {
    id: "color-blindness-simulator",
    name: "Color Blindness Simulator",
    description: "Simulate how colors appear to people with different types of color blindness.",
    category: "color-tools",
    icon: Eye,
    path: "/tools/color-blindness-simulator"
  },
  
  // Calculators
  {
    id: "unit-converter",
    name: "Unit Converter",
    description: "Convert between different units of measurement.",
    category: "calculators",
    icon: Ruler,
    path: "/tools/unit-converter"
  },
  {
    id: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Calculate percentages, changes, and proportions.",
    category: "calculators",
    icon: Percent,
    path: "/tools/percentage-calculator"
  },
  {
    id: "discount-calculator",
    name: "Discount Calculator",
    description: "Calculate sale prices, discounts, and taxes.",
    category: "calculators",
    icon: Calculator,
    path: "/tools/discount-calculator"
  },
  {
    id: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    description: "Calculate compound interest for investments and loans.",
    category: "calculators",
    icon: GraduationCap,
    path: "/tools/compound-interest-calculator"
  },
  {
    id: "loan-calculator",
    name: "Loan Calculator",
    description: "Calculate mortgage, auto, and personal loan payments with amortization.",
    category: "calculators",
    icon: Calculator,
    path: "/tools/loan-calculator"
  },
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    description: "Calculate Body Mass Index (BMI) and ideal weight range.",
    category: "calculators",
    icon: Scale,
    path: "/tools/bmi-calculator"
  },
  {
    id: "investment-calculator",
    name: "Investment Calculator",
    description: "Project future investment growth with different strategies and time periods.",
    category: "calculators",
    icon: CircleDollarSign,
    path: "/tools/investment-calculator"
  },
  
  // IT Tools
  {
    id: "ip-address-lookup",
    name: "IP Address Lookup",
    description: "Look up information about an IP address.",
    category: "it-tools",
    icon: Globe,
    path: "/tools/ip-address-lookup"
  },
  {
    id: "base64-converter",
    name: "Base64 Converter",
    description: "Encode and decode Base64 strings and files.",
    category: "it-tools",
    icon: FileDigit,
    path: "/tools/base64-converter"
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Generate strong, secure passwords for your accounts.",
    category: "random-tools",
    icon: KeyRound,
    path: "/tools/password-generator"
  },
  {
    id: "dns-lookup",
    name: "DNS Lookup Tool",
    description: "Query DNS records for any domain name.",
    category: "it-tools",
    icon: Server,
    path: "/tools/dns-lookup"
  },
  {
    id: "cron-generator",
    name: "CRON Expression Generator",
    description: "Create and decode CRON expressions for scheduled tasks.",
    category: "it-tools",
    icon: Clock,
    path: "/tools/cron-generator"
  },
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    description: "Create customizable QR codes for links, text, wifi and more.",
    category: "it-tools",
    icon: QrCode,
    path: "/tools/qr-code-generator"
  },
  {
    id: "qr-code-decoder",
    name: "QR Code Decoder",
    description: "Decode QR codes from images or scan them directly with your camera.",
    category: "it-tools",
    icon: Scan,
    path: "/tools/qr-code-decoder"
  },
  {
    id: "ssl-checker",
    name: "SSL Certificate Checker",
    description: "Check SSL certificate validity, expiration dates, and security grades.",
    category: "it-tools",
    icon: Shield,
    path: "/tools/ssl-checker"
  },
  {
    id: "network-speed-test",
    name: "Network Speed Test",
    description: "Test your internet connection speed with download, upload, and latency measurements.",
    category: "it-tools",
    icon: Zap,
    path: "/tools/network-speed-test"
  },
  
  // PDF Tools
  {
    id: "pdf-merger",
    name: "PDF Merger",
    description: "Combine multiple PDF files into a single document.",
    category: "pdf-tools",
    icon: FilePlus,
    path: "/tools/pdf-merger"
  },
  {
    id: "pdf-splitter",
    name: "PDF Splitter",
    description: "Extract specific pages or split PDF files into multiple documents.",
    category: "pdf-tools",
    icon: Scissors,
    path: "/tools/pdf-splitter"
  },
  {
    id: "pdf-to-image",
    name: "PDF to Image",
    description: "Convert PDF pages to image formats like JPG, PNG, or WEBP.",
    category: "pdf-tools",
    icon: FileImage,
    path: "/tools/pdf-to-image"
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF",
    description: "Convert images to PDF format individually or as a batch.",
    category: "pdf-tools",
    icon: ImageDown,
    path: "/tools/image-to-pdf"
  },
  {
    id: "pdf-text-extractor",
    name: "PDF Text Extractor",
    description: "Extract text from PDF with professional accuracy.",
    category: "pdf-tools",
    icon: FileText,
    path: "/tools/pdf-text-extractor"
  },
  {
    id: "pdf-rotator",
    name: "PDF Rotator",
    description: "Rotate PDF pages individually or in bulk with live preview and precise control.",
    category: "pdf-tools",
    icon: RefreshCw,
    path: "/tools/pdf-rotator"
  },
  
  // Image Tools
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Resize images with custom dimensions and aspect ratio control.",
    category: "image-tools",
    icon: Crop,
    path: "/tools/image-resizer"
  },
  {
    id: "image-converter",
    name: "Image Converter",
    description: "Convert images between formats (JPEG, PNG, WebP) with quality controls.",
    category: "image-tools",
    icon: ImageIcon,
    path: "/tools/image-converter"
  },
  {
    id: "image-flipper",
    name: "Image Flipper",
    description: "Flip or rotate images horizontally, vertically, or by custom angles.",
    category: "image-tools",
    icon: FlipHorizontal,
    path: "/tools/image-flipper"
  },
  {
    id: "watermark-tool",
    name: "Watermark Tool",
    description: "Add text or image watermarks to photos with customizable styling.",
    category: "image-tools",
    icon: Droplets,
    path: "/tools/watermark-tool"
  },
  
  // SEO Tools
  {
    id: "meta-tags-generator",
    name: "Meta Tags Generator",
    description: "Generate meta tags for better SEO of your web pages",
    category: "seo-tools",
    icon: FileText,
    path: "/tools/meta-tags-generator"
  },
  {
    id: "utm-builder",
    name: "UTM Builder",
    description: "Build campaign URLs with UTM tracking parameters and parse existing tagged links.",
    category: "seo-tools",
    icon: ExternalLink,
    path: "/tools/utm-builder"
  },
  {
    id: "robots-txt-generator",
    name: "Robots.txt Generator",
    description: "Create and validate robots.txt files for web crawlers",
    category: "seo-tools",
    icon: Code,
    path: "/tools/robots-txt-generator"
  },
  {
    id: "sitemap-generator",
    name: "Sitemap Generator",
    description: "Generate XML sitemaps for your website",
    category: "seo-tools",
    icon: LayoutGrid,
    path: "/tools/sitemap-generator"
  },
  {
    id: "heading-structure",
    name: "Heading Structure Analyzer",
    description: "Analyze and optimize your HTML heading structure",
    category: "seo-tools",
    icon: Heading1,
    path: "/tools/heading-structure"
  },

  // Additional tools for existing categories
  {
    id: "language-detector",
    name: "Language Detector",
    description: "Detect the language of any text",
    category: "text-utilities",
    icon: Languages,
    path: "/tools/language-detector"
  },
  
  // New Tools - one for each category
  {
    id: "word-frequency",
    name: "Word Frequency Analyzer",
    description: "Analyze word frequency and find the most common words in text",
    category: "text-utilities",
    icon: Search,
    path: "/tools/word-frequency"
  },
  {
    id: "color-mixer",
    name: "Color Mixer",
    description: "Mix two colors together and see the result",
    category: "color-tools",
    icon: Palette,
    path: "/tools/color-mixer"
  },
  {
    id: "tip-calculator",
    name: "Tip Calculator",
    description: "Calculate tips and split bills among multiple people",
    category: "calculators",
    icon: Calculator,
    path: "/tools/tip-calculator"
  },
  {
    id: "image-crop",
    name: "Image Crop Tool",
    description: "Crop images to specific dimensions or aspect ratios",
    category: "image-tools",
    icon: Crop,
    path: "/tools/image-crop"
  },
  {
    id: "keyword-density",
    name: "Keyword Density Checker",
    description: "Analyze keyword density and frequency in your content",
    category: "seo-tools",
    icon: Search,
    path: "/tools/keyword-density"
  },

  // Security Tools
  {
    id: "password-strength-checker",
    name: "Password Strength Checker",
    description: "Analyze password strength and get security recommendations",
    category: "security-tools",
    icon: Shield,
    path: "/tools/password-strength-checker"
  },
  {
    id: "email-validator",
    name: "Email Validator",
    description: "Validate email addresses and check format correctness",
    category: "security-tools",
    icon: Key,
    path: "/tools/email-validator"
  },

  // Content Tools
  {
    id: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator", 
    description: "Generate placeholder text for designs and layouts",
    category: "content-tools",
    icon: FileText,
    path: "/tools/lorem-ipsum-generator"
  },
  {
    id: "username-generator", 
    name: "Username Generator",
    description: "Generate unique usernames for social media and accounts",
    category: "random-tools", 
    icon: Quote,
    path: "/tools/username-generator"
  },
  {
    id: "favicon-generator",
    name: "Favicon Generator",
    description: "Convert images to favicon format with multiple sizes",
    category: "content-tools",
    icon: ImageIcon,
    path: "/tools/favicon-generator"
  },
  {
    id: "lorem-pixel-generator",
    name: "Lorem Pixel Image Generator",
    description: "Generate placeholder images with custom dimensions, colors, and text overlays for mockups",
    category: "content-tools",
    icon: ImageIcon,
    path: "/tools/lorem-pixel-generator"
  },

  // Data Tools
  {
    id: "csv-to-json",
    name: "CSV to JSON Converter",
    description: "Convert CSV data to JSON format with customizable options",
    category: "data-tools",
    icon: Database,
    path: "/tools/csv-to-json"
  },
  {
    id: "xml-formatter",
    name: "XML Formatter",
    description: "Format and validate XML documents with syntax highlighting",
    category: "data-tools", 
    icon: FileCode,
    path: "/tools/xml-formatter"
  },
  {
    id: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates",
    category: "data-tools",
    icon: Clock,
    path: "/tools/timestamp-converter"
  },
  // Time Tools
  {
    id: "time-zone-converter",
    name: "Time Zone Converter",
    description: "Convert time between different time zones.",
    category: "time-tools",
    icon: Clock,
    path: "/tools/time-zone-converter"
  },
  {
    id: "stopwatch",
    name: "Stopwatch and Timer",
    description: "A simple stopwatch and timer tool.",
    category: "time-tools",
    icon: Clock,
    path: "/tools/stopwatch"
  },
  {
    id: "meeting-time-finder",
    name: "Meeting Time Finder",
    description: "Find common meeting times across multiple time zones for easier scheduling.",
    category: "time-tools",
    icon: Users,
    path: "/tools/meeting-time-finder"
  },
  
  // Text Utilities
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text between different cases like UPPERCASE, lowercase, Title Case, camelCase, snake_case, etc.",
    category: "text-utilities",
    icon: Type,
    path: "/tools/case-converter"
  },
  // Image Tools
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Compress images to reduce their file size without significant loss of quality.",
    category: "image-tools",
    icon: Minimize2,
    path: "/tools/image-compressor"
  },
  {
    id: "bulk-file-renamer",
    name: "Bulk File Renamer",
    description: "Rename multiple files with pattern-based rules, sequential numbering, and batch operations.",
    category: "it-tools",
    icon: FolderEdit,
    path: "/tools/bulk-file-renamer"
  },
  {
    id: "ascii-art-generator",
    name: "ASCII Art Generator",
    description: "Convert text and images into ASCII art with customizable fonts and styles.",
    category: "content-tools",
    icon: FileType,
    path: "/tools/ascii-art-generator"
  },
  
  // Finance Tools
  {
    id: "currency-converter",
    name: "Currency Converter",
    description: "Convert between different currencies with real-time exchange rates and historical data.",
    category: "finance-tools",
    icon: DollarSign,
    path: "/tools/currency-converter"
  },
  {
    id: "expense-tracker",
    name: "Expense Tracker",
    description: "Track daily expenses with categories, budgets, and visual spending reports.",
    category: "finance-tools",
    icon: TrendingUp,
    path: "/tools/expense-tracker"
  },
  
  // Productivity Tools
  {
    id: "pomodoro-timer",
    name: "Pomodoro Timer",
    description: "Productivity timer with task tracking, break reminders, and focus statistics.",
    category: "productivity-tools",
    icon: Timer,
    path: "/tools/pomodoro-timer"
  },
  
  // Additional IT Tools
  {
    id: "file-compressor",
    name: "File Compressor",
    description: "Compress files and folders into ZIP archives with customizable compression levels.",
    category: "it-tools",
    icon: Archive,
    path: "/tools/file-compressor"
  },
  
  // Additional Text Utilities
  {
    id: "ocr-text-extractor",
    name: "OCR Text Extractor",
    description: "Extract text from images using optical character recognition technology.",
    category: "text-utilities",
    icon: ScanText,
    path: "/tools/ocr-text-extractor"
  },
  {
    id: "word-cloud-generator",
    name: "Word Cloud Generator",
    description: "Create beautiful visual word clouds from text. Generate stunning visualizations with customizable colors and fonts.",
    category: "text-utilities",
    icon: Cloud,
    path: "/tools/word-cloud-generator"
  },
  {
    id: "text-to-speech",
    name: "Text-to-Speech Generator",
    description: "Convert text to speech using your browser's built-in capabilities. Customize voice, speed, and pitch.",
    category: "text-utilities",
    icon: Volume2,
    path: "/tools/text-to-speech"
  },
  {
    id: "duplicate-line-remover",
    name: "Duplicate Line Remover",
    description: "Remove duplicate lines from text while preserving order. Clean up lists, logs, and data files efficiently.",
    category: "text-utilities",
    icon: Trash2,
    path: "/tools/duplicate-line-remover"
  },
  
  // Additional Security Tools
  {
    id: "totp-generator",
    name: "TOTP Generator",
    description: "Generate time-based one-time passwords compatible with Google Authenticator.",
    category: "security-tools",
    icon: ShieldCheck,
    path: "/tools/totp-generator"
  },
  
  // Additional Data Tools
  {
    id: "database-schema-visualizer",
    name: "Database Schema Visualizer",
    description: "Visualize database table relationships and schema structure from SQL definitions.",
    category: "data-tools",
    icon: GitFork,
    path: "/tools/database-schema-visualizer"
  },
  
  // Additional Time Tools
  {
    id: "world-clock",
    name: "World Clock",
    description: "Display current time across multiple time zones with customizable locations.",
    category: "time-tools",
    icon: MapPin,
    path: "/tools/world-clock"
  },

  // Random Tools
  {
    id: "random-number-generator",
    name: "Random Number Generator",
    description: "Generate random numbers, decimals, and number sequences with customizable ranges.",
    category: "random-tools",
    icon: Hash,
    path: "/tools/random-number-generator"
  },
  {
    id: "random-string-generator",
    name: "Random String Generator",
    description: "Generate random strings, passwords, and pronounceable words with custom character sets.",
    category: "random-tools",
    icon: Type,
    path: "/tools/random-string-generator"
  },
  {
    id: "random-color-generator",
    name: "Random Color Generator",
    description: "Generate random colors and harmonious color palettes with HEX, RGB, and HSL values.",
    category: "random-tools",
    icon: Palette,
    path: "/tools/random-color-generator"
  },

  // Additional Developer Tools
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

  // Additional IT Tools
  {
    id: "barcode-generator",
    name: "Barcode Generator",
    description: "Generate professional barcodes in various formats including CODE128, EAN13, UPC, and CODE39.",
    category: "it-tools",
    icon: BarChart3,
    path: "/tools/barcode-generator"
  },

  // Additional Content Tools
  {
    id: "email-template-generator",
    name: "Email Template Generator",
    description: "Create professional HTML email templates with responsive design and customizable styling.",
    category: "content-tools",
    icon: Mail,
    path: "/tools/email-template-generator"
  },

  // Additional Finance Tools
  {
    id: "invoice-generator",
    name: "Simple Invoice Generator",
    description: "Create professional invoices with customizable branding and automatic calculations.",
    category: "finance-tools",
    icon: Receipt,
    path: "/tools/invoice-generator"
  },
  {
    id: "gst-calculator",
    name: "GST Calculator",
    description: "Calculate Indian GST inclusive and exclusive amounts with CGST, SGST, and IGST splits.",
    category: "finance-tools",
    icon: Receipt,
    path: "/tools/gst-calculator"
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
