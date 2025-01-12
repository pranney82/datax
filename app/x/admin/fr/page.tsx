'use client'

import { useEffect, useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface FeatureRequest {
  id: string
  title: string
  description: string
  status: string
  createdAt: { toDate: () => Date }
  userId: string
  email: string
  votes: number
}

const ITEMS_PER_PAGE = 10

export default function FeatureRequestsPage() {
  const [requests, setRequests] = useState<FeatureRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof FeatureRequest>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [requestToDelete, setRequestToDelete] = useState<FeatureRequest | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "featureRequests"))
        const requestData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FeatureRequest[]
        setRequests(requestData)
      } catch (error) {
        console.error("Error fetching feature requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const handleSort = (field: keyof FeatureRequest) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredRequests = requests.filter(request =>
    Object.values(request).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortField === "createdAt") {
      if (!a.createdAt || !b.createdAt) return 0;
      const aDate = a.createdAt.toDate()
      const bDate = b.createdAt.toDate()
      return sortDirection === "asc" 
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime()
    }
    const aValue = String(a[sortField])
    const bValue = String(b[sortField])
    return sortDirection === "asc" 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue)
  })

  const totalPages = Math.ceil(sortedRequests.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedRequests = sortedRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleDelete = async () => {
    if (!requestToDelete) return

    try {
      await deleteDoc(doc(db, "featureRequests", requestToDelete.id))
      setRequests(requests.filter(request => request.id !== requestToDelete.id))
      setRequestToDelete(null)
    } catch (error) {
      console.error("Error deleting feature request:", error)
    }
  }

  return (
    <main className="flex flex-col flex-1 p-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/x/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Feature Requests</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Feature Requests
            <Badge variant="outline" className="px-2 py-1 bg-gray-100 rounded-full">
              {requests.length}
            </Badge>
          </h1>
          <Input
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("title")} className="cursor-pointer">
                  Title <ArrowUpDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort("email")} className="cursor-pointer">
                  Requested By <ArrowUpDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                  Status <ArrowUpDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort("votes")} className="cursor-pointer">
                  Votes <ArrowUpDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort("createdAt")} className="cursor-pointer">
                  Created <ArrowUpDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No feature requests found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.title}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>{request.votes}</TableCell>
                    <TableCell>
                      {request.createdAt && typeof request.createdAt.toDate === 'function' 
                        ? request.createdAt.toDate().toLocaleString()
                        : 'Invalid Date'
                      }
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => setRequestToDelete(request)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && setCurrentPage(p => p - 1)}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages && setCurrentPage(p => p + 1)}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog open={!!requestToDelete} onOpenChange={() => setRequestToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the feature request
              <b>{requestToDelete?.title}</b> and remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestToDelete(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
