import { useEffect, useState, useCallback } from "react";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";
import { useAuth } from "@/lib/context/auth-context";
import { querySalesReps, queryCustomFieldOptions } from "./salesquery";
import CFDropdown from "@/components/cf-dropdown";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface SalesRep {
    name: string;
    leadsAssigned: number;
    leadsClosed: number;
    revenue: number;
    avgDealSize: number;
    conversionRate: number;
    activeDeals: number;
}

interface JobDocument {
    type: string;
    status: string;
    priceWithTax: number;
}

interface Job {
    id: string;
    approvedCustomerOrders: JobDocument;
    pendingCustomerOrders: JobDocument;
}

interface SalesData {
    scope?: {
        connection?: {
            withValues?: Job[];
        };
    };
}

// Add this fetch function
const fetchSalesRepsData = async (orgID: string, grantKey: string, cfName3: string, cfID: string, startDate: string, endDate: string) => {
    try {
        console.log('Fetching sales reps data with params:', { orgID, cfName3, cfID, startDate, endDate });
        
        const query = {
            "$": { "grantKey": grantKey },
            ...querySalesReps({ 
                orgID,
                cfID,
                cfName3,
                startDate,
                endDate
            })
        };
        
        const response = await fetch('/api/jtfetch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Sales reps data result:', result);
        return result;
    } catch (error) {
        console.error('Error fetching sales reps data:', error);
        return null;
    }
};

