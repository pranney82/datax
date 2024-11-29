"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  Star,
  FileText, // Documents
  CheckSquare, // Tasks
  Calendar,
  Download, // Export
  type LucideIcon
} from "lucide-react"
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface FeatureCardProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
  isPopular?: boolean
}

function FeatureCard({ title, description, href, icon: Icon, isPopular }: FeatureCardProps) {
  return (
    <Link href={href}>
      <Card className="group relative h-full p-6 hover:bg-muted/50 transition-colors">
        <div className="flex flex-col items-center text-center">
          <Icon className="h-12 w-12 mb-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{title}</h3>
          </div>
          {isPopular && (
              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3" /> Popular
              </Badge>
            )}
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
        <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
      </Card>
    </Link>
  )
}

export default function FeaturesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const allFeatures = [

    {
      title: "Cash Flow Calendar",
      description: "Track and manage your cash flow based on JobTread's calendar task types.",
      href: "/x/features/calendar",
      icon: Calendar,
      isPopular: true,
    },
    {
      title: "Zillow Data Import",
      description: "When a job is created, automatically import property data from Zillow and assign to custom fields.",
      href: "/x/features/zillow",
      icon: Download,
      isPopular: true,
    },
    {
      title: "Google Maps Cover Photos",
      description: "Automatically fetch Google Maps images and assign to Job Cover Photo.",
      href: "/x/features/coverphoto",
      icon: FileText,
      isPopular: true,
    },
    {
      title: "Print ToDos",
      description: "Generate printable task lists for offline use.",
      href: "/x/features/print",
      icon: CheckSquare,
      isPopular: false,
    },
  ]

  const filteredFeatures = allFeatures.filter(feature => 
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="flex flex-col flex-1 p-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Features</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="container py-8">
          <div className="flex flex-col gap-4 mb-8">
            <h1 className="text-3xl font-bold">JT Features</h1>
            <Input
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            {filteredFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                href={feature.href}
                icon={feature.icon}
                isPopular={feature.isPopular}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
