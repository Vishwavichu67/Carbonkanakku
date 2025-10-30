import { Leaf } from 'lucide-react';
import { siteConfig } from '@/lib/constants';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Leaf className="h-6 w-6 text-primary" />
      <span className="font-headline font-bold text-lg text-primary">{siteConfig.name}</span>
    </div>
  );
}
