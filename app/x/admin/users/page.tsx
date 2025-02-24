'use client'

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
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
import { collection, getDocs, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { MoreHorizontal, ArrowUpDown, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

const truncate = (str: string, length: number = 15): string => {
  if (!str) return '';
  return str.length > length ? `${str.substring(0, length)}...` : str;
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
  const [editUser, setEditUser] = useState<UserData & { stripeData?: StripeData } | null>(null)
  const [isSaving, setIsSaving] = useState(false)

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

  const handleEditSubmit = async () => {
    if (!editUser || isSaving) return;
    setIsSaving(true);
    try {
      const updatedUser = { ...editUser };
      
      await Promise.all([
        updateDoc(doc(db, "users", updatedUser.id), {
          name: updatedUser.name,
          email: updatedUser.email,
          org: updatedUser.org,
          stripeCustomerId: updatedUser.stripeCustomerId
        }),
        updatedUser.stripeCustomerId && updatedUser.stripeData ? 
          updateDoc(doc(db, "stripedata", updatedUser.stripeCustomerId), {
            subscriptionStatus: updatedUser.stripeData.subscriptionStatus,
            tier: updatedUser.stripeData.tier
          }) : Promise.resolve()
      ]);

      setUsers(prevUsers => 
        prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
      );
    } catch (error: unknown) {
      console.error("Error updating user:", error);
    } finally {
      setIsSaving(false);
      setEditUser(null);
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
          <div className="mt-2 p-3 bg-yellow-100 text-yellow-800 rounded-md text-sm">
            To give a user temporary CORE access, change the stripeCustomerID to &quot;datax_core_paid&quot;
          </div>
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
                <TableHead onClick={() => handleSort("stripeCustomerId")} className="cursor-pointer">
                  Stripe Customer ID <ArrowUpDown className="inline h-4 w-4" />
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
                    <TableCell title={user.email}>
                      {truncate(user.email)}
                    </TableCell>
                    <TableCell title={user.org}>
                      {truncate(user.org)}
                    </TableCell>
                    <TableCell title={orgs[user.org]?.grantKey || 'No key'}>
                      {truncate(orgs[user.org]?.grantKey || 'No key')}
                    </TableCell>
                    <TableCell title={user.stripeCustomerId}>
                      {truncate(user.stripeCustomerId)}
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => {
                            if (!user.stripeData && user.stripeCustomerId) {
                              const { ...userWithoutStripe } = user;
                              const stripeCustomerId: string = user.stripeCustomerId;
                              setEditUser({
                                ...(userWithoutStripe as UserData),
                                stripeData: {
                                  customerId: stripeCustomerId,
                                  customerEmail: user.email,
                                  subscriptionStatus: 'free',
                                  tier: 'free',
                                  createdAt: user.createdAt
                                }
                              });
                            } else {
                              setEditUser(user);
                            }
                          }}>Edit</DropdownMenuItem>
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

      {editUser && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSaving) {
              setEditUser(null);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-[425px] max-w-[90vw]">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Edit User</h2>
              <p className="text-sm text-gray-500">Modify the user details below.</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Name</label>
              <Input 
                type="text" 
                value={editUser?.name || ""} 
                onChange={(e) => setEditUser(prev => prev ? { ...prev, name: e.target.value } : null)} 
              />
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                value={editUser?.email || ""} 
                onChange={(e) => setEditUser(prev => prev ? { ...prev, email: e.target.value } : null)} 
              />
              <label className="text-sm font-medium">Organization</label>
              <Input 
                type="text" 
                value={editUser?.org || ""} 
                onChange={(e) => setEditUser(prev => prev ? { ...prev, org: e.target.value } : null)} 
              />
              <label className="text-sm font-medium">Stripe Customer ID</label>
              <Input 
                type="text" 
                value={editUser?.stripeCustomerId || ""} 
                onChange={(e) => setEditUser(prev => prev ? { ...prev, stripeCustomerId: e.target.value } : null)} 
              />
              <label className="text-sm font-medium">Subscription Status</label>
              <Input 
                type="text" 
                value={editUser?.stripeData?.subscriptionStatus || "free"} 
                onChange={(e) => setEditUser(prev => {
                  if (!prev) return null;
                  const updatedStripeData = prev.stripeData ? {
                    ...prev.stripeData,
                    subscriptionStatus: e.target.value
                  } : {
                    customerId: prev.stripeCustomerId,
                    customerEmail: prev.email,
                    subscriptionStatus: e.target.value,
                    tier: 'free',
                    createdAt: prev.createdAt
                  };
                  return { ...prev, stripeData: updatedStripeData };
                })} 
              />
              <label className="text-sm font-medium">Tier</label>
              <Input 
                type="text" 
                value={editUser?.stripeData?.tier || "free"} 
                onChange={(e) => setEditUser(prev => {
                  if (!prev) return null;
                  const updatedStripeData = prev.stripeData ? {
                    ...prev.stripeData,
                    tier: e.target.value
                  } : {
                    customerId: prev.stripeCustomerId,
                    customerEmail: prev.email,
                    subscriptionStatus: 'free',
                    tier: e.target.value,
                    createdAt: prev.createdAt
                  };
                  return { ...prev, stripeData: updatedStripeData };
                })} 
              />
              <label className="text-sm font-medium">Created At</label>
              <Input type="text" value={editUser ? formatDate(editUser.createdAt) : ""} readOnly />
              <label className="text-sm font-medium">Grant Key</label>
              <Input type="text" value={editUser ? (orgs[editUser.org]?.grantKey || "No key") : ""} readOnly />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => !isSaving && setEditUser(null)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleEditSubmit}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {userToDelete && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setUserToDelete(null);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-[425px] max-w-[90vw]">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Are you absolutely sure?</h2>
              <p className="text-sm text-gray-500">
                This action cannot be undone. This will permanently delete{' '}
                <span className="font-medium">{userToDelete?.name}</span>&apos;s account
                and remove their data from our servers.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setUserToDelete(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </main>
  )
}
