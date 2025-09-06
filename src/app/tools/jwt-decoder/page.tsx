import { Metadata } from 'next'
import { JwtDecoderClient } from './client'

export const metadata: Metadata = {
  title: 'JWT Decoder - Decode JSON Web Tokens Online | AZ Tools',
  description: 'Decode and analyze JWT (JSON Web Tokens) with our free online tool. View header, payload, and signature information with claims validation and expiration checking.',
  keywords: ['JWT decoder', 'JSON Web Token', 'JWT decode', 'token decoder', 'authentication', 'web development'],
  openGraph: {
    title: 'JWT Decoder - Decode JSON Web Tokens Online | AZ Tools',
    description: 'Decode and analyze JWT (JSON Web Tokens) with our free online tool. View header, payload, and signature information.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'JWT Decoder - Decode JSON Web Tokens Online | AZ Tools',
    description: 'Decode and analyze JWT (JSON Web Tokens) with our free online tool. View header, payload, and signature information.',
  }
}

export default function JwtDecoderPage() {
  return <JwtDecoderClient />
}