import type { Metadata } from 'next'
import { Quicksand, Noto_Sans_JP, Playfair_Display } from 'next/font/google'

import { Analytics } from '@vercel/analytics/next'

import { AudioProvider } from '@/components/providers/AudioProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

import './globals.css'

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nagomi Hub - 没入型 作業BGM & タスク管理',
  description:
    'Spirit City: Lofi Sessions 風の没入型作業環境。LoFi BGM・環境音ミキサー・ポモドーロタイマー・精霊コレクションで集中を楽しむ。',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Nagomi Hub',
    description: '没入型の作業BGMとタスク管理で、集中を楽しむ',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nagomi Hub',
    description: '没入型の作業BGMとタスク管理で、集中を楽しむ',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${quicksand.variable} ${notoSansJP.variable} ${playfairDisplay.variable} antialiased`}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <AudioProvider>{children}</AudioProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
