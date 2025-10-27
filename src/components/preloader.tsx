'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 20); // Adjust timing for desired speed

    return () => clearInterval(timer);
  }, []);


  return (
    <div className={cn('preloader', { hidden: !isLoading })}>
      <div className="flex w-full max-w-xs flex-col items-center gap-4">
        <Image
          src="/artechway.png"
          alt="Artechway Logo"
          width={200}
          height={57}
          className="preloader-logo mb-4"
          priority
        />
        <Progress value={progress} className="h-2 w-full" />
        <p className="text-sm text-muted-foreground">{progress}% Loaded</p>
      </div>
    </div>
  );
}
