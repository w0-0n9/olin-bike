import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function TourBanner() {
  const t = useTranslations('tourBanner');

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[50vh] min-h-[380px] w-full sm:h-[60vh] md:h-[70vh]">
        <Image
          src="/images/tour-arc.jpg"
          alt="Tour de France peloton on the Champs-Élysées with the Arc de Triomphe"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark overlay — heavier at top where text sits */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,12,28,0.70) 0%, rgba(10,12,28,0.50) 35%, rgba(10,12,28,0.30) 70%, rgba(10,12,28,0.55) 100%)',
          }}
        />
        {/* Subtle yellow glow for atmosphere (echoes the brand) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, rgba(240,230,90,0.15) 0%, transparent 50%)',
          }}
        />
        <div className="relative z-10 flex h-full items-start">
          <div className="container-max pt-10 sm:pt-16">
            <h2
              className="brush whitespace-pre-line text-5xl leading-[0.9] text-accent sm:text-7xl md:text-8xl lg:text-9xl"
              style={{
                transform: 'rotate(-2deg)',
                textShadow:
                  '0 2px 20px rgba(10,12,28,0.7), 0 0 40px rgba(10,12,28,0.5)',
              }}
            >
              {t('title')}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
