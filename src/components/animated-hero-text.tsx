
'use client';

import { useEffect, useState } from 'react';

const wordCycles: Record<string, string[]> = {
  "AI": ["AI", "Automation", "Innovation"],
  "Technology": ["Technology", "Development", "Software"],
};

const baseText = "Exploring AI, Design, and Technology";
const animatedWords = Object.keys(wordCycles);

function AnimatedWord({ word, cycle }: { word: string, cycle: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % cycle.length);
    }, 3000); // Change word every 3 seconds
    return () => clearInterval(interval);
  }, [cycle.length]);

  return (
    <span className="relative inline-block w-32 sm:w-48 text-left">
      <span
        key={index}
        className="inline-block animate-text-fade-in-out text-primary"
      >
        {cycle[index]}
      </span>
    </span>
  );
}

export default function AnimatedHeroText() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight">
        {baseText}
      </h1>
    );
  }
  
  const parts = baseText.split(new RegExp(`(${animatedWords.join('|')})`, 'g'));

  return (
    <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight">
      {parts.map((part, index) => {
        if (animatedWords.includes(part)) {
          return (
            <AnimatedWord key={index} word={part} cycle={wordCycles[part]} />
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </h1>
  );
}
