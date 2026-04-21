'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'philosophy', key: 'philosophy' },
  { id: 'experience', key: 'experience' },
  { id: 'included', key: 'included' },
  { id: 'itinerary', key: 'itinerary' },
  { id: 'chalet', key: 'stays' },
  { id: 'whofor', key: 'reserve' }, // dark bg — reuse "reserve" label or add "whoFor" key
  { id: 'about', key: 'about' },
  { id: 'reserve', key: 'reserve' },
] as const;

// Sections with dark (navy) backgrounds
const DARK_SECTIONS = new Set(['whofor', 'reserve']);

export function SectionNav() {
  const t = useTranslations('nav');
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top,
          );
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: 0 },
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const visible = active !== null;
  const isDark = active !== null && DARK_SECTIONS.has(active);

  // Deduplicate — whofor and reserve both map to 'reserve' key
  // Show unique visible items only
  const displaySections = SECTIONS.filter(
    (s) => s.id !== 'whofor',
  );

  return (
    <nav
      aria-label="Section navigation"
      className={cn(
        'fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 transition-all duration-500 lg:block xl:left-8',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <ul className="flex flex-col gap-4">
        {displaySections.map((s) => {
          const isActive = active === s.id || (s.id === 'reserve' && active === 'whofor');
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="group flex items-center gap-3"
                aria-current={isActive ? 'true' : undefined}
              >
                <span
                  className={cn(
                    'relative block h-[2px] rounded-full transition-all duration-300',
                    isActive
                      ? 'w-7 bg-accent'
                      : isDark
                        ? 'w-3 bg-paper-light/40 group-hover:w-5 group-hover:bg-paper-light/70'
                        : 'w-3 bg-ink/30 group-hover:w-5 group-hover:bg-ink/60',
                  )}
                  aria-hidden
                />
                <span
                  className={cn(
                    'kicker whitespace-nowrap transition-all duration-300',
                    isActive
                      ? isDark
                        ? 'translate-x-0 text-paper-light opacity-100'
                        : 'translate-x-0 text-ink opacity-100'
                      : isDark
                        ? '-translate-x-1 text-paper-light/60 opacity-0 group-hover:translate-x-0 group-hover:opacity-70'
                        : '-translate-x-1 text-ink-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-70',
                  )}
                >
                  {t(s.key)}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
