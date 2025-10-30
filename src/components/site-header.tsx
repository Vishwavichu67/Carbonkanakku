'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Logo } from './logo';
import { mainNav } from '@/lib/constants';
import { useUser } from '@/firebase';
import { UserNav } from './user-nav';
import { Skeleton } from './ui/skeleton';
import { useSidebar } from './ui/sidebar';
import { usePathname } from 'next/navigation';

function DashboardMobileMenu() {
    const { toggleSidebar } = useSidebar();
    return (
        <div className="md:hidden">
            <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={toggleSidebar}
            >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
            </Button>
        </div>
    );
}

function SiteMobileMenu() {
    return (
        <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/" className="mb-6">
                <Logo />
              </Link>
              <div className="flex flex-col space-y-4">
                {mainNav.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
    );
}


export function SiteHeader() {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {mainNav.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        {isDashboard ? <DashboardMobileMenu /> : <SiteMobileMenu />}

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
           <div className="flex-1 md:hidden">
            <Link href="/" className="ml-2">
                <Logo />
            </Link>
           </div>
          <nav className="flex items-center">
            {loading ? (
              <Skeleton className="h-9 w-24" />
            ) : user ? (
              <UserNav />
            ) : !isAuthPage ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild className="bg-primary text-primary-foreground">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}
