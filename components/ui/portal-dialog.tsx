import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import { Button } from "./button"

interface PortalDialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  showClose?: boolean
}

export function PortalDialog({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  showClose = true
}: PortalDialogProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-[90vw] relative ${className}`}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        )}
        {showClose && (
          <Button
            className="absolute top-2 right-2"
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            ×
          </Button>
        )}
        {children}
      </div>
    </div>,
    document.body
  )
} 