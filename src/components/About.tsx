import { useTranslations } from 'next-intl';
import Image from 'next/image';

type Partner = {
  name: string;
  logo?: string;
  href: string;
  width: number; // source aspect reference
  height: number;
  // display height in rem (Tailwind h-*)
  display: string;
};

// Real partner logos (PNG with transparent backgrounds)
const PARTNERS: Partner[] = [
  {
    name: 'Rapha',
    logo: '/images/partners/rapha.png',
    href: 'https://www.rapha.cc/',
    width: 500,
    height: 245,
    display: 'h-7 sm:h-8',
  },
  {
    name: 'Airbnb Superhost',
    logo: '/images/partners/airbnb.png',
    href: 'https://www.airbnb.com/',
    width: 500,
    height: 160,
    display: 'h-7 sm:h-8',
  },
  {
    name: 'Wolf Tooth',
    logo: '/images/partners/wolf-tooth.png',
    href: 'https://www.wolftoothcomponents.com/',
    width: 400,
    height: 86,
    display: 'h-5 sm:h-6',
  },
  {
    name: 'Park Tool',
    logo: '/images/partners/park-tool.png',
    href: 'https://www.parktool.com/',
    width: 500,
    height: 300,
    display: 'h-10 sm:h-12',
  },
  {
    name: 'BIEA',
    logo: '/images/partners/biea.png',
    href: 'https://www.biea.bike/',
    width: 750,
    height: 212,
    display: 'h-6 sm:h-7',
  },
];

export function About() {
  const t = useTranslations('about');
  const body = t.raw('body') as string[];

  return (
    <section id="about" className="grain-paper section relative bg-paper-warm">
      <div className="container-max grid items-stretch gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="relative lg:col-span-6">
          <div className="relative aspect-[3/2] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[520px]">
            <Image
              src="/images/about-founders.jpg"
              alt="Augusto and Rodrigo — Olin founders riding in the Alps"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            {/* Brush name overlay */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-6 text-paper-light sm:p-7">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 30%, rgba(10,12,28,0.85) 100%)',
                }}
              />
              <div className="relative">
                <p
                  className="brush text-4xl leading-none text-accent sm:text-5xl"
                  style={{ transform: 'rotate(-2deg)' }}
                >
                  Augusto
                </p>
                <p
                  className="brush mt-1 text-4xl leading-none text-accent sm:text-5xl"
                  style={{ transform: 'rotate(-1deg)' }}
                >
                  & Rodrigo
                </p>
                <p className="kicker mt-3 text-paper/70">Founders</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <h2
            className="brush mb-10 text-5xl text-ink sm:text-6xl md:text-7xl"
            style={{ transform: 'rotate(-1deg)' }}
          >
            {t('title')}
          </h2>

          <div className="space-y-6">
            {body.map((p, i) => (
              <p
                key={i}
                className="text-base leading-relaxed text-ink-soft sm:text-lg"
              >
                {p}
              </p>
            ))}
          </div>

          <div className="mt-12 border-t border-paper-line pt-8">
            <p className="kicker mb-6 text-paper-muted">
              {t('inGoodCompany')}
            </p>
            <div className="space-y-8">
              {[PARTNERS.slice(0, 3), PARTNERS.slice(3)].map((row, ri) => (
                <div
                  key={ri}
                  className="flex flex-wrap items-center justify-start gap-x-10 gap-y-6 sm:gap-x-14"
                >
                  {row.map((p) =>
                    p.logo ? (
                      <a
                        key={p.name}
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={p.name}
                        className="relative flex items-center opacity-70 transition-opacity hover:opacity-100"
                        title={p.name}
                      >
                        <Image
                          src={p.logo}
                          alt={p.name}
                          width={p.width}
                          height={p.height}
                          className={`${p.display} w-auto object-contain`}
                        />
                      </a>
                    ) : null,
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
