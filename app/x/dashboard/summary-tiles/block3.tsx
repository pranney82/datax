"use client"

import DashCard from "@/components/dash-card"
import { useEffect, useState, useCallback } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/context/auth-context"
import { useLeadsCount } from '@/lib/hooks/use-leads-count'
import { queryDocsStatus } from '@/app/x/dashboard/leads/query'

type QueryResponse = {
    organization?: {
        accounts?: {
          count?: number
        }
    }
}

type StatusQueryResponse = {
  organization?: {
    documents?: {
      withValues?: {
        [key: string]: {
          count: number
          status: string
        }
      }
    }
  }
}

export function Block3() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState<QueryResponse | null>(null)
  const { setLeadsCount, dateRange, setBlock3MonthlyLeads, setBlock3StatusCounts } = useLeadsCount()
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

  const fetchStatusQuery = useCallback(async (
    orgID: string,
    grantKey: string,
    startDate: string,
    endDate: string
  ): Promise<StatusQueryResponse | null> => {
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
            ...queryDocsStatus({ orgID, startDate, endDate })
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      //console.log('data:', data);
      return data
    } catch (error) {
      console.error('Error fetching status query:', error)
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
            // Fetch leads and status for each month
            const monthlyData = await Promise.all(dateRange.monthDates.map(async (startDate) => {
              const endDate = dateRange.getLastDayOfMonth(startDate)
              const [queryData, statusData] = await Promise.all([
                fetchQuery(orgData.orgID, orgData.grantKey, startDate, endDate),
                fetchStatusQuery(orgData.orgID, orgData.grantKey, startDate, endDate)
              ])

              // Transform status data using the status name from the response
              const statusCounts = statusData?.organization?.documents?.withValues
                ? Object.entries(statusData.organization.documents.withValues).map(([, data]) => ({
                    status: data.status,
                    count: data.count
                  }))
                : []

              return {
                leadsData: {
                  start: startDate,
                  end: endDate,
                  count: queryData?.organization?.accounts?.count || 0
                },
                statusData: {
                  start: startDate,
                  end: endDate,
                  statusCounts
                }
              }
            }))
            //console.log('monthlyData:', monthlyData);
            setBlock3MonthlyLeads(monthlyData.map(d => d.leadsData))
            setBlock3StatusCounts(monthlyData.map(d => d.statusData))
            
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
  }, [user, hasFetched, dateRange, setLeadsCount, setBlock3MonthlyLeads, setBlock3StatusCounts, fetchQuery, fetchStatusQuery])

  const menuInfo = "Total of all new customers created."
  const menuItems = [
    {
      label: "Info",
      type: "info" as const,
      tooltip: menuInfo
    }
  ]

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
      menuItems={menuItems}
    />
  )
}

