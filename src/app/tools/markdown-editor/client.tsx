'use client'

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownToLine, Copy, Code, Eye, FileText } from "lucide-react";
import { toast } from 'sonner';

export function MarkdownEditorClient() {
  const [markdown, setMarkdown] = useState('# Hello Markdown\n\nThis is a **bold** text and this is an *italic* text.\n\n## Lists\n\n- Item 1\n- Item 2\n- Item 3\n\n## Code\n\n```javascript\nfunction hello() {\n  console.log("Hello World!");\n}\n```');
  const [htmlOutput, setHtmlOutput] = useState('');

  // Parse markdown to HTML
  useEffect(() => {
    const parseMarkdown = () => {
      let html = markdown;
      
      // Split by paragraphs first
      const paragraphs = html.split(/\n\s*\n/);
      const parsedParagraphs = paragraphs.map(paragraph => {
        let para = paragraph.trim();
        if (!para) return '';
        
        // Headers (must be processed first)
        if (para.match(/^#{1,6}\s/)) {
          para = para.replace(/^# (.*$)/gm, '<h1>$1</h1>');
          para = para.replace(/^## (.*$)/gm, '<h2>$1</h2>');
          para = para.replace(/^### (.*$)/gm, '<h3>$1</h3>');
          para = para.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
          para = para.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
          para = para.replace(/^###### (.*$)/gm, '<h6>$1</h6>');
          return para;
        }
        
        // Code blocks (must be processed before inline code)
        if (para.includes('```')) {
          para = para.replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
          return para;
        }
        
        // Blockquotes
        if (para.startsWith('>')) {
          const lines = para.split('\n');
          const quoteContent = lines
            .map(line => line.replace(/^>\s?/, ''))
            .join('<br>');
          return `<blockquote>${quoteContent}</blockquote>`;
        }
        
        // Unordered lists
        if (para.match(/^[\-\*\+]\s/m)) {
          const listItems = para
            .split('\n')
            .filter(line => line.match(/^[\-\*\+]\s/))
            .map(line => line.replace(/^[\-\*\+]\s/, ''))
            .map(item => `<li>${item}</li>`)
            .join('');
          return `<ul>${listItems}</ul>`;
        }
        
        // Ordered lists
        if (para.match(/^\d+\.\s/m)) {
          const listItems = para
            .split('\n')
            .filter(line => line.match(/^\d+\.\s/))
            .map(line => line.replace(/^\d+\.\s/, ''))
            .map(item => `<li>${item}</li>`)
            .join('');
          return `<ol>${listItems}</ol>`;
        }
        
        // Horizontal rule
        if (para === '---' || para === '***' || para === '___') {
          return '<hr>';
        }
        
        // Regular paragraph - apply inline formatting
        para = para.replace(/\n/g, '<br>');
        
        // Bold and italic (order matters)
        para = para.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
        para = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        para = para.replace(/\*(.*?)\*/g, '<em>$1</em>');
        para = para.replace(/_{3}(.*?)_{3}/g, '<strong><em>$1</em></strong>');
        para = para.replace(/__(.*?)__/g, '<strong>$1</strong>');
        para = para.replace(/_(.*?)_/g, '<em>$1</em>');
        
        // Links (must be before images)
        para = para.replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        
        // Images
        para = para.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;">');
        
        // Inline code (after links to avoid conflicts)
        para = para.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        return `<p>${para}</p>`;
      });
      
      return parsedParagraphs.filter(p => p).join('\n');
    };
    
    setHtmlOutput(parseMarkdown());
  }, [markdown]);

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlOutput);
    toast.success("HTML copied to clipboard");
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Markdown file has been downloaded");
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([htmlOutput], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("HTML file has been downloaded");
  };

  return (
    <ToolLayout toolId="markdown-editor" categoryId="text-utilities">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col-reverse md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Card className="p-4 h-full">
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium flex items-center gap-1">
                  <Code className="h-4 w-4" /> Editor
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={handleDownloadMarkdown}
                >
                  <ArrowDownToLine className="h-3 w-3" />
                  Download .md
                </Button>
              </div>
              <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="h-[400px] font-mono"
                placeholder="Write your markdown here..."
              />
            </Card>
          </div>
          
          <div className="flex-1">
            <Card className="p-4 h-full">
              <Tabs defaultValue="preview">
                <div className="flex justify-between mb-2">
                  <TabsList>
                    <TabsTrigger value="preview" className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> Preview
                    </TabsTrigger>
                    <TabsTrigger value="html" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" /> HTML
                    </TabsTrigger>
                  </TabsList>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={handleDownloadHtml}
                  >
                    <ArrowDownToLine className="h-3 w-3" />
                    Download .html
                  </Button>
                </div>
                
                <TabsContent value="preview" className="h-[400px] overflow-auto border rounded-md p-4">
                  <div className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: htmlOutput }}
                  />
                </TabsContent>
                
                <TabsContent value="html" className="h-[400px]">
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="absolute top-2 right-2 gap-1"
                      onClick={handleCopyHtml}
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                    <pre className="font-mono text-xs p-4 whitespace-pre-wrap border rounded-md h-[400px] overflow-auto bg-muted/50">
                      {htmlOutput}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}