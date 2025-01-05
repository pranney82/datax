import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";
import { querySales, queryCustomFieldOptions } from "./salesquery";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { useAuth } from "@/lib/context/auth-context";
import CFDropdown from "@/components/cf-dropdown";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Payload } from 'recharts/types/component/DefaultLegendContent';

// Define consistent colors for the chart
const COLORS: { [key: string]: string } = {
    // Primary colors from leadsbarone.tsx
    color1: '#8884d8',
    color2: '#82ca9d',
    color3: '#ffc658',
    color4: '#ff7300',
    color5: '#0088fe',
    color6: '#00C49F',
    color7: '#ff84d8',
    color8: '#82ceff',
    color9: '#ffc000',
    color10: '#ff0000',
    color11: '#0000fe',
    color12: '#00FF9F'
};

interface MonthlyData {
    month: string;
    [key: string]: number | string;
}

interface DateRange {
    monthDates: string[];
}

const fetchCustomFieldOptions = async (orgID: string, grantKey: string, cfID: string) => {
    try {
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
                        cfID
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
        const options = result?.organization?.customFields?.nodes?.[0]?.options || [];
        console.log('Extracted options:', options);
        return options;
    } catch (error) {
        console.error('Error fetching custom field options:', error);
        return [];
    }
};

const fetchSalesData = async (orgID: string, grantKey: string, cfName3: string, cfID: string, startDate: string, endDate: string) => {
    try {
        const query = {
            "$": { "grantKey": grantKey },
            ...querySales({ 
                orgID,
                cfName3,
                cfID,
                startDate,
                endDate
            })
        };
        
        console.log('Sending query for:', {
            cfName3,
            startDate,
            endDate,
            fullQuery: JSON.stringify(query, null, 2)
        });
        
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
        console.log('Sales data result:', result);
        return result;
    } catch (error) {
        console.error('Error fetching sales data:', error);
        return null;
    }
};

const getLastDayOfMonth = (dateString: string) => {
    const [year, month] = dateString.split('-').map(num => parseInt(num));
    // Create date for first day of next month, then subtract one day
    const lastDay = new Date(Date.UTC(year, month, 0));
    return lastDay.toISOString().split('T')[0];
};

const processQueryResultForChart = (results: Array<{
    result: any,
    option: string,
    startDate: string
}>): MonthlyData[] => {
    console.log('Processing query results:', results);
    
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTotals: { [key: string]: { [value: string]: number } } = {};
    
    // Initialize all months with 0 for all options
    const uniqueOptions = Array.from(new Set(results.map(r => r.option)));
    monthOrder.forEach(month => {
        monthlyTotals[month] = {};
        uniqueOptions.forEach(option => {
            monthlyTotals[month][option] = 0;
        });
    });

    // Process each result
    results.forEach(({ result, option, startDate }) => {
        const month = new Date(startDate).toLocaleString('default', { month: 'short' });
        const amount = result?.scope?.connection?.["Amount:sum"] || 0;

        console.log(`Processing result for ${option} in ${month}:`, { amount });

        if (monthlyTotals[month]) {
            monthlyTotals[month][option] = amount;
        }
    });

    // Convert to chart format and sort
    return Object.entries(monthlyTotals)
        .map(([month, values]) => ({
            month,
            ...values
        }))
        .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
};

