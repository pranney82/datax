import { notFound } from "next/navigation"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getHelpResource } from "@/lib/resources/data"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface PageProps {
  params: {
    id: string
  }
}

export default function ResourcePage({ params }: PageProps) {
  const resource = getHelpResource(params.id)
  
  if (!resource) {
    notFound()
  }

  return (
    <main className="flex flex-col flex-1 p-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/library">Library</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/library/resources">Resources</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{resource.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex justify-between items-center gap-2">
          <h1 className="text-2xl font-bold">{resource.title}</h1>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground">
                    {resource.description}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Resource Contents</h3>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {resource.topics.map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{resource.type}</span>
                </div>
                {resource.type === 'video' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{resource.duration}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Read Time</span>
                  <span className="font-medium">{resource.readTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">{resource.updatedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Author</span>
                  <span className="font-medium">{resource.author}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
} 