
import { Metadata } from 'next'
import { ColorConverterClient } from './client'

export const metadata: Metadata = {
  title: 'Color Converter - HEX, RGB, HSL Converter | AZ Tools',
  description: 'Convert colors between HEX, RGB, and HSL formats instantly. Professional color converter with visual preview for designers and developers.',
  keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hsl converter', 'color codes', 'web colors', 'design tools'],
  openGraph: {
    title: 'Color Converter - HEX, RGB, HSL Converter | AZ Tools',
    description: 'Convert colors between HEX, RGB, and HSL formats instantly. Professional color converter with visual preview.',
    type: 'website',
  }
}

export default function ColorConverterPage() {
  return <ColorConverterClient />
}
