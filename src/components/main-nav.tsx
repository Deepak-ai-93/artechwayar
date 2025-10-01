
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { routes, type Route, type NavItem } from '@/lib/routes';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

const isNavItem = (route: Route): route is NavItem => 'href' in route;

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Image src="/artechway.png" alt="Artechway Logo" width={140} height={40} />
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        {routes.map((route) =>
          isNavItem(route) ? (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname?.startsWith(route.href)
                  ? 'text-foreground'
                  : 'text-foreground/60'
              )}
            >
              {route.label}
            </Link>
          ) : (
            <DropdownMenu key={route.label}>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground/60 transition-colors hover:text-foreground/80 focus:outline-none">
                {route.label}
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {route.items.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        )}
      </nav>
    </div>
  );
}
