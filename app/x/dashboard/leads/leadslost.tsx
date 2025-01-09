"use client"

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import CFDropdown from "@/components/cf-dropdown";
import LeadsLostQuery from "./leadsLostQuery";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function LeadsLost() {
    const [isCustomFieldOpen, setIsCustomFieldOpen] = useState(false);
    const [selectedField, setSelectedField] = useState("");
    const [selectedFieldName, setSelectedFieldName] = useState("");
    
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

                const { leadslostcfv, leadslostcfvName } = orgDoc.data();
                
                if (leadslostcfv && leadslostcfvName) {
                    setSelectedField(leadslostcfv);
                    setSelectedFieldName(leadslostcfvName);
                }
            } catch (error) {
                console.error('Error fetching saved custom field:', error);
            }
        };

        fetchSavedCustomField();
    }, []);

    const { queryResult } = LeadsLostQuery({ selectedField });
    const data = queryResult?.organization?.customFields?.nodes?.[0]?.customFieldValues?.processedData || [];

    const handleSaveCustomField = async () => {
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
                console.log('No org found');
                return;
            }

            const updateData = {
                leadslostcfv: selectedField,
                leadslostcfvName: selectedFieldName
            };
            
            await updateDoc(doc(db, 'orgs', org), updateData);
            setIsCustomFieldOpen(false);
        } catch (error) {
            console.error('Error saving custom field:', error);
        }
    };

    return (
        <Card className="w-full h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between flex-shrink-0 p-4 sm:p-6">
                <div className="w-full pr-4">
                    <CardTitle className="text-base sm:text-lg md:text-l truncate">
                        {selectedFieldName || "Select custom field, preferably Lead Lost Reason"}
                    </CardTitle>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
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
            <CardContent className="flex-grow p-2 sm:p-4">
                <ChartContainer
                    config={{
                        count: {
                            label: "Count",
                            color: "#ffd400",
                        },
                    }}
                    className="w-full h-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                type="number"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis 
                                type="category" 
                                dataKey="reason" 
                                width={80}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                            />
                            <ChartTooltip 
                                content={
                                    <ChartTooltipContent 
                                        labelClassName="text-xs sm:text-sm"
                                        valueClassName="text-xs sm:text-sm"
                                    />
                                } 
                            />
                            <Legend 
                                wrapperStyle={{ fontSize: '12px' }}
                            />
                            <Bar dataKey="count" fill="#ffd400" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>

            <Dialog open={isCustomFieldOpen} onOpenChange={setIsCustomFieldOpen}>
                <DialogContent className="sm:max-w-[425px]">
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
        </Card>
    );
}

