import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { OlinMark } from './OlinMark';

export function Philosophy() {
  const t = useTranslations('philosophy');
  const body = t.raw('body') as string[];

  return (
    <section
      id="philosophy"
      className="grain-paper section relative bg-paper-warm"
    >
      <div className="container-max grid items-center gap-16 lg:grid-cols-5 lg:gap-20">
        <div className="lg:col-span-2">
          <OlinMark variant="auto" className="mb-6 h-14 w-14 text-ink" />
          <p className="kicker mb-4 text-paper-muted">{t('label')}</p>
          <h2 className="brush text-6xl leading-none text-ink sm:text-7xl">
            {t('title')}
          </h2>
          <p className="display mt-3 text-2xl italic text-ink-soft sm:text-3xl">
            {t('subtitle')}
          </p>

          <div className="mt-10 space-y-5">
            {body.map((p, i) => (
              <p
                key={i}
                className={
                  i === 1 || i === body.length - 1
                    ? 'display text-lg text-ink sm:text-xl'
                    : 'text-[0.95rem] leading-relaxed text-ink-soft/90 sm:text-base'
                }
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[4/3]">
            <Image
              src="/images/philosophy-bw.jpg"
              alt="Two cyclists riding in purposeful movement"
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
            {/* Paper-tone overlay to soften into the page */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(245,241,232,0.08), transparent 40%, rgba(245,241,232,0.12))',
              }}
            />
          </div>
          {/* Tour de France attribution caption */}
          <p className="kicker mt-4 text-paper-muted">Tour de France · 2026</p>
        </div>
      </div>
    </section>
  );
}
