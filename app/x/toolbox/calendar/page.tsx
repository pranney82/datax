'use client'

import { ArrowUpRight, ChevronLeft, ChevronRight, LayoutGrid, List, Plus } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getDoc, doc } from 'firebase/firestore'
import { useAuth } from "@/lib/context/auth-context"
import { calQuery1 } from './calquery'
import { db } from '@/lib/firebase'
import Link from 'next/link'
import { TTSelector } from './ttselector'

interface Task {
  id: string
  name: string
  startDate: string
  description: string
  job: {
    id: string
    name: string
  }
}

export default function Calendar() {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Totals']
  const [currentDate, setCurrentDate] = useState(new Date())
  const today = new Date()
  const [isCalendarView, setIsCalendarView] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const [orgId, setOrgId] = useState<string | null>(null)
  const [grantKey, setGrantKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [taskID, setTaskID] = useState<string | null>(null) 

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

  useEffect(() => {
    if (!user) return
    const fetchUserSettings = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userDocRef)
        const userData = userDoc.data()
        const orgDocRef = doc(db, 'orgs', userData?.org)
        const orgDoc = await getDoc(orgDocRef)
        const orgData = orgDoc.data()
        
        if (!orgData?.orgID || !orgData?.grantKey) {
          setError('Organization settings not found')
          return
        }
        setTaskID(orgData.calTaskType)
        setOrgId(orgData.orgID)
        setGrantKey(orgData.grantKey)
      } catch (error) {
        console.error('Error fetching user settings:', error)
        setError('Failed to load organization settings')
      }
    }
    
    fetchUserSettings()
  }, [user])

  const fetchTasks = useCallback(async () => {
    if (!orgId || !grantKey) return;

    try {
      setLoading(true);

      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

      const formatDateForAPI = (date: Date) => {
        const tzOffset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (tzOffset * 60000));
        return localDate.toISOString().split('T')[0];
      };

      const startDate = formatDateForAPI(firstDay);
      const endDate = formatDateForAPI(lastDay);

      console.log('Date Range:', { startDate, endDate });

      const response = await fetch('/api/jtfetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            "$": { "grantKey": grantKey },
            ...calQuery1({ 
              orgID: orgId,
              cfName2: taskID || "",
              startDate,
              endDate
            })
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      const fetchedTasks = data?.organization?.tasks?.nodes || [];
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error in fetchTasks:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [orgId, grantKey, currentDate, taskID]);

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks, currentDate])

  const parseTaskDate = (dateString: string) => {
    const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    
    const totalDays = firstDay + daysInMonth
    const numberOfWeeks = Math.ceil(totalDays / 7)
    const totalSlots = numberOfWeeks * 8

    return [...Array(totalSlots)].map((_, index) => {
      const isEighthColumn = (index + 1) % 8 === 0
      const adjustedIndex = index - Math.floor(index / 8)
      const dayNumber = adjustedIndex - firstDay + 1
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth
      
      const isToday = isValidDay && 
        dayNumber === today.getDate() && 
        currentDate.getMonth() === today.getMonth() && 
        currentDate.getFullYear() === today.getFullYear()

      if (isEighthColumn) {
        const weekStart = index - 7
        const weeklyInvoices = tasks.filter(task => {
          const taskDate = parseTaskDate(task.startDate);
          for (let i = weekStart; i < index; i++) {
            const dayIndex = i - Math.floor(i / 8)
            const day = dayIndex - firstDay + 1
            if (day > 0 && day <= daysInMonth &&
                taskDate.getDate() === day &&
                taskDate.getMonth() === currentDate.getMonth() &&
                taskDate.getFullYear() === currentDate.getFullYear()) {
              return true
            }
          }
          return false
        })
        const weeklyTotal = weeklyInvoices.reduce((sum, task) => sum + (parseFloat(task.description) || 0), 0)

        return (
          <div
            key={index}
            className="aspect-square border rounded-lg p-2 bg-gray-50 flex flex-col justify-center items-center"
          >
            <div className="text-xs sm:text-sm font-medium text-gray-600">Weekly Total</div>
            <div className="text-xs sm:text-sm font-semibold">
              ${weeklyTotal.toLocaleString()}
            </div>
          </div>
        )
      }

      const dayTasks = tasks.filter(task => {
        const taskDate = parseTaskDate(task.startDate);
        return isValidDay &&
          taskDate.getDate() === dayNumber &&
          taskDate.getMonth() === currentDate.getMonth() &&
          taskDate.getFullYear() === currentDate.getFullYear()
      })

      return (
        <div
          key={index}
          className={`aspect-square border rounded-lg p-1 sm:p-2 ${
            isToday ? 'bg-blue-50 hover:bg-blue-100' :
            'hover:bg-gray-50'
          } cursor-pointer flex flex-col gap-1`}
        >
          {isValidDay && (
            <>
              <span className={`text-xs sm:text-sm ${isToday ? 'font-semibold' : ''}`}>
                {dayNumber}
              </span>
              {dayTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTask({
                      id: task.id,
                      name: task.name,
                      description: task.description,
                      startDate: task.startDate,
                      job: task.job
                    })
                    setIsDialogOpen(true)
                  }}
                  className="bg-yellow-100 rounded p-0.5 sm:p-1 text-[0.6rem] sm:text-xs hover:bg-yellow-200 transition-colors cursor-pointer"
                >
                  <div className="font-medium truncate">{task.name}</div>
                  <div className="font-small text-gray-500 truncate">{task.job.name}</div>
                  <div className="text-black">
                    ${parseFloat(task.description).toLocaleString()}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )
    })
  }

  const getMonthlyTotal = () => {
    return tasks.reduce((sum, task) => sum + (parseFloat(task.description) || 0), 0)
  }

  const generateListView = () => {
    const filteredInvoices = tasks.filter(task => {
      const taskDate = parseTaskDate(task.startDate);
      return taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear();
    })

    if (filteredInvoices.length === 0) {
      return (
        <div className="flex items-center justify-center p-4 sm:p-8 border rounded-lg">
          <span className="text-gray-500">No Pay Phases Found</span>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4">
        {filteredInvoices
          .sort((a, b) => parseTaskDate(a.startDate).getTime() - parseTaskDate(b.startDate).getTime())
          .map(task => (
            <div 
              key={task.id}
              onClick={() => {
                setSelectedTask(task);
                setIsDialogOpen(true);
              }}
              className="flex flex-col p-3 sm:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm sm:text-lg">{task.name}</span>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {parseTaskDate(task.startDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600">{task.job.name}</span>                  
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-sm sm:text-lg">
                    ${parseFloat(task.description).toLocaleString()}
                  </span>
                  <Link href={`https://app.jobtread.com/jobs/${task.job.id}/schedule?taskId=${task.id}`} target="_blank" className="text-xs text-gray-500 hover:underline">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    )
  }

  const handleTaskTypeSelect = async (newTaskId: string) => {
    setTaskID(newTaskId)
    try {
      setLoading(true)
      if (!newTaskId) {
        setTasks([])
      } else {
        await fetchTasks()
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Cash Flow Calendar</h1>
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <TTSelector onTaskTypeSelect={handleTaskTypeSelect} />
                <Button
                  variant="outline"
                  className="gap-2 w-full sm:w-auto"
                  onClick={() => setIsCalendarView(!isCalendarView)}
                >
                  {isCalendarView ? (
                    <>
                      <List className="h-4 w-4" />
                      <span>List View</span>
                    </>
                  ) : (
                    <>
                      <LayoutGrid className="h-4 w-4" />
                      <span>Calendar View</span>
                    </>
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-center">
                <button 
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={handlePreviousMonth}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="flex flex-col items-center">
                  <h2 className="text-lg sm:text-2xl font-semibold">{monthYear}</h2>
                  <h3 className="text-xs sm:text-sm text-gray-500">
                    ${getMonthlyTotal().toLocaleString()}
                  </h3>
                </div>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={handleNextMonth}
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4" />
                  <span className="whitespace-nowrap">Add Task <Badge variant="secondary" className="ml-1">Coming Soon</Badge></span>
                </Button>
              </div>
            </div>

            {isCalendarView ? (
              <div className="grid grid-cols-8 gap-1 sm:gap-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center font-medium text-gray-500 py-1 sm:py-2 text-xs sm:text-sm">
                    {day}
                  </div>
                ))}
                {generateCalendarDays()}
              </div>
            ) : (
              generateListView()
            )}
          </div>
        </>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              {selectedTask?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="text-xs sm:text-sm text-gray-500">
                Due Date
              </div>
              <div className="font-medium text-sm sm:text-base">
                {selectedTask?.startDate ? 
                  parseTaskDate(selectedTask.startDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ''
                }
              </div>
            </div>
            <div className="grid gap-2">
              <div className="text-xs sm:text-sm text-gray-500">
                Amount
              </div>
              <div className="font-medium text-sm sm:text-base">
                ${parseFloat(selectedTask?.description || '0').toLocaleString()}
              </div>
            </div>
            <div className="grid gap-2">
              <div className="text-xs sm:text-sm text-gray-500">
                Job ID
              </div>
              <div className="font-medium text-sm sm:text-base">
                {selectedTask?.job.id}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

