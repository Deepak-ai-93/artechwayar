'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { HeroAnimation } from './hero-animation';

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="flex items-center md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setOpen(false)}
          >
            <HeroAnimation className="mr-2 h-5 w-5" />
            <span className="font-bold font-headline text-lg">Artechway</span>
          </Link>
          <div className="my-4 flex h-[calc(100vh-8rem)] flex-col justify-between pb-10 pl-6">
            <div className="flex flex-col space-y-3">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname?.startsWith(route.href) ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/" className="flex items-center space-x-2">
        <HeroAnimation className="h-6 w-6" />
        <span className="font-bold font-headline text-xl">Artechway</span>
      </Link>
    </div>
  );
}
