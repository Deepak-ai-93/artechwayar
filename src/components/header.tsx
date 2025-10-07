
'use client';

import * as React from 'react';
import Link from 'next/link';
import { MainNav } from './main-nav';
import { MobileNav } from './mobile-nav';
import { cn } from '@/lib/utils';
import { PenSquare } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "border-b border-border/40 bg-background/95 backdrop-blur-sm" : "bg-transparent"
      )}
    >
      <div className="container flex h-20 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Future elements can go here */}
        </div>
      </div>
    </header>
  );
}
