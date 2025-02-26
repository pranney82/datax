import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Quote {
  text: string;
  author: string;
  expirationDate: number;
}

interface OrgData {
  orgID: string;
  grantKey: string;
  companyName: string;
  lastFetched: number;
}

interface AppState {
  quote: Quote | null;
  orgData: OrgData | null;
  setQuote: (quote: Quote) => void;
  setOrgData: (data: OrgData) => void;
  clearOrgData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      quote: null,
      orgData: null,
      setQuote: (quote) => set({ quote }),
      setOrgData: (data) => set({ orgData: { ...data, lastFetched: Date.now() } }),
      clearOrgData: () => set({ orgData: null }),
    }),
    {
      name: 'app-storage',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      }
    }
  )
); 