'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
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

interface Invoice {
  id: string
  jobName: string
  amount: number
  dueDate: Date
}

export default function Calendar() {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Totals']
  const [currentDate, setCurrentDate] = useState(new Date())
  const today = new Date()

  const monthYear = currentDate.toLocaleString('default', { 
    month: 'long',
    year: 'numeric'
  })

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const invoices: Invoice[] = [
    {
      id: '1',
      jobName: 'Kitchen Remodel',
      amount: 12500,
      dueDate: new Date(2024, 10, 5)
    },
    {
      id: '2',
      jobName: 'Bathroom Renovation',
      amount: 8750,
      dueDate: new Date(2024, 10, 12)
    },
    {
      id: '3',
      jobName: 'Deck Installation',
      amount: 15000,
      dueDate: new Date(2024, 10, 15)
    },
    {
      id: '4',
      jobName: 'Basement Finishing',
      amount: 22000,
      dueDate: new Date(2024, 10, 15)
    },
    {
      id: '5',
      jobName: 'Roof Repair',
      amount: 4500,
      dueDate: new Date(2024, 10, 18)
    },
    {
      id: '6',
      jobName: 'Window Replacement',
      amount: 9800,
      dueDate: new Date(2024, 10, 22)
    },
    {
      id: '7',
      jobName: 'Garage Door Install',
      amount: 3200,
      dueDate: new Date(2024, 10, 28)
    }
  ]

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const totalSlots = 35

    return [...Array(totalSlots)].map((_, index) => {
      const isEighthColumn = (index + 1) % 8 === 0
      const adjustedIndex = index - Math.floor(index / 8)
      const dayNumber = adjustedIndex - firstDay + 1
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth
      
      const isToday = isValidDay && 
        dayNumber === today.getDate() && 
        currentDate.getMonth() === today.getMonth() && 
        currentDate.getFullYear() === today.getFullYear()

      // Calculate weekly totals for the 8th column
      if (isEighthColumn) {
        const weekStart = index - 7
        const weeklyInvoices = invoices.filter(invoice => {
          const dueDate = invoice.dueDate
          for (let i = weekStart; i < index; i++) {
            const dayIndex = i - Math.floor(i / 8)
            const day = dayIndex - firstDay + 1
            if (day > 0 && day <= daysInMonth &&
                dueDate.getDate() === day &&
                dueDate.getMonth() === currentDate.getMonth() &&
                dueDate.getFullYear() === currentDate.getFullYear()) {
              return true
            }
          }
          return false
        })
        const weeklyTotal = weeklyInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)

        return (
          <div
            key={index}
            className="aspect-square border rounded-lg p-2 bg-gray-50 flex flex-col justify-center items-center"
          >
            <div className="text-sm font-medium text-gray-600">Weekly Total</div>
            <div className="text-sm font-semibold">
              ${weeklyTotal.toLocaleString()}
            </div>
          </div>
        )
      }

      // Regular day cell code
      const dayInvoices = invoices.filter(invoice => {
        const dueDate = invoice.dueDate
        return isValidDay &&
          dueDate.getDate() === dayNumber &&
          dueDate.getMonth() === currentDate.getMonth() &&
          dueDate.getFullYear() === currentDate.getFullYear()
      })

      return (
        <div
          key={index}
          className={`aspect-square border rounded-lg p-2 ${
            isToday ? 'bg-blue-50 hover:bg-blue-100' :
            'hover:bg-gray-50'
          } cursor-pointer flex flex-col gap-1`}
        >
          {isValidDay && (
            <>
              <span className={`text-sm ${isToday ? 'font-semibold' : ''}`}>
                {dayNumber}
              </span>
              {dayInvoices.map(invoice => (
                <div
                  key={invoice.id}
                  className="bg-yellow-100 rounded p-1 text-xs"
                >
                  <div className="font-medium truncate">{invoice.jobName}</div>
                  <div className="text-black">
                    ${invoice.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )
    })
  }

  // Add this function to calculate monthly total
  const getMonthlyTotal = () => {
    return invoices
      .filter(invoice => 
        invoice.dueDate.getMonth() === currentDate.getMonth() &&
        invoice.dueDate.getFullYear() === currentDate.getFullYear()
      )
      .reduce((sum, invoice) => sum + invoice.amount, 0)
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
                <BreadcrumbLink href="#">Features</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Calendar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-center gap-4 mb-6">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold">{monthYear}</h2>
            <h3 className="text-sm text-gray-500">
              ${getMonthlyTotal().toLocaleString()}
            </h3>
          </div>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={handleNextMonth}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-8 gap-2">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div key={day} className="text-center font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          
          {/* Calendar days and total slots */}
          {generateCalendarDays()}
        </div>
      </div>
    </main>
  )
}
