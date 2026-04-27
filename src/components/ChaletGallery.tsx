'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Mirrors the keys under `chalet.captions` in messages
type CaptionKey =
  | 'exterior'
  | 'terrace'
  | 'living'
  | 'dining'
  | 'outdoor'
  | 'bedroom'
  | 'bedroomAttic'
  | 'hottub'
  | 'sauna';

type Photo = {
  src: string;
  captionKey: CaptionKey;
  aspect: 'square' | 'portrait' | 'landscape' | 'wide';
};

const PHOTOS: Photo[] = [
  { src: '/images/chalet/exterior-hero.jpg', captionKey: 'exterior', aspect: 'wide' },
  { src: '/images/chalet/living.jpg', captionKey: 'living', aspect: 'landscape' },
  { src: '/images/chalet/dining.jpg', captionKey: 'dining', aspect: 'landscape' },
  { src: '/images/chalet/bedroom-view.jpg', captionKey: 'bedroom', aspect: 'landscape' },
  { src: '/images/chalet/hottub.jpg', captionKey: 'hottub', aspect: 'portrait' },
  { src: '/images/chalet/outdoor-dining.jpg', captionKey: 'outdoor', aspect: 'landscape' },
  { src: '/images/chalet/exterior-terrace.jpg', captionKey: 'terrace', aspect: 'landscape' },
  { src: '/images/chalet/sauna.jpg', captionKey: 'sauna', aspect: 'portrait' },
];

export function ChaletGallery() {
  const t = useTranslations('chalet');
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? null : (i + 1) % PHOTOS.length)),
    [],
  );
  const prev = useCallback(
    () =>
      setActive((i) =>
        i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length,
      ),
    [],
  );

  useEffect(() => {
    if (active === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handler);
    };
  }, [active, close, next, prev]);

  return (
    <section id="chalet" className="section relative bg-paper">
      <div className="container-max">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="kicker mb-3 text-paper-muted">{t('kicker')}</p>
            <h2
              className="brush text-5xl leading-[0.95] text-ink sm:text-6xl md:text-7xl"
              style={{ transform: 'rotate(-1.5deg)' }}
            >
              {t('title')}
            </h2>
            <p className="display mt-3 text-lg italic text-ink-soft sm:text-xl">
              {t('location')}
            </p>
          </div>
          <p className="display max-w-md text-base leading-relaxed text-ink-soft/90 md:text-right">
            {t('summary')}
          </p>
        </div>

        {/* Mosaic grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
          {/* Hero — spans 2x2 on larger screens */}
          <button
            type="button"
            onClick={() => setActive(0)}
            className="group relative col-span-2 row-span-2 aspect-[4/3] overflow-hidden md:aspect-auto"
          >
            <Image
              src={PHOTOS[0].src}
              alt={t(`captions.${PHOTOS[0].captionKey}`)}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="kicker text-paper-light">
                {t(`captions.${PHOTOS[0].captionKey}`)}
              </p>
            </div>
          </button>

          {PHOTOS.slice(1).map((photo, i) => {
            const idx = i + 1;
            return (
              <button
                key={photo.src}
                type="button"
                onClick={() => setActive(idx)}
                className={cn(
                  'group relative aspect-square overflow-hidden',
                  photo.aspect === 'portrait' && 'row-span-2 aspect-[3/4] md:aspect-[3/4]',
                )}
              >
                <Image
                  src={photo.src}
                  alt={t(`captions.${photo.captionKey}`)}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/15" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-[10px] uppercase tracking-wider2 text-paper-light">
                    {t(`captions.${photo.captionKey}`)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Lightbox */}
      {active !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm sm:p-10"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Close"
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 text-paper-light transition hover:border-accent hover:text-accent"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous"
            className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-paper/30 text-paper-light transition hover:border-accent hover:text-accent sm:left-8"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next"
            className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-paper/30 text-paper-light transition hover:border-accent hover:text-accent sm:right-8"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div
            className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full w-full">
              <Image
                src={PHOTOS[active].src}
                alt={t(`captions.${PHOTOS[active].captionKey}`)}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <p className="display text-center text-base italic text-paper-light/90 sm:text-lg">
              {t(`captions.${PHOTOS[active].captionKey}`)}
              <span className="ml-3 text-xs tracking-wider2 text-paper/50">
                {active + 1} / {PHOTOS.length}
              </span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
