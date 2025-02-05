"use client"

import * as React from "react"
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  sub,
} from "date-fns"
import { CalendarIcon, ChevronDown, Loader2, Check } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    window.addEventListener("resize", listener)
    return () => window.removeEventListener("resize", listener)
  }, [matches, query])

  return matches
}

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <DatePickerWithRange />
    </div>
  )
}

export function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  })
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [selectedPreset, setSelectedPreset] = React.useState<string>("This Month")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSelectingEndDate, setIsSelectingEndDate] = React.useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")

  const presets: { [key: string]: DateRange | null } = {
    "All Time": {
      from: new Date(2000, 0, 1),
      to: new Date(),
    },
    "Custom Date Range": {
      from: new Date(),
      to: new Date(),
    },
    Today: {
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    },
    Yesterday: {
      from: startOfDay(sub(new Date(), { days: 1 })),
      to: endOfDay(sub(new Date(), { days: 1 })),
    },
    "This Week": {
      from: startOfWeek(new Date()),
      to: endOfWeek(new Date()),
    },
    "Last Week": {
      from: startOfWeek(sub(new Date(), { weeks: 1 })),
      to: endOfWeek(sub(new Date(), { weeks: 1 })),
    },
    "This Month": {
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    },
    "Last Month": {
      from: startOfMonth(sub(new Date(), { months: 1 })),
      to: endOfMonth(sub(new Date(), { months: 1 })),
    },
    "This Quarter": {
      from: startOfQuarter(new Date()),
      to: endOfQuarter(new Date()),
    },
    "Last Quarter": {
      from: startOfQuarter(sub(new Date(), { months: 3 })),
      to: endOfQuarter(sub(new Date(), { months: 3 })),
    },
    "This Year": {
      from: startOfYear(new Date()),
      to: endOfYear(new Date()),
    },
    "Last Year": {
      from: startOfYear(sub(new Date(), { years: 1 })),
      to: endOfYear(sub(new Date(), { years: 1 })),
    },
  }

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset)
    if (presets[preset]) {
      setDate(presets[preset])
    }
  }

  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            {selectedPreset}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          {Object.keys(presets).map((preset) => (
            <DropdownMenuItem key={preset} onSelect={() => handlePresetChange(preset)}>
              {selectedPreset === preset && <Check className="mr-2 h-4 w-4" />}
              <span className={cn(selectedPreset === preset && "font-medium")}>{preset}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedPreset === "Custom Date Range" && (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
              disabled={isLoading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </span>
              ) : date?.from ? (
                date.to ? (
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{format(date.from, "LLL dd, yyyy")}</span>
                    <span className="mx-2 text-muted-foreground">to</span>
                    <span className="text-sm font-medium">{format(date.to, "LLL dd, yyyy")}</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{format(date.from, "LLL dd, yyyy")}</span>
                    <span className="mx-2 text-muted-foreground">to</span>
                    <span className="text-sm font-medium">Pick end date</span>
                  </div>
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align={isMobile ? "center" : "start"}>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(newDate) => {
                setIsLoading(true)
                if (newDate?.from) {
                  if (!isSelectingEndDate) {
                    setDate({ from: newDate.from, to: undefined })
                    setIsSelectingEndDate(true)
                  } else if (newDate.to) {
                    setDate({ from: date?.from as Date, to: newDate.to })
                    setIsSelectingEndDate(false)
                    setIsPopoverOpen(false)
                    setIsLoading(false)
                  }
                } else {
                  setDate(undefined)
                  setIsSelectingEndDate(false)
                }
                setIsLoading(false)
              }}
              numberOfMonths={isMobile ? 1 : 2}
              className={cn("max-w-[300px] sm:max-w-none", isMobile && "max-w-[280px]")}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

