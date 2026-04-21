import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function WhoFor() {
  const t = useTranslations('whoFor');
  const body = t.raw('body') as string[];

  return (
    <section id="whofor" className="relative overflow-hidden bg-navy-deep">
      <div className="grid lg:min-h-[85vh] lg:grid-cols-2">
        {/* Left: text */}
        <div className="section relative flex items-center">
          <div className="container-max relative w-full max-w-2xl">
            <h2
              className="brush mb-10 text-5xl leading-none text-paper-light sm:text-6xl md:text-7xl"
              style={{ transform: 'rotate(-2deg)' }}
            >
              {t('title')}
            </h2>

            <div className="space-y-6">
              {body.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === body.length - 1
                      ? 'display text-xl italic text-accent sm:text-2xl'
                      : 'text-base leading-relaxed text-paper/85 sm:text-lg'
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right: full-height photo with yellow brush overlay text */}
        <div className="relative min-h-[420px] lg:min-h-0">
          <Image
            src="/images/tour-crowd.jpg"
            alt="Tour de France spectators cheering the peloton"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          {/* Vertical OLIN brush text overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-10">
            <span
              className="brush text-7xl leading-none text-accent drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] sm:text-8xl"
              style={{ writingMode: 'vertical-rl' }}
            >
              OLIN
            </span>
          </div>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(10,12,28,0.4) 0%, transparent 30%)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
