'use client'

import { useEffect, useState } from "react"
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, KeyRound } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/context/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from "next/link"

type Organization = {
  id: string;
  name: string;
}

type JTMembership = {
  organization: {
    id: string;
    name: string;
    subscriptionStatus: string;
    subscriptionType: string;
  };
};

export default function SettingsPage() {
  const { user } = useAuth()
  const userId = user?.uid || ''

  const [settings, setSettings] = useState({
    jtgrantkey: '',
    jtorgid: '',
    dataxorgid: '',
    subscriptionStatus: '',
    subscriptionType: '',
    enableNotifications: false,
    enableAutoSync: false,
    enableDarkMode: false,
  })
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  const [showGrantKey, setShowGrantKey] = useState(false)

  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(false)

  const [grantKeyDialogOpen, setGrantKeyDialogOpen] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      if (!userId) return

      const userDoc = await getDoc(doc(db, 'users', userId))
      if (!userDoc.exists()) return

      const userData = userDoc.data()
      
      const orgDoc = await getDoc(doc(db, 'orgs', userData.org))
      if (!orgDoc.exists()) return

      const orgData = orgDoc.data()
      
      // Search stripedata collection for matching orgID
      const stripeQuery = query(
        collection(db, 'stripedata'),
        where('orgID', '==', userData.org)
      )
      
      const stripeSnapshot = await getDocs(stripeQuery)
      let subscriptionStatus = 'free'
      let subscriptionType = 'free'
      
      if (!stripeSnapshot.empty) {
        const stripeData = stripeSnapshot.docs[0].data()
        subscriptionStatus = stripeData.subscriptionStatus || 'error'
        subscriptionType = stripeData.tier || 'error'
      }

      setSettings(prev => ({
        ...prev,
        jtgrantkey: orgData.grantKey || '',
        jtorgid: orgData.orgID || '',
        dataxorgid: userData.org || '',
        subscriptionStatus,
        subscriptionType,
        // Keep other settings as is
      }))
    }

    fetchSettings()
  }, [userId])

  const handleInputChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSettings(prev => ({ ...prev, [key]: newValue }))
    setUnsavedChanges(true)
  }

  const handleSave = async () => {
    if (!userId) {
      alert('User not authenticated')
      return
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (!userDoc.exists()) return
      
      await updateDoc(doc(db, 'orgs', userDoc.data().org), {
        grantKey: settings.jtgrantkey,
        orgID: settings.jtorgid
      })

      await updateDoc(doc(db, 'users', userId), {
        enableNotifications: settings.enableNotifications,
        enableAutoSync: settings.enableAutoSync,
        enableDarkMode: settings.enableDarkMode
      })

      setUnsavedChanges(false)
      alert('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    }
  }

  const orgLookUp = async (grantKey: string) => {
    if (!grantKey) {
      console.error('Missing grantKey')
      return null
    }

    setIsLoadingOrgs(true)
    try {
      const response = await fetch('/api/jtfetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            "$": { "grantKey": grantKey },
            "currentGrant": {
              "user": {
                "memberships": {
                  "nodes": {
                    "organization": {
                      "id": {},
                      "name": {}
                    }
                  }
                }
              }
            }
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const orgs = data?.currentGrant?.user?.memberships?.nodes?.map(
        (node: JTMembership | undefined) => ({
          id: node?.organization?.id || '',
          name: node?.organization?.name || ''
        })
      ) || []
      
      setOrganizations(orgs)
      return data
    } catch (error) {
      console.error('Error fetching query:', error)
      return null
    } finally {
      setIsLoadingOrgs(false)
    }
  }

  useEffect(() => {
    if (settings.jtgrantkey) {
      orgLookUp(settings.jtgrantkey)
    }
  }, [settings.jtgrantkey])

  const gkDialog = () => setGrantKeyDialogOpen(true)

  return (
    <div className="flex-grow container mx-auto px-4 py-8">
      <div className="grid gap-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <Button onClick={handleSave} disabled={!unsavedChanges}>
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Configure your JobTread API credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full" onClick={gkDialog}>
                <KeyRound className="h-4 w-4 mr-2" />
                <span>Retrieve API Grant Key</span>
              </Button>
              <div className="space-y-2">
                <Label htmlFor="jobtread-api">JobTread API Grant Key</Label>
                <div className="relative">
                  <Input
                    id="jobtread-api"
                    type={showGrantKey ? "text" : "password"}
                    value={settings.jtgrantkey}
                    onChange={handleInputChange('jtgrantkey')}
                    placeholder="Enter your JobTread API Grant Key"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGrantKey(!showGrantKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showGrantKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobtread-org">JobTread Organization</Label>
                <Select
                  value={settings.jtorgid}
                  onValueChange={(value) => {
                    setSettings(prev => ({ ...prev, jtorgid: value }))
                    setUnsavedChanges(true)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingOrgs ? (
                      <SelectItem value="loading" disabled>
                        Loading organizations...
                      </SelectItem>
                    ) : organizations.length > 0 ? (
                      organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No organizations found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable dark mode for the interface
                    <div className="text-xs text-muted-foreground">Coming Soon</div>
                  </div>
                </div>
              </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Billing</CardTitle>
                <CardDescription>
                  Manage your billing information
                </CardDescription>
                  <div className="space-y-2">
                    <div className="text-sm py-2">
                      Subscription Status: <span className="font-semibold">{settings.subscriptionStatus}</span>
                    </div>
                    <div className="text-sm py-2">
                      Subscription Type: <span className="font-semibold">{settings.subscriptionType}</span>
                    </div>
                  </div>
                  {settings.subscriptionStatus === 'error' && (
                    <div className="text-sm py-2">
                      <span className="font-semibold text-red-500">Error fetching subscription data</span>
                    </div>
                  )}
                  {settings.subscriptionStatus === 'free' ? (
                    <Link href={process.env.NEXT_PUBLIC_APP_URL + '/pricing'}>
                      <Button className="w-full">Upgrade to PRO</Button>
                    </Link>
                  ) : (
                    <Button className="w-full" onClick={() => window.open('https://billing.stripe.com/p/login/7sIdSU6y5g7f2WI7ss', '_blank')}>Manage Subscription</Button>
                  )}
                
              </CardHeader>
            </Card>
          </div>
        </div>

        <Dialog open={grantKeyDialogOpen} onOpenChange={setGrantKeyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to get your API Grant Key</DialogTitle>
              <DialogDescription className="space-y-4 pt-4">
                <p>1. Click the button below to open JobTread in a new window</p>
                <p>2. We will automatically take you to the API Grant Settings page</p>
                <p>3. Click &quot;Add Grant to All Organizations&quot;</p>
                <p>4. Name it something like &quot;DATAx Key,&quot; doesn&apos;t need to be exact. Create.</p>
                <p>5. Copy the Grant Key and paste it back here</p>
                
                <Button 
                  className="w-full mt-4"
                  onClick={() => window.open('https://app.jobtread.com/settings/integrations/api/grants', '_blank')}
                >
                  <KeyRound className="h-4 w-4 mr-2" />
                  Open JobTread API Settings
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
  )
}

