import { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface DashCardProps {
  title: string
  description?: string
  content?: string | ReactNode
  subContent?: string
  children?: ReactNode
  footer?: {
    text: string
    trend?: 'up' | 'down'
    value?: string
  }
  menuItems?: MenuItem[]
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  loading?: boolean
  accentColor?: string
  icon?: ReactNode
}

export default function ModernDashboardCard({
  title,
  description,
  content,
  subContent,
  children,
  footer,
  menuItems,
  badge,
  loading = false,
  accentColor = 'bg-black',
  icon
}: DashCardProps) {
  if (loading) {
    return (
      <Card className="overflow-hidden shadow-sm">
        <div className="h-0.5 w-full bg-gray-200" />
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-4 w-full" />
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md shadow-sm">
      <div className={`h-0.5 w-full ${accentColor}`} />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {menuItems && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {menuItems.map((item, index) => (
                  <DropdownMenuItem key={index} onClick={item.onClick}>
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col space-y-4 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="w-full">
            {typeof content === 'string' ? (
              <div className="text-3xl font-extrabold text-black tracking-tight">{content}</div>
            ) : (
              <div className="w-full">{content}</div>
            )}

            {subContent && (
              <div className="text-sm text-muted-foreground">{subContent}</div>
            )}
          </div>
          {icon && (
            <div className={`flex h-16 w-16 items-center justify-center rounded-full ${accentColor} p-3 text-white transition-transform group-hover:scale-110`}>
              {icon}
            </div>
          )}
        </div>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
        {children}
      </CardContent>
      {(footer || badge) && (
        <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-6 py-3 mt-auto">
          {footer && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">{footer.text}</span>
              {footer.trend && footer.value && (
                <div className={`flex items-center gap-1 font-medium ${
                  footer.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    {footer.trend === 'up' ? (
                      <path d="M18 15l-6-6-6 6" />
                    ) : (
                      <path d="M6 9l6 6 6-6" />
                    )}
                  </svg>
                  {footer.value}
                </div>
              )}
            </div>
          )}
          {badge && (
            <Badge variant={badge.variant} className="px-2 py-1">
              {badge.text}
            </Badge>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

