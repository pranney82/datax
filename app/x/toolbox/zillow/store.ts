import { create } from 'zustand'

interface CustomFieldsStore {
  refreshTrigger: number
  triggerRefresh: () => void
}

export const useCustomFieldsStore = create<CustomFieldsStore>((set) => ({
  refreshTrigger: 0,
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 }))
})) 