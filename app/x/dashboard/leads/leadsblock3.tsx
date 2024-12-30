import DashCard from "@/components/dash-card";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";
import { docsDataQuery } from "./query";

export function LeadsBlock3() {
    const [marketingBudget, setMarketingBudget] = useState(0);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [newBudget, setNewBudget] = useState("");
    const { block3MonthlyLeads } = useLeadsCount();

    const thisMonthLeads = block3MonthlyLeads.length > 0 ? block3MonthlyLeads[block3MonthlyLeads.length - 1].count : 0;
    
    
    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) return;

                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (!userDoc.exists()) return;

                const org = userDoc.data().org;
                if (!org) return;

                // Get org document using the orgID
                const orgDoc = await getDoc(doc(db, 'orgs', org));
                if (orgDoc.exists()) {
                    setMarketingBudget(orgDoc.data()?.monthlyMarketingBudget ?? 0);
                }

            } catch (error) {
                console.error('Error fetching marketing budget:', error);
            }
        };

        fetchBudget();
    }, []);

    const handleSaveBudget = async () => {
        console.log('Saving budget:', newBudget);
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                console.log('No current user');
                return;
            }

            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (!userDoc.exists()) {
                console.log('User doc not found');
                return;
            }

            const orgID = userDoc.data().org;
            if (!orgID) {
                console.log('No orgID found');
                return;
            }

            const budgetValue = parseFloat(newBudget);
            if (isNaN(budgetValue)) {
                console.log('Invalid budget value');
                return;
            }

            const orgRef = doc(db, 'orgs', orgID);
            const orgDoc = await getDoc(orgRef);
            
            if (!orgDoc.exists()) {
                // Create new org document if it doesn't exist
                await setDoc(orgRef, {
                    monthlyMarketingBudget: budgetValue
                });
            } else {
                // Update existing document
                await updateDoc(orgRef, {
                    monthlyMarketingBudget: budgetValue
                });
            }
            
            setMarketingBudget(budgetValue);
            setIsEditOpen(false);
            console.log('Budget saved successfully');
        } catch (error) {
            console.error('Error updating marketing budget:', error);
        }
    };

    const menuItems = [
        {
            label: "Edit",
            onClick: () => {
                setNewBudget(marketingBudget.toString());
                setIsEditOpen(true);
            }
        }
    ];

    const averageLeadCost = thisMonthLeads > 0 ? marketingBudget / thisMonthLeads : marketingBudget;

    return (
        <>
            <DashCard 
                title="Lead Acquisition Cost" 
                description="this month" 
                content={`$${averageLeadCost.toFixed(2)}`}
                menuItems={menuItems}
                footer={`Marketing Budget: $${marketingBudget}/mo`}
            />

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Monthly Marketing Budget</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            type="number"
                            value={newBudget}
                            onChange={(e) => setNewBudget(e.target.value)}
                            placeholder="Enter monthly budget"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveBudget}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}