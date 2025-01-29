"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useMemo } from "react"

interface FeatureCardProps {
  title: string
  description: string
  href: string
  isPopular?: boolean
  status: string
  footerTag?: string
  tier: "core" | "pro"
}

function FeatureCard({ title, description, href, isPopular, status, footerTag }: FeatureCardProps) {
  return (
    <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md hover:border-gray-300 flex flex-col">
      <div className="p-4 flex-grow">
        <div className="flex flex-row justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#ffd400]" />
            <Link
              href={href}
              className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors duration-200 ease-in-out group"
            >
              <span className="border-b-2 border-gray-200 group-hover:border-gray-400 pb-1">{title}</span>
            </Link>
          </div>
          <div>
            <Badge
              variant="secondary"
              className={`gap-1 font-semibold pointer-events-none ml-2 whitespace-nowrap px-2 py-1 rounded-full text-xs ${
                isPopular
                  ? "bg-[#ffd400] text-[#000]"
                  : status === "Coming Soon"
                    ? "bg-blue-100 text-blue-800"
                    : status === "Request"
                      ? "bg-purple-100 text-purple-800"
                      : ""
              }`}
            >
              {isPopular && <TrendingUp className="h-3 w-3 text-[#000]" />}
              {isPopular ? "Popular" : status}
            </Badge>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-4 text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <p className="line-clamp-2">{description}</p>
          {footerTag && (
            <span
              className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                footerTag === "PRO" ? "bg-[#ffd400] text-[#000]" : "bg-gray-200 text-gray-800"
              } flex items-center gap-1`}
            >
              {footerTag === "PRO" ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {footerTag}
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {footerTag}
                </>
              )}
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}

const allFeatures: FeatureCardProps[] = [
  {
    title: "Cash Flow Calendar",
    description: "Track and manage your cash flow based on JobTread's calendar task types.",
    href: "/x/toolbox/calendar",
    isPopular: true,
    status: "Active",
    footerTag: "CORE",
    tier: "core",
  },
  {
    title: "Zillow Data Import",
    description: "When a job is created, automatically import property data from Zillow and assign to custom fields.",
    href: "/x/toolbox/zillow",
    isPopular: true,
    status: "Active",
    footerTag: "CORE",
    tier: "core",
  },
  {
    title: "Google Maps Cover Photos",
    description: "Automatically fetch Google Maps images and assign to Job Cover Photo.",
    href: "/x/toolbox/coverphoto",
    isPopular: true,
    status: "Active",
    footerTag: "CORE",
    tier: "core",
  },
  {
    title: "AI Agent",
    description: "Define workflows inside of JobTread for your AI Agent to run automously.",
    href: "#",
    isPopular: false,
    status: "Coming Soon",
    footerTag: "PRO",
    tier: "pro",
  },
  {
    title: "Voice to Estimate",
    description: "Generate estimates for jobs using voice recordings and AI.",
    href: "#",
    isPopular: false,
    status: "Coming Soon",
    footerTag: "PRO",
    tier: "pro",
  },
  {
    title: "Inventory Management",
    description: "Track and manage your inventory inside of JobTread.",
    href: "#",
    isPopular: false,
    status: "Coming Soon",
    footerTag: "PRO",
    tier: "pro",
  },
  {
    title: "Google Calendar Sync",
    description: "Sync your JobTread calendar with Google Calendar, instantly both ways.",
    href: "#",
    isPopular: false,
    status: "Coming Soon",
    footerTag: "PRO",
    tier: "pro",
  },
  {
    title: "Calendly Integration",
    description: "Automatically sync your Calendly events to JobTread.",
    href: "#",
    isPopular: false,
    status: "Coming Soon",
    footerTag: "PRO",
    tier: "pro",
  },
  {
    title: "Third Party Payment Processing",
    description: "Integrate with more payment processors than what are avaialbe in JobTread, seamlessly.",
    href: "#",
    isPopular: false,
    status: "Coming Soon",
    footerTag: "PRO",
    tier: "pro",
  },
  {
    title: "Print Calendar",
    description: "Generate printable calendar for offline use.",
    href: "#",
    isPopular: false,
    status: "Coming Soon",
    footerTag: "PRO",
    tier: "pro",
  },
  {
    title: "Print ToDos",
    description: "Generate printable task lists for offline use.",
    href: "#",
    isPopular: false,
    status: "Coming Soon",
    footerTag: "PRO",
    tier: "pro",
  },
  {
    title: "Feature Request",
    description: "Suggest a new feature for us to build.",
    href: "/x#feature-request",
    isPopular: false,
    status: "Request",
    footerTag: "CORE",
    tier: "core",
  },
]

export default function FeaturesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTier, setSelectedTier] = useState<"all" | "core" | "pro">("all")

  const filteredAndSortedFeatures = useMemo(() => {
    return allFeatures.filter((feature) => {
      const matchesSearch =
        feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTier = selectedTier === "all" || feature.tier === selectedTier
      return matchesSearch && matchesTier
    })
  }, [searchQuery, selectedTier])

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Toolbox</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select value={selectedTier} onValueChange={(value: "all" | "core" | "pro") => setSelectedTier(value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="core">CORE</SelectItem>
                <SelectItem value="pro">PRO</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              href={feature.href}
              isPopular={feature.isPopular}
              status={feature.status}
              footerTag={feature.footerTag}
              tier={feature.tier}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