export default function RevenueBySourceChart() {
    const { dateRange } = useLeadsCount();
    console.log('Date range:', dateRange);
    const { user } = useAuth();
    const [queryResult, setQueryResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCustomFieldOpen, setIsCustomFieldOpen] = useState(false);
    const [selectedField, setSelectedField] = useState("");
    const [selectedFieldName, setSelectedFieldName] = useState("");
    const [hiddenSeries, setHiddenSeries] = useState<{ [key: string]: boolean }>({});
    const [chartData, setChartData] = useState<any[]>([]);

    // Handle saving custom field selection
    const handleSaveCustomField = async () => {
        if (!user?.uid) return;

        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const org = userDoc.data()?.org;
            if (!org) return;

            await updateDoc(doc(db, 'orgs', org), {
                salescfv: selectedField,
                salescfvName: selectedFieldName
            });

            setIsCustomFieldOpen(false);
        } catch (error) {
            console.error('Error saving custom field:', error);
        }
    };

    // Fetch saved custom field on mount
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

                const { salescfv, salescfvName } = orgDoc.data();
                
                if (salescfv && salescfvName) {
                    setSelectedField(salescfv);
                    setSelectedFieldName(salescfvName);
                }
            } catch (error) {
                console.error('Error fetching saved custom field:', error);
            }
        };

        fetchSavedCustomField();
    }, [user]);

    // Fetch sales data when custom field or date range changes
    useEffect(() => {
        const fetchData = async () => {
            if (!selectedField) {
                console.log('No selected field, skipping fetch');
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

                console.log('Fetching with:', { orgID, grantKey, selectedField, dateRange });

                if (orgID && grantKey) {
                    const options = await fetchCustomFieldOptions(orgID, grantKey, selectedField);
                    console.log('Got options:', options);

                    // Create an array of all month queries we need to make
                    const allQueries = options.flatMap((option: any) => {
                        const monthQueries = dateRange.monthDates.map(startDate => {
                            const query = {
                                option,
                                startDate,
                                endDate: getLastDayOfMonth(startDate)
                            };
                            console.log('Prepared query:', query);
                            return query;
                        });
                        return monthQueries;
                    });

                    console.log('All prepared queries:', allQueries);

                    // Fetch data for each option and month combination
                    const allResults = await Promise.all(
                        allQueries.map((query: any) => 
                            fetchSalesData(
                                orgID,
                                grantKey,
                                query.option,
                                selectedField,
                                query.startDate,
                                query.endDate
                            )
                        )
                    );

                    // Process the results, now including metadata about which option and month each result is for
                    const processedData = processQueryResultForChart(
                        allResults.map((result, index) => ({
                            result,
                            option: allQueries[index].option,
                            startDate: allQueries[index].startDate
                        }))
                    );

                    console.log('Setting chart data:', processedData);
                    setChartData(processedData);
                }
            } catch (error) {
                console.error('Error in RevenueBySourceChart:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selectedField, dateRange]);

    console.log('Rendering with chartData:', chartData);

    // Add type-safe legend click handler
    const handleLegendClick = (data: Payload) => {
        setHiddenSeries(prev => ({
            ...prev,
            [data.dataKey as string]: !prev[data.dataKey as string]
        }));
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Revenue by Lead Source</CardTitle>
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
                {!selectedField ? (
                    <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                        Please select a custom field from the menu to view the chart
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis 
                                tickFormatter={(value) => `$${(value / 1000)}k`}
                            />
                            <Tooltip 
                                formatter={(value, name) => [
                                    `$${value.toLocaleString()}`, // Value formatting
                                    name as string // Name of the series
                                ]}
                            />
                            <Legend 
                                onClick={handleLegendClick}
                            />
                            {Object.entries(chartData[0] || {})
                                .filter(([key]) => {
                                    if (key === 'month') return false;
                                    return chartData.some(data => data[key] > 0);
                                })
                                .map(([key], index) => (
                                    <Area
                                        key={key}
                                        type="monotone"
                                        dataKey={key}
                                        stackId="1"
                                        stroke={Object.values(COLORS)[index % Object.values(COLORS).length]}
                                        fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
                                        hide={hiddenSeries[key]}
                                    />
                                ))}
                        </AreaChart>
                    </ResponsiveContainer>
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
                            onFieldsLoad={(fields) => {
                                console.log('Fields loaded in RevenueBySourceChart:', fields);
                                if (!selectedField && fields.length > 0) {
                                    console.log('Auto-selecting first field:', fields[0]);
                                    setSelectedField(fields[0].id);
                                    setSelectedFieldName(fields[0].name);
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
