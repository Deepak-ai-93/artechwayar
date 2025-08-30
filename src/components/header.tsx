import Link from 'next/link';
import { Button } from './ui/button';
import { LogIn } from 'lucide-react';
import { MainNav } from './main-nav';
import { MobileNav } from './mobile-nav';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-headline text-2xl font-bold">Artechway</span>
          </Link>
          <MainNav />
        </div>
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Admin Login
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
