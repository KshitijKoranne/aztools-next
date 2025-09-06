import { Metadata } from 'next'
import { ScanText } from 'lucide-react'
import { OcrTextExtractorClient } from './client'

export const metadata: Metadata = {
  title: 'OCR Text Extractor - Extract Text from Images | AZ Tools',
  description: 'Extract text from images using advanced OCR technology. Supports multiple languages, formats, and provides confidence metrics.',
  keywords: 'OCR, text extraction, image to text, optical character recognition, tesseract, image processing',
  openGraph: {
    title: 'OCR Text Extractor - Extract Text from Images | AZ Tools',
    description: 'Extract text from images using advanced OCR technology. Supports multiple languages, formats, and provides confidence metrics.',
  },
}

export default function OcrTextExtractorPage() {
  return <OcrTextExtractorClient />
}