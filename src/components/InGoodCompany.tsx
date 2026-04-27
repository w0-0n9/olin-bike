import { useTranslations } from 'next-intl';
import Image from 'next/image';

type Partner = {
  name: string;
  logo: string;
  href: string;
  width: number;
  height: number;
  // display height in rem (Tailwind h-*) — bumped up vs. the previous footer-style row
  display: string;
};

const PARTNERS: Partner[] = [
  {
    name: 'Rapha',
    logo: '/images/partners/rapha.png',
    href: 'https://www.rapha.cc/',
    width: 500,
    height: 245,
    display: 'h-12 sm:h-14',
  },
  {
    name: 'Airbnb Superhost',
    logo: '/images/partners/airbnb.png',
    href: 'https://www.airbnb.com/',
    width: 500,
    height: 160,
    display: 'h-12 sm:h-14',
  },
  {
    name: 'Wolf Tooth',
    logo: '/images/partners/wolf-tooth.png',
    href: 'https://www.wolftoothcomponents.com/',
    width: 400,
    height: 86,
    display: 'h-9 sm:h-11',
  },
  {
    name: 'Park Tool',
    logo: '/images/partners/park-tool.png',
    href: 'https://www.parktool.com/',
    width: 500,
    height: 300,
    display: 'h-16 sm:h-20',
  },
  {
    name: 'BIEA',
    logo: '/images/partners/biea.png',
    href: 'https://www.biea.bike/',
    width: 750,
    height: 212,
    display: 'h-11 sm:h-12',
  },
];

export function InGoodCompany() {
  const t = useTranslations('about');

  return (
    <section className="bg-paper py-16 sm:py-20">
      <div className="container-max">
        <p className="kicker mb-10 text-center text-paper-muted">
          {t('inGoodCompany')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 sm:gap-x-16 lg:gap-x-20">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={p.name}
              title={p.name}
              className="flex items-center transition-opacity hover:opacity-70"
            >
              <Image
                src={p.logo}
                alt={p.name}
                width={p.width}
                height={p.height}
                className={`${p.display} w-auto object-contain [filter:brightness(0)]`}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
