import { create } from 'zustand'

interface Metrics {
  amountSum: number
  amountAvg: number
  amountMin: number
  amountMax: number
  count: number
}

interface LeadsState {
  leadsCount: number
  setLeadsCount: (count: number) => void
  block4Metrics: Metrics
  setBlock4Metrics: (metrics: Metrics) => void
}

export const useLeadsCount = create<LeadsState>((set) => ({
  leadsCount: 0,
  setLeadsCount: (count: number) => set({ leadsCount: count }),
  block4Metrics: {
    amountSum: 0,
    amountAvg: 0,
    amountMin: 0,
    amountMax: 0,
    count: 0
  },
  setBlock4Metrics: (metrics: Metrics) => set({ block4Metrics: metrics }),
})) 