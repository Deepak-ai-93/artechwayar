'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getPosts } from '@/lib/posts';
import { createSupabaseBrowserClient } from '@/lib/supabase';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [postCount, setPostCount] = useState(0);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [showCount, setShowCount] = useState(false);

  useEffect(() => {
    const fetchPostCount = async () => {
      const supabase = createSupabaseBrowserClient();
      const { totalPosts } = await getPosts(supabase, {});
      setPostCount(totalPosts);
    };

    fetchPostCount();

    const timer = setTimeout(() => {
      setShowCount(true);
    }, 500); 

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showCount && postCount > 0) {
      const duration = 1000;
      const stepTime = Math.max(10, duration / postCount);
      let currentCount = 0;

      const counterInterval = setInterval(() => {
        currentCount += 1;
        setAnimatedCount(currentCount);
        if (currentCount >= postCount) {
          clearInterval(counterInterval);
          setTimeout(() => setIsLoading(false), 500);
        }
      }, stepTime);

      return () => clearInterval(counterInterval);
    } else if (showCount && postCount === 0) {
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [showCount, postCount]);


  return (
    <div className={cn('preloader', { hidden: !isLoading })}>
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/artechway.png"
          alt="Artechway Logo"
          width={200}
          height={57}
          className="preloader-logo"
          priority
        />
        {showCount && (
            <div className="preloader-counter">
                {animatedCount} Blogs Loaded
            </div>
        )}
      </div>
    </div>
  );
}
