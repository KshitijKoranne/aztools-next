import { Metadata } from 'next'
import { UrlEncoderClient } from './client'

export const metadata: Metadata = {
  title: 'URL Encoder/Decoder - Free Online Tool | AZ Tools',
  description: 'Encode and decode URL components with our free online URL encoder/decoder tool. Perfect for web developers, supporting percent encoding and decoding with live preview.',
  keywords: ['URL encoder', 'URL decoder', 'percent encoding', 'URI encoding', 'web development tools', 'online encoder'],
  openGraph: {
    title: 'URL Encoder/Decoder - Free Online Tool | AZ Tools',
    description: 'Encode and decode URL components with our free online URL encoder/decoder tool. Perfect for web developers.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'URL Encoder/Decoder - Free Online Tool | AZ Tools',
    description: 'Encode and decode URL components with our free online URL encoder/decoder tool. Perfect for web developers.',
  }
}

export default function UrlEncoderPage() {
  return <UrlEncoderClient />
}