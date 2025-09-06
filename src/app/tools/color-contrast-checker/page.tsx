import { Metadata } from 'next'
import { ColorContrastCheckerClient } from './client'

export const metadata: Metadata = {
  title: 'Color Contrast Checker - WCAG Accessibility Tool | AZ Tools',
  description: 'Check color contrast ratios for web accessibility compliance. Ensure your designs meet WCAG AA and AAA standards for better user experience.',
  keywords: ['color contrast checker', 'WCAG compliance', 'accessibility', 'contrast ratio', 'web accessibility', 'AA AAA standards'],
  openGraph: {
    title: 'Color Contrast Checker - WCAG Accessibility Tool | AZ Tools',
    description: 'Check color contrast ratios for web accessibility compliance and WCAG standards.',
    type: 'website',
  }
}

export default function ColorContrastCheckerPage() {
  return <ColorContrastCheckerClient />
}