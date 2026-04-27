import { useTranslations } from 'next-intl';
import { OlinMark } from './OlinMark';
import { SPOTS_REMAINING, TOTAL_SPOTS } from '@/lib/config';

export function Reserve() {
  const t = useTranslations('pricing');
  const body = t.raw('body') as string[];

  return (
    <section
      id="reserve"
      className="section relative overflow-hidden bg-navy-deep"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 15% 50%, rgba(240,230,90,0.10), transparent 55%)',
        }}
      />

      <div className="container-max relative grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <OlinMark
            variant="auto"
            className="mb-8 h-16 w-16 text-accent"
          />

          {/* Countdown-style spots remaining */}
          <div className="flex items-end gap-5">
            <span
              className="brush block text-[8rem] leading-[0.8] text-accent drop-shadow-[0_4px_30px_rgba(240,230,90,0.25)] sm:text-[10rem] md:text-[12rem]"
              style={{ transform: 'rotate(-3deg)' }}
              aria-label={t('spotsKicker', { count: SPOTS_REMAINING })}
            >
              {SPOTS_REMAINING}
            </span>
            <div className="pb-4">
              <p className="kicker text-paper-light/85">{t('spotsLabel')}</p>
              <p className="mt-1 text-xs uppercase tracking-wider2 text-paper/45">
                {t('outOfTotal', { total: TOTAL_SPOTS })}
              </p>
            </div>
          </div>

          {/* Stripe-secured payment button — sits right under the counter */}
          <a
            href="/book"
            className="btn-accent mt-8"
          >
            {t('payNow')}
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <p className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-wider2 text-paper/55">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Secured by Stripe
          </p>

          <p
            className="brush mt-10 text-3xl leading-tight text-paper-light sm:text-4xl md:text-5xl"
            style={{ transform: 'rotate(-1deg)' }}
          >
            {t('ctaBrush')}
          </p>
          <p className="mt-4 text-sm uppercase tracking-wider2 text-paper/60">
            {t('contactLabel')}{' '}
            <a
              href={`mailto:${t('contact')}`}
              className="text-accent underline-offset-4 hover:underline"
            >
              {t('contact')}
            </a>
          </p>
        </div>

        <div className="space-y-6 text-paper/85">
          {body.map((p, i) => (
            <p key={i} className="text-base leading-relaxed sm:text-lg">
              {p}
            </p>
          ))}

          <div className="my-8 border-y border-accent/30 py-8">
            <p className="kicker mb-2 text-accent">{t('priceLabel')}</p>
            <p className="display text-4xl text-paper-light sm:text-5xl">
              {t('price')}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-paper/75">
              {t('priceSub')}
            </p>
          </div>

          <p className="display text-lg italic text-paper-light sm:text-xl">
            {t('shape')}
          </p>
          <p className="text-sm leading-relaxed text-paper/75 sm:text-base">
            {t('shapeBody')}
          </p>

          <p className="text-xs leading-relaxed text-paper/55">
            {t('deposit')}
          </p>
          <p className="text-xs leading-relaxed text-paper/55">
            {t('reply')}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a href="/book" className="btn-accent">
              {t('ctaBrush')}
            </a>
            <a
              href={`mailto:${t('contact')}`}
              className="text-sm text-paper/60 underline-offset-4 hover:text-accent hover:underline"
            >
              {t('contact')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
