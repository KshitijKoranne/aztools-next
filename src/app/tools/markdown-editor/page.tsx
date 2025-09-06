import { Metadata } from 'next'
import { FileEdit } from 'lucide-react'
import { MarkdownEditorClient } from './client'

export const metadata: Metadata = {
  title: 'Markdown Editor - Live Preview & Export | AZ Tools',
  description: 'Create and edit Markdown documents with live HTML preview. Export to MD or HTML formats with professional markdown parsing.',
  keywords: 'markdown editor, markdown preview, markdown to html, live preview, text editor, documentation',
  openGraph: {
    title: 'Markdown Editor - Live Preview & Export | AZ Tools',
    description: 'Create and edit Markdown documents with live HTML preview. Export to MD or HTML formats with professional markdown parsing.',
  },
}

export default function MarkdownEditorPage() {
  return <MarkdownEditorClient />
}