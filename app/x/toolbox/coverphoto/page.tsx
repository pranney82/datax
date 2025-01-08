'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Label } from "@/components/ui/label"
import { SingleRun } from "./singlerun"
import { CoverPhotoLogsTable } from "./cplogstable"
import ModernDashboardCard from "@/components/dash-card"
import { Input } from "@/components/ui/input"
import { CreateWebhookButton } from "./cpwebhook"
import { searchWebhooks } from "./cpquery"
import { doc, getDoc } from "firebase/firestore"
import { useAuth } from "@/lib/context/auth-context"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Webhook {
  id: string
  url: string
}

export default function GMapCoverPhotoPage() {
  const { user } = useAuth()
  const [orgId, setOrgId] = useState<string | null>(null)
  const [grantKey, setGrantKey] = useState<string | null>(null)
  const [webhookExists, setWebhookExists] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const fetchUserSettings = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const userDocRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userDocRef)
        const userData = userDoc.data()
        const orgDocRef = doc(db, 'orgs', userData?.org)
        const orgDoc = await getDoc(orgDocRef)
        const orgData = orgDoc.data()
        
        if (!orgData?.orgID || !orgData?.grantKey) {
          setError('Organization settings not found. Please check your settings.')
          return
        }
        
        setOrgId(orgData.orgID)
        setGrantKey(orgData.grantKey)
      } catch (error) {
        console.error('Error fetching user settings:', error)
        setError('Failed to load organization settings')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUserSettings()
  }, [user])

  useEffect(() => {
    const fetchWebhooks = async () => {
      if (!orgId || !grantKey) return

      try {
        const response = await fetch('/api/jtfetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: {
              "$": { "grantKey": grantKey },
              ...searchWebhooks({ orgID: orgId })
            }
          })
        })
        const data = await response.json()
        
        const webhooks = data?.organization?.webhooks?.nodes || []
        const exists = webhooks.some((webhook: Webhook) => 
          webhook.url === "https://winyourdata.com/api/coverphoto/2"
        )
        setWebhookExists(exists)
      } catch (error) {
        console.error('Error fetching webhooks:', error)
      }
    }
    fetchWebhooks()
  }, [orgId, grantKey])

  return (
    <main className="flex flex-col flex-1 p-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/x/toolbox">Toolbox</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Google Maps Cover Photo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-8 p-6">
        <div>
          <h1 className="text-2xl font-semibold mb-6">Google Maps Job Cover Photo</h1>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <ModernDashboardCard 
                title="Automatic Cover Photo Updates"
                description="Enable automatic cover photo creation on job creation. This will create a cover photo for each job created in JobTread using a static Google Streetview image.">
                
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="gmap-cover-photo">
                      Webhook URL
                    </Label>
                  </div>
                  <div className="flex w-full gap-2">
                    <Input 
                      className="w-full" 
                      type="text" 
                      id="webhook-url"
                      value="https://winyourdata.com/api/coverphoto/2"
                      disabled
                    />
                  </div>
                  {isLoading ? (
                    <Button disabled className="w-full">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </Button>
                  ) : error ? (
                    <div className="text-sm text-red-600">{error}</div>
                  ) : (
                    <CreateWebhookButton 
                      isConnected={webhookExists} 
                      orgId={orgId} 
                      grantKey={grantKey}
                    />
                  )}
                </div>
              </ModernDashboardCard>
            </div>
            <div className="col-span-2">
              <SingleRun />
            </div>
          </div>
        </div>

        <CoverPhotoLogsTable />
      </div>
    </main>
  )
} 