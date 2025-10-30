import { siteConfig } from '@/lib/constants';

const CustomLogo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 160 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M76.9999 50.0001C76.9999 59.3379 73.2801 68.283 66.7156 74.8475C60.1511 81.412 51.206 85.1318 41.8682 85.1318C32.5303 85.1318 23.5852 81.412 17.0207 74.8475C10.4562 68.283 6.73645 59.3379 6.73645 50.0001C6.73645 40.6622 10.4562 31.7171 17.0207 25.1526C23.5852 18.5881 32.5303 14.8683 41.8682 14.8683C51.206 14.8683 60.1511 18.5881 66.7156 25.1526C73.2801 31.7171 76.9999 40.6622 76.9999 50.0001Z"
      stroke="currentColor"
      strokeWidth="10"
    />
    <path
      d="M48.8749 56.4941C50.3124 55.0566 50.3124 52.6806 48.8749 51.2431C45.9999 48.3681 41.8124 48.3681 38.9374 51.2431C37.4999 52.6806 37.4999 55.0566 38.9374 56.4941C40.3749 57.9316 43.4374 61.2431 43.4374 61.2431C43.4374 61.2431 47.4374 57.9316 48.8749 56.4941Z"
      fill="currentColor"
    />
    <path
      d="M84.1484 25.9915V43.2552L101.412 25.9915H119.55L100.539 44.9922L125 74.0084H106.862L90.7801 53.6493L84.1484 60.281V74.0084H71.5332V25.9915H84.1484Z"
      fill="currentColor"
    />
    <path
      d="M106.862 13.9999L153.25 50.9161L106.862 88"
      stroke="currentColor"
      strokeWidth="10"
    />
    <path d="M129 41L134.5 35.5" stroke="currentColor" strokeWidth="3" />
    <path d="M136 51L141.5 45.5" stroke="currentColor" strokeWidth="3" />
    <path d="M143 61L148.5 55.5" stroke="currentColor" strokeWidth="3" />
    <path d="M122 61L116.5 55.5" stroke="currentColor" strokeWidth="3" />
    <path d="M115 71L109.5 65.5" stroke="currentColor" strokeWidth="3" />
    <path d="M108 81L102.5 75.5" stroke="currentColor" strokeWidth="3" />
    <path d="M30 19L27 22" stroke="currentColor" strokeWidth="3" />
    <path d="M17 28L20.5 31.5" stroke="currentColor" strokeWidth="3" />
    <path d="M10 40L13.5 43.5" stroke="currentColor" strokeWidth="3" />
    <path d="M10 60L13.5 56.5" stroke="currentColor" strokeWidth="3" />
    <path d="M17 72L20.5 68.5" stroke="currentColor" strokeWidth="3" />
    <path d="M30 81L27 78" stroke="currentColor" strokeWidth="3" />
    <path d="M47 84L44 81" stroke="currentColor" strokeWidth="3" />
    <path d="M60 81L57 78" stroke="currentColor" strokeWidth="3" />
    <path d="M68 72L65 68.5" stroke="currentColor" strokeWidth="3" />
    <path d="M74 60L71 56.5" stroke="currentColor" strokeWidth="3" />
    <path d="M74 40L71 43.5" stroke="currentColor" strokeWidth="3" />
    <path d="M68 28L65 31.5" stroke="currentColor" strokeWidth="3" />
    <path d="M60 19L57 22" stroke="currentColor" strokeWidth="3" />
  </svg>
);


export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <CustomLogo className="h-6 w-10 text-primary" />
      <span className="font-headline font-bold text-lg text-primary">{siteConfig.name}</span>
    </div>
  );
}
