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
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface StripeData {
  id: string
  customerId: string
  customerEmail: string
  customerName: string
  amount: number
  status: string
  createdAt: { toDate: () => Date }
  paymentMethod: string
  tier: string
  subscriptionStatus: string
}

const ITEMS_PER_PAGE = 10

export default function StripePage() {
  const [payments, setPayments] = useState<StripeData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof StripeData>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "stripedata"))
        const paymentData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as StripeData[]
        setPayments(paymentData)
      } catch (error) {
        console.error("Error fetching payments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const handleSort = (field: keyof StripeData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredPayments = payments.filter(payment =>
    Object.values(payment).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (sortField === "createdAt") {
      const aDate = a.createdAt.toDate()
      const bDate = b.createdAt.toDate()
      return sortDirection === "asc" 
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime()
    }
    if (sortField === "amount") {
      return sortDirection === "asc" 
        ? a.amount - b.amount
        : b.amount - a.amount
    }
    const aValue = String(a[sortField])
    const bValue = String(b[sortField])
    return sortDirection === "asc" 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue)
  })

  const totalPages = Math.ceil(sortedPayments.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedPayments = sortedPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100)
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
                <BreadcrumbPage>Stripe Payments</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Stripe Payments
            <Badge variant="outline" className="px-2 py-1 bg-gray-100 rounded-full">
              {payments.length}
            </Badge>
          </h1>
          <Input
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("customerName")} className="cursor-pointer">
                  Customer <ArrowUpDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort("customerEmail")} className="cursor-pointer">
                  Email <ArrowUpDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort("amount")} className="cursor-pointer">
                  Amount <ArrowUpDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                  Status <ArrowUpDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort("tier")} className="cursor-pointer">
                  Tier <ArrowUpDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort("subscriptionStatus")} className="cursor-pointer">
                  Subscription <ArrowUpDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort("createdAt")} className="cursor-pointer">
                  Date <ArrowUpDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.customerName}</TableCell>
                    <TableCell>{payment.customerEmail}</TableCell>
                    <TableCell>{formatAmount(payment.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={payment.status === 'succeeded' ? 'default' : 'destructive'}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.tier}</TableCell>
                    <TableCell>
                      <Badge variant={
                        payment.subscriptionStatus === 'active' ? 'default' : 
                        payment.subscriptionStatus === 'canceled' ? 'destructive' : 
                        'secondary'
                      }>
                        {payment.subscriptionStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.createdAt.toDate().toLocaleString()}
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
                          <DropdownMenuItem>View Customer</DropdownMenuItem>
                          <DropdownMenuItem>View Subscription</DropdownMenuItem>
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
    </main>
  )
}
