import type { InventoryItem, InventoryStatus } from "./types"

export const mockInventoryItems: InventoryItem[] = [
  {
    id: "inv-001",
    name: "2x4 Lumber",
    sku: "LUM-2x4-8FT",
    quantity: 250,
    category: "Lumber",
    location: "Warehouse A",
    costPrice: 3.99,
    lastUpdated: "2024-02-10T08:00:00Z",
    status: "IN_STOCK",
    minimumStockLevel: 100,
    reorderPoint: 150,
    history: [
      {
        timestamp: "2024-02-10T08:00:00Z",
        action: "STOCK_UPDATE",
        previousValue: 200,
        newValue: 250,
        userId: "user1"
      }
    ]
  },
  {
    id: "inv-002",
    name: "Drywall Sheets 4x8",
    sku: "DW-4x8-STD",
    quantity: 75,
    category: "Drywall",
    location: "Warehouse B",
    costPrice: 12.99,
    lastUpdated: "2024-02-09T15:30:00Z",
    status: "LOW_STOCK",
    minimumStockLevel: 50,
    reorderPoint: 100,
    history: [
      {
        timestamp: "2024-02-09T15:30:00Z",
        action: "STATUS_CHANGE",
        previousValue: "IN_STOCK",
        newValue: "LOW_STOCK",
        userId: "user2"
      }
    ]
  },
  {
    id: "inv-003",
    name: "Paint - White Semi-Gloss",
    sku: "PNT-WSG-1GAL",
    quantity: 0,
    category: "Paint",
    location: "Warehouse A",
    costPrice: 24.99,
    lastUpdated: "2024-02-08T12:15:00Z",
    status: "OUT_OF_STOCK",
    minimumStockLevel: 20,
    reorderPoint: 30,
    history: [
      {
        timestamp: "2024-02-08T12:15:00Z",
        action: "STOCK_UPDATE",
        previousValue: 5,
        newValue: 0,
        userId: "user1"
      }
    ]
  },
  {
    id: "inv-004",
    name: "Concrete Mix 50lb",
    sku: "CON-MIX-50",
    quantity: 150,
    category: "Concrete",
    location: "Warehouse C",
    costPrice: 8.99,
    lastUpdated: "2024-02-10T09:45:00Z",
    status: "IN_STOCK",
    minimumStockLevel: 75,
    reorderPoint: 100,
    history: [
      {
        timestamp: "2024-02-10T09:45:00Z",
        action: "RESTOCK",
        previousValue: 50,
        newValue: 150,
        userId: "user3"
      }
    ]
  },
  {
    id: "inv-005",
    name: "Roofing Shingles",
    sku: "ROOF-SH-BLK",
    quantity: 1000,
    category: "Roofing",
    location: "Warehouse B",
    costPrice: 32.99,
    lastUpdated: "2024-02-07T16:20:00Z",
    status: "IN_STOCK",
    minimumStockLevel: 500,
    reorderPoint: 750,
    history: [
      {
        timestamp: "2024-02-07T16:20:00Z",
        action: "INVENTORY_COUNT",
        previousValue: 950,
        newValue: 1000,
        userId: "user2"
      }
    ]
  }
]

export const mockCategories = [
  "Lumber",
  "Drywall",
  "Paint",
  "Concrete",
  "Roofing",
  "Plumbing",
  "Electrical",
  "Hardware",
  "Tools",
  "Safety Equipment"
] as const

export const mockLocations = [
  "Warehouse A",
  "Warehouse B",
  "Warehouse C",
  "Outside Storage",
  "Tool Room"
] as const

export const mockStatuses: InventoryStatus[] = [
  "IN_STOCK",
  "LOW_STOCK",
  "OUT_OF_STOCK"
]