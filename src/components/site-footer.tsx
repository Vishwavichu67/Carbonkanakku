import { siteConfig } from '@/lib/constants';
import { Logo } from './logo';

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <Logo />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
