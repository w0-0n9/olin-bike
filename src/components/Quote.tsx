import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { OlinMark } from './OlinMark';

export function Quote() {
  const t = useTranslations('quote');
  const heroT = useTranslations('hero');

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[70vh] py-28 sm:min-h-[80vh] sm:py-36">
        <Image
          src="/images/hero-mountains.jpg"
          alt="Alpine mountains at dusk"
          fill
          sizes="100vw"
          className="object-cover"
        />

        {/* Strong dark overlay for guaranteed text legibility */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,12,28,0.72) 0%, rgba(10,12,28,0.58) 40%, rgba(10,12,28,0.78) 100%)',
          }}
        />

        {/* Warm yellow accent glow (atmospheric, not washing out) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(240,230,90,0.18) 0%, transparent 55%)',
          }}
        />

        <div className="container-max relative z-10 flex min-h-[70vh] flex-col items-center justify-center text-center sm:min-h-[80vh]">
          <p
            className="brush mx-auto max-w-4xl text-3xl leading-tight text-paper-light drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)] sm:text-5xl md:text-6xl"
            style={{ transform: 'rotate(-1deg)' }}
          >
            &ldquo;{t('text')}&rdquo;
          </p>

          <div className="mt-14 flex flex-col items-center">
            <OlinMark
              variant="auto"
              className="mb-4 h-12 w-12 text-accent drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
            />
            <p className="brush text-4xl text-accent drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-5xl">
              OLIN
            </p>
            <p className="display mt-1 text-lg italic text-paper-light/90 sm:text-xl">
              Cycling Experiences
            </p>
            <p className="display mt-4 text-sm italic text-paper-light/70">
              {heroT('subtitle')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
