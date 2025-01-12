"use client"

import * as React from "react"
import { MoreHorizontal, Settings2, User, HelpCircle, X, Lightbulb } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const drawerItems = [
  { icon: Settings2, label: 'Settings', href: '/x/settings' },
  { icon: User, label: 'Profile', href: '/x/profile' },
  { icon: HelpCircle, label: 'Help & Support', href: '/x/help' },
  { icon: Lightbulb, label: 'Feature Request', href: '/x#feature-request' },
]

export function DrawerDemo() {
  const pathname = usePathname()

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
              <ul className="flex flex-wrap justify-around">
                {drawerItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.label} className="w-1/2 p-2">
                      <DrawerClose asChild>
                        <Link 
                          href={item.href}
                          className="flex flex-col items-center justify-center h-full p-2 rounded-lg transition-colors duration-200"
                        >
                          <item.icon className={`h-6 w-6 ${isActive ? 'text-[#ffd400]' : 'text-gray-500'}`} />
                          <span className={`text-xs mt-1 ${isActive ? 'text-[#ffd400] font-semibold' : 'text-gray-500'}`}>
                            {item.label}
                          </span>
                        </Link>
                      </DrawerClose>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
          <DrawerFooter className="bg-background border-t border-gray-200 p-4">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full bg-white hover:bg-gray-100 text-gray-700 border-gray-300">
                <X className="h-5 w-5 mr-2" />
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

