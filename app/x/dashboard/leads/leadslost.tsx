"use client"

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import CFDropdown from "@/components/cf-dropdown";
import LeadsLostQuery from "./leadsLostQuery";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { MoreVertical } from 'lucide-react';

export default function LeadsLost() {
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
        } catch (error) {
            console.error('Error saving custom field:', error);
        }
    };

    const colors = [
      'rgba(255, 212, 0, 0.7)',   // #FFD400 with opacity
      'rgba(255, 107, 107, 0.7)', // #FF6B6B with opacity
      'rgba(78, 205, 196, 0.7)',  // #4ECDC4 with opacity
      'rgba(69, 183, 209, 0.7)',  // #45B7D1 with opacity
      'rgba(255, 160, 122, 0.7)', // #FFA07A with opacity
      'rgba(32, 178, 170, 0.7)',  // #20B2AA with opacity
      'rgba(147, 112, 219, 0.7)', // #9370DB with opacity
      'rgba(60, 179, 113, 0.7)'   // #3CB371 with opacity
    ];

    return (
        <Card className="w-full h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-m sm:text-base md:text-lg text-gray-800 dark:text-gray-100">
                    {selectedFieldName || "Select custom field, preferably Lead Lost Reason"}
                </CardTitle>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="More options">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
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
                            <Button variant="outline" onClick={() => {}}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveCustomField}>
                                Save
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="flex-grow p-1 sm:p-2 md:p-4 overflow-x-auto overflow-y-hidden">
                <ChartContainer
                    config={{
                        count: {
                            label: "Count",
                            color: "rgba(255, 212, 0, 0.7)", // Updated to match the first color with opacity
                        },
                    }}
                    className="w-full h-full"
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 5, bottom: 15 }}
                        >
                            <XAxis 
                                type="number"
                                tick={{ fontSize: 14, fill: "#333333" }}
                            />
                            <YAxis 
                                type="category" 
                                dataKey="reason" 
                                width={120}
                                tick={{ fontSize: 14, fill: "#333333" }}
                                tickFormatter={(value) => value.length > 30 ? `${value.substring(0, 30)}` : value}
                            />
                            <ChartTooltip 
                                content={
                                    <ChartTooltipContent 
                                        labelClassName="text-sm sm:text-m"
                                    />
                                } 
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                                <LabelList 
                                    dataKey="count" 
                                    position="insideRight" 
                                    fill="#000000" 
                                    fontSize={12}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

