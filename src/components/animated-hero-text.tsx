'use client';

import { useEffect, useState } from 'react';

const wordCycles: Record<string, string[]> = {
  "AI": ["AI", "Automation", "Innovation"],
  "Technology": ["Technology", "Development", "Software"],
};

const baseText = "Exploring AI, Design, and Technology";

function AnimatedWord({ cycle }: { cycle: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % cycle.length);
    }, 3000); // Change word every 3 seconds
    return () => clearInterval(interval);
  }, [cycle.length]);

  return (
    <span className="relative inline-block text-left">
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
      <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
        {baseText}
      </h1>
    );
  }

  return (
    <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
      <span className="block">Exploring <AnimatedWord cycle={wordCycles["AI"]} />, Design,</span>
      <span className="block">and <AnimatedWord cycle={wordCycles["Technology"]} /></span>
    </h1>
  );
}
