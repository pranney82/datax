import DashCard from "@/components/dash-card";
import LeadFunnel from "./leadfunnel";
import LeadsLineOne from "./leadslineone";
import LeadsBarOne from "./leadsbarone";
import LeadsLost from "./leadslost";
import LeadsPie from "./leadspie";
import { LeadsBlock3 } from "./leadsblock3";
import { LeadsBlock4 } from "./leadsblock4";
import { useLeadsCount } from "@/lib/hooks/use-leads-count"
import { useCallback, useEffect, useState } from "react";
import { doc } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/context/auth-context";
import FeatureProtect from "@/components/admin/featureProtect";
export default function Leads() {
  const { user } = useAuth()  
  const { setBlock4Metrics, dateRange } = useLeadsCount()
  const [monthlyData, setMonthlyData] = useState<Array<{
    start: string, 
    end: string, 
    metrics: {
      amountSum: number;
      amountAvg: number;
      amountMin: number;
      amountMax: number;
      count: number;
    }
  }>>([])
  const [hasFetched, setHasFetched] = useState(false)

    const fetchQuery = useCallback(async (orgID: string, grantKey: string, startDate: string, endDate: string) => {
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
      }, [])

      useEffect(() => {
        async function fetchData() {
          if (!user?.uid || hasFetched) return
    
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid))
            const userOrg = userDoc.data()?.org
    
            if (userOrg) {
              const orgDoc = await getDoc(doc(db, "orgs", userOrg))
              const orgData = orgDoc.data()
              
              if (orgData?.orgID && orgData?.grantKey) {
                //console.log('Monthly dates to fetch:', dateRange.monthDates)

                const monthlyData = await Promise.all(dateRange.monthDates.map(async (monthStartDate) => {
                  const monthEndDate = dateRange.getLastDayOfMonth(monthStartDate)
                  //console.log(`Fetching for month: ${monthStartDate} to ${monthEndDate}`)
                  
                  const monthlyQueryData = await fetchQuery(
                    orgData.orgID, 
                    orgData.grantKey,
                    monthStartDate,
                    monthEndDate
                  )
                  //console.log('Monthly query result:', monthlyQueryData)
                  
                  return {
                    start: monthStartDate,
                    end: monthEndDate,
                    metrics: {
                      amountSum: monthlyQueryData?.scope?.connection?.["Amount:sum"] || 0,
                      amountAvg: monthlyQueryData?.scope?.connection?.["Amount:avg"] || 0,
                      amountMin: monthlyQueryData?.scope?.connection?.["Amount:min"] || 0,
                      amountMax: monthlyQueryData?.scope?.connection?.["Amount:max"] || 0,
                      count: monthlyQueryData?.scope?.connection?.count || 0
                    }
                  }
                }))
                //console.log('Final monthly data:', monthlyData)
                setMonthlyData(monthlyData)
              }
            }
            
            setHasFetched(true)
          } catch (error) {
            console.error("Error fetching data:", error)
          }
        }
    
        fetchData()
      }, [user, hasFetched, dateRange, setBlock4Metrics, fetchQuery])
      
    const { block3MonthlyLeads, block4Metrics } = useLeadsCount()
    
    // Get current month's leads count (last item in array)
    const currentMonthLeads = block3MonthlyLeads.length > 0 
        ? block3MonthlyLeads[block3MonthlyLeads.length - 1].count
        : 0

    // Calculate conversion rate using the same logic as block4
    const conversionRate = currentMonthLeads > 0 && monthlyData[monthlyData.length - 1]?.metrics?.count > 0
        ? (((monthlyData[monthlyData.length - 1]?.metrics?.count ?? 1) / currentMonthLeads) * 100).toFixed(1) 
        : '0'

    //console.log('data:', monthlyData)

    // Calculate revenue per lead
    const revenuePerLead = block4Metrics.count > 0
        ? `$${(block4Metrics.amountSum / block4Metrics.count).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`
        : '$0.00'

    return (
    <FeatureProtect featureName="Leads Dashboard">
    <div className="flex flex-col gap-4">
        {/* Top row */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        <DashCard title="Raw Leads" description="this month" content={currentMonthLeads.toLocaleString()} />
        <DashCard title="Conversion Rate" description="this month" content={`${conversionRate}%`} />
        <LeadsBlock3 />
        <LeadsBlock4 />
        <DashCard 
            title="Revenue Per Lead" 
            description="last 12 months" 
            content={revenuePerLead} 
        />
        </div>

        {/* second row */}
        <div className="grid gap-4 md:grid-cols-6">
            <div className="md:col-span-6">
                <LeadsLineOne />
            </div>
            <div className="md:col-span-2">
                <LeadFunnel />
            </div>
            <div className="md:col-span-4"> 
                <LeadsBarOne />
            </div>
            <div className="md:col-span-3">
                <LeadsPie />
            </div>
            <div className="md:col-span-3">
                <LeadsLost />
            </div>
        </div>
    </div>
    </FeatureProtect>
    );
}
