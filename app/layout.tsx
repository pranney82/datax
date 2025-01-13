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
        url: '/assets/logos/5.png',
        width: 600,
        height: 315,
        alt: 'Win Your DATA Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
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

