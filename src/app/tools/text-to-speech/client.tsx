'use client'

import React, { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Play, Pause, Square, Volume2, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface Voice {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
}

export function TextToSpeechClient() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      toast.error("Text-to-speech is not supported in your browser.");
      return;
    }

    // Load available voices
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      const voiceList: Voice[] = availableVoices.map(voice => ({
        voice,
        name: voice.name,
        lang: voice.lang
      }));
      
      setVoices(voiceList);
      
      // Set default voice (preferably English)
      if (voiceList.length > 0 && !selectedVoice) {
        const englishVoice = voiceList.find(v => v.lang.startsWith('en')) || voiceList[0];
        setSelectedVoice(englishVoice.voice.name);
      }
    };

    // Load voices immediately
    loadVoices();

    // Also load voices when they become available (some browsers load them asynchronously)
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  const speak = () => {
    if (!text.trim()) {
      toast.error("Please enter some text to convert to speech.");
      return;
    }

    if (!isSupported) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find selected voice
    const voice = voices.find(v => v.voice.name === selectedVoice)?.voice;
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
      toast.error("An error occurred during speech synthesis.");
    };

    speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Group voices by language
  const groupedVoices = voices.reduce((groups: { [key: string]: Voice[] }, voice) => {
    const lang = voice.lang.split('-')[0].toUpperCase();
    if (!groups[lang]) {
      groups[lang] = [];
    }
    groups[lang].push(voice);
    return groups;
  }, {});

  if (!isSupported) {
    return (
      <ToolLayout toolId="text-to-speech" categoryId="text-utilities">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Volume2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Text-to-Speech Not Supported</h3>
              <p className="text-muted-foreground">
                Your browser doesn&apos;t support the Web Speech API. Please try using a modern browser like Chrome, Firefox, or Safari.
              </p>
            </div>
          </CardContent>
        </Card>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout toolId="text-to-speech" categoryId="text-utilities">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Text Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="text-input">Enter text to convert to speech</Label>
                <Textarea
                  id="text-input"
                  placeholder="Type or paste your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] mt-2"
                />
                <div className="text-xs text-muted-foreground mt-2">
                  Characters: {text.length} | Words: {text.trim() ? text.trim().split(/\s+/).length : 0}
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={speak} 
                  disabled={!text.trim() || isPlaying}
                  className="flex-1 min-w-[120px]"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Speak
                </Button>
                
                {isPlaying && !isPaused && (
                  <Button onClick={pause} variant="outline" className="flex-1 min-w-[120px]">
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                )}
                
                {isPaused && (
                  <Button onClick={resume} variant="outline" className="flex-1 min-w-[120px]">
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </Button>
                )}
                
                {(isPlaying || isPaused) && (
                  <Button onClick={stop} variant="outline" className="flex-1 min-w-[120px]">
                    <Square className="mr-2 h-4 w-4" />
                    Stop
                  </Button>
                )}
              </div>

              {/* Status */}
              {isPlaying && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-2 text-primary">
                    <Volume2 className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {isPaused ? 'Paused' : 'Playing...'}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sample Texts */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Texts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {[
                  "Hello, this is a test of the text-to-speech functionality.",
                  "The quick brown fox jumps over the lazy dog.",
                  "Welcome to AZ Tools! This is your go-to online toolkit for various utilities and converters.",
                  "Artificial intelligence is transforming the way we interact with technology.",
                  "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole filled with the ends of worms and an oozy smell."
                ].map((sample, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left justify-start h-auto p-3"
                    onClick={() => setText(sample)}
                  >
                    <div className="text-sm">{sample}</div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Speech Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Voice Selection */}
              <div>
                <Label>Voice</Label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {Object.entries(groupedVoices).map(([lang, voiceList]) => (
                      <div key={lang}>
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                          {lang}
                        </div>
                        {voiceList.map((voice) => (
                          <SelectItem key={voice.voice.name} value={voice.voice.name}>
                            <div className="flex flex-col">
                              <span>{voice.name}</span>
                              <span className="text-xs text-muted-foreground">{voice.lang}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Speech Rate */}
              <div>
                <Label htmlFor="rate-input">Speech Rate: {rate.toFixed(1)}x</Label>
                <Input
                  id="rate-input"
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Slow (0.1x)</span>
                  <span>Fast (2x)</span>
                </div>
              </div>

              {/* Pitch */}
              <div>
                <Label htmlFor="pitch-input">Pitch: {pitch.toFixed(1)}</Label>
                <Input
                  id="pitch-input"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Low (0)</span>
                  <span>High (2)</span>
                </div>
              </div>

              {/* Volume */}
              <div>
                <Label htmlFor="volume-input">Volume: {Math.round(volume * 100)}%</Label>
                <Input
                  id="volume-input"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Quiet (0%)</span>
                  <span>Loud (100%)</span>
                </div>
              </div>

              <Separator />

              {/* Reset Button */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setRate(1);
                  setPitch(1);
                  setVolume(1);
                }}
              >
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
      </div>
    </ToolLayout>
  );
}