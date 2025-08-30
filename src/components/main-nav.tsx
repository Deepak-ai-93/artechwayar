'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const routes = [
  { href: '/category/ai-design', label: 'AI Design' },
  { href: '/category/ai-marketing', label: 'AI Marketing' },
  { href: '/category/ai-news', label: 'AI News' },
  { href: '/category/future-of-ai', label: 'Future of AI' },
  { href: '/category/ai-for-business', label: 'AI for Business' },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'transition-colors hover:text-primary',
            pathname?.startsWith(route.href) ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
