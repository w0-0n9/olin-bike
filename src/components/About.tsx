import { useTranslations } from 'next-intl';
import Image from 'next/image';

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
        </div>
      </div>
    </section>
  );
}
