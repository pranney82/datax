'use client'

import { collection, query, where, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/context/auth-context'
import { useEffect, useState, useCallback } from "react"
import { useLogsStore } from './store'

export interface AIABillingLog {
  id: string
  date: string
  status: 'success' | 'failed'
  jobId: string
  invoice: string
  email: string
  errorMessage?: string
}

export function useAIAbillingLogs() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<AIABillingLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const refreshTrigger = useLogsStore((state) => state.refreshTrigger)

  const fetchLogs = useCallback(async () => {
    //console.log('Fetching logs for user:', user?.email)
    if (!user?.email) return;
    setIsLoading(true);
    try {
      const logsRef = collection(db, 'aiabillingLogs')
      const q = query(
        logsRef,
        where('email', '==', user.email),
        limit(50)
      )
      
      const querySnapshot = await getDocs(q)
      //console.log('Query snapshot:', querySnapshot.size, 'documents found')
      
      const logsData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) as AIABillingLog[]
      
      //console.log('Processed logs data:', logsData)
      setLogs(logsData)
    } catch (error) {
      console.error('Failed to fetch aia billing logs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.email])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs, refreshTrigger])

  return { logs, isLoading }
} 