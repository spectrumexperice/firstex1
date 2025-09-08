import { ReactNode } from 'react';

import { Tajawal } from 'next/font/google';
import Providers from '@/app/providers'; 
import '@/app/globals.css';
import Header from './[locale]/component/Header';


const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal',
});


export default function RootLayout({ children }: { children: ReactNode }) {
  return <>
     <html lang="en" dir="ltr">
      <body
        className={` ${tajawal.variable} antialiased`}
      >
        <Providers>
        
           {children}
        </Providers>
      
      </body>
    </html>
  </>;
}
