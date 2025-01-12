"use client"

import { ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-react'
import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"

interface User {
  name: string
  email: string
  avatar: string
  uid: string
}

export function NavUser() {
  const [user, setUser] = useState<User | null>(null)
  
  const { isMobile } = useSidebar()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDocRef = doc(db, 'users', authUser.uid)
        const userDoc = await getDoc(userDocRef)
        const userData = userDoc.data()
        
        setUser({
          uid: authUser.uid,
          email: userData?.email || '',
          name: userData?.name || '',
          avatar: userData?.avatar || ''
        })
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar || ''} alt={user?.name || ''} />
                <AvatarFallback className="rounded-lg">
                  {user?.name?.split(' ').map(word => word[0]).join('').toUpperCase() || 'X'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name || ''}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar || ''} alt={user?.name || ''} />
                  <AvatarFallback className="rounded-lg">
                    {user?.name?.split(' ').map(word => word[0]).join('').toUpperCase() || 'X'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name || ''}</span>
                  <span className="truncate text-xs">{user?.email || ''}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <div className="group">
                  <Link 
                    href="/pricing" 
                    className="flex items-center justify-between w-full px-2 py-1.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-foreground hover:text-primary rounded-md transition-all duration-200 ease-in-out transform hover:scale-105"
                  >
                    <span className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Upgrade to {' '}
                      <span className="ml-1 text-xs bg-primary-foreground text-primary px-1.5 py-0.5 rounded-full transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                        CORE
                      </span>
                    </span>
                  </Link>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* TODO: Add account settings */}
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <Link href="/x/settings">
                  Billing
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link 
                href="/" 
                onClick={(e) => {
                  e.preventDefault()
                  signOut(auth)
                }}
                className="flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

