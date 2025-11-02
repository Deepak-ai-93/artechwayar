'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import AnimatedCategoryText from './animated-category-text';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false)
    }, 4000);

    return () => clearTimeout(timer);
  }, []);


  return (
    <div className={cn('preloader', { hidden: !isLoading })}>
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <Image
          src="/artechway.png"
          alt="Artechway Logo"
          width={200}
          height={57}
          className="preloader-logo mb-4"
          priority
        />
        <AnimatedCategoryText />
      </div>
    </div>
  );
}
