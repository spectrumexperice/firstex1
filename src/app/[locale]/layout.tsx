
import '@/app/output.css'
import { Tajawal } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/src/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import Providers from '../providers';
import UserProvider from '../userProvide';
import Header from './component/Header';



const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal',
});



export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const {locale}=await params
  // Validate the locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Set the locale for the request
setRequestLocale(locale);

  // Load messages
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error('Failed to load messages', error);
    notFound();
  }

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className={` ${tajawal.variable} antialiased`}>
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