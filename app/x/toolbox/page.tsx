"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, ChevronDown, Check } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
    <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 ease-in-out hover:shadow-lg hover:border-gray-300 flex flex-col">
      <div className="p-5 flex-grow">
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
              className={`gap-1 font-semibold pointer-events-none ml-2 whitespace-nowrap px-2 py-1 rounded-full text-xs border ${
                isPopular
                  ? "bg-[#ffd400] text-[#000] border-[#e6bf00]"
                  : status === "Coming Soon"
                    ? "bg-gray-100 text-gray-600 border-gray-300"
                    : status === "Request"
                      ? "bg-purple-100 text-purple-800 border-purple-300"
                      : ""
              }`}
            >
              {isPopular && <TrendingUp className="h-3 w-3 text-[#000]" />}
              {isPopular ? "Popular" : status}
            </Badge>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-4 text-sm text-gray-600 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <p className="line-clamp-2">{description}</p>
          {footerTag && (
            <span
              className={`ml-2 px-1.5 py-0.25 text-[9px] font-medium rounded flex items-center gap-0.5 transition-all duration-200 ease-in-out items-center ${
                footerTag === "PRO"
                  ? "bg-gradient-to-r from-[#fff5cc] to-[#ffd400] text-[#664d00] border border-[#ffd400] shadow-sm hover:brightness-105"
                  : footerTag === "CORE"
                    ? "bg-gradient-to-r from-[#fffae6] to-[#fff5cc] text-[#664d00] border border-[#ffe680] hover:brightness-105"
                    : "bg-gray-200 text-gray-800"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold">{footerTag}</span>
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
    title: "Zillow Integration",
    description: "Import property data from Zillow and assign to custom fields.",
    href: "/x/toolbox/zillow",
    isPopular: true,
    status: "Active",
    footerTag: "CORE",
    tier: "core",
  },
  {
    title: "Google Cover Photo",
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
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-6">
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="text-2xl font-bold mb-2 sm:mb-0">Toolbox</h1>
            <div className="flex flex-row gap-4 sm:hidden">
              <Input
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-32 bg-white"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-24">
                    {selectedTier === "all" ? "All Tiers" : selectedTier.toUpperCase()}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setSelectedTier("all")}>
                    <Check className={`mr-2 h-4 w-4 ${selectedTier === "all" ? "opacity-100" : "opacity-0"}`} />
                    All Tiers
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedTier("core")}>
                    <Check className={`mr-2 h-4 w-4 ${selectedTier === "core" ? "opacity-100" : "opacity-0"}`} />
                    CORE
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedTier("pro")}>
                    <Check className={`mr-2 h-4 w-4 ${selectedTier === "pro" ? "opacity-100" : "opacity-0"}`} />
                    PRO
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="hidden sm:flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 bg-white"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {selectedTier === "all" ? "All Tiers" : selectedTier.toUpperCase()}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setSelectedTier("all")}>
                  <Check className={`mr-2 h-4 w-4 ${selectedTier === "all" ? "opacity-100" : "opacity-0"}`} />
                  All Tiers
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedTier("core")}>
                  <Check className={`mr-2 h-4 w-4 ${selectedTier === "core" ? "opacity-100" : "opacity-0"}`} />
                  CORE
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedTier("pro")}>
                  <Check className={`mr-2 h-4 w-4 ${selectedTier === "pro" ? "opacity-100" : "opacity-0"}`} />
                  PRO
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
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

