"use client"

import DashCard from "@/components/dash-card";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/context/auth-context";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SalesBlock4() {
    const { user } = useAuth();
    const { salesTarget, setSalesTarget, block4MonthlyMetrics } = useLeadsCount();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [newTarget, setNewTarget] = useState("");
    
    const currentMonth = new Date().getMonth();

    // Fetch sales target from Firestore
    useEffect(() => {
        async function fetchSalesTarget() {
            if (!user?.uid) return;

            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const userOrg = userDoc.data()?.org;

                if (userOrg) {
                    const orgDoc = await getDoc(doc(db, "orgs", userOrg));
                    const target = orgDoc.data()?.salesTarget || 0;
                    setSalesTarget(target);
                }
            } catch (error) {
                console.error("Error fetching sales target:", error);
            }
        }

        fetchSalesTarget();
    }, [user, setSalesTarget]);

    const handleSaveTarget = async () => {
        try {
            if (!user?.uid) return;

            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) return;

            const orgID = userDoc.data().org;
            if (!orgID) return;

            const targetValue = parseFloat(newTarget);
            if (isNaN(targetValue)) return;

            const orgRef = doc(db, 'orgs', orgID);
            const orgDoc = await getDoc(orgRef);
            
            if (!orgDoc.exists()) {
                await setDoc(orgRef, {
                    salesTarget: targetValue
                });
            } else {
                await updateDoc(orgRef, {
                    salesTarget: targetValue
                });
            }
            
            setSalesTarget(targetValue);
            setIsEditOpen(false);
        } catch (error) {
            console.error('Error updating sales target:', error);
        }
    };

    // Calculate target percentage
    const targetPercentage = salesTarget > 0 
        ? ((block4MonthlyMetrics[currentMonth]?.metrics.amountSum || 0) / salesTarget * 100).toFixed(1)
        : 0;

    return (
        <>
            <DashCard 
                title="Sales Target %" 
                description="this month" 
                content={`${targetPercentage}%`}
                footer={{
                    text: `$${salesTarget.toLocaleString()} sales target`,
                }}
                menuItems={[
                    {
                        label: "Edit Target",
                        onClick: () => {
                            setNewTarget(salesTarget.toString());
                            setIsEditOpen(true);
                        }
                    }
                ]}
            />

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Sales Target</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            type="number"
                            value={newTarget}
                            onChange={(e) => setNewTarget(e.target.value)}
                            placeholder="Enter sales target"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveTarget}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
} 