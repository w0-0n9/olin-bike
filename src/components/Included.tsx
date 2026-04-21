import { useTranslations } from 'next-intl';
import { ICONS, type IconName } from './Icons';

type Feature = {
  icon: IconName;
  title: string;
  body: string;
};

export function Included() {
  const t = useTranslations('included');
  const features = t.raw('features') as Feature[];

  return (
    <section id="included" className="grain-paper section relative bg-paper-warm">
      <div className="container-max">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
          <h2
            className="brush text-5xl leading-[0.95] text-ink sm:text-6xl md:text-7xl"
            style={{ transform: 'rotate(-1deg)' }}
          >
            {t('title')}
          </h2>
          <p className="display mt-6 text-lg italic text-ink-soft sm:text-xl">
            {t('intro')}
          </p>
        </div>

        {/* 6 feature cards — 1 col mobile, 2 cols tablet, 3 cols desktop */}
        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-14 lg:gap-y-14">
          {features.map((f, i) => {
            const Icon = ICONS[f.icon];
            return (
              <div key={i} className="group relative">
                {/* Number */}
                <span className="kicker absolute -top-1 right-0 text-paper-muted/70">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Icon in yellow accent square */}
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center bg-ink text-accent transition-transform group-hover:-rotate-3">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="display mb-3 text-2xl text-ink sm:text-[1.6rem]">
                  {f.title}
                </h3>
                <p className="text-[0.95rem] leading-relaxed text-ink-soft">
                  {f.body}
                </p>
              </div>
            );
          })}
        </div>

        {/* Founding member callout */}
        <div className="mt-20 border border-accent-deep/50 bg-accent/10 p-8 sm:p-10">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div>
              <p className="kicker mb-2 text-accent-deep">
                Founding member perk
              </p>
              <p className="display text-lg text-ink sm:text-xl">
                {t('perk')}
              </p>
            </div>
            <svg
              viewBox="0 0 40 40"
              className="h-10 w-10 flex-shrink-0 text-accent-deep sm:h-12 sm:w-12"
              fill="currentColor"
              aria-hidden
            >
              <path d="M20 2l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z" />
            </svg>
          </div>
        </div>

        {/* Location note — descriptive */}
        <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-ink-soft/80 sm:text-base">
          {t('note')}
        </p>

        {/* Not included — fine print */}
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-paper-muted">
          {t('excluded')}
        </p>
      </div>
    </section>
  );
}
