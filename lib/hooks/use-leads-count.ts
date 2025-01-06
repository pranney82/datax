import { create } from 'zustand'

type QueryResponse = {
  scope?: {
    connection?: {
      ["Amount:sum"]?: number;
      ["Amount:avg"]?: number;
      ["Amount:min"]?: number;
      ["Amount:max"]?: number;
      count?: number;
    }
  }
}

interface Metrics {
  amountSum: number
  amountAvg: number
  amountMin: number
  amountMax: number
  count: number
}

interface MonthlyRevenue {
  start: string
  end: string
  data: QueryResponse | null
}

interface DateRange {
  monthDates: string[]
  getLastDayOfMonth: (dateString: string) => string
}

interface Block4MonthlyMetrics {
  start: string
  end: string
  metrics: Metrics
}

interface Block3MonthlyLeads {
  start: string
  end: string
  count: number
}

interface StatusCount {
  status: string
  count: number
}

interface Block3StatusCounts {
  start: string
  end: string
  statusCounts: StatusCount[]
}

interface LeadsState {
  leadsCount: number
  setLeadsCount: (count: number) => void
  block4Metrics: Metrics
  setBlock4Metrics: (metrics: Metrics) => void
  monthlyRevenue: MonthlyRevenue[]
  setMonthlyRevenue: (revenue: MonthlyRevenue[]) => void
  dateRange: DateRange
  block4MonthlyMetrics: Block4MonthlyMetrics[]
  setBlock4MonthlyMetrics: (metrics: Block4MonthlyMetrics[]) => void
  block3MonthlyLeads: Block3MonthlyLeads[]
  setBlock3MonthlyLeads: (leads: Block3MonthlyLeads[]) => void
  block3StatusCounts: Block3StatusCounts[]
  setBlock3StatusCounts: (counts: Block3StatusCounts[]) => void
  pendingQuery: QueryResponse | null
  setPendingQuery: (query: QueryResponse | null) => void
  salesTarget: number
  setSalesTarget: (target: number) => void
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
  monthlyRevenue: [],
  setMonthlyRevenue: (revenue: MonthlyRevenue[]) => set({ monthlyRevenue: revenue }),
  dateRange: {
    monthDates: Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() - i
      return new Date(year, month, 1).toISOString().split('T')[0]
    }).reverse(),
    getLastDayOfMonth: (dateString: string) => {
      const date = new Date(dateString)
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 2, 0)
      return lastDay.toISOString().split('T')[0]
    }
  },
  block4MonthlyMetrics: [],
  setBlock4MonthlyMetrics: (metrics: Block4MonthlyMetrics[]) => set({ block4MonthlyMetrics: metrics }),
  block3MonthlyLeads: [],
  setBlock3MonthlyLeads: (leads: Block3MonthlyLeads[]) => set({ block3MonthlyLeads: leads }),
  block3StatusCounts: [],
  setBlock3StatusCounts: (counts: Block3StatusCounts[]) => set({ block3StatusCounts: counts }),
  pendingQuery: null,
  setPendingQuery: (query: QueryResponse | null) => set({ pendingQuery: query }),
  salesTarget: 0,
  setSalesTarget: (target: number) => set({ salesTarget: target }),
})) 