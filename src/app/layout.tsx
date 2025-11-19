import type { Metadata } from 'next';
import { Geist, Geist_Mono, Montserrat } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
const font = Montserrat({
  weight: ['600'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Portfolio Juan Manuel Silva',
  description: 'Portfolio Juan Manuel Silva - Full Stack Developer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='hydrated'>
      <body
        className={`${font.className} antialiased`}
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        {children}
      </body>
    </html>
  );
}
