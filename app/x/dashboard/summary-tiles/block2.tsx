"use client"

import DashCard from "@/components/dash-card"
import { useEffect, useState, useCallback } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/context/auth-context"

// Add this interface for the connection nodes
type ConnectionNode = {
  budgetedCost?: number;
  actualCost?: number;
  id?: string;
  // Add other node properties as needed
}

type QueryResponse = {
  scope?: {
    connection?: {
      nodes?: ConnectionNode[],
      withValues?: Array<{
        budgetedCost: number, 
        actualCost: number
      }>
    }
  }
}

export function Block2() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState<QueryResponse | null>(null)

  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const fetchRevenue = useCallback(async (orgID: string, grantKey: string, page?: string): Promise<QueryResponse | null> => {
    if (!grantKey || !orgID) {
      console.error('Missing grantKey or orgID');
      return null;
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
                "$": {
                  "with": {
                    "id": {},
                    "cfv:22NMPgvPNpFk": {
                      "_": "customFieldValues",
                      "$": {
                        "where": [
                          [
                            "customField",
                            "id"
                          ],
                          "=",
                          "22NMPgvPNpFk"
                        ],
                        "size": 1
                      },
                      "values": {
                        "$": {
                          "field": "value"
                        }
                      }
                    },
                    "approvedCustomerOrders": {
                      "_": "documents",
                      "$": {
                        "with": {
                          "approvedHourCostItems": {
                            "_": "costItems",
                            "$": {
                              "where": {
                                "and": [
                                  [
                                    "isSelected"
                                  ],
                                  [
                                    [
                                      "unit",
                                      "name"
                                    ],
                                    "in",
                                    [
                                      "hour",
                                      "hours",
                                      "hr",
                                      "hrs"
                                    ]
                                  ]
                                ]
                              }
                            },
                            "quantity": {
                              "_": "sum",
                              "$": "quantity"
                            }
                          }
                        },
                        "where": {
                          "and": [
                            [
                              "type",
                              "customerOrder"
                            ],
                            [
                              "status",
                              "approved"
                            ],
                            [
                              "includeInBudget",
                              true
                            ]
                          ]
                        }
                      },
                      "priceWithTaxSum": {
                        "_": "sum",
                        "$": "priceWithTax"
                      },
                      "cost": {
                        "_": "sum",
                        "$": "cost"
                      },
                      "price": {
                        "_": "sum",
                        "$": "price"
                      }
                    },
                    "approvedCustomerInvoices": {
                      "_": "documents",
                      "$": {
                        "where": {
                          "and": [
                            [
                              "type",
                              "customerInvoice"
                            ],
                            [
                              "status",
                              "approved"
                            ]
                          ]
                        }
                      },
                      "sum": {
                        "_": "sum",
                        "$": "priceWithTax"
                      }
                    },
                    "costItems": {
                      "$": {
                        "where": [
                          [
                            "document",
                            "id"
                          ],
                          null
                        ],
                        "with": {}
                      },
                      "cost": {
                        "_": "sum",
                        "$": "cost"
                      }
                    },
                    "actualCost": {
                      "$": {}
                    },
                    "projectedCost": {
                      "$": {}
                    },
                    "invoiced": {
                      "_": "documents",
                      "$": {
                        "where": {
                          "and": [
                            [
                              "type",
                              "customerInvoice"
                            ],
                            [
                              "status",
                              "in",
                              [
                                "pending",
                                "approved"
                              ]
                            ]
                          ]
                        }
                      },
                      "price": {
                        "_": "sum",
                        "$": "price"
                      },
                      "priceWithTax": {
                        "_": "sum",
                        "$": "priceWithTax"
                      }
                    },
                    "invoicedWithTax": {
                      "_": "documents",
                      "$": {
                        "where": {
                          "and": [
                            [
                              "type",
                              "customerInvoice"
                            ],
                            [
                              "status",
                              "in",
                              [
                                "pending",
                                "approved"
                              ]
                            ]
                          ]
                        }
                      },
                      "amountPaidSum": {
                        "_": "sum",
                        "$": "amountPaid"
                      }
                    }
                  },
                  "where": {
                    "and": [
                      {
                        "and": [
                          {
                            "!=": [
                              {
                                "field": [
                                  "closedOn"
                                ]
                              },
                              {
                                "value": null
                              }
                            ]
                          },
                          {between: [{field: ["closedOn"]}, [{value: startDate}, {value: endDate}]]},
                          {
                            ">": [
                              {
                                "field": [
                                  "approvedCustomerOrders",
                                  "price"
                                ]
                              },
                              {
                                "value": 0
                              }
                            ]
                          },
                          {
                            ">": [
                              {
                                "field": [
                                  "collected"
                                ]
                              },
                              {
                                "value": 0
                              }
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
                    "incomplete": {
                      "+": [
                        {
                          "field": [
                            "taskSummary",
                            "started"
                          ]
                        },
                        {
                          "field": [
                            "taskSummary",
                            "unstarted"
                          ]
                        }
                      ]
                    },
                    "budgetedCost": {
                      "if": [
                        {
                          "=": [
                            {
                              "field": "priceType"
                            },
                            {
                              "value": null
                            }
                          ]
                        },
                        {
                          "field": [
                            "costItems",
                            "cost"
                          ]
                        },
                        {
                          "field": [
                            "approvedCustomerOrders",
                            "cost"
                          ]
                        }
                      ]
                    },
                    "collected": {
                      "*": [
                        {
                          "/": [
                            {
                              "field": [
                                "invoiced",
                                "price"
                              ]
                            },
                            {
                              "field": [
                                "invoiced",
                                "priceWithTax"
                              ]
                            }
                          ]
                        },
                        {
                          "field": [
                            "invoicedWithTax",
                            "amountPaidSum"
                          ]
                        }
                      ]
                    }
                  },
                  "page": page || ""
                },
                "_": "jobs",
                "nextPage": {},
                "withValues": {}
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

    // If there's a next page, fetch it and merge the results
    if (data?.scope?.connection?.nextPage) {
      const nextPageData = await fetchRevenue(orgID, grantKey, data.scope.connection.nextPage)
      if (nextPageData?.scope?.connection?.withValues) {
        // Merge the withValues arrays
        data.scope.connection.withValues = [
          ...(data.scope.connection.withValues || []),
          ...(nextPageData.scope.connection.withValues)
        ]
      }
    }

    return data
  } catch (error: Error | unknown) {
    console.error('Error fetching revenue:', error)
    return null
  }
}, [startDate, endDate])

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
            const revenueData = await fetchRevenue(orgData.orgID, orgData.grantKey)
            setQuery(revenueData)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, fetchRevenue])

  const menuInfo = "Looking at all jobs with approved customer orders. Taking the budgeted cost and subtracting the actual cost to get the gross margin."
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

  if (!query) {
    return <DashCard title="Revenue" description="JT Grant Key or Org ID missing" content="" />
  }

  const totalBudgetedCost = query?.scope?.connection?.withValues?.reduce(
    (sum, item) => sum + (item.budgetedCost || 0),
    0
  ) || 0

  const totalActualCost = query?.scope?.connection?.withValues?.reduce(
    (sum, item) => sum + (item.actualCost || 0),
    0
  ) || 0
  
  const grossMargin = (((totalBudgetedCost - totalActualCost) / totalBudgetedCost) * 100).toFixed(2)

  return (
    <DashCard 
      title="Gross Margin" 
      description="Completed Projects"
      content={`${grossMargin}%`}
      menuItems={menuItems}
    />
  )
}

