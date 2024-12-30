import DashCard from "@/components/dash-card";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { docsDataQuery } from "./query";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";

interface DocumentNode {
    id: string;
    createdAt: string;
    closedAt: string | null;
    data: {
        next?: {
            status: string;
        };
    };
    status: string;
}

interface DocumentsResponse {
    organization?: {
        documents?: {
            nodes?: DocumentNode[];
            nextPage?: string;
        };
    };
}

export function LeadsBlock4() {
    
    const { dateRange } = useLeadsCount();
    const startDate = dateRange.monthDates[0];
    const endDate = dateRange.monthDates[dateRange.monthDates.length - 1];

    const fetchAllLeadsData = useCallback(async (
        orgID: string, 
        grantKey: string, 
        startDate: string, 
        endDate: string, 
        page?: string
    ): Promise<DocumentsResponse> => {
        try {
            const response = await fetch('/api/jtfetch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: {
                        "$": { "grantKey": grantKey },
                        ...docsDataQuery({ 
                            orgID, 
                            startDate, 
                            endDate,
                            page: page || "" // Default first page
                        })
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // If there's a next page, fetch it and merge the results
            if (data?.organization?.documents?.nextPage) {
                const nextPageData = await fetchAllLeadsData(orgID, grantKey, startDate, endDate, data.organization.documents.nextPage);
                if (nextPageData?.organization?.documents?.nodes) {
                    // Merge the nodes arrays
                    data.organization.documents.nodes = [
                        ...(data.organization.documents.nodes || []),
                        ...(nextPageData.organization.documents.nodes || [])
                    ];
                }
            }
            console.log('all data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching leads data:', error);
            return {};
        }
    }, []);

    const calculateAverageDays = useCallback((leadsData: DocumentNode[]) => {
        console.log('Calculating average days with leads:', leadsData?.length);
        if (!leadsData?.length) {
            console.log('No leads data available');
            return 0;
        }

        const closedLeads = leadsData.filter(lead => {
            console.log('Lead status:', lead.status, 'closedAt:', lead.closedAt);
            return lead.closedAt !== null;
        });
        console.log('Number of closed leads:', closedLeads.length);
        
        if (closedLeads.length === 0) {
            console.log('No closed leads found');
            return 0;
        }

        const totalDays = closedLeads.reduce((sum, lead, index) => {
            console.log(`\nProcessing lead ${index + 1}:`, lead);
            
            // Log the raw date strings
            console.log('Raw dates:', {
                createdAt: lead.createdAt,
                closedAt: lead.closedAt
            });

            const createdAt = new Date(lead.createdAt);
            const closedAt = new Date(lead.closedAt!);
            
            console.log('Parsed dates:', {
                createdAt: createdAt.toISOString(),
                closedAt: closedAt.toISOString()
            });

            const diffTime = closedAt.getTime() - createdAt.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            console.log('Time calculations:', {
                diffTime,
                diffDays,
                currentSum: sum,
                newSum: sum + diffDays
            });
            
            return sum + diffDays;
        }, 0);

        console.log('\nFinal calculations:', {
            totalDays,
            numberOfLeads: closedLeads.length,
            average: totalDays / closedLeads.length
        });

        const averageDays = (totalDays / closedLeads.length).toFixed(1);
        return parseFloat(averageDays);
    }, []);

    useEffect(() => {
        const fetchLeadsToClose = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    console.log('No current user');
                    return;
                }

                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (!userDoc.exists()) {
                    console.log('User doc does not exist');
                    return;
                }

                const org = userDoc.data().org;
                if (!org) {
                    console.log('No org found in user data');
                    return;
                }

                // Get org document using the orgID
                const orgDoc = await getDoc(doc(db, 'orgs', org));
                const orgID = orgDoc.data()?.orgID;
                const grantKey = orgDoc.data()?.grantKey;

                console.log('Fetching with dates:', { startDate, endDate });
                
                if (orgID && grantKey) {
                    const leadsData = await fetchAllLeadsData(orgID, grantKey, startDate, endDate);
                    const nodes = leadsData?.organization?.documents?.nodes || [];
                    console.log('Received nodes:', nodes.length);
                    const averageDays = calculateAverageDays(nodes);
                    setLeadToClose(averageDays);
                }
            } catch (error) {
                console.error('Error in fetchLeadsToClose:', error);
            }
        };

        fetchLeadsToClose();
    }, [fetchAllLeadsData, calculateAverageDays, startDate, endDate]);

    // Add state for storing the result
    const [leadToClose, setLeadToClose] = useState(0);

    return (
        <>
            <DashCard 
                title="Lead to Close Average" 
                description="last 12 months" 
                content={`${leadToClose} days`}
            />
        </>
    );
}