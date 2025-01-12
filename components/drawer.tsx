"use client"

import * as React from "react"
import { MoreHorizontal, Sparkles, X, Lightbulb, LogOut, HelpCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserStore } from "@/lib/stores/user-store"

export function DrawerDemo() {
  const pathname = usePathname()
  const { name, avatar } = useUserStore()

  const drawerItems = [
    { icon: Sparkles, label: 'Upgrade to CORE', href: '/pricing' },
    { icon: Lightbulb, label: 'Feature Request', href: '/x#feature-request' },
    { icon: HelpCircle, label: 'Support', href: '/x/settings/#support' },
    { icon: Avatar, label: 'Profile', href: '/x/settings', isAvatar: true },
    { icon: LogOut, label: 'Log out', href: '#' },
  ]

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="h-16 w-full flex flex-col items-center justify-center p-2">
          <MoreHorizontal className="h-6 w-6 text-gray-500" />
          <span className="text-xs mt-1 text-gray-500">More</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="flex flex-col items-center bg-gradient-to-r from-black to-[#ffd400] text-white rounded-t-lg p-6">
            <DrawerTitle className="text-2xl font-bold mb-2">
              <img src="/assets/logos/5.png" alt="Datax" className="h-12 w-auto mb-4" />
            </DrawerTitle>
            <DrawerDescription className="text-white/80">Data Made Easy</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 bg-background">
            <nav>
              <ul className="space-y-2">
                {drawerItems.map((item) => (
                  <li key={item.label}>
                    <DrawerClose asChild>
                      <Link 
                        href={item.href}
                        className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                          item.label === 'Upgrade to CORE' ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-gray-100'
                        }`}
                      >
                        {item.isAvatar ? (
                          <Avatar className="h-8 w-8 rounded-lg mr-3">
                            <AvatarImage src={avatar || ''} alt={name || ''} />
                            <AvatarFallback className="rounded-lg">
                              {name?.split(' ').map(word => word[0]).join('').toUpperCase() || 'X'}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <item.icon className={`h-5 w-5 mr-3 ${item.label === 'Upgrade to CORE' ? 'text-[#e6b800]' : 'text-gray-500'}`} />
                        )}
                        <span className={`text-sm ${item.label === 'Upgrade to CORE' ? 'text-[#e6b800] font-semibold' : 'text-gray-700'}`}>
                          {item.label}
                        </span>
                      </Link>
                    </DrawerClose>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="bg-background border-t border-gray-200 p-4">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full bg-white hover:bg-gray-100 text-gray-700 border-gray-300">
                <X className="h-5 w-5 mr-2" />
                Close
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

