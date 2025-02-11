"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { DateRange } from "react-day-picker"
import { FileSpreadsheet, FileText, Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useInventoryStore } from "../store"
import DatePickerWithRange from "@/components/datepicker"
import { Label } from "@/components/ui/label"

type ReportType = 
  | "stock-levels"
  | "movement-analysis"
  | "reorder-points"
  | "usage-history"
  | "cost-analysis"

interface ReportConfig {
  title: string
  description: string
  dateRangeRequired: boolean
}

const REPORT_TYPES: Record<ReportType, ReportConfig> = {
  "stock-levels": {
    title: "Stock Levels Report",
    description: "Current inventory levels with reorder point analysis",
    dateRangeRequired: false
  },
  "movement-analysis": {
    title: "Movement Analysis",
    description: "Inventory movement trends and patterns",
    dateRangeRequired: true
  },
  "reorder-points": {
    title: "Reorder Points Analysis",
    description: "Suggested reorder points based on usage patterns",
    dateRangeRequired: true
  },
  "usage-history": {
    title: "Usage History",
    description: "Historical usage patterns and trends",
    dateRangeRequired: true
  },
  "cost-analysis": {
    title: "Cost Analysis",
    description: "Cost trends and valuation analysis",
    dateRangeRequired: true
  }
}

export function InventoryReports() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("stock-levels")
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf'>('excel')

  const exportReport = async (format: 'excel' | 'pdf') => {
    setExportFormat(format)
    setIsExporting(true)
    try {
      const reportData = await generateReport()
      if (format === 'excel') {
        await exportToExcel(reportData)
      } else {
        await exportToPDF(reportData)
      }
    } catch (error) {
      console.error('Export failed:', error)
      // Show error notification
    } finally {
      setIsExporting(false)
    }
  }

  const exportToExcel = async (data: any) => {
    // Will implement when Jobtread query is available
    // This will:
    // 1. Format the data for Excel
    // 2. Generate Excel file using a library like xlsx
    // 3. Trigger download
  }

  const exportToPDF = async (data: any) => {
    // Will implement when Jobtread query is available
    // This will:
    // 1. Format the data for PDF
    // 2. Generate PDF using a library like pdfmake
    // 3. Trigger download
  }

  const generateReport = async () => {
    const reportConfig = REPORT_TYPES[selectedReport]
    if (reportConfig.dateRangeRequired) {
      // Show error or notification
      return
    }

    // Report generation logic will be implemented when Jobtread query is provided
    switch (selectedReport) {
      case "stock-levels":
        await generateStockLevelsReport()
        break
      case "movement-analysis":
        await generateMovementAnalysis({ from: new Date(), to: new Date() })
        break
      case "reorder-points":
        await generateReorderPointsReport({ from: new Date(), to: new Date() })
        break
      case "usage-history":
        await generateUsageHistoryReport({ from: new Date(), to: new Date() })
        break
      case "cost-analysis":
        await generateCostAnalysisReport({ from: new Date(), to: new Date() })
        break
    }
  }

  const generateStockLevelsReport = async () => {
    // Will implement when Jobtread query is available
    // This report will include:
    // - Current stock levels
    // - Items below reorder point
    // - Suggested reorder quantities
    // - Safety stock status
  }

  const generateMovementAnalysis = async (dateRange: { from: Date; to: Date }) => {
    // Will implement when Jobtread query is available
    // This report will include:
    // - Stock movement patterns
    // - Peak usage periods
    // - Slow-moving items
    // - Fast-moving items
  }

  const generateReorderPointsReport = async (dateRange: { from: Date; to: Date }) => {
    // Will implement when Jobtread query is available
    // This report will include:
    // - Calculated reorder points based on:
    //   * Average daily usage
    //   * Lead time
    //   * Safety stock requirements
    // - Suggested safety stock levels
    // - Lead time analysis
  }

  const generateUsageHistoryReport = async (dateRange: { from: Date; to: Date }) => {
    // Will implement when Jobtread query is available
    // This report will include:
    // - Historical usage patterns
    // - Seasonal trends
    // - Usage by project/job
    // - Demand forecasting
  }

  const generateCostAnalysisReport = async (dateRange: { from: Date; to: Date }) => {
    // Will implement when Jobtread query is available
    // This report will include:
    // - Cost trends
    // - Value of inventory
    // - Cost by category
    // - Cost optimization suggestions
  }

  return (
    <div className="space-y-6">
      <div>
        <Label>Report Type</Label>
        <Select
          value={selectedReport}
          onValueChange={(value) => setSelectedReport(value as ReportType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(REPORT_TYPES).map(([value, config]) => (
              <SelectItem key={value} value={value}>
                {config.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-1">
          {REPORT_TYPES[selectedReport].description}
        </p>
      </div>

      {REPORT_TYPES[selectedReport].dateRangeRequired && (
        <div>
          <Label>Date Range</Label>
          <div className="mt-2">
            <DatePickerWithRange />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button 
          onClick={() => exportReport('excel')}
          className="flex-1"
          disabled={isExporting}
          variant="outline"
        >
          {isExporting && exportFormat === 'excel' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="mr-2 h-4 w-4" />
          )}
          Export to Excel
        </Button>
        <Button 
          onClick={() => exportReport('pdf')}
          className="flex-1"
          disabled={isExporting}
          variant="outline"
        >
          {isExporting && exportFormat === 'pdf' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          Export to PDF
        </Button>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Reorder Level Management</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Reorder points are calculated using:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Average Daily Usage × Lead Time</li>
          <li>Safety Stock Level (based on variability)</li>
          <li>Seasonal Adjustments</li>
          <li>Minimum Order Quantities</li>
        </ul>
      </div>
    </div>
  )
}