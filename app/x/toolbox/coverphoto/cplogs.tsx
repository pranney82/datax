'use client'

import { collection, query, where, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/context/auth-context'
import { useEffect, useState } from "react"

export interface CoverPhotoLog {
  id: string
  date: string
  status: 'success' | 'failed'
  jobId: string
  address: string
  email: string
  errorMessage?: string
}

export function useCoverPhotoLogs() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<CoverPhotoLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user?.email) return;

      try {
        const logsRef = collection(db, 'coverphotoLogs')
        const q = query(
          logsRef,
          where('email', '==', user.email),
          limit(50)
        )
        
        const querySnapshot = await getDocs(q)
        const logsData = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) as CoverPhotoLog[]
        
        setLogs(logsData)
      } catch (error) {
        console.error('Failed to fetch cover photo logs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()
  }, [user])

  return { logs, isLoading }
} 