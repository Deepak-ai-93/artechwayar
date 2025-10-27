'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulate a loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn('preloader', { hidden: !isLoading })}>
      <Image
        src="/artechway.png"
        alt="Artechway Logo"
        width={200}
        height={57}
        className="preloader-logo"
        priority
      />
    </div>
  );
}
