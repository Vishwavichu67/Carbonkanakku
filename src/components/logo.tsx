import { siteConfig } from '@/lib/constants';
import Image from 'next/image';

const CustomLogo = ({ className }: { className?: string }) => (
  <Image
    src="/icon.svg"
    alt={`${siteConfig.name} logo`}
    className={className}
    width={120} 
    height={36}
    priority
  />
);

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <CustomLogo className="h-9 w-auto text-primary" />
    </div>
  );
}
