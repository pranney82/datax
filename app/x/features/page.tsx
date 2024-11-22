"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  Star,
  MessageSquare, // Chat
  BarChart, // Dashboard
  FileText, // Documents
  CheckSquare, // Tasks
  Calendar,
  Notebook, // Notes
  HardDrive, // Files
  Users, // Team Chat
  Video, // Meetings
  Mail, // Email
  Wand2, // AI Writer
  LineChart, // Data Analysis
  Workflow, // Automation
  Webhook, // API
  Plug, // Integrations
  Lock, // Access Control
  History, // Audit
  Shield, // Compliance
  FileBarChart, // Reports
  PieChart, // Visualization
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
            {isPopular && (
              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3" /> Popular
              </Badge>
            )}
          </div>
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
      title: "AI Chat",
      description: "Engage with our advanced AI chatbot for instant assistance and insights.",
      href: "/x/chat",
      icon: MessageSquare,
      isPopular: true,
    },
    {
      title: "Dashboard Analytics",
      description: "Comprehensive analytics and visualization tools for your data.",
      href: "/x/dashboard",
      icon: BarChart,
      isPopular: true,
    },
    {
      title: "Document Generation",
      description: "Automatically generate professional documents and reports.",
      href: "/x/documents",
      icon: FileText,
      isPopular: true,
    },
    {
      title: "Task Manager",
      description: "Organize and track your tasks efficiently.",
      href: "/x/tasks",
      icon: CheckSquare,
    },
    {
      title: "Calendar",
      description: "Schedule and manage your appointments.",
      href: "/x/calendar",
      icon: Calendar,
    },
    {
      title: "Notes",
      description: "Take and organize your notes seamlessly.",
      href: "/x/notes",
      icon: Notebook,
    },
    {
      title: "File Storage",
      description: "Secure cloud storage for your files.",
      href: "/x/files",
      icon: HardDrive,
    },
    {
      title: "Team Chat",
      description: "Real-time messaging for team collaboration.",
      href: "/x/team-chat",
      icon: Users,
    },
    {
      title: "Video Meetings",
      description: "HD video conferencing solution.",
      href: "/x/meetings",
      icon: Video,
    },
    {
      title: "Email Client",
      description: "Integrated email management system.",
      href: "/x/email",
      icon: Mail,
    },
    {
      title: "AI Writing Assistant",
      description: "Generate and improve content with AI.",
      href: "/x/ai-writer",
      icon: Wand2,
    },
    {
      title: "Data Analysis",
      description: "Automated data analysis and insights.",
      href: "/x/analysis",
      icon: LineChart,
    },
    {
      title: "Workflow Automation",
      description: "Create custom automation workflows.",
      href: "/x/automation",
      icon: Workflow,
    },
    {
      title: "API Management",
      description: "Manage and monitor your API integrations.",
      href: "/x/api",
      icon: Webhook,
    },
    {
      title: "Webhooks",
      description: "Set up and manage webhook endpoints.",
      href: "/x/webhooks",
      icon: Webhook,
    },
    {
      title: "Third-party Integrations",
      description: "Connect with popular services and tools.",
      href: "/x/integrations",
      icon: Plug,
    },
    {
      title: "Access Control",
      description: "Manage user permissions and access levels.",
      href: "/x/access",
      icon: Lock,
    },
    {
      title: "Audit Logs",
      description: "Track and monitor system activities.",
      href: "/x/audit",
      icon: History,
    },
    {
      title: "Compliance Tools",
      description: "Tools for maintaining regulatory compliance.",
      href: "/x/compliance",
      icon: Shield,
    },
    {
      title: "Custom Reports",
      description: "Create and schedule custom reports.",
      href: "/x/reports",
      icon: FileBarChart,
    },
    {
      title: "Data Visualization",
      description: "Interactive charts and graphs.",
      href: "/x/visualization",
      icon: PieChart,
    },
    {
      title: "Export Tools",
      description: "Export data in multiple formats.",
      href: "/x/export",
      icon: Download,
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
