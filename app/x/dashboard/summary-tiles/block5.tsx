"use client"

import DashCard from "@/components/dash-card"
import { useEffect, useState, useCallback } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/context/auth-context"
import { useLeadsCount } from "@/lib/hooks/use-leads-count"

export function Block5() {
  const { pendingQuery, setPendingQuery } = useLeadsCount()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

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
                    "id": orgID
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
                                    "value": "pending"
                                  }
                                ]
                              },
                              {
                                "between": [
                                  {
                                    "field": [
                                      "createdAt"
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
        const userDoc = await getDoc(doc(db, "users", user.uid))
        const userOrg = userDoc.data()?.org

        if (userOrg) {
          const orgDoc = await getDoc(doc(db, "orgs", userOrg))
          const orgData = orgDoc.data()
          
          if (orgData?.orgID && orgData?.grantKey) {
            const queryData = await fetchQuery(orgData.orgID, orgData.grantKey)
            setPendingQuery(queryData)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, fetchQuery, setPendingQuery])

  const menuInfo = "A total of all estimates that have a status of 'pending'."
  const menuItems = [
    {
      label: "Info",
      type: "info" as const,
      tooltip: menuInfo
    }
  ]

  if (loading) {
    return <DashCard title="Revenue" description="Loading..." content="..." />
  }

  if (!pendingQuery) {
    return <DashCard title="Revenue" description="JT Grant Key or Org ID missing" content="" />
  }

  const docSum = pendingQuery?.scope?.connection?.["Amount:sum"] 
    ? Math.ceil(pendingQuery.scope.connection["Amount:sum"]).toLocaleString()
    : 0;
  
  return (
    <DashCard 
      title="Pipeline Value" 
      description="last 12 months"
      content={`$${docSum}`}
      menuItems={menuItems}
    />
  )
}

