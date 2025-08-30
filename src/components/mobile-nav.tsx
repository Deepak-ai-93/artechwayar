'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, PenSquare } from 'lucide-react';
import { routes } from '@/lib/routes';

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setOpen(false)}
          >
            <PenSquare className="mr-2 h-5 w-5 text-primary" />
            <span className="font-bold">Artechway</span>
          </Link>
          <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
            <div className="flex flex-col space-y-3">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={`text-lg ${pathname === route.href ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
  );
}
