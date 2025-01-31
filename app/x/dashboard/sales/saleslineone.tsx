"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Area } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLeadsCount } from "@/lib/hooks/use-leads-count"
import { useEffect, useState } from "react"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/context/auth-context"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import type { TooltipProps } from "recharts"

type ValueType = number | string | Array<number | string>
type NameType = string

const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const parseFormattedNumber = (str: string): number => {
  return Number.parseInt(str.replace(/,/g, ""), 10)
}

interface ChartData {
  month: string
  actual: number | undefined
  target: number | undefined
}

export default function RevenueChart() {
  const { block4MonthlyMetrics } = useLeadsCount()
  const { user } = useAuth()
  const [isMobile, setIsMobile] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [salesTarget, setSalesTarget] = useState(0)
  const [newTarget, setNewTarget] = useState("")

  const formatCurrency = (value: ValueType): string => {
    if (value === undefined || value === null) return "N/A"
    const numValue = Number(value)
    if (isNaN(numValue)) return "N/A"

    if (isMobile) {
      if (numValue >= 1e6) {
        return `$${Math.round(numValue / 1e6)}M`
      } else if (numValue >= 1e3) {
        return `$${Math.round(numValue / 1e3)}K`
      }
      return `$${numValue}`
    }

    if (numValue >= 1e9) {
      return `$${(numValue / 1e9).toFixed(1)}B`
    } else if (numValue >= 1e6) {
      return `$${(numValue / 1e6).toFixed(1)}M`
    } else if (numValue >= 1e3) {
      return `$${Math.round(numValue / 1e3)}K`
    }
    return `$${numValue}`
  }

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    async function fetchSalesTarget() {
      if (!user?.uid) return

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        const userOrg = userDoc.data()?.org

        if (userOrg) {
          const orgDoc = await getDoc(doc(db, "orgs", userOrg))
          const target = orgDoc.data()?.salesTarget || 0
          setSalesTarget(target)
          setNewTarget(formatNumberWithCommas(target))
        }
      } catch (error) {
        console.error("Error fetching sales target:", error)
      }
    }

    fetchSalesTarget()
  }, [user])

  const handleSaveTarget = async () => {
    if (!user?.uid) return

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid))
      const userOrg = userDoc.data()?.org

      if (userOrg) {
        const parsedTarget = parseFormattedNumber(newTarget)
        await updateDoc(doc(db, "orgs", userOrg), {
          salesTarget: parsedTarget,
        })
        setSalesTarget(parsedTarget)
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error updating sales target:", error)
    }
  }

  const chartData: ChartData[] = block4MonthlyMetrics.map((metric, index) => {
    const monthlyTarget = salesTarget / 12 // Divide annual target by 12 for monthly target
    const cumulativeTarget = monthlyTarget * (index + 1) // Cumulative target based on monthly target
    const cumulativeActual = block4MonthlyMetrics
      .slice(0, index + 1)
      .reduce((sum, m) => sum + (m.metrics.amountSum || 0), 0)

    // Direct month mapping to avoid any date parsing issues
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const [monthStr] = metric.start.split("-")
    const monthIndex = Number.parseInt(monthStr, 10) - 1
    const monthName = monthNames[monthIndex]

    return {
      month: monthName,
      actual: cumulativeActual !== undefined ? Math.round(cumulativeActual) : undefined,
      target: cumulativeTarget !== undefined ? Math.round(cumulativeTarget) : undefined,
    }
  })

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload || payload.length === 0) {
      return <div className="custom-tooltip bg-white p-4 rounded-lg shadow-md border border-gray-200">No data</div>
    }
    return (
      <div className="custom-tooltip bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <p className="label font-semibold text-gray-700">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className={`${entry.name === "Actual Revenue" ? "text-yellow-500" : "text-black"} font-medium`}
          >
            {`${entry.name}: ${entry.value !== undefined ? formatCurrency(entry.value) : "N/A"}`}
          </p>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Revenue vs Target</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>Set Revenue Target</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="mb-4 flex items-center space-x-2">
            <Input
              type="text"
              value={newTarget}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d,]/g, "")
                const number = parseFormattedNumber(value)
                setNewTarget(formatNumberWithCommas(number))
              }}
              placeholder="Enter new target"
            />
            <Button onClick={handleSaveTarget}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : null}
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
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
              tickFormatter={(value) => formatCurrency(value)}
              stroke="#9CA3AF"
              tick={{ fill: "#333333" }}
              tickLine={{ stroke: "#9CA3AF" }}
              axisLine={{ stroke: "#E5E7EB" }}
              width={isMobile ? 60 : 80}
              tickCount={6}
              domain={[0, "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFD400" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FFD400" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="actual" stroke="#FFD400" fillOpacity={1} fill="url(#actualGradient)" />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#FFD400"
              strokeWidth={3}
              name="Actual Revenue"
              dot={{ r: 6, fill: "#FFD400", strokeWidth: 2, stroke: "#FFFFFF" }}
              activeDot={{ r: 8, fill: "#FFD400", strokeWidth: 2, stroke: "#FFFFFF" }}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#000000"
              strokeWidth={2}
              name="Target Revenue"
              dot={(props: { cx?: number; cy?: number }) => {
                const { cx = 0, cy = 0 } = props
                return (
                  <path
                    d={`M${cx - 4},${cy} L${cx},${cy - 4} L${cx + 4},${cy} L${cx},${cy + 4} Z`}
                    fill="#FFFFFF"
                    stroke="#000000"
                    strokeWidth={2}
                  />
                )
              }}
              activeDot={(props: { cx?: number; cy?: number }) => {
                const { cx = 0, cy = 0 } = props
                return (
                  <path
                    d={`M${cx - 6},${cy} L${cx},${cy - 6} L${cx + 6},${cy} L${cx},${cy + 6} Z`}
                    fill="#FFFFFF"
                    stroke="#000000"
                    strokeWidth={2}
                  />
                )
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

