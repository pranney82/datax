export type InventoryStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK"

export interface HistoryEntry {
  timestamp: string
  action: string
  previousValue?: any
  newValue?: any
  userId: string
}

export interface InventoryItem {
  id: string
  name: string
  sku: string
  quantity: number
  category: string
  location: string
  costPrice: number
  lastUpdated: string
  status: InventoryStatus
  minimumStockLevel: number
  reorderPoint: number
  history: HistoryEntry[]
}

export interface SearchFilters {
  query?: string
  category?: string
  status?: string
  location?: string
  minQuantity?: number
  maxQuantity?: number
}

export interface InventoryStats {
  totalItems: number
  lowStockItems: number
  outOfStockItems: number
  totalValue: number
}