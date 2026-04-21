import { useTranslations } from 'next-intl';
import { OlinMark } from './OlinMark';

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
          <h2
            className="brush text-5xl leading-[0.9] text-accent sm:text-6xl md:text-7xl"
            style={{ transform: 'rotate(-2deg)' }}
          >
            {t('spotsKicker')}
          </h2>
          <p
            className="brush mt-8 text-3xl leading-tight text-paper-light sm:text-4xl md:text-5xl"
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

          <div className="pt-4">
            <a href={`mailto:${t('contact')}`} className="btn-accent">
              {t('contact')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
