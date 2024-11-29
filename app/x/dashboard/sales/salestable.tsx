import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  import { Avatar, AvatarFallback } from "@/components/ui/avatar"
  
  const salesReps = [
    {
      id: 1,
      name: "Sarah Johnson",
      leadsAssigned: 245,
      leadsClosed: 82,
      revenue: 4850000,
      avgDealSize: 59146,
      conversionRate: 33.5,
      activeDeals: 15,
    },
    {
      id: 2,
      name: "Michael Chen",
      leadsAssigned: 218,
      leadsClosed: 65,
      revenue: 3900000,
      avgDealSize: 60000,
      conversionRate: 29.8,
      activeDeals: 12,
    },
    {
      id: 3,
      name: "Alex Rodriguez",
      leadsAssigned: 196,
      leadsClosed: 71,
      revenue: 4200000,
      avgDealSize: 59155,
      conversionRate: 36.2,
      activeDeals: 18,
    },
  ]
  
  export default function SalesTable() {
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }
  
    const formatPercent = (value: number) => {
      return `${value.toFixed(1)}%`
    }
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Rep Performance (YTD)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rep</TableHead>
                <TableHead className="text-right">Leads Assigned</TableHead>
                <TableHead className="text-right">Leads Closed</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Avg Deal Size</TableHead>
                <TableHead className="text-right">Conv. Rate</TableHead>
                <TableHead className="text-right">Active Deals</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesReps.map((rep) => (
                <TableRow key={rep.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{rep.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {rep.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{rep.leadsAssigned}</TableCell>
                  <TableCell className="text-right">{rep.leadsClosed}</TableCell>
                  <TableCell className="text-right">{formatCurrency(rep.revenue)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(rep.avgDealSize)}</TableCell>
                  <TableCell className="text-right">{formatPercent(rep.conversionRate)}</TableCell>
                  <TableCell className="text-right">{rep.activeDeals}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }