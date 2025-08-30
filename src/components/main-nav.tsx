
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';
import { LogoIcon } from '@/components/ui/logo-icon';

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <LogoIcon className="h-6 w-6 text-primary" />
        <span className="hidden font-bold sm:inline-block font-headline text-xl">
          Artechway
        </span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'transition-colors hover:text-foreground/80',
              pathname?.startsWith(route.href) ? 'text-foreground' : 'text-foreground/60'
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
