// Cache configuration with background revalidation
export const dynamic = 'force-dynamic' // Keep dynamic for client-side navigation
export const revalidate = process.env.NEXT_PUBLIC_DISABLE_CACHE === 'true' ? 0 : 300 // 5 minutes with background revalidation

// Enable streaming for progressive rendering
export const preferredRegion = 'auto'
export const runtime = 'nodejs'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/* Suspense boundaries will be added in child components */}
      {children}
    </div>
  )
} 