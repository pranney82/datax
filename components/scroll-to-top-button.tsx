"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ScrollToTopButtonProps {
  scrollThreshold?: number
}

export function ScrollToTopButton({ scrollThreshold = 300 }: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false)

  const debounce = <T extends (...args: unknown[]) => void>(
    func: T,
    wait: number,
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null
    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  const toggleVisibility = useCallback(
    debounce(() => {
      if (window.pageYOffset > scrollThreshold) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }, 100),
    [scrollThreshold],
  )

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [toggleVisibility])

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

