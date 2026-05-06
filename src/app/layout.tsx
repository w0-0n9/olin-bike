import type { Metadata } from 'next';
import { Inter, Playfair_Display, Caveat } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

// Caveat stays as a graceful fallback while the Adobe Fonts (Flood Std)
// kit loads — and if the kit is not configured.
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Olin Cycling Experiences',
  description: 'An exclusive cycling experience around the Tour de France 2026.',
};

const adobeFontsKitId = process.env.NEXT_PUBLIC_ADOBE_FONTS_KIT_ID;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Surface the active locale on <html> so CSS rules like
  // `:lang(ko) { word-break: keep-all }` can target Korean for proper
  // Hangul 어절 line-breaking, and so screen readers pronounce content
  // with the right phoneme set.
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable} ${caveat.variable}`}
    >
      <head>
        {adobeFontsKitId ? (
          <link
            rel="stylesheet"
            href={`https://use.typekit.net/${adobeFontsKitId}.css`}
          />
        ) : null}
      </head>
      <body>{children}</body>
    </html>
  );
}
