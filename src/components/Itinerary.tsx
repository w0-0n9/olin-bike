'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Day = { date: string; label: string; body: string };

// One photo per day — each tied to the day's actual content
const DAY_PHOTOS = [
  // Day 1: Arrival in Lyon, drive to the chalet, welcome dinner
  {
    src: '/images/chalet/exterior-hero.jpg',
    alt: 'Arriving at the private chalet in Oz',
  },
  // Day 2: Stage 17 experience — ride from Oz, finish-line atmosphere in Voiron
  {
    src: '/images/peloton.jpg',
    alt: 'Watching the Stage 17 finish of the Tour de France live',
  },
  // Day 3: Alpine discovery & vineyard ride — scenic villages and rolling terrain
  {
    src: '/images/oisans-valley.jpg',
    alt: 'A scenic alpine ride through the Oisans valley',
  },
  // Day 4: Alpe d'Huez + Stage 19 — the 21 hairpin bends
  {
    src: '/images/peloton-alpine.jpg',
    alt: "The peloton on Alpe d'Huez, Stage 19",
  },
  // Day 5: Stage 20 & farewell dinner — celebratory ride moment
  {
    src: '/images/cyclist-smile.jpg',
    alt: 'A smiling rider mid-tour — final celebration',
  },
  // Day 6: Departure — alpine memory
  {
    src: '/images/hero-mountains.jpg',
    alt: 'Alpine morning — carrying the mountains back with you',
  },
];

export function Itinerary() {
  const t = useTranslations('itinerary');
  const days = t.raw('days') as Day[];
  const [active, setActive] = useState(0);
  const dayRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the top-most intersecting entry (closest to viewport top line)
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top,
          );
        if (visible.length > 0) {
          const idx = dayRefs.current.indexOf(
            visible[0].target as HTMLLIElement,
          );
          if (idx !== -1) setActive(idx);
        }
      },
      {
        // Trigger when the day is in the upper-middle of viewport
        rootMargin: '-20% 0px -55% 0px',
        threshold: 0,
      },
    );

    dayRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="itinerary" className="section relative bg-paper">
      <div className="container-max">
        <h2
          className="brush mb-16 text-5xl text-ink sm:text-6xl md:text-7xl"
          style={{ transform: 'rotate(-1.5deg)' }}
        >
          {t('title')}
        </h2>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left — scroll-linked photo stack */}
          <div className="relative lg:col-span-5">
            <div className="sticky top-28">
              <div className="relative aspect-[3/4] overflow-hidden">
                {DAY_PHOTOS.map((p, i) => (
                  <Image
                    key={p.src}
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    priority={i === 0}
                    className={cn(
                      'absolute inset-0 object-cover transition-opacity duration-700 ease-in-out',
                      active === i ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                ))}

                {/* Day indicator overlay (bottom-left brush) */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, transparent 40%, rgba(10,12,28,0.8) 100%)',
                    }}
                  />
                  <div className="relative text-paper-light">
                    <p className="kicker mb-2 text-paper-light/70">
                      Day {active + 1} / {days.length}
                    </p>
                    <p
                      className="brush text-3xl leading-none text-accent sm:text-4xl"
                      style={{ transform: 'rotate(-1deg)' }}
                    >
                      {days[active].label}
                    </p>
                    <p className="display mt-2 text-sm italic text-paper-light/80 sm:text-base md:text-lg">
                      {days[active].date}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress bar — 6 segments */}
              <div className="mt-5 flex gap-1.5">
                {days.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-0.5 flex-1 transition-colors duration-500',
                      i <= active ? 'bg-accent-deep' : 'bg-paper-line',
                    )}
                  />
                ))}
              </div>
              <p className="kicker mt-4 text-paper-muted">
                July 21–26 · French Alps
              </p>
            </div>
          </div>

          {/* Right — day timeline */}
          <ol className="relative lg:col-span-7">
            <div
              aria-hidden
              className="absolute bottom-0 left-[13px] top-2 w-px border-l-2 border-dashed border-accent-deep/40"
            />
            <div className="space-y-12 sm:space-y-14">
              {days.map((day, i) => (
                <li
                  key={i}
                  ref={(el) => {
                    dayRefs.current[i] = el;
                  }}
                  className={cn(
                    'relative pl-12 transition-opacity duration-500',
                    active === i ? 'opacity-100' : 'opacity-55',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-paper transition-all duration-300',
                      active === i
                        ? 'scale-110 bg-ink text-accent'
                        : 'bg-accent text-ink',
                    )}
                  >
                    <span className="text-[10px] font-bold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </span>
                  <p className="kicker mb-2 text-sm text-paper-muted sm:text-base">{day.date}</p>
                  <h3 className="display mb-3 text-2xl text-ink sm:text-[1.65rem]">
                    {day.label}
                  </h3>
                  <p className="text-[0.95rem] leading-relaxed text-ink-soft sm:text-base">
                    {day.body}
                  </p>
                </li>
              ))}
            </div>
          </ol>
        </div>
      </div>
    </section>
  );
}
