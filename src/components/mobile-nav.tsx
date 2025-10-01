
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, ChevronDown } from 'lucide-react';
import { routes, type Route, type NavItem } from '@/lib/routes';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


const isNavItem = (route: Route): route is NavItem => 'href' in route;

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="flex w-full items-center justify-between md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
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
             <Image src="/artechway.png" alt="Artechway Logo" width={140} height={40} />
          </Link>
          <div className="my-4 flex h-[calc(100vh-8rem)] flex-col justify-between pb-10 pl-6">
            <div className="flex flex-col space-y-3">
              {routes.map((route) =>
                isNavItem(route) ? (
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
                ) : (
                  <Accordion key={route.label} type="single" collapsible className="w-full">
                    <AccordionItem value={route.label} className="border-b-0">
                      <AccordionTrigger className="text-lg font-medium text-muted-foreground hover:no-underline hover:text-primary py-2">
                        {route.label}
                      </AccordionTrigger>
                      <AccordionContent className="pl-4">
                        <div className="flex flex-col space-y-3 pt-2">
                          {route.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "text-base font-medium transition-colors hover:text-primary",
                                pathname?.startsWith(item.href) ? 'text-primary' : 'text-muted-foreground'
                              )}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex-1 flex justify-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/artechway.png" alt="Artechway Logo" width={140} height={40} />
        </Link>
      </div>
      <div className="w-6 h-6" />
    </div>
  );
}
