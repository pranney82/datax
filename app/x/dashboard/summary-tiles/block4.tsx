"use client"

import DashCard from "@/components/dash-card"
import { useEffect, useState, useCallback } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/context/auth-context"
import { useLeadsCount } from '@/lib/hooks/use-leads-count'

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

export function Block4() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState<QueryResponse | null>(null)
  const { leadsCount, setBlock4Metrics } = useLeadsCount()

  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

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
                "scope": {
                  "_type": {},
                  "_": "organization",
                  "$": {
                    "id": "22NLTQwjkKmc"
                  },
                  "id": {},
                  "connection": {
                    "_type": {},
                    "_": "documents",
                    "$": {
                      "with": {
                        "id": {},
                        "documentRecipients": {
                          "lastViewedAt": {
                            "_": "max",
                            "$": {
                              "field": [
                                "documentLastViewedAt"
                              ]
                            }
                          }
                        }
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
                                    "value": "customerOrder"
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
                            "createdAt"
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
            
            // Fetch revenue data with the values directly
            const queryData = await fetchQuery(orgData.orgID, orgData.grantKey)
            setQuery(queryData)

            // Store all metrics
            setBlock4Metrics({
              amountSum: queryData?.scope?.connection?.["Amount:sum"] || 0,
              amountAvg: queryData?.scope?.connection?.["Amount:avg"] || 0,
              amountMin: queryData?.scope?.connection?.["Amount:min"] || 0,
              amountMax: queryData?.scope?.connection?.["Amount:max"] || 0,
              count: queryData?.scope?.connection?.count || 0
            })
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, setBlock4Metrics, fetchQuery])

  if (loading) {
    return <DashCard title="Revenue" description="Loading..." content="..." />
  }

  if (!query) {
    return <DashCard title="Revenue" description="JT Grant Key or Org ID missing" content="" />
  }

  const docCount = query?.scope?.connection?.count || 0;
  const conversionRate = leadsCount ? ((docCount / leadsCount) * 100).toFixed(1) : '0';
  
  return (
    <DashCard 
      title="Conversion Rate" 
      description="last 12 months"
      content={`${conversionRate}%`}
    />
  )
}
