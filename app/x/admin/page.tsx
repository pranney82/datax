"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp } from 'lucide-react'
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
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
      title: "Stripe Transactions",
      description: "Track and manage your Stripe transactions.",
      href: "/x/admin/stripe",
      isPopular: false,
      status: "Active"
    },
    {
      title: "User Management",
      description: "Manage your users and their permissions.",
      href: "/x/admin/users",
      isPopular: false,
      status: "Active"
    },
    {
      title: "Feature Requests",
      description: "Feature requests from the users.",
      href: "/x/admin/fr",
      isPopular: false,
      status: "Active"
    },
    {
      title: "Logs",
      description: "View and manage user logs.",
      href: "/x/admin/logs",
      isPopular: false,  
      status: "Active"
    },
    {
      title: "Support Requests",
      description: "View and manage support requests from users.",
      href: "/x/admin/sr",
      isPopular: false,
      status: "Active"
    }
  ]

  const filteredAndSortedFeatures = useMemo(() => {
    return allFeatures
      .filter(feature => 
        (feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
  }, [allFeatures, searchQuery]);
  return (
    <main className="flex flex-col flex-1 p-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Admin</BreadcrumbLink>
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
              status={feature.status}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

