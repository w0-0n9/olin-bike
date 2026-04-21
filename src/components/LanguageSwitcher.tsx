'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

const LOCALES = ['en', 'es', 'fr'] as const;

export function LanguageSwitcher({
  compact = false,
  dark = false,
}: {
  compact?: boolean;
  dark?: boolean;
}) {
  const t = useTranslations('language');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 text-xs uppercase tracking-wider2',
        compact && 'text-[10px]',
      )}
      role="group"
      aria-label={t('label')}
    >
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span
              className={cn(
                'mx-1',
                dark ? 'text-paper-light/30' : 'text-ink/20',
              )}
            >
              ·
            </span>
          )}
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(() => {
                router.replace(pathname, { locale: l });
              })
            }
            className={cn(
              'transition-colors',
              locale === l
                ? dark
                  ? 'text-accent'
                  : 'text-ink'
                : dark
                  ? 'text-paper-light/60 hover:text-paper-light'
                  : 'text-ink-muted/70 hover:text-ink',
            )}
            aria-current={locale === l ? 'true' : undefined}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
