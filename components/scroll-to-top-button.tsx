"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"

function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
interface ScrollToTopButtonProps {
  scrollThreshold?: number
  excludePaths?: string[]
}

export function ScrollToTopButton({ scrollThreshold = 300, excludePaths = ["/x"] }: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()


  // Check if the current path should exclude the button
  const shouldExclude = useCallback(() => {
    return excludePaths.some((path) => pathname.startsWith(path))
  }, [pathname, excludePaths])

  const toggleVisibility = useCallback(() => {

    if (window.pageYOffset > scrollThreshold) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [scrollThreshold])

  const debouncedToggleVisibility = useCallback(
    debounce(toggleVisibility, 100),
    [toggleVisibility],
  )

  useEffect(() => {
    if (shouldExclude()) return

    window.addEventListener("scroll", debouncedToggleVisibility)
    return () => window.removeEventListener("scroll", debouncedToggleVisibility)
  }, [debouncedToggleVisibility, shouldExclude])

  // Don't render the button if we're on an excluded path
  if (shouldExclude()) {
    return null
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={`fixed bottom-4 right-4 p-2 rounded-full shadow-lg transition-opacity duration-300 bg-primary hover:bg-primary/90 z-50 ${
              isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Scroll to top</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

