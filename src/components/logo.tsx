import { siteConfig } from '@/lib/constants';
import Image from 'next/image';

const CustomLogo = ({ className }: { className?: string }) => (
  <Image
    src="/icon.svg"
    alt={`${siteConfig.name} logo`}
    className={className}
    width={80} 
    height={24}
    priority
  />
);

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <CustomLogo className="h-6 w-auto text-primary" />
      <span className="font-headline font-bold text-lg text-primary">{siteConfig.name}</span>
    </div>
  );
}
