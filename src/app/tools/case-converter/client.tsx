'use client'

import React, { useState } from 'react';
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function CaseConverterClient() {
  const [inputText, setInputText] = useState('');

  const toSentenceCase = () => {
    const result = inputText.toLowerCase().replace(/(^\s*\w|\.\s*\w)/g, (c) => c.toUpperCase());
    setInputText(result);
  };

  const toLowerCase = () => setInputText(inputText.toLowerCase());
  const toUpperCase = () => setInputText(inputText.toUpperCase());
  const toCapitalizedCase = () => {
    const result = inputText.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    setInputText(result);
  };
  const toAlternatingCase = () => {
    const result = inputText.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
    setInputText(result);
  };
  const toTitleCase = () => {
    const result = inputText.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    setInputText(result);
  };
  const toInverseCase = () => {
    const result = inputText.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
    setInputText(result);
  };

  return (
    <ToolLayout toolId="case-converter" categoryId="text-utilities">
      <div className="grid gap-4">
        <Textarea
          placeholder="Enter your text here"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={10}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button onClick={toSentenceCase}>Sentence case</Button>
          <Button onClick={toLowerCase}>lower case</Button>
          <Button onClick={toUpperCase}>UPPER CASE</Button>
          <Button onClick={toCapitalizedCase}>Capitalized Case</Button>
          <Button onClick={toAlternatingCase}>aLtErNaTiNg cAsE</Button>
          <Button onClick={toTitleCase}>Title Case</Button>
          <Button onClick={toInverseCase}>InVeRsE CaSe</Button>
        </div>
      </div>
    </ToolLayout>
  );
}