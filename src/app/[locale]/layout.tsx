import { Geist, Geist_Mono } from 'next/font/google';
import { Tajawal } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

import Providers from '@/app/providers';
import UserProvider from '@/app/userProvide';
import Header from '@/app/[locale]/component/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

type RootLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
const messages = (await import(`../../../messages/${locale}.json`)).default;
console.log("messageeeee",messages)

  return (
     <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${tajawal.variable} antialiased`}
      >
   <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <UserProvider>
          <Header />
          <main>{children}</main>
        </UserProvider>
      </Providers>
    </NextIntlClientProvider>
     </body>
    </html>
  );
}
