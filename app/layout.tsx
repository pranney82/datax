import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from '@/lib/context/auth-context'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Win Your DATA',
  description: 'Insights and automation for serious contractors',
  metadataBase: new URL('https://winyourdata.com'),
  openGraph: {
    title: 'Win Your DATA',
    description: 'Insights and automation for serious contractors',
    url: 'https://winyourdata.com',
    siteName: 'Win Your DATA',
    images: [
      {
        url: '/assets/images/thumb.png',
        width: 1200,
        height: 630,
        alt: 'Win Your DATA Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Win Your DATA',
    description: 'Insights and automation for serious contractors',
    images: ['/assets/images/thumb.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

