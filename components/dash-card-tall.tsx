import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  

export default function DashCardTall({ title, description }: { title: string, description: string }) {
  return (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Current</TableHead>
                    <TableHead>Goal</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>                                     
                    <TableRow>
                        <TableCell>Revenue</TableCell>
                        <TableCell>$900,000.00</TableCell>
                        <TableCell>$1,000,000.00</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Rev Per Employee</TableCell>
                        <TableCell>$90,000.00</TableCell>
                        <TableCell>$100,000.00</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Active Projects</TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>12</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Total Estimates</TableCell>
                        <TableCell>28</TableCell>
                        <TableCell>30</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Approved Estimates</TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>12</TableCell>
                    </TableRow>   
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  )
}
