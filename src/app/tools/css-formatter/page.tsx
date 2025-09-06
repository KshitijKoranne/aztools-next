import { Metadata } from 'next'
import { CssFormatterClient } from './client'

export const metadata: Metadata = {
  title: 'CSS Formatter - Beautify & Minify CSS Online | AZ Tools',
  description: 'Format, beautify, and minify CSS code online. Clean up CSS with proper indentation, remove comments, and optimize file size.',
  keywords: ['css formatter', 'css beautifier', 'css minifier', 'css optimizer', 'format css'],
  openGraph: {
    title: 'CSS Formatter - Beautify & Minify CSS Online | AZ Tools',
    description: 'Format, beautify, and minify CSS code online with proper indentation and optimization.',
    type: 'website',
  }
}

export default function CssFormatterPage() {
  return <CssFormatterClient />
}