import { Metadata } from 'next'
import { GradientGeneratorClient } from './client'

export const metadata: Metadata = {
  title: 'CSS Gradient Generator - Create Beautiful Gradients | AZ Tools',
  description: 'Generate CSS gradients with live preview. Create linear and radial gradients with multiple colors, custom directions, and copy CSS code instantly.',
  keywords: ['css gradient generator', 'linear gradient', 'radial gradient', 'css gradients', 'gradient maker', 'web design tools'],
  openGraph: {
    title: 'CSS Gradient Generator - Create Beautiful Gradients | AZ Tools',
    description: 'Generate beautiful CSS gradients with live preview and instant CSS code generation.',
    type: 'website',
  }
}

export default function GradientGeneratorPage() {
  return <GradientGeneratorClient />
}