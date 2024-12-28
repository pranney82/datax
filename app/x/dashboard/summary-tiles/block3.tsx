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

  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const { setLeadsCount } = useLeadsCount()

  const fetchQuery = useCallback(async (orgID: string, grantKey: string) => {
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
  }, [endDate, startDate])

  useEffect(() => {
    async function fetchData() {
      if (!user?.uid) return

      try {
        setLoading(true)
        // First get the user's org reference
        const userDoc = await getDoc(doc(db, "users", user.uid))
        const userOrg = userDoc.data()?.org

        if (userOrg) {
          // Then fetch the org document
          const orgDoc = await getDoc(doc(db, "orgs", userOrg))
          const orgData = orgDoc.data()
          
          if (orgData?.orgID && orgData?.grantKey) {
            const queryData = await fetchQuery(orgData.orgID, orgData.grantKey)
            setQuery(queryData)
            setLeadsCount(queryData?.organization?.accounts?.count || 0)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, setLeadsCount, fetchQuery])

  if (loading) {
    return <DashCard title="Revenue" description="Loading..." content="..." />
  }

  if (!query) {
    return <DashCard title="Revenue" description="JT Grant Key or Org ID missing" content="" />
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

