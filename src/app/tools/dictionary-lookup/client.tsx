"use client";

import { useState } from "react";
import { BookOpen, Search, Volume2 } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics?: { text?: string; audio?: string }[];
  meanings: Meaning[];
}

export default function Client() {
  const [word, setWord] = useState("useful");
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [busy, setBusy] = useState(false);

  async function lookupWord() {
    if (!word.trim()) return toast.error("Enter a word.");
    setBusy(true);
    try {
      const response = await fetch(`/api/live-data/dictionary?word=${encodeURIComponent(word.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Dictionary lookup failed.");
      setEntries(data);
      toast.success("Definition loaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not fetch definition.");
      setEntries([]);
    } finally {
      setBusy(false);
    }
  }

  const audio = entries.flatMap((entry) => entry.phonetics ?? []).find((item) => item.audio)?.audio;

  return (
    <ToolLayout toolId="dictionary-lookup">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Dictionary Lookup</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <div className="space-y-2">
              <Label>Word</Label>
              <Input value={word} onChange={(event) => setWord(event.target.value)} onKeyDown={(event) => event.key === "Enter" && lookupWord()} placeholder="serendipity" />
            </div>
            <Button onClick={lookupWord} disabled={busy} className="self-end">
              <Search className="h-4 w-4" />
              {busy ? "Looking..." : "Lookup"}
            </Button>
            {audio ? (
              <Button asChild variant="outline" className="self-end">
                <a href={audio} target="_blank" rel="noopener noreferrer">
                  <Volume2 className="h-4 w-4" /> Audio
                </a>
              </Button>
            ) : (
              <Button variant="outline" disabled className="self-end">
                <Volume2 className="h-4 w-4" /> Audio
              </Button>
            )}
          </CardContent>
        </Card>

        {entries.map((entry) => (
          <Card key={`${entry.word}-${entry.phonetic ?? ""}`}>
            <CardContent className="space-y-5 py-5">
              <div>
                <div className="text-sm font-bold uppercase text-primary">Definition</div>
                <h2 className="mt-2 text-3xl font-black">{entry.word}</h2>
                <p className="mt-1 text-muted-foreground">{entry.phonetic ?? entry.phonetics?.find((item) => item.text)?.text ?? "Phonetic spelling not listed"}</p>
              </div>

              <div className="space-y-4">
                {entry.meanings.map((meaning, meaningIndex) => (
                  <div key={`${meaning.partOfSpeech}-${meaningIndex}`} className="rounded-md border bg-muted/30 p-4">
                    <div className="mb-3 text-sm font-bold uppercase text-muted-foreground">{meaning.partOfSpeech}</div>
                    <ol className="space-y-3">
                      {meaning.definitions.slice(0, 4).map((definition, index) => (
                        <li key={`${definition.definition}-${index}`} className="leading-7">
                          <span className="font-semibold">{index + 1}. </span>{definition.definition}
                          {definition.example && <div className="mt-1 text-sm text-muted-foreground">Example: {definition.example}</div>}
                          {definition.synonyms && definition.synonyms.length > 0 && (
                            <div className="mt-1 text-sm text-muted-foreground">Synonyms: {definition.synonyms.slice(0, 8).join(", ")}</div>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ToolLayout>
  );
}
