import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/context/auth-context"
import type { Metadata } from "next"
import dynamic from "next/dynamic"
import type React from "react" // Added import for React

const ScrollToTopButton = dynamic(
  () => import("@/components/scroll-to-top-button").then((mod) => mod.ScrollToTopButton),
  { ssr: false },
)

export const metadata: Metadata = {
  title: "Win Your DATAx",
  description: "Your JOBTREAD automation partner.",
  metadataBase: new URL("https://winyourdata.com"),
  openGraph: {
    title: "Win Your DATAx",
    description: "Your JOBTREAD automation partner.",
    url: "https://winyourdata.com",
    siteName: "Win Your DATAx",
    images: [
      {
        url: "/assets/images/thumb.png",
        width: 1200,
        height: 630,
        alt: "Win Your DATAx Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Win Your DATAx",
    description: "Your JOBTREAD automation partner.",
    images: ["/assets/images/thumb.png"],
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
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            {children}
            <ScrollToTopButton
              scrollThreshold={400}
              excludePaths={["/x"]} // Add any other paths you want to exclude
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

