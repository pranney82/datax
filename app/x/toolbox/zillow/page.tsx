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
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function ZillowPage() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [addressMapping, setAddressMapping] = useState("")
  const [priceMapping, setPriceMapping] = useState("")
  const [statusMapping, setStatusMapping] = useState("")

  const customFields = [
    "address_field",
    "property_location",
    "street_address",
    "price_amount",
    "listing_price",
    "sale_price",
    "property_status",
    "listing_status",
    "deal_stage"
  ]

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
                <BreadcrumbPage>Zillow Integration</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-8 p-6">
        <div>
          <h1 className="text-2xl font-semibold mb-6">Zillow Data Import</h1>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
              id="zillow-mode"
            />
            <Label htmlFor="zillow-mode">
              Enable Zillow Integration
            </Label>
          </div>
        </div>

        <div className="flex flex-col gap-6 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="address-mapping">Address Field Mapping</Label>
            <Select
              value={addressMapping}
              onValueChange={setAddressMapping}
              disabled={!isEnabled}
            >
              <SelectTrigger id="address-mapping">
                <SelectValue placeholder="Select a field for address" />
              </SelectTrigger>
              <SelectContent>
                {customFields.filter(field => 
                  field.includes('address') || field.includes('location')
                ).map(field => (
                  <SelectItem key={field} value={field}>
                    {field.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price-mapping">Price Field Mapping</Label>
            <Select
              value={priceMapping}
              onValueChange={setPriceMapping}
              disabled={!isEnabled}
            >
              <SelectTrigger id="price-mapping">
                <SelectValue placeholder="Select a field for price" />
              </SelectTrigger>
              <SelectContent>
                {customFields.filter(field => 
                  field.includes('price')
                ).map(field => (
                  <SelectItem key={field} value={field}>
                    {field.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-mapping">Status Field Mapping</Label>
            <Select
              value={statusMapping}
              onValueChange={setStatusMapping}
              disabled={!isEnabled}
            >
              <SelectTrigger id="status-mapping">
                <SelectValue placeholder="Select a field for status" />
              </SelectTrigger>
              <SelectContent>
                {customFields.filter(field => 
                  field.includes('status') || field.includes('stage')
                ).map(field => (
                  <SelectItem key={field} value={field}>
                    {field.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </main>
  )
}
