import { useTranslations } from 'next-intl';
import { OlinMark } from './OlinMark';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-paper-line bg-paper">
      <div className="container-max py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3 text-ink">
              <OlinMark variant="auto" className="h-9 w-9 text-ink" />
              <span className="brush text-3xl">OLIN</span>
            </div>
            <p className="display mt-3 text-base italic text-ink-soft">
              {t('brand')}
            </p>
            <p className="mt-1 text-xs text-paper-muted">{t('tagline')}</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="kicker text-paper-muted">Contact</p>
            <a
              href={`mailto:${t('contact')}`}
              className="text-sm text-ink hover:text-accent-deep"
            >
              {t('contact')}
            </a>
            <p className="mt-2 text-xs text-paper-muted">{t('invitation')}</p>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <p className="kicker text-paper-muted">Language</p>
            <LanguageSwitcher />
          </div>
        </div>

        <div className="hairline my-10" />

        <div className="flex flex-col items-start justify-between gap-3 text-xs text-paper-muted sm:flex-row sm:items-center">
          <p>
            © {year} Olin Cycling Experiences. {t('rights')}
          </p>
          <p className="brush text-base text-ink-muted/70">olin.bike</p>
        </div>
      </div>
    </footer>
  );
}
