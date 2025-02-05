"use client"

import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLeadsCount } from "@/lib/hooks/use-leads-count"
import { querySales, queryCustomFieldOptions } from "./salesquery"
import { db, auth } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import CFDropdown from "@/components/cf-dropdown"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import type { Payload } from "recharts/types/component/DefaultLegendContent"

interface OrgData {
  orgID: string
  grantKey: string
  salescfv?: string
  salescfvName?: string
}

// Define consistent colors for the chart
const COLORS: { [key: string]: string } = {
  color1: "#FFD400", // Yellow
  color2: "#FF6B6B", // Red
  color3: "#4ECDC4", // Teal
  color4: "#45B7D1", // Blue
}

interface MonthlyData {
  month: string
  [key: string]: number | string
}

const fetchCustomFieldOptions = async (orgID: string, grantKey: string, cfID: string) => {
  try {
    const response = await fetch("/api/jtfetch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          $: { grantKey: grantKey },
          ...queryCustomFieldOptions({
            orgID,
            cfID,
          }),
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    const options = result?.organization?.customFields?.nodes?.[0]?.options || []
    return options
  } catch (error) {
    console.error("Error fetching custom field options:", error)
    return []
  }
}

const fetchSalesData = async (
  orgID: string,
  grantKey: string,
  cfName3: string,
  cfID: string,
  startDate: string,
  endDate: string,
) => {
  try {
    const query = {
      $: { grantKey: grantKey },
      ...querySales({
        orgID,
        cfName3,
        cfID,
        startDate,
        endDate,
      }),
    }

    const response = await fetch("/api/jtfetch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error fetching sales data:", error)
    return null
  }
}

const getLastDayOfMonth = (dateString: string) => {
  const [year, month] = dateString.split("-").map((num) => Number.parseInt(num))
  const lastDay = new Date(Date.UTC(year, month, 0))
  return lastDay.toISOString().split("T")[0]
}

const processQueryResultForChart = (
  results: Array<{
    result: {
      scope?: {
        connection?: {
          "Amount:sum": number
        }
      }
    }
    option: string
    startDate: string
  }>,
): MonthlyData[] => {
  // Create a map to store the data by startDate to preserve chronological order
  const dataByDate: { [key: string]: { month: string; [key: string]: number | string } } = {}

  // Get unique options first
  const uniqueOptions = Array.from(new Set(results.map((r) => r.option)))

  // Initialize all dates with 0 values for each option
  results.forEach(({ startDate }) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const [monthStr] = startDate.split("-")
    const monthIndex = Number.parseInt(monthStr, 10) - 1
    const monthName = monthNames[monthIndex]

    if (!dataByDate[startDate]) {
      dataByDate[startDate] = {
        month: monthName,
        ...Object.fromEntries(uniqueOptions.map((option) => [option, 0])),
      }
    }
  })

  // Fill in the actual values
  results.forEach(({ result, option, startDate }) => {
    const amount = result?.scope?.connection?.["Amount:sum"] || 0
    if (dataByDate[startDate]) {
      dataByDate[startDate][option] = amount
    }
  })

  // Convert to array maintaining chronological order
  return Object.entries(dataByDate)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([, data]) => data)
}

