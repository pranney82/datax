"use client"

import { useState, useEffect, useCallback } from "react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ChartContainer } from "@/components/ui/chart"
import CFDropdown from "@/components/cf-dropdown"
import LeadsPieQuery from "./leadspiequery"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"

const CustomizedAxisTick = ({ x, y, payload, fontSize }: any) => {
  const words = payload.value.split(' ');
  const lineHeight = fontSize * 1.2;
  const yOffset = words.length > 1 ? -lineHeight / 2 : 0;
  
  return (
    <g transform={`translate(${x},${y})`}>
      {words.map((word: string, index: number) => (
        <text
          key={index}
          x={0}
          y={yOffset + (index * lineHeight)}
          dy={fontSize}
          textAnchor="middle"
          fill="hsl(var(--foreground))"
          fontSize={`${fontSize}px`}
          className="font-medium"
        >
          {word}
        </text>
      ))}
    </g>
  );
};

export default function SimpleRadarChart() {
  const [isCustomFieldOpen, setIsCustomFieldOpen] = useState(false)
  const [selectedField, setSelectedField] = useState("")
  const [selectedFieldName, setSelectedFieldName] = useState("")
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 })
  
  const { queryResult } = LeadsPieQuery({ selectedField })
  const rawData = queryResult?.organization?.customFields?.nodes?.[0]?.customFieldValues?.processedData || []

  const data = rawData.map((item) => ({
    subject: item.name,
    A: item.value,
    fullMark: Math.max(...rawData.map(d => d.value))
  }))

  const updateChartSize = useCallback(() => {
    const container = document.getElementById('chart-container');
    if (container) {
      setChartSize({
        width: container.clientWidth,
        height: container.clientHeight
      });
    }
  }, []);

  useEffect(() => {
    updateChartSize();
    window.addEventListener('resize', updateChartSize);
    return () => window.removeEventListener('resize', updateChartSize);
  }, [updateChartSize]);

  useEffect(() => {
    const fetchSavedCustomField = async () => {
      try {
        const currentUser = auth.currentUser
        if (!currentUser) return

        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        if (!userDoc.exists()) return

        const org = userDoc.data().org
        if (!org) return

        const orgDoc = await getDoc(doc(db, 'orgs', org))
        if (!orgDoc.exists()) return

        const { leadspiecfv, leadspiecfvName } = orgDoc.data()
        
        if (leadspiecfv && leadspiecfvName) {
          setSelectedField(leadspiecfv)
          setSelectedFieldName(leadspiecfvName)
        }
      } catch (error) {
        console.error('Error fetching saved custom field:', error)
      }
    }

    fetchSavedCustomField()
  }, [])

  const handleSaveCustomField = async () => {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) return

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
      if (!userDoc.exists()) return

      const org = userDoc.data().org
      if (!org) return

      if (!selectedField) return

      const updateData = {
        leadspiecfv: selectedField,
        leadspiecfvName: selectedFieldName
      }
      
      await updateDoc(doc(db, 'orgs', org), updateData)
      setIsCustomFieldOpen(false)
    } catch (error) {
      console.error('Error saving custom field:', error)
    }
  }

  const getFontSize = () => {
    if (chartSize.width < 300) return 8;
    if (chartSize.width < 400) return 10;
    return 12;
  };

  const getOuterRadius = () => {
    const smallerDimension = Math.min(chartSize.width, chartSize.height);
    return `${Math.floor(smallerDimension * 0.35)}px`;
  };

  return (
    <Card className="w-full mx-auto overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base sm:text-lg text-gray-800 dark:text-gray-100 line-clamp-2">
          {selectedFieldName || "Select custom field, preferably Job Type"}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsCustomFieldOpen(true)}>
              Select Custom Field
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pt-2 pb-4 px-2 sm:px-4">
        <div id="chart-container" className="w-full aspect-square min-h-[350px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px]">
          <ChartContainer
            config={{
              A: { 
                label: selectedFieldName || "Value", 
                color: "hsl(var(--primary))" 
              }
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                cx="50%" 
                cy="50%" 
                outerRadius={getOuterRadius()}
                data={data}
              >
                <PolarGrid 
                  gridType="circle"
                  stroke="hsl(var(--muted-foreground))"
                  strokeOpacity={0.4}
                />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={<CustomizedAxisTick fontSize={getFontSize()} />}
                  tickLine={false}
                  stroke="hsl(var(--muted-foreground))"
                />
                <PolarRadiusAxis 
                  angle={55} 
                  domain={[0, 'auto']} 
                  tickCount={0}
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                />
                <Radar 
                  name={selectedFieldName || "Value"} 
                  dataKey="A" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.5}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                    padding: '8px 12px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{
                    fontWeight: 500,
                    marginBottom: '4px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>

      <Dialog open={isCustomFieldOpen} onOpenChange={setIsCustomFieldOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Custom Field</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <CFDropdown
              value={selectedField}
              onChange={(value, name) => {
                setSelectedField(value)
                setSelectedFieldName(name || '')
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomFieldOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustomField}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

