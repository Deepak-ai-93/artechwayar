'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';

const words = ['Artechway', ...routes.map(r => r.label)];
const colors = [
  'text-primary',
  'text-chart-1',
  'text-chart-2',
  'text-chart-3',
  'text-chart-4',
  'text-chart-5',
];

export default function AnimatedHeroText() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fade-out
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % words.length);
        setFade(true); // Start fade-in
      }, 500); // Duration of fade-out
    }, 3000); // Time each word is displayed

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={cn(
        'transition-all duration-500',
        fade ? 'opacity-100' : 'opacity-0',
        colors[index % colors.length]
      )}
    >
      {words[index]}
    </span>
  );
}
