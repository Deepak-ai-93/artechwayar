
'use client';

import { useEffect, useState } from 'react';

const wordsToAnimate = ["AI", "Technology"];

export default function AnimatedHeroText() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const text = "Exploring AI, Design, and Technology";
  const parts = text.split(new RegExp(`(${wordsToAnimate.join('|')})`, 'g'));

  if (!isMounted) {
    return (
      <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight">
        {text}
      </h1>
    );
  }

  return (
    <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight">
      {parts.map((part, index) => {
        if (wordsToAnimate.includes(part)) {
          return (
            <span key={index} className="inline-block">
              <span 
                className="inline-block animate-text-fade-in text-primary"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {part}
              </span>
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </h1>
  );
}
