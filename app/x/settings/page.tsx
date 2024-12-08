'use client'

import { useEffect, useState } from "react"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function SettingsPage() {
  const [settings, setSettings] = useState({
    jtgrantkey: '',
    jtorgid: '',
    enableNotifications: false,
    enableAutoSync: false,
    enableDarkMode: false,
  })

  const [showGrantKey, setShowGrantKey] = useState(false)
  const [showOrgId, setShowOrgId] = useState(false)

  const userId = 'user_2lWABBDZrVg3N9IWW6f18kftZvx' // Hardcoded for testing

  // Fetch user settings from Firestore
  useEffect(() => {
    const fetchSettings = async () => {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        setSettings(prev => ({
          ...prev,
          jtgrantkey: userData.jtgrantkey || '',
          jtorgid: userData.jtorgid || '',
          // Keep other settings as is for now
        }))
      }
    }

    fetchSettings()
  }, [])

  // Update handlers to save to Firestore
  const handleInputChange = (key: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSettings(prev => ({ ...prev, [key]: newValue }))
    
    // Update Firestore
    try {
      await updateDoc(doc(db, 'users', userId), {
        [key]: newValue
      })
    } catch (error) {
      console.error('Error updating setting:', error)
      // You might want to add error handling UI here
    }
  }

  const handleToggleChange = (key: string) => async (checked: boolean) => {
    setSettings(prev => ({ ...prev, [key]: checked }))
    
    // Update Firestore
    try {
      await updateDoc(doc(db, 'users', userId), {
        [key]: checked
      })
    } catch (error) {
      console.error('Error updating setting:', error)
      // You might want to add error handling UI here
    }
  }

  return (
    <main className="flex flex-col flex-1 p-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-8 p-6">
        <h1 className="text-2xl font-semibold">Settings</h1>

        <div className="grid gap-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Configure your JobTread API credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="jobtread-org">JobTread Organization ID</Label>
                <div className="relative">
                  <Input
                    id="jobtread-org"
                    type={showOrgId ? "text" : "password"}
                    value={settings.jtorgid}
                    onChange={handleInputChange('jtorgid')}
                    placeholder="Enter your JobTread Organization ID"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOrgId(!showOrgId)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showOrgId ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
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
                  <Label>Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive notifications about updates and alerts
                  </div>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={handleToggleChange('enableNotifications')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Sync</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically sync data with external services
                  </div>
                </div>
                <Switch
                  checked={settings.enableAutoSync}
                  onCheckedChange={handleToggleChange('enableAutoSync')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable dark mode for the interface
                  </div>
                </div>
                <Switch
                  checked={settings.enableDarkMode}
                  onCheckedChange={handleToggleChange('enableDarkMode')}
                />
              </div>
            </CardContent>
          </Card>
          <Button>Save Settings</Button>
        </div>
      </div>
    </main>
  )
}
