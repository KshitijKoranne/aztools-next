import { Metadata } from 'next'
import { ColorBlindnessSimulatorClient } from './client'

export const metadata: Metadata = {
  title: 'Color Blindness Simulator - See Colors as Others Do | AZ Tools',
  description: 'Simulate how images appear to people with different types of color blindness. Test protanopia, deuteranopia, tritanopia, and achromatopsia vision.',
  keywords: ['color blindness simulator', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia', 'colorblind test', 'accessibility design'],
  openGraph: {
    title: 'Color Blindness Simulator - See Colors as Others Do | AZ Tools',
    description: 'Simulate how images appear to people with different types of color blindness for better accessibility.',
    type: 'website',
  }
}

export default function ColorBlindnessSimulatorPage() {
  return <ColorBlindnessSimulatorClient />
}