"use client"

import { Home, BarChart3, Zap, BookOpen, Settings2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { icon: Home, label: 'Home', href: '/x' },
  { icon: BarChart3, label: 'Dashboard', href: '/x/dashboard' },
  { icon: Zap, label: 'Toolbox', href: '/x/toolbox' },
  { icon: BookOpen, label: 'Library', href: '/x/library/templates' },
  { icon: Settings2, label: 'Settings', href: '/x/settings' },
]

export function BottomMenu() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden">
      <ul className="flex justify-around items-center h-16">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/x' && pathname.startsWith(`${item.href}/`))
          return (
            <li key={item.label} className="relative flex-1">
              <Link 
                href={item.href} 
                className={`flex flex-col items-center justify-center h-full p-2 ${
                  isActive ? 'bg-gray-100' : ''
                }`}
              >
                <item.icon className={`h-6 w-6 ${isActive ? 'text-[#ffd400]' : 'text-gray-500'}`} />
                <span className={`text-xs mt-1 ${isActive ? 'text-[#ffd400] font-semibold' : 'text-gray-500'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ffd400]" />
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

