"use client"

import { ArrowUpRight, ChevronLeft, ChevronRight, CalendarDays, List, Plus, YoutubeIcon as YouTube } from "lucide-react"
import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getDoc, doc } from "firebase/firestore"
import { useAuth } from "@/lib/context/auth-context"
import { calQuery1 } from "./calquery"
import { db } from "@/lib/firebase"
import Link from "next/link"
import { TTSelector } from "./ttselector"
import FeatureProtect from "@/components/admin/featureProtect"

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

const getWeekNumber = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

export default function Calendar() {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
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
  const [isTutorialOpen, setIsTutorialOpen] = useState(false) // Added tutorial dialog state

  const monthYear = currentDate.toLocaleString("default", {
    month: "short",
    year: "numeric",
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
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)
        const userData = userDoc.data()
        const orgDocRef = doc(db, "orgs", userData?.org)
        const orgDoc = await getDoc(orgDocRef)
        const orgData = orgDoc.data()

        if (!orgData?.orgID || !orgData?.grantKey) {
          setError("Organization settings not found")
          return
        }
        setTaskID(orgData.calTaskType)
        setOrgId(orgData.orgID)
        setGrantKey(orgData.grantKey)
      } catch (error) {
        console.error("Error fetching user settings:", error)
        setError("Failed to load organization settings")
      }
    }

    fetchUserSettings()
  }, [user])

  const fetchTasks = useCallback(async () => {
    if (!orgId || !grantKey) return

    try {
      setLoading(true)

      // Calculate first day of current month
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      // Calculate last day of current month
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      // Extend the date range to include the last week of previous month and first week of next month
      const extendedStartDate = new Date(firstDay)
      extendedStartDate.setDate(extendedStartDate.getDate() - 7)
      const extendedEndDate = new Date(lastDay)
      extendedEndDate.setDate(extendedEndDate.getDate() + 7)

      // Format dates for API in ISO format and handle timezone offset
      const formatDateForAPI = (date: Date) => {
        const tzOffset = date.getTimezoneOffset()
        const localDate = new Date(date.getTime() - tzOffset * 60000)
        return localDate.toISOString().split("T")[0]
      }

      const startDate = formatDateForAPI(extendedStartDate)
      const endDate = formatDateForAPI(extendedEndDate)

      const response = await fetch("/api/jtfetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            $: { grantKey: grantKey },
            ...calQuery1({
              orgID: orgId,
              cfName2: taskID || "",
              startDate,
              endDate,
            }),
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", errorText)
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const fetchedTasks = data?.organization?.tasks?.nodes || []
      setTasks(fetchedTasks)
    } catch (error) {
      console.error("Error in fetchTasks:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [orgId, grantKey, taskID, currentDate.getFullYear, currentDate.getMonth]) // Added currentDate.getFullYear and currentDate.getMonth to dependencies

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const parseTaskDate = (dateString: string) => {
    // Split the date string to get just the date part
    const [year, month, day] = dateString.split("T")[0].split("-").map(Number)
    // Create date in local timezone
    return new Date(year, month - 1, day)
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const lastMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))

    const totalDays = firstDay + daysInMonth
    const numberOfWeeks = Math.ceil(totalDays / 7)
    const totalSlots = numberOfWeeks * 7 // 7 columns (7 days of the week)

    return [...Array(totalSlots)].map((_, index) => {
      const isSunday = index % 7 === 0
      const adjustedIndex = index
      const dayNumber = adjustedIndex - firstDay + 1
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth
      const displayDate = isCurrentMonth
        ? dayNumber
        : dayNumber <= 0
          ? lastMonthDays + dayNumber
          : dayNumber - daysInMonth

      const isToday =
        isCurrentMonth &&
        dayNumber === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear()

      // Calculate the date for this cell
      const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber)

      // Filter tasks for this day, including tasks from adjacent months
      const dayTasks = tasks.filter((task) => {
        const taskDate = parseTaskDate(task.startDate)
        return (
          taskDate.getDate() === cellDate.getDate() &&
          taskDate.getMonth() === cellDate.getMonth() &&
          taskDate.getFullYear() === cellDate.getFullYear()
        )
      })

      // Calculate weekly total for Sundays
      let weeklyTotal = 0
      if (isSunday) {
        const weekStart = index
        const weekEnd = index + 6
        const weeklyInvoices = tasks.filter((task) => {
          const taskDate = parseTaskDate(task.startDate)
          for (let i = weekStart; i <= weekEnd; i++) {
            const dayIndex = i
            const day = dayIndex - firstDay + 1
            const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            if (
              taskDate.getDate() === checkDate.getDate() &&
              taskDate.getMonth() === checkDate.getMonth() &&
              taskDate.getFullYear() === checkDate.getFullYear()
            ) {
              return true
            }
          }
          return false
        })
        weeklyTotal = weeklyInvoices.reduce((sum, task) => sum + (Number.parseFloat(task.description) || 0), 0)
      }

      return (
        <div
          key={index}
          className={`aspect-square border border-gray-200 rounded-lg p-0.5 sm:p-1 md:p-2 lg:p-3 ${
            isToday
              ? "bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 shadow-md"
              : isCurrentMonth
                ? "hover:bg-black/5"
                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
          } cursor-pointer flex flex-col gap-0.5 sm:gap-1`}
        >
          <span
            className={`text-sm ${isToday ? "font-semibold" : ""} ${
              isCurrentMonth ? "text-gray-700" : "text-gray-400"
            } mb-1`}
          >
            {displayDate}
          </span>
          {dayTasks.map((task) => (
            <div
              key={task?.id || "unknown"}
              onClick={() => {
                if (task) {
                  setSelectedTask({
                    id: task.id || "",
                    name: task.name || "Unnamed Task",
                    description: task.description || "",
                    startDate: task.startDate || "",
                    job: task.job || { id: "", name: "" },
                  })
                  setIsDialogOpen(true)
                }
              }}
              className={`bg-gradient-to-r ${
                Number.parseFloat(task?.description || "0") >= 0
                  ? "from-[#E8F5E9] to-[#F1F8E9] hover:from-[#C8E6C9] hover:to-[#DCEDC8] border-l-[#4CAF50]"
                  : "from-[#FFEBEE] to-[#FFCDD2] hover:from-[#FFCDD2] hover:to-[#EF9A9A] border-l-[#F44336]"
              } rounded-sm p-0.5 text-xs transition-all duration-200 cursor-pointer border-l-2 transform hover:scale-[1.02] shadow-sm hover:shadow-md w-full`}
            >
              <div className="w-full space-y-0">
                <div className="font-medium w-full overflow-hidden text-ellipsis whitespace-nowrap text-[10px] sm:text-[13px] hidden sm:block">
                  {task?.name || "Unnamed Task"}
                </div>
                <div className="font-small text-gray-600 w-full overflow-hidden text-ellipsis whitespace-nowrap text-[9px] sm:text-[12px] hidden sm:block">
                  {task?.job?.name || "No Job"}
                </div>
                <div
                  className={`text-[8px] sm:text-[10px] md:text-[10px] lg:text-xs xl:text-sm font-semibold mt-0.5 ${
                    Number.parseFloat(task?.description || "0") >= 0 ? "text-black" : "text-red-700"
                  }`}
                >
                  {Number.parseFloat(task?.description || "0") >= 0
                    ? `$${Math.round(Number.parseFloat(task?.description || "0")).toLocaleString()}`
                    : `($${Math.abs(Math.round(Number.parseFloat(task?.description || "0"))).toLocaleString()})`}
                </div>
              </div>
            </div>
          ))}
          {isSunday && (
            <div className="mt-auto pt-1 border-t border-gray-200">
              <div className="bg-[#FFD400] rounded-md py-0.5 px-1 relative overflow-hidden flex flex-col">
                <div className="text-[7px] sm:text-[9px] md:text-[10px] font-normal text-black text-left leading-tight">
                  Week {getWeekNumber(new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber))} Total
                </div>
                <div className="text-[9px] sm:text-[11px] md:text-[12px] lg:text-sm xl:text-base font-bold tracking-wide text-black text-left leading-tight">
                  ${Math.round(weeklyTotal).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      )
    })
  }

  // Replace the existing getMonthlyTotal function with this updated version
  const getMonthlyTotal = () => {
    const currentMonthTasks = tasks.filter((task) => {
      const taskDate = parseTaskDate(task.startDate)
      return taskDate.getMonth() === currentDate.getMonth() && taskDate.getFullYear() === currentDate.getFullYear()
    })
    return currentMonthTasks.reduce((sum, task) => sum + (Number.parseFloat(task.description) || 0), 0)
  }

  const generateListView = () => {
    const filteredInvoices = tasks.filter((task) => {
      const taskDate = parseTaskDate(task.startDate)
      return taskDate.getMonth() === currentDate.getMonth() && taskDate.getFullYear() === currentDate.getFullYear()
    })

    if (filteredInvoices.length === 0) {
      return (
        <div className="flex items-center justify-center p-8 border border-gray-200 rounded-lg">
          <span className="text-gray-500">No Pay Phases Found</span>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4">
        {filteredInvoices
          .sort((a, b) => parseTaskDate(a.startDate).getTime() - parseTaskDate(b.startDate).getTime())
          .map((task) => (
            <div
              key={task.id}
              onClick={() => {
                setSelectedTask(task)
                setIsDialogOpen(true)
              }}
              className="flex flex-col p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 border-l-4 border-l-[#FFD400] shadow-sm hover:shadow-md relative"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-xl text-gray-900">{task.name}</h3>
                  <span className="text-sm text-gray-600">
                    {parseTaskDate(task.startDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md inline-block w-fit">
                    {task.job.name}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-bold text-xl bg-[#FFD400] px-4 py-2 rounded-lg">
                    ${Number.parseFloat(task.description).toLocaleString()}
                  </span>
                  <Link
                    href={`https://app.jobtread.com/jobs/${task.job.id}/schedule?taskId=${task.id}`}
                    target="_blank"
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View in JobTread <ArrowUpRight className="w-4 h-4" />
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
        // If clearing the task type, clear the tasks
        setTasks([])
      } else {
        // Otherwise fetch new tasks
        await fetchTasks()
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-col flex-1 p-0 pt-12">
      {error && <div className="p-4 bg-red-100 text-red-700 rounded-md m-4 border border-gray-200">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#FFD400] border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-1 flex-col gap-2 p-2 pt-0 border-r border-l border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 px-2 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 w-full justify-center sm:justify-start order-1 sm:order-none sm:w-auto">
                <Button
                  variant="outline"
                  className="focus:ring-2 focus:ring-yellow-400 focus:outline-none hover:bg-accent"
                  onClick={() => setIsCalendarView(!isCalendarView)}
                >
                  {isCalendarView ? <List className="h-4 w-4" /> : <CalendarDays className="h-4 w-4" />}
                </Button>
                <TTSelector onTaskTypeSelect={handleTaskTypeSelect} />
                <Button
                  variant="outline"
                  className="gap-2 text-black hover:bg-accent border border-gray-200 relative sm:hidden"
                >
                  <Plus className="w-4 h-4 z-10 relative" />
                  <span className="absolute -right-1 -top-1 bg-[#eee] text-[#4c545e] text-[8px] font-bold px-2 py-1 transform rotate-12 rounded-full leading-tight whitespace-nowrap">
                    Coming
                    <br />
                    Soon
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 text-black border-2 border-[#FFD400] bg-[#FFD400] transition-colors duration-300 shadow-lg hover:bg-[#FFD400]/80 sm:hidden"
                  onClick={() => setIsTutorialOpen(true)}
                >
                  <YouTube className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-col items-center w-full sm:w-auto order-2 sm:order-none mt-2 sm:mt-0">
                <div className="flex items-center space-x-6 mb-2">
                  <button
                    className="p-2 bg-[#FFD400] rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#000] hover:bg-[#FFD400]/80"
                    onClick={handlePreviousMonth}
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="w-6 h-6 text-[#000]" />
                  </button>
                  <h2 className="text-4xl font-bold text-[#000] tracking-tight">{monthYear}</h2>
                  <button
                    className="p-2 bg-[#FFD400] rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#000] hover:bg-[#FFD400]/80"
                    onClick={handleNextMonth}
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-6 h-6 text-[#000]" />
                  </button>
                </div>
                <div className="bg-[#FFD400] px-6 py-2 rounded-full text-lg font-semibold text-[#000] shadow-md transition-all duration-200 hover:bg-[#FFD400]/80">
                  ${Math.round(getMonthlyTotal()).toLocaleString()}
                </div>
              </div>

              <div className="w-full sm:w-auto hidden sm:flex justify-center sm:justify-end space-x-2">
                <Button variant="outline" className="gap-2 text-black hover:bg-accent border border-gray-200 relative">
                  <Plus className="w-4 h-4 z-10 relative" />
                  <span className="z-10 relative">Add Task</span>
                  <span className="absolute right-1 -top-1 bg-[#eee] text-[#4c545e] text-[8px] font-bold px-2 py-1 transform rotate-12 rounded-full leading-tight whitespace-nowrap">
                    Coming Soon
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 text-black border-2 border-[#FFD400] bg-[#FFD400] transition-colors duration-300 shadow-lg hover:bg-[#FFD400]/80"
                  onClick={() => setIsTutorialOpen(true)}
                >
                  <YouTube className="w-5 h-5" />
                  <span className="font-semibold">Tutorial</span>
                </Button>
              </div>
            </div>
            {isCalendarView ? (
              <FeatureProtect featureName="Cash Flow Calendar">
                <div className="grid grid-cols-7 gap-0">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className={`text-center font-semibold py-3 bg-gray-100 text-gray-600 rounded-t-lg border-b-2 border-[#FFD400]/30`}
                    >
                      {day}
                    </div>
                  ))}
                  {generateCalendarDays()}
                </div>
              </FeatureProtect>
            ) : (
              <FeatureProtect featureName="Cash Flow Calendar">
                <div className="border border-gray-200">{generateListView()}</div>
              </FeatureProtect>
            )}
          </div>
        </>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className={`sm:max-w-[425px] max-w-[90vw] w-full border-l-4 ${
            Number.parseFloat(selectedTask?.description || "0") >= 0 ? "border-l-[#4CAF50]" : "border-l-[#F44336]"
          } bg-white rounded-lg shadow-lg`}
        >
          <DialogHeader className="border-b border-b-black/10 pb-4">
            <DialogTitle className="text-xl font-semibold text-black">{selectedTask?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2.5">
              <div className="text-sm text-black/60 font-medium">Due Date</div>
              <div className="font-medium text-black">
                {selectedTask?.startDate
                  ? parseTaskDate(selectedTask.startDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </div>
            </div>
            <div className="grid gap-2.5">
              <div className="text-sm text-black/60 font-medium">Amount</div>
              <div
                className={`font-bold text-2xl ${
                  Number.parseFloat(selectedTask?.description || "0") >= 0
                    ? "text-black bg-[#E8F5E9]"
                    : "text-red-700 bg-[#FFEBEE]"
                } inline-block px-3 py-1 rounded`}
              >
                {Number.parseFloat(selectedTask?.description || "0") >= 0
                  ? `$${Math.round(Number.parseFloat(selectedTask?.description || "0")).toLocaleString()}`
                  : `($${Math.abs(Math.round(Number.parseFloat(selectedTask?.description || "0"))).toLocaleString()})`}
              </div>
            </div>
            <div className="grid gap-2.5">
              <div className="text-sm text-black/60 font-medium">Job Details</div>
              <div className="flex items-center justify-between">
                <div className="font-medium text-black">{selectedTask?.job.name}</div>
                <Link
                  href={`https://app.jobtread.com/jobs/${selectedTask?.job.id}/schedule?taskId=${selectedTask?.id}`}
                  target="_blank"
                  className="text-black hover:text-[#FFD400] transition-colors"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="text-sm text-black/60">ID: {selectedTask?.job.id}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
        <DialogContent className="sm:max-w-[800px] max-w-[90vw] w-full bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-black">Cash Flow Calendar Walkthrough</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/FEptwBb7IrM"
              title="Tutorial Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

