import { Metadata } from 'next'
import { SvgCodeGeneratorClient } from './client'

export const metadata: Metadata = {
  title: 'SVG Code Generator - Create & Generate SVG Graphics Online | AZ Tools',
  description: 'Create and generate SVG graphics with visual editor and live code output. Draw shapes, add text, and export SVG code instantly.',
  keywords: ['SVG generator', 'SVG editor', 'SVG code', 'vector graphics', 'web graphics'],
  openGraph: {
    title: 'SVG Code Generator - Create & Generate SVG Graphics Online | AZ Tools',
    description: 'Create and generate SVG graphics with visual editor and live code output.',
    type: 'website',
  }
}

export default function SvgCodeGeneratorPage() {
  return <SvgCodeGeneratorClient />
}