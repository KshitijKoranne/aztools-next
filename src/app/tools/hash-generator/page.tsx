import { Metadata } from 'next'
import { HashGeneratorClient } from './client'

export const metadata: Metadata = {
  title: 'Hash Generator - Generate MD5, SHA1, SHA256 Hashes Online | AZ Tools',
  description: 'Generate secure hash values for text and files using SHA-1, SHA-256, SHA-384, and SHA-512 algorithms. Free online hash generator for developers and security professionals.',
  keywords: ['hash generator', 'SHA256', 'SHA1', 'SHA512', 'file hash', 'checksum', 'cryptographic hash', 'security'],
  openGraph: {
    title: 'Hash Generator - Generate MD5, SHA1, SHA256 Hashes Online | AZ Tools',
    description: 'Generate secure hash values for text and files using SHA-1, SHA-256, SHA-384, and SHA-512 algorithms.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Hash Generator - Generate MD5, SHA1, SHA256 Hashes Online | AZ Tools',
    description: 'Generate secure hash values for text and files using SHA-1, SHA-256, SHA-384, and SHA-512 algorithms.',
  }
}

export default function HashGeneratorPage() {
  return <HashGeneratorClient />
}