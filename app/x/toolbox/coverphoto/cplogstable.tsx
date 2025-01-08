'use client'

import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useCoverPhotoLogs } from "./cplogs"
import { useState } from "react"

const ITEMS_PER_PAGE = 10

export function CoverPhotoLogsTable() {
  const { logs, isLoading } = useCoverPhotoLogs()
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedLogs = logs.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">Run History</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Job ID</TableHead>
            <TableHead>Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                Loading...
              </TableCell>
            </TableRow>
          ) : paginatedLogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No logs found
              </TableCell>
            </TableRow>
          ) : (
            paginatedLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {new Date(log.date).toLocaleString()}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    log.status === 'success' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <Link 
                    className="text-blue-500 hover:underline" 
                    href={`https://app.jobtread.com/jobs/${log.jobId}`} 
                    target="_blank"
                  >
                    {log.jobId}
                  </Link>
                </TableCell>
                <TableCell>{log.address}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {currentPage === 1 ? (
                <PaginationPrevious className="pointer-events-none opacity-50" />
              ) : (
                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
              )}
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              {currentPage === totalPages ? (
                <PaginationNext className="pointer-events-none opacity-50" />
              ) : (
                <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
} 