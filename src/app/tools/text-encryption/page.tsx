import { Metadata } from 'next'
import { Lock } from 'lucide-react'
import { TextEncryptionClient } from './client'

export const metadata: Metadata = {
  title: 'Text Encryption - Secure AES-GCM Encryption | AZ Tools',
  description: 'Encrypt and decrypt text using secure AES-GCM encryption. Keep your sensitive information safe with client-side encryption.',
  keywords: 'text encryption, AES encryption, secure text, encrypt decrypt, password protection, data security',
  openGraph: {
    title: 'Text Encryption - Secure AES-GCM Encryption | AZ Tools',
    description: 'Encrypt and decrypt text using secure AES-GCM encryption. Keep your sensitive information safe with client-side encryption.',
  },
}

export default function TextEncryptionPage() {
  return <TextEncryptionClient />
}