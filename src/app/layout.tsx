import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LeadDialogProvider } from '@/components/forms/LeadDialog';
import { Toaster } from '@/components/ui/toaster';
import { pagesMeta, company } from '@/content/site';

export const metadata: Metadata = {
  metadataBase: new URL('https://xn--80aknigcncfkc7d8byc.xn--p1ai'),
  title: {
    default: pagesMeta.home.title,
    template: '%s | Строят Крымчане',
  },
  description: pagesMeta.home.description,
  keywords: [
    'строительство домов Крым',
    'СИП-панельные дома',
    'каркасные дома Крым',
    'модульные дома',
    'дом под ключ Крым',
    'Строят Крымчане',
  ],
  authors: [{ name: company.name }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: company.name,
    title: pagesMeta.home.title,
    description: pagesMeta.home.description,
    images: [{ url: '/images/hero-aframe.jpg', width: 1440, height: 720, alt: company.tagline }],
  },
  twitter: {
    card: 'summary_large_image',
    title: company.name,
    description: pagesMeta.home.description,
    images: ['/images/hero-aframe.jpg'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2c2620',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-ember focus:px-4 focus:py-2 focus:text-[#f2ede2]"
        >
          Перейти к содержимому
        </a>
        <LeadDialogProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
        </LeadDialogProvider>
      </body>
    </html>
  );
}
