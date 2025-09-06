import { Metadata } from 'next'
import { ColorExtractorClient } from './client'

export const metadata: Metadata = {
  title: 'Color Extractor - Extract Colors from Images | AZ Tools',
  description: 'Extract dominant colors from any image. Upload images and get the most prominent colors with hex codes, percentages, and usage statistics.',
  keywords: ['color extractor', 'image colors', 'dominant colors', 'color palette from image', 'hex colors from image', 'image analysis'],
  openGraph: {
    title: 'Color Extractor - Extract Colors from Images | AZ Tools',
    description: 'Extract dominant colors from any image and get detailed color analysis with hex codes.',
    type: 'website',
  }
}

export default function ColorExtractorPage() {
  return <ColorExtractorClient />
}