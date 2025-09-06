import { Metadata } from 'next'
import { HttpHeadersViewerClient } from './client'

export const metadata: Metadata = {
  title: 'HTTP Headers Viewer - Analyze Website Headers Online | AZ Tools',
  description: 'Analyze HTTP response headers, security headers, CORS policies, and caching directives. View detailed header information and security scores.',
  keywords: ['http headers viewer', 'security headers', 'cors analyzer', 'response headers', 'http analysis'],
  openGraph: {
    title: 'HTTP Headers Viewer - Analyze Website Headers Online | AZ Tools',
    description: 'Analyze HTTP response headers, security headers, CORS policies, and caching directives online.',
    type: 'website',
  }
}

export default function HttpHeadersViewerPage() {
  return <HttpHeadersViewerClient />
}