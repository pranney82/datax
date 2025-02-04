"use client"

import { Label } from "@/components/ui/label"
import { SingleRun } from "./singlerun"
import ModernDashboardCard from "@/components/dash-card"
import { Input } from "@/components/ui/input"
import { CreateWebhookButton } from "./cpwebhook"
import { searchWebhooks } from "./cpquery"
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

export default function GMapCoverPhotoPage() {
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

        const webhooks = data?.organization?.webhooks?.nodes || []
        const exists = webhooks.some((webhook: Webhook) => webhook.url === "https://winyourdata.com/api/coverphoto/2")
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
            <h1 className="text-2xl font-bold">Google Maps Job Cover Photo</h1>
            <p className="text-muted-foreground">Manage automatic cover photo updates for your jobs</p>
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
        <FeatureProtect featureName="Google Maps Job Cover Photo">
          <div className="grid gap-6 md:grid-cols-2">
            <ModernDashboardCard
              title="Automatic Cover Photo Updates"
              description="Enable automatic cover photo creation on job creation. This will create a cover photo for each job created in JobTread using a static Google Streetview image."
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
            <h2 className="text-2xl font-semibold mb-4">Cover Photo Logs</h2>
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto">
                <div className="grid gap-4 p-4">
                  <div className="bg-white rounded-lg border text-sm">
                    <div className="md:flex md:items-center md:gap-4 md:p-4">
                      <div className="flex-1 p-4 md:p-0">
                        <div className="font-medium mb-1">Date & Time</div>
                        <div>1/26/2025, 3:21:31 PM</div>
                      </div>
                      <div className="flex-1 p-4 md:p-0">
                        <div className="font-medium mb-1">Status</div>
                        <div className="text-green-600">Success</div>
                      </div>
                      <div className="flex-1 p-4 md:p-0">
                        <div className="font-medium mb-1">Job ID</div>
                        <div>22P3Kv2xn6T5</div>
                      </div>
                      <div className="flex-1 p-4 md:p-0">
                        <div className="font-medium mb-1">Address</div>
                        <div>3203 Lenox Rd NE unit 45, Atlanta, GA 30324, USA</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border text-sm">
                    <div className="md:flex md:items-center md:gap-4 md:p-4">
                      <div className="flex-1 p-4 md:p-0">
                        <div className="font-medium mb-1">Date & Time</div>
                        <div>1/25/2025, 2:15:22 PM</div>
                      </div>
                      <div className="flex-1 p-4 md:p-0">
                        <div className="font-medium mb-1">Status</div>
                        <div className="text-green-600">Success</div>
                      </div>
                      <div className="flex-1 p-4 md:p-0">
                        <div className="font-medium mb-1">Job ID</div>
                        <div>19L7Jm4xk2R8</div>
                      </div>
                      <div className="flex-1 p-4 md:p-0">
                        <div className="font-medium mb-1">Address</div>
                        <div>1180 Peachtree St NE, Atlanta, GA 30309, USA</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border text-sm">
                    <div className="md:flex md:items-center md:gap-4 md:p-4">
                      <div className="flex-1 p-4 md:p-0">
                        <div className="font-medium mb-1">Date & Time</div>
                        <div>1/24/2025, 11:05:47 AM</div>
                      </div>
                      <div className="flex-1 p-4 md:p-0">
                        <div className="font-medium mb-1">Status</div>
                        <div className="text-red-600">Failed</div>
                      </div>
                      <div className="flex-1 p-4 md:p-0">
                        <div className="font-medium mb-1">Job ID</div>
                        <div>31Q9Hs6yp4F2</div>
                      </div>
                      <div className="flex-1 p-4 md:p-0">
                        <div className="font-medium mb-1">Address</div>
                        <div>400 W Peachtree St NW, Atlanta, GA 30308, USA</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border text-sm">
                    <div className="md:flex md:items-center md:gap-4 md:p-4">
                      <div className="flex-1 p-4 md:p-0">
                        <div className="font-medium mb-1">Date & Time</div>
                        <div>1/23/2025, 9:30:15 AM</div>
                      </div>
                      <div className="flex-1 p-4 md:p-0">
                        <div className="font-medium mb-1">Status</div>
                        <div className="text-green-600">Success</div>
                      </div>
                      <div className="flex-1 p-4 md:p-0">
                        <div className="font-medium mb-1">Job ID</div>
                        <div>28T6Gf1zw9M3</div>
                      </div>
                      <div className="flex-1 p-4 md:p-0">
                        <div className="font-medium mb-1">Address</div>
                        <div>75 14th St NE, Atlanta, GA 30309, USA</div>
                      </div>
                    </div>
                  </div>
                </div>
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

