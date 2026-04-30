import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { OlinMark } from './OlinMark';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-navy-deep pb-28 pt-24 sm:pb-32 sm:pt-32">
      {/* Solid PDF cover block — same dark navy as the printed invitation */}
      {/* Soft yellow accent glow (TdF yellow jersey feel) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 75%, rgba(240,230,90,0.10), transparent 60%)',
        }}
      />

      <div className="container-max relative z-10 flex flex-col items-center text-center">
        <p className="kicker mb-6 text-paper/60 sm:mb-8">{t('kicker')}</p>

        <p className="display mx-auto max-w-xl text-base italic leading-relaxed text-paper/80 sm:text-lg">
          {t('intro')}
        </p>

        <div className="my-14 flex flex-col items-center sm:my-20">
          <OlinMark
            variant="auto"
            className="mb-8 h-20 w-20 text-paper-light sm:h-24 sm:w-24"
          />
          <h1 className="brush text-7xl leading-none text-paper-light sm:text-8xl md:text-[10rem]">
            {t('brand')}
          </h1>
          <p className="display mt-4 text-2xl italic text-paper-light/90 sm:text-3xl md:text-4xl">
            {t('tagline')}
          </p>
        </div>

        <p className="display mb-12 text-base italic text-paper/90 sm:text-lg md:text-xl">
          {t('subtitle')}
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <Link href="/book" className="btn-accent">
            {t('cta')}
          </Link>
          <Link href={{ pathname: '/', hash: 'experience' }} className="btn-ghost-dark">
            {t('ctaSecondary')}
          </Link>
        </div>
      </div>

      {/* Scroll indicator — anchored to section bottom, not content */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
        <span className="kicker text-paper/40">olin.bike</span>
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 animate-bounce text-paper/40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 4v16m0 0l-6-6m6 6l6-6" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}
