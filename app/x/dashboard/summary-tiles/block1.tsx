"use client"

import DashCard from "@/components/dash-card"
import { useEffect, useState, useCallback } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/context/auth-context"
import { useLeadsCount } from "@/lib/hooks/use-leads-count"

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

export function Block1() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState<QueryResponse | null>(null)
  const { setMonthlyRevenue, dateRange } = useLeadsCount()
  const [hasFetched, setHasFetched] = useState(false)

  const fetchRevenue = useCallback(async (orgID: string, grantKey: string, startDate: string, endDate: string) => {
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
                "scope": {
                  "_type": {},
                  "_": "organization",
                  "$": {
                    "id": orgID
                  },
                  "id": {},
                  "connection": {
                    "_type": {},
                    "_": "documents",
                    "$": {
                      "with": {
                        "id": {}
                      },
                      "where": {
                        "and": [
                          {
                            "and": [
                              {
                                "=": [
                                  {
                                    "field": [
                                      "type"
                                    ]
                                  },
                                  {
                                    "value": "customerInvoice"
                                  }
                                ]
                              },
                              {
                                "=": [
                                  {
                                    "field": [
                                      "status"
                                    ]
                                  },
                                  {
                                    "value": "approved"
                                  }
                                ]
                              },
                              {
                                "between": [
                                  {
                                    "field": [
                                      "closedAt"
                                    ]
                                  },
                                  [
                                    {
                                      "value": `${endDate}T07:00:00.000Z`
                                    },
                                    {
                                      "value": `${startDate}T07:00:00.000Z`
                                    }
                                  ]
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      "sortBy": [
                        {
                          "field": [
                            "closedAt"
                          ],
                          "order": "desc"
                        }
                      ],
                      "expressions": {
                        "amount": {
                          "if": [
                            {
                              "in": [
                                {
                                  "field": "type"
                                },
                                [
                                  "customerOrder",
                                  "customerInvoice"
                                ]
                              ]
                            },
                            {
                              "field": [
                                "priceWithTax"
                              ]
                            },
                            {
                              "+": [
                                {
                                  "field": [
                                    "cost"
                                  ]
                                },
                                {
                                  "field": [
                                    "tax"
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      }
                    },
                    "count": {},
                    "Amount:sum": {
                      "_": "sum",
                      "$": {
                        "field": [
                          "amount"
                        ]
                      }
                    },
                    "Amount:avg": {
                      "_": "avg",
                      "$": {
                        "field": [
                          "amount"
                        ]
                      }
                    },
                    "Amount:min": {
                      "_": "min",
                      "$": {
                        "field": [
                          "amount"
                        ]
                      }
                    },
                    "Amount:max": {
                      "_": "max",
                      "$": {
                        "field": [
                          "amount"
                        ]
                      }
                    }
                  }
                }
              
        }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      //console.log('block1 data:', data)
      return data
    } catch (error) {
      console.error('Error fetching revenue:', error)
      return null
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      if (!user?.uid || hasFetched) return

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
            // Fetch revenue for each month
            const monthlyData = await Promise.all(dateRange.monthDates.map(async (startDate) => {
              const endDate = dateRange.getLastDayOfMonth(startDate)
              const revenueData = await fetchRevenue(
                orgData.orgID, 
                orgData.grantKey,
                startDate,
                endDate
              )
              return {
                start: startDate,
                end: endDate,
                data: revenueData
              }
            }))
            setMonthlyRevenue(monthlyData)
            
            // For the total, use first and last dates from monthDates array
            const revenueData = await fetchRevenue(
              orgData.orgID, 
              orgData.grantKey,
              dateRange.monthDates[0],  // First month
              dateRange.getLastDayOfMonth(dateRange.monthDates[dateRange.monthDates.length - 1])  // Last day of most recent month
            )
            setQuery(revenueData)
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
  }, [user, hasFetched, dateRange, fetchRevenue, setMonthlyRevenue])

  if (loading) {
    return <DashCard title="Revenue" description="Loading..." content="..." />
  }

  if (!query) {
    return <DashCard title="Revenue" description="JT Grant Key or Org ID missing" content="" />
  }

  const revenueValue = query?.scope?.connection?.["Amount:sum"]
    ? `$${Math.ceil(query.scope.connection["Amount:sum"]).toLocaleString()}`
    : '$0'
  
  //console.log('monthlyRevenue:', monthlyRevenue)
  
  return (
    <DashCard 
      title="Revenue" 
      description="last 12 months"
      content={revenueValue}
    />
  )
}

