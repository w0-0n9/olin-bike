import { setRequestLocale } from 'next-intl/server';
import { BookingForm } from '@/components/BookingForm';

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <BookingForm />;
}
