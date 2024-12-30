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
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
    
interface MenuItem {
    label: string;
    onClick: () => void;
}

interface DashCardProps {
    title: string
    description: string
    content?: string
    children?: ReactNode
    footer?: string
    menuItems?: MenuItem[]
}

export default function DashCard({ title, description, content, children, footer, menuItems }: DashCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                {menuItems && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
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
            </CardHeader>
            <CardContent>
                {content ? (
                    <div className="text-2xl font-bold">{content}</div>
                ) : children}
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            <CardDescription>{footer}</CardDescription>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
