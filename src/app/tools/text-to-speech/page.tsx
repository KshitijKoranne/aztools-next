import { Metadata } from 'next'
import { Volume2 } from 'lucide-react'
import { TextToSpeechClient } from './client'

export const metadata: Metadata = {
  title: 'Text-to-Speech Generator - Convert Text to Voice | AZ Tools',
  description: 'Convert text to speech with customizable voice, rate, pitch, and volume settings. Browser-based text-to-speech tool.',
  keywords: 'text to speech, tts, voice generator, speech synthesis, text reader, voice converter',
  openGraph: {
    title: 'Text-to-Speech Generator - Convert Text to Voice | AZ Tools',
    description: 'Convert text to speech with customizable voice, rate, pitch, and volume settings. Browser-based text-to-speech tool.',
  },
}

export default function TextToSpeechPage() {
  return <TextToSpeechClient />
}