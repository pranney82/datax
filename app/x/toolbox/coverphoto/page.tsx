'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"

interface RunHistory {
  id: string
  timestamp: Date
  status: 'success' | 'failed'
  jobsProcessed: number
  errorMessage?: string
}

export default function GMapCoverPhotoPage() {
  const [isEnabled, setIsEnabled] = useState(false)

  // Mock data for the history table
  const runHistory: RunHistory[] = [
    {
      id: '1',
      timestamp: new Date('2024-03-20T14:30:00'),
      status: 'success',
      jobsProcessed: 15,
    },
    {
      id: '2',
      timestamp: new Date('2024-03-19T10:15:00'),
      status: 'failed',
      jobsProcessed: 8,
      errorMessage: 'API Rate limit exceeded'
    },
    {
      id: '3',
      timestamp: new Date('2024-03-18T16:45:00'),
      status: 'success',
      jobsProcessed: 12,
    },
    {
      id: '4',
      timestamp: new Date('2024-03-17T09:20:00'),
      status: 'failed',
      jobsProcessed: 3,
      errorMessage: 'Network connection timeout'
    },
  ]

  return (
    <main className="flex flex-col flex-1 p-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/x/toolbox">Toolbox</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Google Maps Cover Photo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-8 p-6">
        <div>
          <h1 className="text-2xl font-semibold mb-6">Google Maps Job Cover Photo</h1>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
              id="gmap-cover-photo"
            />
            <Label htmlFor="gmap-cover-photo">
              Enable Automatic Cover Photo Updates
            </Label>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">Run History</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jobs Processed</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runHistory.map((run) => (
                <TableRow key={run.id}>
                  <TableCell>
                    {run.timestamp.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      run.status === 'success' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{run.jobsProcessed} jobs</TableCell>
                  <TableCell className="text-gray-500">
                    {run.errorMessage || 'Completed successfully'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  )
} 