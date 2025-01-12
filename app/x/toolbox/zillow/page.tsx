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
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import FeatureProtect from "@/components/admin/featureProtect"

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
      <h1 className="text-2xl font-bold mb-8">Zillow Data Import</h1>
      <FeatureProtect featureName="Zillow Data Import">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ModernDashboardCard 
          title="Automatic Zillow Data"
          description="Enable automatic Zillow data import on job creation. This will create a Zestimate and Zillow URL for each job created in JobTread."
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
    </main>

  )
}

