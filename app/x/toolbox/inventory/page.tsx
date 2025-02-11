"use client"

import { Label } from "@/components/ui/label"
import ModernDashboardCard from "@/components/dash-card"
import { Input } from "@/components/ui/input"
import { searchInventory } from "./mock-search"
import type { InventoryItem, SearchFilters } from "./types"
import { useDebounce } from "./hooks/useDebounce"
import { InventoryReports } from "./reports/inventoryreports"
import { useAuth } from "@/lib/context/auth-context"
import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Loader2, YoutubeIcon as YouTube } from "lucide-react"
import { Button } from "@/components/ui/button"
import FeatureProtect from "@/components/admin/featureProtect"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function InventoryPage() {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  const { user } = useAuth()
  const [orgId, setOrgId] = useState<string | null>(null)
  const [grantKey, setGrantKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<InventoryItem[]>([])
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    // Initial load of all items
    const results = searchInventory({})
    setSearchResults(results)
  }, [])

  useEffect(() => {
    const filters: SearchFilters = {
      query: debouncedSearchQuery
    }
    const results = searchInventory(filters)
    setSearchResults(results)
  }, [debouncedSearchQuery])

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

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="space-y-8">
        <header className="space-y-4 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">Track and manage your inventory items efficiently</p>
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
        
        <FeatureProtect featureName="Inventory">
          <div className="grid gap-6 md:grid-cols-2">
            <ModernDashboardCard
              title="Inventory Items"
              description="Search and manage inventory items"
            >
              <div className="space-y-4">
                {isLoading ? (
                  <Button disabled className="w-full">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </Button>
                ) : error ? (
                  <div className="text-sm text-red-600 p-2 bg-red-50 rounded">{error}</div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1">
                          <Input
                            type="text"
                            id="search-inventory"
                            placeholder="Search by name, SKU, or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <Button 
                          variant="outline"
                          size="default"
                          className="whitespace-nowrap sm:w-auto w-full"
                        >
                          Add New Item
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground px-0.5">
                        {searchResults.length} items found
                      </div>
                    </div>
                    
                    {/* Mobile Card View */}
                    <div className="sm:hidden">
                      <div className="space-y-2 max-h-[70vh] overflow-y-auto pb-1 overscroll-contain">
                        {searchResults.map((item) => (
                          <div 
                            key={item.id} 
                            className="bg-white rounded-lg border p-3 shadow-sm hover:bg-gray-50/75 active:bg-gray-100 transition-colors cursor-pointer touch-manipulation"
                          >
                            <div className="flex justify-between items-start gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm truncate">{item.name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</div>
                              </div>
                              <span className={`shrink-0 px-2 py-1 rounded text-xs font-medium shadow-sm ${
                                item.status === "IN_STOCK" 
                                  ? "bg-green-100 text-green-800"
                                  : item.status === "LOW_STOCK"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-xs font-medium text-gray-700">Quantity</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{item.quantity}</div>
                              </div>
                              <div>
                                <div className="text-xs font-medium text-gray-700">Location</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{item.location}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block border rounded-lg overflow-hidden">
                      <div className="max-h-[400px] overflow-y-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr className="border-b">
                              <th className="text-left p-3 text-sm font-medium">Name</th>
                              <th className="text-left p-3 text-sm font-medium">SKU</th>
                              <th className="text-left p-3 text-sm font-medium">Quantity</th>
                              <th className="text-left p-3 text-sm font-medium">Location</th>
                              <th className="text-left p-3 text-sm font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {searchResults.map((item) => (
                              <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 text-sm">{item.name}</td>
                                <td className="p-3 text-sm">{item.sku}</td>
                                <td className="p-3 text-sm">{item.quantity}</td>
                                <td className="p-3 text-sm">{item.location}</td>
                                <td className="p-3">
                                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                                    item.status === "IN_STOCK" 
                                      ? "bg-green-100 text-green-800"
                                      : item.status === "LOW_STOCK"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ModernDashboardCard>

            <ModernDashboardCard
              title="Inventory Reports"
              description="Generate and view inventory reports"
            >
              <InventoryReports />
            </ModernDashboardCard>
          </div>
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
              src="https://www.youtube.com/embed/placeholder"
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