export default function RevenueBySourceChart() {
  const { dateRange } = useLeadsCount()
  const { user } = useAuth()
  const [, setIsLoading] = useState(true)
  const [isCustomFieldOpen, setIsCustomFieldOpen] = useState(false)
  const [selectedField, setSelectedField] = useState("")
  const [selectedFieldName, setSelectedFieldName] = useState("")
  const [hiddenSeries, setHiddenSeries] = useState<{ [key: string]: boolean }>({})
  const [chartData, setChartData] = useState<MonthlyData[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768) // Adjust this breakpoint as needed
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleSaveCustomField = async () => {
    if (!user?.uid) return

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid))
      const org = userDoc.data()?.org
      if (!org) return

      await updateDoc(doc(db, "orgs", org), {
        salescfv: selectedField,
        salescfvName: selectedFieldName,
      })

      setIsCustomFieldOpen(false)
    } catch (error) {
      console.error("Error saving custom field:", error)
    }
  }

  useEffect(() => {
    const fetchSavedCustomField = async () => {
      try {
        if (!user?.uid) return

        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (!userDoc.exists()) return

        const org = userDoc.data().org
        if (!org) return

        const orgDoc = await getDoc(doc(db, "orgs", org))
        if (!orgDoc.exists()) return

        const { salescfv, salescfvName } = orgDoc.data()

        if (salescfv && salescfvName) {
          setSelectedField(salescfv)
          setSelectedFieldName(salescfvName)
        }
      } catch (error) {
        console.error("Error fetching saved custom field:", error)
      }
    }

    fetchSavedCustomField()
  }, [user])

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedField) {
        console.log("No selected field, skipping fetch")
        return
      }

      setIsLoading(true)
      try {
        const currentUser = auth.currentUser
        if (!currentUser) {
          console.log("No current user")
          return
        }

        const userDoc = await getDoc(doc(db, "users", currentUser.uid))
        if (!userDoc.exists()) {
          console.log("No user doc")
          return
        }

        const org = userDoc.data().org
        if (!org) {
          console.log("No org")
          return
        }

        const orgDoc = await getDoc(doc(db, "orgs", org))
        const orgID = (orgDoc.data() as OrgData)?.orgID
        const grantKey = (orgDoc.data() as OrgData)?.grantKey

        if (orgID && grantKey) {
          const options = await fetchCustomFieldOptions(orgID, grantKey, selectedField)

          const allQueries = options.flatMap((option: string) => {
            const monthQueries = dateRange.monthDates.map((startDate) => {
              const query = {
                option,
                startDate,
                endDate: getLastDayOfMonth(startDate),
              }
              return query
            })
            return monthQueries
          })

          const allResults = await Promise.all(
            allQueries.map((query: { option: string; startDate: string; endDate: string }) =>
              fetchSalesData(orgID, grantKey, query.option, selectedField, query.startDate, query.endDate),
            ),
          )

          const processedData = processQueryResultForChart(
            allResults.map((result, index) => ({
              result,
              option: allQueries[index].option,
              startDate: allQueries[index].startDate,
            })),
          )

          setChartData(processedData)
        }
      } catch (error) {
        console.error("Error in RevenueBySourceChart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedField, dateRange])

  const handleLegendClick = (data: Payload) => {
    setHiddenSeries((prev) => ({
      ...prev,
      [data.dataKey as string]: !prev[data.dataKey as string],
    }))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Revenue by Lead Source</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsCustomFieldOpen(true)}>Select Custom Field</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {!selectedField ? (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            Please select a custom field from the menu to view the chart
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={chartData}
              margin={
                isMobile ? { top: 20, right: 10, left: 0, bottom: 10 } : { top: 20, right: 30, left: 20, bottom: 10 }
              }
            >
              <XAxis
                dataKey="month"
                tickFormatter={(value, index) => {
                  if (isMobile && index % 2 !== 0) {
                    return ""
                  }
                  return value
                }}
                stroke="#9CA3AF"
                tick={{ fill: "#333333" }}
                tickLine={{ stroke: "#9CA3AF" }}
                axisLine={{ stroke: "#E5E7EB" }}
                dy={10}
              />
              <YAxis
                tickFormatter={(value) => `$${value / 1000}K`}
                stroke="#9CA3AF"
                tick={{ fill: "#333333" }}
                tickLine={{ stroke: "#9CA3AF" }}
                axisLine={{ stroke: "#E5E7EB" }}
                width={isMobile ? 60 : 80}
                tickCount={6}
                domain={[0, "auto"]}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <Card className="custom-tooltip bg-white p-4 rounded-lg shadow-md border border-gray-200">
                        <CardContent className="p-0">
                          <p className="label font-semibold text-gray-700 mb-2">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="font-medium mb-1" style={{ color: entry.color }}>
                              {`${entry.name}: $${(Number(entry.value) / 1000).toFixed(0)}K`}
                            </p>
                          ))}
                        </CardContent>
                      </Card>
                    )
                  }
                  return null
                }}
              />
              <Legend onClick={handleLegendClick} verticalAlign="bottom" height={36} iconType="circle" />
              {Object.entries(chartData[0] || {})
                .filter(([key]) => {
                  if (key === "month") return false
                  return chartData.some((data) => (data[key] as number) > 0)
                })
                .map(([key], index) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stackId="1"
                    stroke={Object.values(COLORS)[index % Object.values(COLORS).length]}
                    fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
                    hide={hiddenSeries[key]}
                  />
                ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
        <CardDescription className="text-muted-foreground text-center">
          Click on a source name to hide it
        </CardDescription>
      </CardContent>

      <Dialog open={isCustomFieldOpen} onOpenChange={setIsCustomFieldOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Custom Field</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <CFDropdown
              value={selectedField}
              onChange={(value, name) => {
                setSelectedField(value)
                setSelectedFieldName(name || "")
              }}
              targetType="job"
              onFieldsLoad={(fields) => {
                console.log("Fields loaded in RevenueBySourceChart:", fields)
                if (!selectedField && fields.length > 0) {
                  console.log("Auto-selecting first field:", fields[0])
                  setSelectedField(fields[0].id)
                  setSelectedFieldName(fields[0].name)
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomFieldOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustomField}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

