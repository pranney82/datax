import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function DashCard({ title, description, content, footer }: { title: string, description: string, content: string, footer: string }) {
  return (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <h1 className="text-2xl font-bold">{content}</h1>
        </CardContent>
        <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {footer}
            </div>
          </div>
        </div>
        </CardFooter>
    </Card>
  )
}
