"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp } from 'lucide-react'
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"

interface FeatureCardProps {
  title: string
  description: string
  href: string
  isPopular?: boolean
  status: string
}

function FeatureCard({ title, description, href, isPopular, status }: FeatureCardProps) {
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
          {status === "Coming Soon" && (
            <Badge                
              className="gap-1 bg-gray-100 text-gray-800 border-gray-200 font-semibold pointer-events-none ml-2 whitespace-nowrap"
            >
              {status}
            </Badge>
          )}
          {status === "xxx" && (
            <Badge                
              className="gap-1 bg-[#ffd400] text-[#000] border-[#ffd400] font-semibold pointer-events-none ml-2 whitespace-nowrap"
            >
              Request!!
            </Badge>
          )}
        </div>
      </div>
    </Card>
  )
}

export default function FeaturesPage() {
  const [searchQuery, setSearchQuery] = useState("")
 

  const allFeatures = [
    {
      title: "Cash Flow Calendar",
      description: "Track and manage your cash flow based on JobTread's calendar task types.",
      href: "/x/toolbox/calendar",
      isPopular: true,
      status: "Active"
    },
    {
      title: "Zillow Data Import",
      description: "When a job is created, automatically import property data from Zillow and assign to custom fields.",
      href: "/x/toolbox/zillow",
      isPopular: true,
      status: "Active"
    },
    {
      title: "Google Maps Cover Photos",
      description: "Automatically fetch Google Maps images and assign to Job Cover Photo.",
      href: "/x/toolbox/coverphoto",
      isPopular: true,  
      status: "Active"
    },
    {
      title: "AI Agent",
      description: "Define workflows inside of JobTread for your AI Agent to run automously.",
      href: "#",
      isPopular: false,
      status: "Coming Soon"
    },
    {
      title: "Voice to Estimate",
      description: "Generate estimates for jobs using voice recordings and AI.",
      href: "#",
      isPopular: false,
      status: "Coming Soon"
    },
    {
      title: "Inventory Management",
      description: "Track and manage your inventory inside of JobTread.",
      href: "#",
      isPopular: false,
      status: "Coming Soon"
    },
    {
      title: "Google Calendar Sync",
      description: "Sync your JobTread calendar with Google Calendar, instantly both ways.",
      href: "#",
      isPopular: false,
      status: "Coming Soon"
    },
    {
      title: "Calendly Integration",
      description: "Automatically sync your Calendly events to JobTread.",
      href: "#",
      isPopular: false,
      status: "Coming Soon"
    },
    {
      title: "Third Party Payment Processing",
      description: "Integrate with more payment processors than what are avaialbe in JobTread, seamlessly.",
      href: "#",
      isPopular: false,
      status: "Coming Soon"
    },
    {
      title: "Print Calendar",
      description: "Generate printable calendar for offline use.",
      href: "#",
      isPopular: false,
      status: "Coming Soon"
    },
    {
      title: "Print ToDos",
      description: "Generate printable task lists for offline use.",
      href: "#",
      isPopular: false,
      status: "Coming Soon"
    },
    {
      title: "Feature Request",
      description: "Suggest a new feature for us to build.",
      href: "/x#feature-request",
      isPopular: false,
      status: "xxx"
    },
  ]

  const filteredAndSortedFeatures = useMemo(() => {
    return allFeatures
      .filter(feature => 
        (feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
  }, [allFeatures, searchQuery]);
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Toolbox</h2>
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:max-w-xs"
          />
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
            />
          ))}
        </div>
      </main>
    </div>
  )
}

