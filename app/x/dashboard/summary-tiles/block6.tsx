"use client"

import DashCard from "@/components/dash-card"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/context/auth-context"
import SalesMap, { JobLocation } from "@/components/sales-map"

type QueryResponse = {
    organization?: {
        jobs?: {
            nodes?: Array<{
                name?: string;
                location?: {
                    latitude?: number;
                    longitude?: number;
                }
            }>
        }
    }
}

export function Block6() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState<QueryResponse | null>(null)


  const fetchQuery = async (orgID: string, grantKey: string) => {
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
                  "jobs": {
                    "$": {
                      "with": {
                        "approvedCustomerOrders": {
                          "_": "documents",
                          "$": {
                            "where": {
                              "and": [
                                [
                                  "type",
                                  "customerOrder"
                                ],
                                [
                                  "status",
                                  "approved"
                                ]
                              ]
                            }
                          }
                        }
                      },
                      "size": 10,
                      "where": {
                        "and": [
                          [
                            "closedOn",
                            null
                          ],
                          [
                            [
                              "approvedCustomerOrders",
                              "count"
                            ],
                            ">",
                            0
                          ]
                        ]
                      }
                    },
                    "nextPage": {},
                    "previousPage": {},
                    "nodes": {
                      "id": {},
                      "name": [],
                      "location": {
                        "id": {},
                        "latitude": {},
                        "longitude": {}
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
  }

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
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) {
    return <DashCard title="Jobs Map" description="Loading..." content="..." />
  }

  if (!query) {
    return <DashCard title="error" description="JT Grant Key or Org ID missing" content="" />
  }

  const jobsQuery = query.organization?.jobs?.nodes || []
  const formattedJobs: JobLocation[] = jobsQuery.map((job, index) => {
    const hasLocation = job.location?.latitude != null && job.location?.longitude != null;
    return {
        id: index + 1,
        lat: job.location?.latitude || 0,
        lng: job.location?.longitude || 0,
        title: job.name || 'Unnamed Job',
        address: hasLocation ? '' : "Can't find location data"
    };
  })

  return (
    <SalesMap 
      jobs={formattedJobs}
      title="Active Jobs"
      zoomLevel={10}
      mapWidth={1000}
      mapHeight={800}
    />
  )
}

