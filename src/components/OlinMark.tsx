import Image from 'next/image';
import { cn } from '@/lib/utils';

type Variant = 'auto' | 'dark' | 'light';

/**
 * Olin flower-mark (Ollin glyph + bicycle wheel pendant),
 * extracted from the official Olin invitation PDF.
 *
 * Variants:
 * - `dark` → ink color (#14162A) for cream/light backgrounds
 * - `light` → paper color (#F5F1E8) for navy/dark backgrounds
 * - `auto` → uses currentColor via mask-image (inherits text color)
 */
export function OlinMark({
  className,
  variant = 'dark',
  priority = false,
}: {
  className?: string;
  variant?: Variant;
  priority?: boolean;
}) {
  if (variant === 'auto') {
    // Renders using CSS mask so it takes currentColor from parent
    return (
      <span
        aria-hidden
        className={cn('inline-block h-8 w-8 bg-current', className)}
        style={{
          WebkitMaskImage: 'url(/images/olin-mark-dark.png)',
          maskImage: 'url(/images/olin-mark-dark.png)',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      />
    );
  }

  const src =
    variant === 'light'
      ? '/images/olin-mark-light.png'
      : '/images/olin-mark-dark.png';

  return (
    <Image
      src={src}
      alt=""
      width={441}
      height={472}
      priority={priority}
      className={cn('h-8 w-auto object-contain', className)}
    />
  );
}
