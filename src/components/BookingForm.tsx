'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { OlinMark } from './OlinMark';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { SPOTS_REMAINING } from '@/lib/config';
import {
  BIKE_SIZES,
  PEDAL_TYPES,
  PRICING,
  calculateTotal,
  formatUSD,
  getPromoDiscount,
} from '@/lib/stripe';

export function BookingForm() {
  const t = useTranslations('book');
  const tc = useTranslations('book.consent');
  const locale = useLocale();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bikeRental, setBikeRental] = useState(false);
  const [bikeSize, setBikeSize] = useState('');
  const [pedalType, setPedalType] = useState('');
  const [jerseySize, setJerseySize] = useState('');
  const [privateRoom, setPrivateRoom] = useState(false);
  const [loading, setLoading] = useState(false);

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState(false);

  // GDPR: each box ticked individually. No master "agree to all".
  const [consentWaiver, setConsentWaiver] = useState(false);
  const [consentInsurance, setConsentInsurance] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentCancellation, setConsentCancellation] = useState(false);
  const [consentFeedback, setConsentFeedback] = useState(false);
  const [consentMedia, setConsentMedia] = useState(false);

  const promoDiscount = getPromoDiscount(appliedPromo);
  const total = calculateTotal({ bikeRental, privateRoom, promoCode: appliedPromo });
  const depositAmount = PRICING.DEPOSIT - promoDiscount;
  const balance = total - depositAmount;

  function handleApplyPromo() {
    const code = promoInput.trim();
    if (!code) return;
    if (getPromoDiscount(code) > 0) {
      setAppliedPromo(code.toUpperCase());
      setPromoError(false);
    } else {
      setPromoError(true);
    }
  }

  function handleRemovePromo() {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError(false);
  }

  const allRequiredConsents =
    consentWaiver && consentInsurance && consentPrivacy && consentCancellation;

  const baseFieldsValid =
    Boolean(name.trim()) &&
    Boolean(email.trim()) &&
    Boolean(jerseySize.trim()) &&
    (!bikeRental || (Boolean(bikeSize) && Boolean(pedalType)));

  const canSubmit = baseFieldsValid && allRequiredConsents && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          bikeRental,
          bikeSize: bikeRental ? bikeSize : undefined,
          pedalType: bikeRental ? pedalType : undefined,
          jerseySize,
          privateRoom,
          locale,
          promoCode: appliedPromo ?? undefined,
          consents: {
            waiver: consentWaiver,
            insurance: consentInsurance,
            privacy: consentPrivacy,
            cancellation: consentCancellation,
            feedback: consentFeedback,
            media: consentMedia,
            at: new Date().toISOString(),
          },
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Something went wrong');
        setLoading(false);
      }
    } catch {
      alert('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen bg-paper pb-20 pt-28 sm:pt-36">
      <div className="container-max">
        {/* Header */}
        <div className="mb-14">
          <Link href="/" className="group mb-8 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            olin.bike
          </Link>
          <div className="flex items-center gap-4">
            <OlinMark variant="auto" className="h-12 w-12 text-ink" />
            <div>
              <h1
                className="brush text-5xl leading-none text-ink sm:text-6xl"
                style={{ transform: 'rotate(-1deg)' }}
              >
                {t('title')}
              </h1>
              <p className="display mt-2 text-base italic text-ink-soft sm:text-lg">
                {t('subtitle')}
              </p>
            </div>
          </div>
          <p className="brush mt-6 text-2xl text-accent-deep">
            {t('spotsLeft', { count: SPOTS_REMAINING })}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left: Form fields */}
            <div className="space-y-10 lg:col-span-7">
              {/* Contact */}
              <fieldset>
                <legend className="kicker mb-6 text-paper-muted">{t('contact')}</legend>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
                      {t('name')}
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-paper-line bg-paper-warm px-4 py-3 text-ink placeholder:text-paper-muted focus:border-accent-deep focus:outline-none focus:ring-1 focus:ring-accent-deep"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
                        {t('email')}
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-paper-line bg-paper-warm px-4 py-3 text-ink placeholder:text-paper-muted focus:border-accent-deep focus:outline-none focus:ring-1 focus:ring-accent-deep"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">
                        {t('phone')}
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-paper-line bg-paper-warm px-4 py-3 text-ink placeholder:text-paper-muted focus:border-accent-deep focus:outline-none focus:ring-1 focus:ring-accent-deep"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Bike option */}
              <fieldset>
                <legend className="kicker mb-6 text-paper-muted">{t('bikeTitle')}</legend>
                <div className="space-y-3">
                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-4 border px-5 py-4 transition-colors',
                      !bikeRental ? 'border-accent-deep bg-accent/10' : 'border-paper-line hover:border-ink/30',
                    )}
                  >
                    <input
                      type="radio"
                      name="bike"
                      checked={!bikeRental}
                      onChange={() => setBikeRental(false)}
                      className="accent-accent-deep"
                    />
                    <span className="flex-1 text-sm text-ink sm:text-base">{t('bikeOwn')}</span>
                    <span className="text-sm font-medium text-paper-muted">+$0</span>
                  </label>

                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-4 border px-5 py-4 transition-colors',
                      bikeRental ? 'border-accent-deep bg-accent/10' : 'border-paper-line hover:border-ink/30',
                    )}
                  >
                    <input
                      type="radio"
                      name="bike"
                      checked={bikeRental}
                      onChange={() => setBikeRental(true)}
                      className="accent-accent-deep"
                    />
                    <span className="flex-1 text-sm text-ink sm:text-base">{t('bikeRental')}</span>
                    <span className="text-sm font-medium text-accent-deep">+{formatUSD(PRICING.BIKE_RENTAL)}</span>
                  </label>

                  {bikeRental && (
                    <div className="ml-9 grid gap-4 border-l-2 border-accent-deep/40 pl-5 pt-2 sm:grid-cols-2">
                      <div>
                        <label htmlFor="bikeSize" className="mb-1.5 block text-sm font-medium text-ink">
                          {t('bikeSize')}
                        </label>
                        <select
                          id="bikeSize"
                          required
                          value={bikeSize}
                          onChange={(e) => setBikeSize(e.target.value)}
                          className="w-full border border-paper-line bg-paper-warm px-4 py-3 text-ink focus:border-accent-deep focus:outline-none focus:ring-1 focus:ring-accent-deep"
                        >
                          <option value="">—</option>
                          {BIKE_SIZES.map((s) => (
                            <option key={s} value={s}>{s} cm</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="pedalType" className="mb-1.5 block text-sm font-medium text-ink">
                          {t('pedalType')}
                        </label>
                        <select
                          id="pedalType"
                          required
                          value={pedalType}
                          onChange={(e) => setPedalType(e.target.value)}
                          className="w-full border border-paper-line bg-paper-warm px-4 py-3 text-ink focus:border-accent-deep focus:outline-none focus:ring-1 focus:ring-accent-deep"
                        >
                          <option value="">—</option>
                          {PEDAL_TYPES.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </fieldset>

              {/* Jersey size — every founding member receives a jersey, so
                  this is a required free-text field. Free text (vs select)
                  accommodates brand-specific fits and chest measurements. */}
              <fieldset>
                <legend className="kicker mb-6 text-paper-muted">{t('jerseyTitle')}</legend>
                <label htmlFor="jerseySize" className="mb-1.5 block text-sm font-medium text-ink">
                  {t('jerseySize')}
                </label>
                <input
                  id="jerseySize"
                  type="text"
                  required
                  value={jerseySize}
                  onChange={(e) => setJerseySize(e.target.value)}
                  placeholder={t('jerseyPlaceholder')}
                  className="w-full border border-paper-line bg-paper-warm px-4 py-3 text-ink placeholder:text-paper-muted focus:border-accent-deep focus:outline-none focus:ring-1 focus:ring-accent-deep"
                />
                <p className="mt-2 text-xs text-paper-muted">{t('jerseyHint')}</p>
              </fieldset>

              {/* Room option */}
              <fieldset>
                <legend className="kicker mb-6 text-paper-muted">{t('roomTitle')}</legend>
                <div className="space-y-3">
                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-4 border px-5 py-4 transition-colors',
                      !privateRoom ? 'border-accent-deep bg-accent/10' : 'border-paper-line hover:border-ink/30',
                    )}
                  >
                    <input
                      type="radio"
                      name="room"
                      checked={!privateRoom}
                      onChange={() => setPrivateRoom(false)}
                      className="accent-accent-deep"
                    />
                    <span className="flex-1 text-sm text-ink sm:text-base">{t('roomShared')}</span>
                    <span className="text-sm font-medium text-paper-muted">+$0</span>
                  </label>

                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-4 border px-5 py-4 transition-colors',
                      privateRoom ? 'border-accent-deep bg-accent/10' : 'border-paper-line hover:border-ink/30',
                    )}
                  >
                    <input
                      type="radio"
                      name="room"
                      checked={privateRoom}
                      onChange={() => setPrivateRoom(true)}
                      className="accent-accent-deep"
                    />
                    <span className="flex-1 text-sm text-ink sm:text-base">{t('roomPrivate')}</span>
                    <span className="text-sm font-medium text-accent-deep">+{formatUSD(PRICING.PRIVATE_ROOM)}</span>
                  </label>
                </div>
              </fieldset>
            </div>

            {/* Right: Price summary (sticky) */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 border border-paper-line bg-paper-warm p-8">
                <h2 className="kicker mb-6 text-paper-muted">{t('priceSummary')}</h2>

                <div className="space-y-3 border-b border-paper-line pb-6">
                  <div className="flex justify-between text-sm text-ink">
                    <span>{t('baseFee')}</span>
                    <span>{formatUSD(PRICING.BASE_FEE)}</span>
                  </div>
                  {bikeRental && (
                    <div className="flex justify-between text-sm text-ink">
                      <span>{t('bikeRentalFee')}</span>
                      <span>+{formatUSD(PRICING.BIKE_RENTAL)}</span>
                    </div>
                  )}
                  {privateRoom && (
                    <div className="flex justify-between text-sm text-ink">
                      <span>{t('privateRoomFee')}</span>
                      <span>+{formatUSD(PRICING.PRIVATE_ROOM)}</span>
                    </div>
                  )}
                  {appliedPromo && (
                    <div className="flex justify-between text-sm text-accent-deep">
                      <span>{t('promo.applied', { code: appliedPromo })}</span>
                      <span>−{formatUSD(promoDiscount)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-between text-lg font-semibold text-ink">
                  <span>{t('total')}</span>
                  <span>{formatUSD(total)}</span>
                </div>

                <div className="mt-6 space-y-2 border-t border-paper-line pt-6">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-accent-deep">{t('deposit')}</span>
                    <span className="text-lg font-bold text-accent-deep">{formatUSD(depositAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-paper-muted">
                    <span>{t('balance')}</span>
                    <span>{formatUSD(balance)}</span>
                  </div>
                </div>

                <p className="mt-6 text-xs leading-relaxed text-paper-muted">
                  {t('depositNote')}
                </p>

                <div className="mt-6 border-t border-paper-line pt-6">
                  <label htmlFor="promoCode" className="kicker mb-3 block text-paper-muted">
                    {t('promo.label')}
                  </label>
                  {appliedPromo ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 border border-accent-deep bg-accent/10 px-4 py-3 text-sm font-medium text-accent-deep">
                        {appliedPromo} · −{formatUSD(promoDiscount)}
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="border border-paper-line bg-paper-warm px-4 py-3 text-xs font-semibold uppercase tracking-wider2 text-ink transition-colors hover:border-ink/40"
                      >
                        {t('promo.remove')}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <input
                          id="promoCode"
                          type="text"
                          value={promoInput}
                          onChange={(e) => {
                            setPromoInput(e.target.value);
                            if (promoError) setPromoError(false);
                          }}
                          onKeyDown={(e) => {
                            // Enter inside the promo input should apply the
                            // code, not submit the whole form (which would
                            // redirect to Stripe with full deposit).
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleApplyPromo();
                            }
                          }}
                          placeholder={t('promo.placeholder')}
                          autoComplete="off"
                          className={cn(
                            'flex-1 border bg-paper-warm px-4 py-3 text-sm text-ink placeholder:text-paper-muted focus:outline-none focus:ring-1',
                            promoError
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'border-paper-line focus:border-accent-deep focus:ring-accent-deep',
                          )}
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          disabled={!promoInput.trim()}
                          className={cn(
                            'border px-4 py-3 text-xs font-semibold uppercase tracking-wider2 transition-colors',
                            promoInput.trim()
                              ? 'border-ink bg-ink text-paper-light hover:bg-navy'
                              : 'cursor-not-allowed border-paper-line bg-paper-line text-paper-muted',
                          )}
                        >
                          {t('promo.apply')}
                        </button>
                      </div>
                      {promoError && (
                        <p className="mt-2 text-xs text-red-600">{t('promo.invalid')}</p>
                      )}
                    </>
                  )}
                </div>

                {/* GDPR-compliant consent block. Sits directly above the
                    deposit button. Each required box must be individually
                    ticked — no master "agree to all" checkbox. The button is
                    disabled until all four required boxes are confirmed. */}
                <fieldset className="mt-8 border-t border-paper-line pt-6">
                  <legend className="kicker mb-4 text-paper-muted">
                    {tc('title')}
                  </legend>

                  <div className="space-y-3 text-xs leading-relaxed text-ink">
                    <ConsentRow
                      id="consent-waiver"
                      checked={consentWaiver}
                      onChange={setConsentWaiver}
                      required
                      requiredLabel={tc('requiredLabel')}
                    >
                      {tc.rich('waiver', {
                        link: (chunks) => (
                          <Link
                            href="/legal/waiver"
                            target="_blank"
                            rel="noopener"
                            className="text-accent-deep underline-offset-2 hover:underline"
                          >
                            {chunks}
                          </Link>
                        ),
                      })}
                    </ConsentRow>

                    <ConsentRow
                      id="consent-insurance"
                      checked={consentInsurance}
                      onChange={setConsentInsurance}
                      required
                      requiredLabel={tc('requiredLabel')}
                    >
                      {tc('insurance')}
                    </ConsentRow>

                    <ConsentRow
                      id="consent-privacy"
                      checked={consentPrivacy}
                      onChange={setConsentPrivacy}
                      required
                      requiredLabel={tc('requiredLabel')}
                    >
                      {tc.rich('privacy', {
                        link: (chunks) => (
                          <Link
                            href="/legal/waiver#privacy"
                            target="_blank"
                            rel="noopener"
                            className="text-accent-deep underline-offset-2 hover:underline"
                          >
                            {chunks}
                          </Link>
                        ),
                      })}
                    </ConsentRow>

                    <ConsentRow
                      id="consent-cancellation"
                      checked={consentCancellation}
                      onChange={setConsentCancellation}
                      required
                      requiredLabel={tc('requiredLabel')}
                    >
                      {tc.rich('cancellation', {
                        link: (chunks) => (
                          <Link
                            href="/legal/waiver#cancellation"
                            target="_blank"
                            rel="noopener"
                            className="text-accent-deep underline-offset-2 hover:underline"
                          >
                            {chunks}
                          </Link>
                        ),
                      })}
                    </ConsentRow>

                    <p className="mt-5 text-[10px] uppercase tracking-wider2 text-paper-muted">
                      {tc('optionalIntro')}
                    </p>

                    <ConsentRow
                      id="consent-feedback"
                      checked={consentFeedback}
                      onChange={setConsentFeedback}
                    >
                      {tc('feedback')}
                    </ConsentRow>

                    <ConsentRow
                      id="consent-media"
                      checked={consentMedia}
                      onChange={setConsentMedia}
                    >
                      {tc('media')}
                    </ConsentRow>
                  </div>
                </fieldset>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={cn(
                    'mt-6 w-full py-4 text-xs font-semibold uppercase tracking-wider2 transition-all',
                    canSubmit
                      ? 'bg-ink text-paper-light hover:bg-navy hover:shadow-[0_10px_30px_-10px_rgba(20,22,42,0.4)]'
                      : 'cursor-not-allowed bg-paper-line text-paper-muted',
                  )}
                >
                  {loading ? t('processing') : `${t('payDeposit')} — ${formatUSD(depositAmount)}`}
                </button>

                {baseFieldsValid && !allRequiredConsents && (
                  <p className="mt-3 text-center text-[11px] text-paper-muted">
                    {tc('helperHint')}
                  </p>
                )}

                <p className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider2 text-paper-muted">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  {t('securedBy')}
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function ConsentRow({
  id,
  checked,
  onChange,
  required,
  requiredLabel,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  required?: boolean;
  requiredLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 text-ink"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-required={required ? true : undefined}
        className="mt-0.5 h-4 w-4 flex-none accent-accent-deep"
      />
      <span className="flex-1">
        {children}
        {required && requiredLabel && (
          <span className="ml-1 text-[10px] uppercase tracking-wider2 text-accent-deep">
            {requiredLabel}
          </span>
        )}
      </span>
    </label>
  );
}
