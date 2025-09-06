import { Metadata } from 'next'
import { CodeMinifierClient } from './client'

export const metadata: Metadata = {
  title: 'Code Minifier - Compress JavaScript, CSS & HTML Online | AZ Tools',
  description: 'Minify and compress JavaScript, CSS, and HTML code to reduce file size. Remove whitespace, comments, and optimize code for production.',
  keywords: ['code minifier', 'javascript minify', 'css minify', 'html minify', 'code compression'],
  openGraph: {
    title: 'Code Minifier - Compress JavaScript, CSS & HTML Online | AZ Tools',
    description: 'Minify and compress JavaScript, CSS, and HTML code to reduce file size and optimize for production.',
    type: 'website',
  }
}

export default function CodeMinifierPage() {
  return <CodeMinifierClient />
}