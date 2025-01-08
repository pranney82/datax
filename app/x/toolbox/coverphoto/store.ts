import { create } from 'zustand'

interface LogsStore {
  refreshTrigger: number
  triggerRefresh: () => void
}

export const useLogsStore = create<LogsStore>((set) => ({
  refreshTrigger: 0,
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
})) 