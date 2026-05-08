import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'Participant Waiver — Olin Cycling Experiences',
  description:
    'Olin Cycling Experiences — Tour de France 2026 Participant Waiver and Checkout Consent. Updated April 2026.',
  robots: { index: false, follow: false },
};

// Legal text held in English. The on-page consent labels are localised in
// `messages/*.json`, but the underlying waiver document is the canonical
// English version referenced by Section 9 (Governing Law). When localised
// versions are commissioned and lawyer-reviewed, switch this to a translation
// table keyed by locale.
export default async function WaiverPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="min-h-screen bg-paper pb-20 pt-28 sm:pt-36">
      <div className="container-max max-w-3xl">
        <Link
          href="/book"
          className="group mb-8 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to checkout
        </Link>

        <header className="mb-10 border-b border-paper-line pb-8">
          <p className="kicker mb-3 text-paper-muted">Olin Cycling Experiences</p>
          <h1
            className="brush text-4xl leading-tight text-ink sm:text-5xl"
            style={{ transform: 'rotate(-1deg)' }}
          >
            Participant Waiver &amp; Checkout Consent
          </h1>
          <p className="display mt-3 text-base italic text-ink-soft sm:text-lg">
            Tour de France 2026 — July 21–26
          </p>
          <dl className="mt-6 grid gap-2 text-xs text-paper-muted sm:grid-cols-2">
            <div>
              <dt className="kicker">Effective date</dt>
              <dd className="text-ink-soft">1 May 2026</dd>
            </div>
            <div>
              <dt className="kicker">Updated</dt>
              <dd className="text-ink-soft">May 2026</dd>
            </div>
          </dl>
        </header>

        <Section number={1} title="Assumption of Risk">
          <p>
            I acknowledge that cycling, particularly road cycling in mountainous terrain and in
            proximity to a professional bicycle race, involves inherent and significant risks of
            physical injury, including but not limited to: falls, collisions with vehicles, animals,
            or other cyclists; exposure to weather including heat, cold, rain, and lightning;
            mechanical failure of equipment; high-altitude effects; and the actions of other road
            users and race spectators.
          </p>
          <p>
            I confirm that I am over 18 years of age, that I am in adequate physical condition to
            participate in a multi-day mountain cycling experience, and that I have consulted a
            physician if I have any pre-existing medical conditions that could be affected by
            strenuous physical activity.
          </p>
          <p>
            I voluntarily and knowingly assume all risks associated with participation in the Olin
            Cycling Experiences Tour de France 2026 program.
          </p>
        </Section>

        <Section number={2} title="Release of Liability">
          <p>
            In consideration of being permitted to participate, I hereby release, discharge, and
            covenant not to sue Olin Cycling Experiences LLC, its founders Augusto and Rodrigo,
            guides, employees, contractors, the chalet property owners, and all associated parties
            (collectively &ldquo;Olin&rdquo;) from any and all claims, demands, losses, or
            liability arising from personal injury, death, property damage, or any other harm
            sustained during or arising from participation in this experience.
          </p>
          <p>
            This release applies to claims arising from ordinary negligence but does not apply to
            gross negligence or wilful misconduct on the part of Olin.
          </p>
          <p>
            This release is binding upon my heirs, executors, personal representatives, and
            assigns.
          </p>
        </Section>

        <Section number={3} title="Medical & Emergency">
          <p>
            I authorise Olin staff to seek and consent to emergency medical treatment on my behalf
            should I be incapacitated. I understand that any costs arising from emergency medical
            treatment, evacuation, or hospitalisation are my sole responsibility and strongly
            recommend participants hold comprehensive travel insurance including emergency
            evacuation cover.
          </p>
          <p>
            I will disclose any relevant medical conditions, allergies, or medications to Olin
            prior to departure. This information will be held confidentially and used only in a
            medical emergency.
          </p>
          <p>
            I confirm I hold, or will obtain before departure, valid travel insurance covering
            cycling activities in France.
          </p>
        </Section>

        <Section number={4} title="Code of Conduct & Group Safety">
          <p>
            I agree to follow all instructions from Olin guides at all times on rides, particularly
            regarding speed, positioning, road rules, and proximity to the professional race route.
            I understand that Olin reserves the right to remove any participant from a ride or from
            the program for behaviour that endangers themselves, other participants, or the
            public, with no refund.
          </p>
          <p>
            I agree to obey French traffic laws and the directions of race marshals, gendarmerie,
            and event officials at all times.
          </p>
        </Section>

        <Section number={5} title="Equipment">
          <p>
            If I rent a carbon bike from Olin (USD $500), I agree to handle it with reasonable care
            and to report any damage promptly. Damage beyond normal wear will be assessed and
            charged at cost. A valid credit card must be held on file for the rental period.
          </p>
          <p>
            A helmet is mandatory on all rides. Participants without a certified cycling helmet
            will not be permitted to ride. Helmets can be provided upon request.
          </p>
        </Section>

        <Section number={6} title="Cancellation & Refund Policy" anchorId="cancellation">
          <p>
            A deposit of USD $1,300 secures your place. The remaining balance of USD $1,690 is due
            no later than 21 May 2026. Optional carbon bike rental (USD $500) is invoiced with the
            final balance.
          </p>
          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider2 text-ink">
            Cancellation by participant
          </h3>
          <ul className="mt-3 space-y-2 pl-5 [list-style:disc] marker:text-paper-muted">
            <li>Within 24 hours of booking: full refund, no questions asked.</li>
            <li>
              More than 90 days before departure (before 22 April 2026): full refund of deposit.
            </li>
            <li>60–90 days before departure: 50% refund of amounts paid.</li>
            <li>
              30–60 days before departure: 25% refund, or full credit toward the Olin TDF 2027
              experience.
            </li>
            <li>
              Less than 30 days before departure: non-refundable, but the place is transferable to
              another rider you nominate, subject to Olin&rsquo;s approval. A USD $150
              administrative fee applies to transfers.
            </li>
          </ul>
          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider2 text-ink">
            Cancellation by Olin
          </h3>
          <p>
            If Olin cancels the experience due to circumstances within our control, all payments
            received will be refunded in full within 14 days. If cancellation is due to force
            majeure events (natural disaster, pandemic restrictions, government order, race
            cancellation by ASO), Olin will offer a full credit toward the 2027 edition or a refund
            minus non-recoverable third-party costs.
          </p>
        </Section>

        <Section number={7} title="Privacy & Data Protection" anchorId="privacy">
          <p>
            Olin processes personal data under the lawful basis of contractual necessity to deliver
            the experience you have booked. Data collected includes: name, email, phone, emergency
            contact, dietary requirements, and medical notes you choose to disclose.
          </p>
          <p>
            Data is retained for the duration of the trip plus seven years for tax, insurance, and
            liability record-keeping, after which it is deleted. Data is not sold or shared with
            third parties except: (a) the chalet operator, transport provider, and bike rental
            partner where strictly necessary to deliver the trip; (b) Stripe for payment
            processing; (c) emergency medical providers in the event of incident.
          </p>
          <p>
            Participants resident in the EU, UK, California, or South Korea retain all rights under
            their applicable data protection law, including the right to access, rectify, or delete
            their data, and the right to lodge a complaint with their local supervisory authority.
            Requests can be sent to{' '}
            <a
              href="mailto:info@olin.bike"
              className="text-accent-deep underline-offset-2 hover:underline"
            >
              info@olin.bike
            </a>
            .
          </p>
        </Section>

        <Section number={8} title="Photo & Media Consent">
          <p>
            Olin may capture photographs and video during the experience. Use of any image in which
            you are individually identifiable for promotional, editorial, or social media purposes
            requires your separate, optional consent at checkout.
          </p>
          <p>
            Incidental appearance in wide group photos where individuals are not the focus is not
            covered by this requirement, but you may at any time email{' '}
            <a
              href="mailto:info@olin.bike"
              className="text-accent-deep underline-offset-2 hover:underline"
            >
              info@olin.bike
            </a>{' '}
            to request that a specific image be removed from Olin channels, and Olin will comply
            within seven days.
          </p>
        </Section>

        <Section number={9} title="Governing Law">
          <p>
            This agreement is governed by the laws of the United States, save that nothing in this
            agreement excludes mandatory consumer protections under the law of the
            participant&rsquo;s country of residence.
          </p>
        </Section>

        <Section number={10} title="Acknowledgement">
          <p>
            By ticking the consent boxes at checkout and submitting payment, I confirm that I have
            read, understood, and agreed to all terms set out in this waiver. A copy of this signed
            waiver and my checkout consents will be emailed to me alongside my booking
            confirmation.
          </p>
        </Section>

        <footer className="mt-16 border-t border-paper-line pt-8 text-xs leading-relaxed text-paper-muted">
          <p>
            Olin Cycling Experiences ·{' '}
            <a
              href="mailto:info@olin.bike"
              className="text-ink-soft underline-offset-2 hover:underline"
            >
              info@olin.bike
            </a>{' '}
            · olin.bike
          </p>
          <p className="mt-3 italic">
            Working draft. Before going live, have a French or EU consumer-protection lawyer review
            Sections 2, 6, and 7 against French tourism industry regulations (Code du tourisme) and
            GDPR. The Release of Liability in Section 2 has limited enforceability under French law
            for organised tourism activities.
          </p>
        </footer>
      </div>
    </article>
  );
}

function Section({
  number,
  title,
  anchorId,
  children,
}: {
  number: number;
  title: string;
  anchorId?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={anchorId} className="mb-12 scroll-mt-28">
      <h2 className="mb-4 text-lg font-semibold text-ink sm:text-xl">
        <span className="mr-2 text-paper-muted">{number}.</span>
        {title}
      </h2>
      <div className="space-y-4 text-sm leading-relaxed text-ink-soft sm:text-base">{children}</div>
    </section>
  );
}
