'use client'

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
import { useState } from "react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    googleMapsApiKey: '',
    zillowApiKey: '',
    enableNotifications: false,
    enableAutoSync: false,
    enableDarkMode: false,
  })

  const handleInputChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, [key]: e.target.value }))
  }

  const handleToggleChange = (key: string) => (checked: boolean) => {
    setSettings(prev => ({ ...prev, [key]: checked }))
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
                Configure your API keys for external services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google-maps-api">Google Maps API Key</Label>
                <Input
                  id="google-maps-api"
                  type="password"
                  value={settings.googleMapsApiKey}
                  onChange={handleInputChange('googleMapsApiKey')}
                  placeholder="Enter your Google Maps API key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zillow-api">Zillow API Key</Label>
                <Input
                  id="zillow-api"
                  type="password"
                  value={settings.zillowApiKey}
                  onChange={handleInputChange('zillowApiKey')}
                  placeholder="Enter your Zillow API key"
                />
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
        </div>
      </div>
    </main>
  )
}