export default function SalesTable() {
    const { dateRange } = useLeadsCount();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedField, setSelectedField] = useState("");
    const [selectedFieldName, setSelectedFieldName] = useState("");
    const [isCustomFieldOpen, setIsCustomFieldOpen] = useState(false);
    const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
    const [, setOptions] = useState<string[]>([]);
    
    // Wrap fetchSalesData in useCallback
    const fetchSalesData = useCallback(async (field: string, fieldName: string, fieldOptions: string[]) => {
        if (!field || fieldOptions.length === 0) {
            console.log('No selected field or options, skipping fetch:', { field, optionsLength: fieldOptions.length });
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                console.log('No current user');
                return;
            }

            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (!userDoc.exists()) {
                console.log('No user doc');
                return;
            }

            const org = userDoc.data().org;
            if (!org) {
                console.log('No org');
                return;
            }

            const orgDoc = await getDoc(doc(db, 'orgs', org));
            const orgID = orgDoc.data()?.orgID;
            const grantKey = orgDoc.data()?.grantKey;

            console.log('Fetching sales reps with:', { orgID, grantKey, field, fieldOptions, dateRange });

            const salesData = await Promise.all(
                fieldOptions.map((option: string) => {
                    console.log('Fetching data for option:', option);
                    return fetchSalesRepsData(
                        orgID,
                        grantKey,
                        option,
                        field,
                        dateRange.monthDates[0],
                        dateRange.monthDates[dateRange.monthDates.length - 1]
                    );
                })
            );

            console.log('Raw sales data results:', salesData);

            const processedData = salesData.map((data: SalesData, index) => {
                const option = fieldOptions[index];
                const jobs = data?.scope?.connection?.withValues || [];
                console.log(`Processing data for ${option}:`, {
                    totalJobs: jobs.length,
                    approvedJobs: jobs.filter((job: Job) => job.approvedCustomerOrders?.priceWithTax > 0).length,
                    pendingJobs: jobs.filter((job: Job) => job.pendingCustomerOrders?.priceWithTax > 0).length
                });

                const totalCount = jobs.length;
                const approvedJobs = jobs.filter((job: Job) => job.approvedCustomerOrders?.priceWithTax > 0);
                const totalRevenue = approvedJobs.reduce((sum: number, job: Job) => 
                    sum + (job.approvedCustomerOrders?.priceWithTax || 0), 0);
                
                return {
                    name: option,
                    leadsAssigned: totalCount,
                    leadsClosed: approvedJobs.length,
                    revenue: totalRevenue,
                    avgDealSize: approvedJobs.length ? totalRevenue / approvedJobs.length : 0,
                    conversionRate: totalCount ? (approvedJobs.length / totalCount) * 100 : 0,
                    activeDeals: jobs.filter((job: Job) => job.pendingCustomerOrders?.priceWithTax > 0).length
                };
            });

            console.log('Final processed data:', processedData);
            setSalesReps(processedData);
        } catch (error) {
            console.error('Error fetching sales data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [dateRange]); // Add dependencies used inside fetchSalesData

    // Update useEffect dependency array
    useEffect(() => {
        const fetchSavedCustomField = async () => {
            try {
                if (!user?.uid) return;

                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (!userDoc.exists()) return;

                const org = userDoc.data().org;
                if (!org) return;

                const orgDoc = await getDoc(doc(db, 'orgs', org));
                if (!orgDoc.exists()) return;

                const { salestablecfv, salestablecfvName } = orgDoc.data();
                const orgID = orgDoc.data()?.orgID;
                const grantKey = orgDoc.data()?.grantKey;
                
                if (salestablecfv && salestablecfvName && orgID && grantKey) {
                    console.log('Found saved custom field:', { salestablecfv, salestablecfvName });
                    setSelectedField(salestablecfv);
                    setSelectedFieldName(salestablecfvName);
                    
                    // Fetch options using queryCustomFieldOptions
                    const response = await fetch('/api/jtfetch', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            query: {
                                "$": { "grantKey": grantKey },
                                ...queryCustomFieldOptions({ 
                                    orgID,
                                    cfID: salestablecfv
                                })
                            }
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    console.log('Custom field options result:', result);
                    
                    // Extract options from the result
                    const fieldOptions = result?.organization?.customFields?.nodes?.[0]?.options || [];
                    console.log('Setting options from saved field:', fieldOptions);
                    setOptions(fieldOptions);

                    // Fetch sales data immediately if saved field is found
                    fetchSalesData(salestablecfv, salestablecfvName, fieldOptions);
                }
            } catch (error) {
                console.error('Error fetching saved custom field:', error);
            }
        };

        fetchSavedCustomField();
    }, [user]); // Remove fetchSalesData from dependencies

    // Handle saving custom field selection
    const handleSaveCustomField = async () => {
        if (!user?.uid) return;

        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const org = userDoc.data()?.org;
            if (!org) return;

            await updateDoc(doc(db, 'orgs', org), {
                salestablecfv: selectedField,
                salestablecfvName: selectedFieldName
            });

            setIsCustomFieldOpen(false);
        } catch (error) {
            console.error('Error saving custom field:', error);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{selectedFieldName || "Select Custom Field for Sales Reps"}</CardTitle>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setIsCustomFieldOpen(true)}>
                            Select Custom Field
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                        Loading...
                    </div>
                ) : !selectedField ? (
                    <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                        Please select a custom field from the menu to view the data
                    </div>
                ) : (
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
                                <TableRow key={rep.name}>
                                    <TableCell className="font-medium">
                                        {rep.name}
                                    </TableCell>
                                    <TableCell className="text-right">{rep.leadsAssigned}</TableCell>
                                    <TableCell className="text-right">{rep.leadsClosed}</TableCell>
                                    <TableCell className="text-right">
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(rep.revenue)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(rep.avgDealSize)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {rep.conversionRate.toFixed(1)}%
                                    </TableCell>
                                    <TableCell className="text-right">{rep.activeDeals}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            <Dialog open={isCustomFieldOpen} onOpenChange={setIsCustomFieldOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select Custom Field</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <CFDropdown
                            value={selectedField}
                            onChange={(value, name) => {
                                setSelectedField(value);
                                setSelectedFieldName(name || '');
                            }}
                            targetType="job"
                            onFieldsLoad={(fields: { id: string; name: string; options?: string[] }[]) => {
                                console.log('Fields loaded in SalesTable:', fields);
                                if (!selectedField && fields.length > 0) {
                                    console.log('Auto-selecting first field:', fields[0]);
                                    setSelectedField(fields[0].id);
                                    setSelectedFieldName(fields[0].name);
                                    const fieldOptions = fields[0].options || [];
                                    console.log('Setting options:', fieldOptions);
                                    setOptions(fieldOptions);
                                }
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCustomFieldOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveCustomField}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}