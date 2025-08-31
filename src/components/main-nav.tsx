
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';
import Image from 'next/image';

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Image src="/artechway.png" alt="Artechway Logo" width={140} height={40} />
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
