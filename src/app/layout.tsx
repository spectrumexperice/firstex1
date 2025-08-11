import { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { Tajawal } from 'next/font/google';
import '@/app/globals.css';
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
})
export default function RootLayout({ children }: { children: ReactNode }) {
  return <>
     <html lang="en" dir="ltr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${tajawal.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  </>;
}
