import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/Hero';
import { Philosophy } from '@/components/Philosophy';
import { TourBanner } from '@/components/TourBanner';
import { Experience } from '@/components/Experience';
import { Included } from '@/components/Included';
import { ChaletGallery } from '@/components/ChaletGallery';
import { Itinerary } from '@/components/Itinerary';
import { InGoodCompany } from '@/components/InGoodCompany';
import { WhoFor } from '@/components/WhoFor';
import { About } from '@/components/About';
import { Reserve } from '@/components/Reserve';
import { Quote } from '@/components/Quote';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Philosophy />
      <TourBanner />
      <Experience />
      <Included />
      <InGoodCompany />
      <Itinerary />
      <ChaletGallery />
      <WhoFor />
      <About />
      <Reserve />
      <Quote />
    </>
  );
}
