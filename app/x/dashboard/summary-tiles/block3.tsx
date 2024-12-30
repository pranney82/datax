"use client"

import DashCard from "@/components/dash-card"
import { useEffect, useState, useCallback } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/context/auth-context"
import { useLeadsCount } from '@/lib/hooks/use-leads-count'

type QueryResponse = {
    organization?: {
        accounts?: {
          count?: number
        }
    }
}

export function Block3() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState<QueryResponse | null>(null)
  const { setLeadsCount, dateRange, block3MonthlyLeads, setBlock3MonthlyLeads } = useLeadsCount()
  const [hasFetched, setHasFetched] = useState(false)

  const fetchQuery = useCallback(async (
    orgID: string, 
    grantKey: string, 
    startDate: string, 
    endDate: string
  ): Promise<QueryResponse | null> => {
    if (!grantKey || !orgID) {
      console.error('Missing grantKey or orgID')
      return null
    }

    try {
      const response = await fetch('/api/jtfetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            "$": { "grantKey": grantKey },
            "organization": {
                "$": {
                "id": orgID
                },
                "id": {},
                "accounts": {
                "$": {
                    "where": {
                    "and": [
                        [
                        "type",
                        "=",
                        "customer"
                        ],
                        [
                        "createdAt",
                        ">=",
                        startDate
                        ],
                        [
                        "createdAt",
                        "<=",
                        endDate
                        ]
                    ]
                    }
                },
                "count": {}
                }
            }
            }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      //console.log('Query data:', data)
      return data
    } catch (error) {
      console.error('Error fetching query:', error)
      return null
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      if (!user?.uid || hasFetched) return

      try {
        setLoading(true)
        const userDoc = await getDoc(doc(db, "users", user.uid))
        const userOrg = userDoc.data()?.org

        if (userOrg) {
          const orgDoc = await getDoc(doc(db, "orgs", userOrg))
          const orgData = orgDoc.data()
          
          if (orgData?.orgID && orgData?.grantKey) {
            // Fetch leads for each month
            const monthlyData = await Promise.all(dateRange.monthDates.map(async (startDate) => {
              const endDate = dateRange.getLastDayOfMonth(startDate)
              const queryData = await fetchQuery(
                orgData.orgID, 
                orgData.grantKey,
                startDate,
                endDate
              )
              return {
                start: startDate,
                end: endDate,
                count: queryData?.organization?.accounts?.count || 0
              }
            }))
            
            setBlock3MonthlyLeads(monthlyData)
            
            // For the total, use first and last dates
            const queryData = await fetchQuery(
              orgData.orgID, 
              orgData.grantKey,
              dateRange.monthDates[0],
              dateRange.getLastDayOfMonth(dateRange.monthDates[dateRange.monthDates.length - 1])
            )
            setQuery(queryData)
            setLeadsCount(queryData?.organization?.accounts?.count || 0)
          }
        }
        
        setHasFetched(true)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, hasFetched, dateRange, setLeadsCount, setBlock3MonthlyLeads, fetchQuery])

  if (loading) {
    return <DashCard title="" description="Loading..." content="..." />
  }

  if (!query) {
    return <DashCard title="" description="JT Grant Key or Org ID missing" content="" />
  }

  const queryValue = query?.organization?.accounts?.count;
  
  return (
    <DashCard 
      title="# Total Leads" 
      description="last 12 months"
      content={queryValue?.toString() || '0'}
    />
  )
}

