import { cn } from '@/lib/utils';

type IconProps = { className?: string };

const base = 'h-6 w-6';
const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function FlagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M5 21V4" />
      <path d="M5 5h11l-2 3 2 3H5" />
    </svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M10 20v-6h4v6" />
    </svg>
  );
}

export function BikeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <circle cx="5.5" cy="17" r="3.5" />
      <circle cx="18.5" cy="17" r="3.5" />
      <path d="M5.5 17 L10 8 L14 8 L18.5 17" />
      <path d="M10 8 L13 8" />
      <circle cx="13.5" cy="5.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function CompassIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5L13 13L8.5 15.5L11 11 Z" fill="currentColor" />
    </svg>
  );
}

export function VanIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M2 16V8h10l3 4h6v4" />
      <path d="M2 16h3" />
      <path d="M9 16h6" />
      <path d="M19 16h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M5 11h5" />
    </svg>
  );
}

export function GiftIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M3 10h18v3H3z" />
      <path d="M5 13v8h14v-8" />
      <path d="M12 10v11" />
      <path d="M7.5 10C6 10 5 9 5 7.5S6 5 7.5 5c2 0 4.5 5 4.5 5s2.5-5 4.5-5C18 5 19 6 19 7.5S18 10 16.5 10" />
    </svg>
  );
}

export const ICONS = {
  flag: FlagIcon,
  home: HomeIcon,
  bike: BikeIcon,
  compass: CompassIcon,
  van: VanIcon,
  gift: GiftIcon,
} as const;

export type IconName = keyof typeof ICONS;
