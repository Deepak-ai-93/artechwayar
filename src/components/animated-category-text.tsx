'use client';

import { useEffect, useState } from 'react';
import { routes, isNavItem } from '@/lib/routes';

const categories = routes.filter(isNavItem).map(route => route.label);

export default function AnimatedCategoryText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % categories.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-8 w-full overflow-hidden text-center">
      {categories.map((category, i) => (
        <span
          key={category}
          className={`absolute inset-0 text-xl text-primary transition-all duration-500 ease-in-out ${
            i === index
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-full'
          }`}
          style={{
            transitionDelay: i === index ? '200ms' : '0ms'
          }}
        >
          {category}
        </span>
      ))}
    </div>
  );
}
