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
import { CalendarIcon, ChevronDown } from "lucide-react"
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
  const [selectedPreset, setSelectedPreset] = React.useState<string>("Today")
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
              {preset}
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
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
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
                setDate(newDate)
                if (isMobile && newDate?.from && newDate?.to) {
                  setIsPopoverOpen(false)
                }
              }}
              numberOfMonths={isMobile ? 1 : 2}
              className="max-w-[300px] sm:max-w-none"
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

