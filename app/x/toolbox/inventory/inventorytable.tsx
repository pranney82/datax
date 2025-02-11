"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function InventoryTable() {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Table content will be populated when query is provided */}
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground h-32">
              Inventory data will be displayed here once the query is implemented
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}