"use client"

import { Label } from "@/components/ui/label"
import { SingleRun } from "./singlerun"
import { AIABillingLogsTable } from "./aialogstable"
import ModernDashboardCard from "@/components/dash-card"
import { Input } from "@/components/ui/input"
import { CreateWebhookButton } from "./aiawebhook"
import { searchWebhooks } from "./aiaquery"
import { doc, getDoc } from "firebase/firestore"
import { useAuth } from "@/lib/context/auth-context"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { Loader2, YoutubeIcon as YouTube } from "lucide-react"
import { Button } from "@/components/ui/button"
import FeatureProtect from "@/components/admin/featureProtect"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Webhook {
  id: string
  url: string
}

export default function AIABillingPage() {
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
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)
        const userData = userDoc.data()
        const orgDocRef = doc(db, "orgs", userData?.org)
        const orgDoc = await getDoc(orgDocRef)
        const orgData = orgDoc.data()

        if (!orgData?.orgID || !orgData?.grantKey) {
          setError("Organization settings not found. Please check your settings.")
          return
        }

        setOrgId(orgData.orgID)
        setGrantKey(orgData.grantKey)
      } catch (error) {
        console.error("Error fetching user settings:", error)
        setError("Failed to load organization settings")
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
        const response = await fetch("/api/jtfetch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: {
              $: { grantKey: grantKey },
              ...searchWebhooks({ orgID: orgId }),
            },
          }),
        })
        const data = await response.json()
        console.log("aiadata",data)
        const webhooks = data?.organization?.webhooks?.nodes || []
        const exists = webhooks.some((webhook: Webhook) => webhook.url === "https://winyourdata.com/api/aiabilling/2")
        setWebhookExists(exists)
      } catch (error) {
        console.error("Error fetching webhooks:", error)
      }
    }
    fetchWebhooks()
  }, [orgId, grantKey])

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="space-y-8">
        <header className="space-y-4 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">AIA Billing</h1>
            <p className="text-muted-foreground">Attach AIA Billing PDF to customer invoices for your jobs</p>
          </div>
          <Button
            variant="outline"
            className="w-full sm:w-auto gap-2 text-black border-2 border-[#FFD400] bg-[#FFD400] transition-colors duration-300 shadow-lg hover:bg-[#FFD400]/80"
            onClick={() => setIsTutorialOpen(true)}
          >
            <YouTube className="w-5 h-5" />
            <span className="font-semibold">Tutorial</span>
          </Button>
        </header>
        <FeatureProtect featureName="AIA Billing">
          <div className="grid gap-6 md:grid-cols-2">
            <ModernDashboardCard
              title="AIA Billing PDF"
              description="Attach AIA Billing PDF to customer invoices for your jobs"
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="webhook-url" className="mb-1 block">
                    Webhook URL
                  </Label>
                  <Input
                    className="w-full"
                    type="text"
                    id="webhook-url"
                    value="https://winyourdata.com/api/aiabilling/2"
                    disabled
                  />
                </div>
                {isLoading ? (
                  <Button disabled className="w-full">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </Button>
                ) : error ? (
                  <div className="text-sm text-red-600 p-2 bg-red-50 rounded">{error}</div>
                ) : (
                  <CreateWebhookButton isConnected={webhookExists} orgId={orgId} grantKey={grantKey} />
                )}
              </div>
            </ModernDashboardCard>

            <ModernDashboardCard title="Single Run">
              <SingleRun />
            </ModernDashboardCard>
          </div>

          <section className="mt-12">
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto p-4">
                <AIABillingLogsTable />
              </div>
            </div>
          </section>
        </FeatureProtect>
      </div>

      <Dialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
        <DialogContent className="sm:max-w-[800px] max-w-[90vw] w-full bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-black">Tutorial Video</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/YwqPPWUjjyw"
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

