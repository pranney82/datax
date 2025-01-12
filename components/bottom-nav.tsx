"use client"

import { Home, BarChart3, Zap, BookOpen } from 'lucide-react'
import { cn } from "@/lib/utils"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { name: 'Home', icon: Home, href: '/x' },
  { name: 'Dashboard', icon: BarChart3, href: '/x/dashboard' },
  { name: 'Toolbox', icon: Zap, href: '/x/toolbox' },
  { name: 'Library', icon: BookOpen, href: '/x/library/templates' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background border-t md:hidden">
      <ul className="flex h-full items-center justify-around">
        {items.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 text-muted-foreground",
                pathname === item.href && "text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

