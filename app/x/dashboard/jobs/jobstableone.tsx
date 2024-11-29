import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activeJobs = [
    {
        id: 1,
        name: "Downtown Office Complex",
        location: "Downtown Dallas",
        projectType: "Commercial Repair",
        revenue: 45000,
        costs: 31500,
        status: "In Progress"
    },
    {
        id: 2,
        name: "Smith Residence",
        location: "Oak Cliff",
        projectType: "Residential Installation",
        revenue: 12500,
        costs: 8125,
        status: "In Progress"
    },
    {
        id: 3,
        name: "24/7 Grocery Store",
        location: "Lake Highlands",
        projectType: "Emergency Service",
        revenue: 8500,
        costs: 5525,
        status: "In Progress"
    },
    {
        id: 4,
        name: "Tech Plaza",
        location: "Richardson",
        projectType: "Maintenance",
        revenue: 15000,
        costs: 9750,
        status: "In Progress"
    },
    {
        id: 5,
        name: "Shopping Mall",
        location: "Arlington",
        projectType: "Commercial Install",
        revenue: 85000,
        costs: 59500,
        status: "In Progress"
    },
    {
        id: 6,
        name: "Corporate HQ",
        location: "Plano",
        projectType: "Inspection",
        revenue: 5500,
        costs: 3575,
        status: "In Progress"
    },
    {
        id: 7,
        name: "Medical Center",
        location: "North Dallas",
        projectType: "Emergency Repair",
        revenue: 22000,
        costs: 14300,
        status: "In Progress"
    },
    {
        id: 8,
        name: "Johnson Family Home",
        location: "Love Field",
        projectType: "Residential Service",
        revenue: 3500,
        costs: 2275,
        status: "In Progress"
    },
    {
        id: 9,
        name: "Restaurant Row",
        location: "East Dallas",
        projectType: "Commercial Service",
        revenue: 18500,
        costs: 12025,
        status: "In Progress"
    },
    {
        id: 10,
        name: "Office Park",
        location: "Las Colinas",
        projectType: "Installation",
        revenue: 65000,
        costs: 42250,
        status: "In Progress"
    },
    {
        id: 11,
        name: "Retail Center",
        location: "Frisco",
        projectType: "Maintenance",
        revenue: 25000,
        costs: 16250,
        status: "In Progress"
    },
    {
        id: 12,
        name: "Hotel Complex",
        location: "Fort Worth",
        projectType: "Emergency Call",
        revenue: 12500,
        costs: 8125,
        status: "In Progress"
    }
];

export default function JobTableOne() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Project Type</TableHead>
                            <TableHead className="text-right">Revenue</TableHead>
                            <TableHead className="text-right">Gross Profit</TableHead>
                            <TableHead className="text-right">Gross Profit %</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activeJobs.map((job) => {
                            const grossProfit = job.revenue - job.costs;
                            const grossProfitPercent = (grossProfit / job.revenue) * 100;
                            
                            return (
                                <TableRow key={job.id}>
                                    <TableCell className="font-medium">{job.name}</TableCell>
                                    <TableCell>{job.projectType}</TableCell>
                                    <TableCell className="text-right">
                                        ${job.revenue.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        ${grossProfit.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {grossProfitPercent.toFixed(1)}%
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
