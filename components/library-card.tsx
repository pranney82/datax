import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "./ui/button"
import Link from "next/link"
import { Download } from "lucide-react"

export default function LibraryCard({ id, title, badge, content, footer, downloadCount }: {
    id: string,
    title: string,
    badge: string,
    content: string,
    footer: string,
    downloadCount?: number
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between">
                    {title}
                    <div className="flex items-center gap-2">
                        {downloadCount} <Download />
                    </div>
                </CardTitle>
                <CardDescription>
                    <Badge variant="secondary">{badge}</Badge>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>{content}</p>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Link href={`/library/templates/${id}`}><Button variant="outline">Read More</Button></Link>
                <Link href={`/library/templates/${id}`}><Button>Download</Button></Link>
            </CardFooter>
        </Card>
    )
}
