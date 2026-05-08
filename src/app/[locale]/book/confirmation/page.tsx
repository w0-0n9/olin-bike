import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { OlinMark } from '@/components/OlinMark';
import Link from 'next/link';
import { PRICING, formatUSD } from '@/lib/stripe';

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'confirmation' });

  return (
    <section className="flex min-h-screen items-center justify-center bg-navy-deep px-5">
      <div className="max-w-xl text-center">
        <OlinMark variant="auto" className="mx-auto mb-8 h-16 w-16 text-accent" />

        <h1
          className="brush text-6xl leading-none text-paper-light sm:text-7xl"
          style={{ transform: 'rotate(-1deg)' }}
        >
          {t('title')}
        </h1>
        <p className="display mt-4 text-xl italic text-paper-light/90 sm:text-2xl">
          {t('subtitle')}
        </p>

        <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-paper/80">
          {t('body')}
        </p>

        <div className="mx-auto mt-10 max-w-sm border border-paper/20 p-6">
          <h2 className="kicker mb-4 text-paper/60">{t('summary')}</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-paper/70">{t('depositPaid')}</span>
              <span className="font-semibold text-accent">{formatUSD(PRICING.DEPOSIT)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-paper/70">{t('balanceDue')}</span>
              <span className="text-paper-light">{t('balanceDate')}</span>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-paper/60">
          {t('contact')}{' '}
          <a
            href="mailto:info@olin.bike"
            className="text-accent underline-offset-4 hover:underline"
          >
            info@olin.bike
          </a>
        </p>

        <Link
          href={`/${locale}`}
          className="mt-10 inline-flex items-center gap-2 border border-paper/25 px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-paper-light transition-all hover:border-accent hover:text-accent"
        >
          {t('backHome')}
        </Link>
      </div>
    </section>
  );
}
