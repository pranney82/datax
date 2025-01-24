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
import { collection, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { MoreHorizontal, ArrowUpDown, Download } from "lucide-react"
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

interface UserData {
  id: string
  admin: boolean
  createdAt: { toDate: () => Date }
  email: string
  enableAutoSync: boolean
  enableDarkMode: boolean
  enableNotifications: boolean
  name: string
  org: string
  stripeCustomerId: string
}

interface StripeData {
  customerId: string
  customerEmail: string
  subscriptionStatus: string
  tier: string
  createdAt: { toDate: () => Date }
}

interface OrgData {
  grantKey?: string
  [key: string]: unknown
}

const ITEMS_PER_PAGE = 20

const formatDate = (dateObj: { toDate: () => Date } | undefined): string => {
  try {
    if (!dateObj?.toDate) return "Invalid date"
    const date = dateObj.toDate()
    if (!(date instanceof Date) || isNaN(date.getTime())) return "Invalid date"
    return date.toLocaleString()
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching data:", error.message)
    } else {
      console.error("Error fetching data:", String(error))
    }
    return "Invalid date"
  }
}

type SortableField = keyof UserData | "stripeData.subscriptionStatus" | "stripeData.tier"

const downloadCSV = (users: (UserData & { stripeData?: StripeData })[], orgs: Record<string, OrgData>) => {
  // Define CSV headers
  const headers = [
    'Name',
    'Email',
    'Organization',
    'Grant Key',
    'Subscription Status',
    'Tier',
    'Created At'
  ]

  // Convert users to CSV rows
  const rows = users.map(user => [
    user.name,
    user.email,
    user.org,
    orgs[user.org]?.grantKey || 'No key',
    user.stripeData?.subscriptionStatus || 'free',
    user.stripeData?.tier || 'free',
    formatDate(user.createdAt)
  ])

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function UsersPage() {
  const [users, setUsers] = useState<(UserData & { stripeData?: StripeData })[]>([])
  const [orgs, setOrgs] = useState<Record<string, OrgData>>({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortableField>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersSnapshot = await getDocs(collection(db, "users"))
        const userData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserData[]

        // Fetch stripe data for each user
        const usersWithStripeData = await Promise.all(
          userData.map(async (user) => {
            if (!user.stripeCustomerId) return user

            const stripeDoc = await getDoc(doc(db, "stripedata", user.stripeCustomerId))
            if (stripeDoc.exists()) {
              return {
                ...user,
                stripeData: stripeDoc.data() as StripeData
              }
            }
            return user
          })
        )

        setUsers(usersWithStripeData)

        const uniqueOrgIds = Array.from(new Set(usersWithStripeData.map(user => user.org)))
        const orgsData: Record<string, OrgData> = {}
        
        await Promise.all(
          uniqueOrgIds.map(async (orgId) => {
            if (orgId) {
              const orgDoc = await getDocs(collection(db, "orgs"))
              const orgData = orgDoc.docs.find(doc => doc.id === orgId)
              if (orgData) {
                orgsData[orgId] = orgData.data() as OrgData
              }
            }
          })
        )
        
        setOrgs(orgsData)
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching data:", error.message)
        } else {
          console.error("Error fetching data:", String(error))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSort = (field: SortableField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    // Handle sorting for nested stripeData fields
    if (sortField === "stripeData.subscriptionStatus") {
      const aValue = a.stripeData?.subscriptionStatus || ""
      const bValue = b.stripeData?.subscriptionStatus || ""
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    if (sortField === "stripeData.tier") {
      const aValue = a.stripeData?.tier || ""
      const bValue = b.stripeData?.tier || ""
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    const aValue = String(a[sortField as keyof UserData])
    const bValue = String(b[sortField as keyof UserData])
    return sortDirection === "asc" 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue)
  })

  const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleDelete = async () => {
    if (!userToDelete) return

    try {
      await deleteDoc(doc(db, "users", userToDelete.id))
      setUsers(users.filter(user => user.id !== userToDelete.id))
      setUserToDelete(null)
    } catch (error) {
      console.error("Error deleting user:", error)
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
                <BreadcrumbPage>Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Users
            <Badge variant="outline" className="px-2 py-1 bg-gray-100 rounded-full">
              {users.length}
            </Badge>
          </h1>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => downloadCSV(sortedUsers, orgs)}
              title="Export to CSV"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                  Name <ArrowUpDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort("email")} className="cursor-pointer">
                  Email <ArrowUpDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort("org")} className="cursor-pointer">
                  Organization <ArrowUpDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead>
                  Grant Key
                </TableHead>
                <TableHead onClick={() => handleSort("stripeData.subscriptionStatus")} className="cursor-pointer">
                  Status <ArrowUpDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort("stripeData.tier")} className="cursor-pointer">
                  Tier <ArrowUpDown className="inline h-4 w-4" />
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
                  <TableCell colSpan={8} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.org}</TableCell>
                    <TableCell>{orgs[user.org]?.grantKey || 'No key'}</TableCell>
                    <TableCell>{user.stripeData?.subscriptionStatus || 'free'}</TableCell>
                    <TableCell>{user.stripeData?.tier || 'free'}</TableCell>
                    <TableCell>
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => setUserToDelete(user as UserData)}
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

      <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete{' '}
              <span className="font-medium">{userToDelete?.name}</span>&apos;s account
              and remove their data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
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
