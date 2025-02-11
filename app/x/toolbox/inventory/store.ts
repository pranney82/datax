import { create } from "zustand"
import { devtools } from "zustand/middleware"

export enum SyncStatus {
  SYNCED = "SYNCED",
  PENDING = "PENDING",
  FAILED = "FAILED"
}

interface InventoryItem {
  id: string
  jobtreadId: string
  name: string
  sku: string
  lastSyncedAt: string
  syncStatus: SyncStatus
  syncError?: string
  version: number
  auditTrail: {
    timestamp: string
    action: string
    userId: string
    syncDetails?: {
      status: SyncStatus
      error?: string
    }
  }[]
}

interface BatchOperation {
  type: 'update' | 'delete'
  items: { id: string; jobtreadId: string; data?: Partial<InventoryItem> }[]
}

interface InventoryState {
  items: InventoryItem[]
  isLoading: boolean
  error: string | null
  lastSync: string | null
  pendingUpdates: Map<string, Partial<InventoryItem>>
  
  // Sync management
  syncItem: (itemId: string) => Promise<void>
  markItemSynced: (itemId: string, jobtreadId: string) => void
  markItemSyncFailed: (itemId: string, error: string) => void
  
  // Optimistic updates handling
  addOptimisticUpdate: (itemId: string, update: Partial<InventoryItem>) => void
  removeOptimisticUpdate: (itemId: string) => void
  
  // Batch operations
  processBatchOperation: (operation: BatchOperation) => Promise<void>
  
  // Retry mechanism
  retryQueue: { itemId: string; operation: string; data: any; attempts: number }[]
  addToRetryQueue: (itemId: string, operation: string, data: any) => void
  processRetryQueue: () => Promise<void>
}

export const useInventoryStore = create<InventoryState>()(
  devtools(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      lastSync: null,
      pendingUpdates: new Map(),
      retryQueue: [],

      syncItem: async (itemId) => {
        try {
          set((state) => ({
            items: state.items.map(item =>
              item.id === itemId
                ? { ...item, syncStatus: SyncStatus.PENDING }
                : item
            )
          }))

          // Webhook call will be implemented when details are provided
          // This will sync with Jobtread's cost item custom fields

          set((state) => ({
            items: state.items.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    syncStatus: SyncStatus.SYNCED,
                    lastSyncedAt: new Date().toISOString()
                  }
                : item
            )
          }))
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Sync failed"
          get().markItemSyncFailed(itemId, errorMessage)
          throw error
        }
      },

      markItemSynced: (itemId, jobtreadId) => {
        set((state) => ({
          items: state.items.map(item =>
            item.id === itemId
              ? {
                  ...item,
                  jobtreadId,
                  syncStatus: SyncStatus.SYNCED,
                  lastSyncedAt: new Date().toISOString(),
                  auditTrail: [
                    ...item.auditTrail,
                    {
                      timestamp: new Date().toISOString(),
                      action: "SYNC_SUCCESS",
                      userId: "system", // Replace with actual user ID
                      syncDetails: { status: SyncStatus.SYNCED }
                    }
                  ]
                }
              : item
          )
        }))
      },

      markItemSyncFailed: (itemId, error) => {
        set((state) => ({
          items: state.items.map(item =>
            item.id === itemId
              ? {
                  ...item,
                  syncStatus: SyncStatus.FAILED,
                  syncError: error,
                  auditTrail: [
                    ...item.auditTrail,
                    {
                      timestamp: new Date().toISOString(),
                      action: "SYNC_FAILED",
                      userId: "system", // Replace with actual user ID
                      syncDetails: { status: SyncStatus.FAILED, error }
                    }
                  ]
                }
              : item
          )
        }))
      },

      addOptimisticUpdate: (itemId, update) => {
        const pendingUpdates = new Map(get().pendingUpdates)
        pendingUpdates.set(itemId, { ...pendingUpdates.get(itemId), ...update })
        set({ pendingUpdates })
      },

      removeOptimisticUpdate: (itemId) => {
        const pendingUpdates = new Map(get().pendingUpdates)
        pendingUpdates.delete(itemId)
        set({ pendingUpdates })
      },

      processBatchOperation: async (operation) => {
        try {
          set({ isLoading: true })
          // Will be implemented when webhook details are provided
          // This will handle batch updates to Jobtread's cost items
          for (const item of operation.items) {
            get().addOptimisticUpdate(item.id, item.data || {})
          }
        } catch (error) {
          set({ error: "Failed to process batch operation" })
          // Revert optimistic updates
          for (const item of operation.items) {
            get().removeOptimisticUpdate(item.id)
          }
        } finally {
          set({ isLoading: false })
        }
      },

      addToRetryQueue: (itemId, operation, data) => {
        set((state) => ({
          retryQueue: [...state.retryQueue, { itemId, operation, data, attempts: 0 }]
        }))
      },

      processRetryQueue: async () => {
        const state = get()
        const queue = [...state.retryQueue]
        set({ retryQueue: [] })

        for (const item of queue) {
          try {
            if (item.attempts >= INVENTORY_CONSTANTS.MAX_RETRY_ATTEMPTS) {
              console.error(`Max retry attempts reached for item ${item.itemId}`)
              continue
            }
            // Implement retry logic here when webhook details are provided
            console.log("Retrying operation:", item)
          } catch (error) {
            // Add back to queue with incremented attempts
            set((state) => ({
              retryQueue: [...state.retryQueue, { ...item, attempts: item.attempts + 1 }]
            }))
          }
        }
      }
    }),
    { name: "inventory-store" }
  )
)

// Constants for inventory management
export const INVENTORY_CONSTANTS = {
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  WEBHOOK_TIMEOUT: 30000, // 30 seconds
  BATCH_SIZE: 50, // For pagination
}