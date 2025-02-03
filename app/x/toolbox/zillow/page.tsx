'use client'

import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { Label } from "@/components/ui/label"
import ModernDashboardCard from "@/components/dash-card"
import { SingleRun } from "./singlerun"
import { Card3 } from "./card3"
import { Card4 } from "./card4"
import { searchWebhooks } from "./zquery"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/context/auth-context"
import { CreateWebhookButton } from "./zwebhook"
import { Button } from "@/components/ui/button"
import { Loader2, YoutubeIcon as YouTube } from 'lucide-react'
import { Input } from "@/components/ui/input"
import FeatureProtect from "@/components/admin/featureProtect"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Webhook {
  url: string
  cfType: string
}

export default function ZillowPage() {
  const { user } = useAuth()
  const [orgId, setOrgId] = useState<string | null>(null)
  const [grantKey, setGrantKey] = useState<string | null>(null)
  const [webhookExists, setWebhookExists] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  
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
          webhook.url === "https://winyourdata.com/api/zillow"
        )
        setWebhookExists(exists)
      } catch (error) {
        console.error('Error fetching webhooks:', error)
      }
    }
    fetchWebhooks()
  }, [orgId, grantKey])
  
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Zillow Data Import</h1>
        <Button
          variant="outline"
          className="gap-2 text-black border-2 border-[#FFD400] bg-[#FFD400] transition-colors duration-300 shadow-lg hover:bg-[#FFD400]/80"
          onClick={() => setIsTutorialOpen(true)}
        >
          <YouTube className="w-5 h-5" />
          <span className="font-semibold">Tutorial</span>
        </Button>
      </div>
      <FeatureProtect featureName="Zillow Data Import">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ModernDashboardCard 
          title="Automatic Zillow Data"
          description="Import on location creation. This will create Zillow data on your location record in JobTread."
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-url" className="mb-2 block">
                Webhook URL
              </Label>
              <Input 
                className="w-full" 
                type="text" 
                id="webhook-url"
                value="https://winyourdata.com/api/zillow"
                disabled
              />
            </div>
            {isLoading ? (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </Button>
            ) : error ? (
              <div className="text-sm text-red-600 p-2 bg-red-100 rounded">{error}</div>
            ) : (
              <CreateWebhookButton 
                isConnected={webhookExists} 
                orgId={orgId} 
                grantKey={grantKey}
              />
            )}
          </div>
        </ModernDashboardCard>
        <SingleRun />
        <Card3 />
        <Card4 />
      </div>
      </FeatureProtect>
      <Dialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
        <DialogContent className="sm:max-w-[800px] max-w-[90vw] w-full bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-black">Tutorial Video</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/nq1yXgheU2Q"
              title="Tutorial Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}