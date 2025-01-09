import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from 'lucide-react';
import CFDropdown from "@/components/cf-dropdown";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import LeadsBarOneQuery from './leadsbaronequery';

type ChartDataType = {
    month: string;
    [key: string]: string | number;
}

export default function ImprovedLeadsSourceChart() {
    const defaultData = [
        {month: "Jan", socialMedia: 10, googleAds: 20, Referral: 30, Direct: 40, Email: 50, Other: 60},
        {month: "Feb", socialMedia: 15, googleAds: 25, Referral: 35, Direct: 45, Email: 55, Other: 65},
        {month: "Mar", socialMedia: 20, googleAds: 30, Referral: 40, Direct: 50, Email: 60, Other: 70},
        {month: "Apr", socialMedia: 25, googleAds: 35, Referral: 45, Direct: 55, Email: 65, Other: 75},
        {month: "May", socialMedia: 30, googleAds: 40, Referral: 50, Direct: 60, Email: 70, Other: 80},
        {month: "Jun", socialMedia: 35, googleAds: 45, Referral: 55, Direct: 65, Email: 75, Other: 85},
        {month: "Jul", socialMedia: 40, googleAds: 50, Referral: 60, Direct: 70, Email: 80, Other: 90},
        {month: "Aug", socialMedia: 45, googleAds: 55, Referral: 65, Direct: 75, Email: 85, Other: 95},
        {month: "Sep", socialMedia: 50, googleAds: 60, Referral: 70, Direct: 80, Email: 90, Other: 100},
        {month: "Oct", socialMedia: 55, googleAds: 65, Referral: 75, Direct: 85, Email: 95, Other: 105},
        {month: "Nov", socialMedia: 60, googleAds: 70, Referral: 80, Direct: 90, Email: 100, Other: 110},
        {month: "Dec", socialMedia: 65, googleAds: 75, Referral: 85, Direct: 95, Email: 105, Other: 115},
    ];

    const [isCustomFieldOpen, setIsCustomFieldOpen] = useState(false);
    const [selectedField, setSelectedField] = useState("");
    const [selectedFieldName, setSelectedFieldName] = useState("");
    const [chartData, setChartData] = useState<ChartDataType[]>(defaultData as ChartDataType[]);
    
    const { queryResult, isLoading } = LeadsBarOneQuery({ selectedField });

    useEffect(() => {
        if (!isLoading && queryResult?.organization?.customFields?.nodes?.[0]?.customFieldValues?.processedData) {
            const processedData: ChartDataType[] = queryResult.organization.customFields.nodes[0].customFieldValues.processedData;
            setChartData(processedData);
        }
    }, [queryResult, isLoading]);

    useEffect(() => {
        const fetchSavedCustomField = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) return;

                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (!userDoc.exists()) return;

                const org = userDoc.data().org;
                if (!org) return;

                const orgDoc = await getDoc(doc(db, 'orgs', org));
                if (!orgDoc.exists()) return;

                const { leadsbarcfv, leadsbarcfvName } = orgDoc.data();
                
                if (leadsbarcfv && leadsbarcfvName) {
                    setSelectedField(leadsbarcfv);
                    setSelectedFieldName(leadsbarcfvName);
                }
            } catch (error) {
                console.error('Error fetching saved custom field:', error);
            }
        };

        fetchSavedCustomField();
    }, []);

    const handleSaveCustomField = async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (!userDoc.exists()) return;

            const org = userDoc.data().org;
            if (!org) return;

            if (!selectedField) return;

            const updateData = {
                leadsbarcfv: selectedField,
                leadsbarcfvName: selectedFieldName
            };
            
            await updateDoc(doc(db, 'orgs', org), updateData);
            setIsCustomFieldOpen(false);
        } catch (error) {
            console.error('Error saving custom field:', error);
        }
    };
    
    const legendColors = ['#FFD400', '#FF6B6B', '#4ECDC4', '#45B7D1'];

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{selectedFieldName || "select custom field, preferably Lead Source"}</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsCustomFieldOpen(true)}>
                                Select Custom Field
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#333333' }} tickLine={{ stroke: '#9CA3AF' }} />
                            <YAxis stroke="#9CA3AF" tick={{ fill: '#333333' }} tickLine={{ stroke: '#9CA3AF' }} />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                }}
                                labelStyle={{ fontWeight: 'bold', color: '#333' }}
                            />
                            <Legend 
                                wrapperStyle={{ paddingTop: '20px' }}
                                payload={
                                    Object.keys(chartData[0] || {})
                                        .filter(key => key !== 'month')
                                        .map((key, index) => ({
                                            value: key,
                                            type: 'rect',
                                            color: legendColors[index % legendColors.length],
                                        }))
                                }
                            />
                            {Object.keys(chartData[0] || {})
                                .filter(key => key !== 'month')
                                .map((key, index) => (
                                    <Bar 
                                        key={key}
                                        dataKey={key}
                                        stackId="a"
                                        fill={legendColors[index % legendColors.length]}
                                        fillOpacity={0.6}
                                    />
                                ))}
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

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
        </>
    );
}

