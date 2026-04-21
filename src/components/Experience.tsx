import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function Experience() {
  const t = useTranslations('intro');
  const body = t.raw('body') as string[];

  return (
    <section
      id="experience"
      className="section relative overflow-hidden bg-paper"
    >
      <div className="container-max grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <p className="kicker mb-4 text-paper-muted">{t('kicker')}</p>
          <h2
            className="brush mb-10 text-6xl leading-[0.95] text-ink sm:text-7xl md:text-8xl"
            style={{ transform: 'rotate(-1.5deg)' }}
          >
            {t('title')}
          </h2>

          <div className="space-y-6">
            {body.map((p, i) => (
              <p
                key={i}
                className={
                  i === 1
                    ? 'display text-xl italic text-ink sm:text-2xl'
                    : 'text-base leading-relaxed text-ink-soft/90 sm:text-lg'
                }
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="relative lg:col-span-6">
          {/* Yellow brush zigzag behind image */}
          <svg
            aria-hidden
            viewBox="0 0 400 500"
            className="pointer-events-none absolute -left-10 -top-8 h-[calc(100%+4rem)] w-[calc(100%+5rem)]"
            preserveAspectRatio="none"
          >
            <path
              d="M40,20 L200,120 L60,240 L240,380 L40,480"
              stroke="#F0E65A"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.95"
            />
          </svg>

          <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[4/3]">
            <Image
              src="/images/oisans-valley.jpg"
              alt="Cyclists on the Oisans valley road, French Alps"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
