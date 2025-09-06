import { Metadata } from 'next'
import { ColorPaletteGeneratorClient } from './client'

export const metadata: Metadata = {
  title: 'Color Palette Generator - Create Color Schemes | AZ Tools',
  description: 'Generate beautiful color palettes using monochromatic, analogous, complementary, triadic, and tetradic color schemes. Perfect for designers and developers.',
  keywords: ['color palette generator', 'color schemes', 'monochromatic colors', 'complementary colors', 'color harmony', 'design tools'],
  openGraph: {
    title: 'Color Palette Generator - Create Color Schemes | AZ Tools',
    description: 'Generate beautiful color palettes using various color harmony schemes. Perfect for design projects.',
    type: 'website',
  }
}

export default function ColorPaletteGeneratorPage() {
  return <ColorPaletteGeneratorClient />
}