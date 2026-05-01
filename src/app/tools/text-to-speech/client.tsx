"use client";

import { useEffect, useState } from "react";
import { Pause, Play, Square } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

export default function Client() {
  const [text, setText] = useState("Welcome to AZ Tools text to speech generator.");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  function speak() {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.voice = voices.find((voice) => voice.name === voiceName) ?? null;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <ToolLayout toolId="text-to-speech">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card><CardHeader><CardTitle>Text-to-Speech Generator</CardTitle></CardHeader><CardContent className="space-y-4">
          <Textarea value={text} onChange={(event) => setText(event.target.value)} className="min-h-[220px]" />
          <div className="space-y-2"><Label>Voice</Label><Select value={voiceName} onValueChange={setVoiceName}><SelectTrigger><SelectValue placeholder="Default voice" /></SelectTrigger><SelectContent>{voices.map((voice) => <SelectItem key={voice.name} value={voice.name}>{voice.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Rate: {rate.toFixed(1)}</Label><Slider value={[rate]} min={0.5} max={2} step={0.1} onValueChange={([next]) => setRate(next ?? 1)} /></div>
          <div className="space-y-2"><Label>Pitch: {pitch.toFixed(1)}</Label><Slider value={[pitch]} min={0.5} max={2} step={0.1} onValueChange={([next]) => setPitch(next ?? 1)} /></div>
          <div className="flex gap-2"><Button onClick={speak}><Play className="mr-2 h-4 w-4" />Speak</Button><Button variant="outline" onClick={() => window.speechSynthesis.pause()}><Pause className="mr-2 h-4 w-4" />Pause</Button><Button variant="outline" onClick={() => window.speechSynthesis.cancel()}><Square className="mr-2 h-4 w-4" />Stop</Button></div>
        </CardContent></Card>
      </div>
    </ToolLayout>
  );
}
