'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { OlinMark } from './OlinMark';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '@/lib/utils';

export function Navigation() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#experience', label: t('experience') },
    { href: '#included', label: t('included') },
    { href: '#itinerary', label: t('itinerary') },
    { href: '#chalet', label: t('stays') },
    { href: '#about', label: t('about') },
  ];

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-paper/90 backdrop-blur-md border-b border-paper-line'
          : 'bg-transparent',
      )}
    >
      <div className="container-max flex h-16 items-center justify-between sm:h-20">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-2 transition-colors',
            scrolled ? 'text-ink' : 'text-paper-light',
          )}
          aria-label="Olin"
        >
          <OlinMark
            variant="auto"
            className={cn(
              'h-8 w-8 transition-colors',
              scrolled ? 'text-ink' : 'text-paper-light',
            )}
          />
          <span className="brush text-2xl tracking-wide">OLIN</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                'text-xs uppercase tracking-wider2 transition-colors',
                scrolled
                  ? 'text-ink-muted hover:text-ink'
                  : 'text-paper/80 hover:text-paper-light',
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-6">
          <LanguageSwitcher dark={!scrolled} />
          <a
            href="#reserve"
            className={cn(
              'hidden sm:inline-flex items-center justify-center gap-2 rounded-none px-6 py-2.5 text-xs font-semibold uppercase tracking-wider2 transition-all',
              scrolled
                ? 'bg-ink text-paper-light hover:bg-navy'
                : 'border border-paper-light/80 text-paper-light hover:bg-paper-light hover:text-ink',
            )}
          >
            {t('reserve')}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={cn(
                'block h-px w-6 transition-transform',
                scrolled ? 'bg-ink' : 'bg-paper-light',
                open && 'translate-y-[7px] rotate-45',
              )}
            />
            <span
              className={cn(
                'block h-px w-6 transition-opacity',
                scrolled ? 'bg-ink' : 'bg-paper-light',
                open && 'opacity-0',
              )}
            />
            <span
              className={cn(
                'block h-px w-6 transition-transform',
                scrolled ? 'bg-ink' : 'bg-paper-light',
                open && '-translate-y-[7px] -rotate-45',
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden border-t border-paper-line bg-paper/95 backdrop-blur-md transition-[max-height] duration-300 md:hidden',
          open ? 'max-h-96' : 'max-h-0',
        )}
      >
        <nav className="container-max flex flex-col gap-6 py-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-wider2 text-ink-soft"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#reserve"
            onClick={() => setOpen(false)}
            className="btn-primary self-start"
          >
            {t('reserve')}
          </a>
        </nav>
      </div>
    </header>
  );
}
