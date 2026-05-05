import { ReactNode } from 'react';

/* import { Tajawal } from 'next/font/google'; */
import Providers from './providers'
/* import '@/app/globals.css' */
import './output.css';
import Header from './[locale]/component/Header';
import { useLocale } from 'next-intl';


/* const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal',
}); */


export default function RootLayout({ children }: { children: ReactNode }) {
  const locale=useLocale()
  return <>
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      
      <body
      /*  className={`${tajawal.className} antialiased`} */
      >
        <Providers>
        
           {children}
        </Providers>
      
      </body>
    </html>
  </>;
}
