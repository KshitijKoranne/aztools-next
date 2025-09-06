import { Metadata } from 'next'
import { ColorMixerClient } from './client'

export const metadata: Metadata = {
  title: 'Color Mixer - Blend Colors Online | AZ Tools',
  description: 'Mix and blend two colors together with adjustable ratios. See real-time color mixing results and get HEX, RGB values instantly.',
  keywords: ['color mixer', 'color blending', 'mix colors', 'color combination', 'blend colors', 'color tools'],
  openGraph: {
    title: 'Color Mixer - Blend Colors Online | AZ Tools',
    description: 'Mix and blend two colors together with real-time preview and adjustable ratios.',
    type: 'website',
  }
}

export default function ColorMixerPage() {
  return <ColorMixerClient />
}