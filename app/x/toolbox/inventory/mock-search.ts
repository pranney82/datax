import type { InventoryItem, SearchFilters } from "@/app/x/toolbox/inventory/types"
import { mockInventoryItems, mockCategories, mockLocations, mockStatuses } from "@/app/x/toolbox/inventory/mock-data"

export const searchInventory = (filters: SearchFilters): InventoryItem[] => {
  let results = [...mockInventoryItems]

  if (filters.query) {
    const searchTerm = filters.query.toLowerCase()
    results = results.filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      item.sku.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm) ||
      item.location.toLowerCase().includes(searchTerm)
    )
  }

  if (filters.category) {
    results = results.filter(item => 
      item.category.toLowerCase() === filters.category?.toLowerCase()
    )
  }

  if (filters.status) {
    results = results.filter(item => 
      item.status === filters.status
    )
  }

  if (filters.location) {
    results = results.filter(item => 
      item.location.toLowerCase() === filters.location?.toLowerCase()
    )
  }

  if (typeof filters.minQuantity === 'number') {
    results = results.filter(item => 
      item.quantity >= filters.minQuantity!
    )
  }

  if (typeof filters.maxQuantity === 'number') {
    results = results.filter(item => 
      item.quantity <= filters.maxQuantity!
    )
  }

  return results
}

// Example search scenarios for testing
export const searchExamples = [
  {
    name: "Find all lumber items",
    filters: {
      category: "Lumber"
    }
  },
  {
    name: "Search by SKU",
    filters: {
      query: "DW-4x8"
    }
  },
  {
    name: "Low stock items",
    filters: {
      status: "LOW_STOCK"
    }
  },
  {
    name: "Items in Warehouse A",
    filters: {
      location: "Warehouse A"
    }
  },
  {
    name: "Items with quantity > 100",
    filters: {
      minQuantity: 100
    }
  },
  {
    name: "Complex search",
    filters: {
      category: "Paint",
      location: "Warehouse A",
      maxQuantity: 50
    }
  }
]

// Usage examples:
/*
// Search for items
const results = searchInventory({ query: "lumber" })

// Filter by category and status
const lowStockLumber = searchInventory({
  category: "Lumber",
  status: "LOW_STOCK"
})

// Complex search
const complexSearch = searchInventory({
  location: "Warehouse A",
  minQuantity: 100,
  maxQuantity: 500
})
*/

// Helper function to get unique values for filters
export const getUniqueValues = (field: keyof InventoryItem): string[] => {
  const values = new Set(mockInventoryItems.map((item: InventoryItem) => String(item[field])))
  return Array.from(values) as string[]
}

// Quick stats for dashboard
export const getInventoryStats = () => {
  const totalItems = mockInventoryItems.length
  const lowStockItems = mockInventoryItems.filter((item: InventoryItem) => item.status === "LOW_STOCK").length
  const outOfStockItems = mockInventoryItems.filter((item: InventoryItem) => item.status === "OUT_OF_STOCK").length
  const totalValue = mockInventoryItems.reduce((sum: number, item: InventoryItem) => sum + (item.quantity * item.costPrice), 0)

  return {
    totalItems,
    lowStockItems,
    outOfStockItems,
    totalValue
  }
}

// Get items that need reordering
export const getReorderItems = () => {
  return mockInventoryItems.filter((item: InventoryItem) =>
    item.quantity <= item.reorderPoint
  )
}

// Get item history
export const getItemHistory = (itemId: string) => {
  const item = mockInventoryItems.find((item: InventoryItem) => item.id === itemId)
  return item?.history || []
}