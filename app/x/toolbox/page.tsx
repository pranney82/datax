"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, FileText, CheckSquare, Calendar, Download, TypeIcon as type, Zap, TrendingUp } from 'lucide-react'
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"

interface FeatureCardProps {
  title: string
  description: string
  href: string
  isPopular?: boolean
  isActive: boolean
}

function FeatureCard({ title, description, href, isPopular, isActive }: FeatureCardProps) {
  return (
    <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md hover:border-gray-300 flex flex-col">
      <div className="p-4 flex-grow">
        <div className="flex flex-row justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#ffd400]" />
            <Link
              href={href}
              className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors duration-200 ease-in-out group"
            >
              <span className="border-b-2 border-gray-200 group-hover:border-gray-400 pb-1">{title}</span>
            </Link>
          </div>
          <Badge 
            variant={isActive ? "default" : "secondary"}
            className={`${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} font-medium pointer-events-none ml-2 whitespace-nowrap`}
          >
            {isActive ? 'On' : 'Off'}
          </Badge>
        </div>
      </div>
      <div className="bg-gray-50 p-4 text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <p className="line-clamp-2">{description}</p>
          {isPopular && (
            <Badge 
              variant="secondary" 
              className="gap-1 bg-[#ffd400] text-[#fff] border-[#ffd400] font-semibold pointer-events-none ml-2 whitespace-nowrap"
            >
              <TrendingUp className="h-3 w-3 text-[#000]" /> Popular
            </Badge>
          )}
        </div>
      </div>
    </Card>
  )
}

export default function FeaturesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFeatures, setActiveFeatures] = useState<Record<string, boolean>>({
    "Cash Flow Calendar": true,
    "Zillow Data Import": true,
    "Google Maps Cover Photos": false,
    "Print ToDos": false,
  })

  const allFeatures = [
    {
      title: "Cash Flow Calendar",
      description: "Track and manage your cash flow based on JobTread's calendar task types.",
      href: "/x/toolbox/calendar",
      icon: Calendar,
      isPopular: true,
    },
    {
      title: "Zillow Data Import",
      description: "When a job is created, automatically import property data from Zillow and assign to custom fields.",
      href: "/x/toolbox/zillow",
      icon: Download,
      isPopular: true,
    },
    {
      title: "Google Maps Cover Photos",
      description: "Automatically fetch Google Maps images and assign to Job Cover Photo.",
      href: "/x/toolbox/coverphoto",
      icon: FileText,
      isPopular: true,
    },
    {
      title: "Print ToDos",
      description: "Generate printable task lists for offline use.",
      href: "/x/toolbox/print",
      icon: CheckSquare,
      isPopular: false,
    },
  ]

  const filteredAndSortedFeatures = useMemo(() => {
    return allFeatures
      .filter(feature => 
        feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (activeFeatures[a.title] === activeFeatures[b.title]) {
          return 0;
        }
        return activeFeatures[a.title] ? -1 : 1;
      });
  }, [allFeatures, searchQuery, activeFeatures]);

  return (
    <main className="flex flex-col flex-1 p-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Toolbox</BreadcrumbLink>
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
        <div className="flex justify-between items-center gap-2">
          <h1 className="text-2xl font-bold">Toolbox</h1>
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              href={feature.href}
              isPopular={feature.isPopular}
              isActive={activeFeatures[feature.title]}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

