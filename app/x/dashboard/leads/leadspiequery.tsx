import { useEffect, useState, useCallback } from 'react';
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { queryCFLeads } from '@/app/x/dashboard/leads/query';
import { useLeadsCount } from "@/lib/hooks/use-leads-count";

interface CustomFieldValue {
  id: string;
  value: string;
  createdAt: string;
}

interface QueryResult {
  organization?: {
    customFields?: {
      nodes?: Array<{
        id: string;
        name: string;
        targetType: string;
        customFieldValues?: {
          nodes?: CustomFieldValue[];
          nextPage?: string;
          previousPage?: string;
          processedData?: Array<{
            name: string;
            value: number;
          }>;
        };
      }>;
    };
  };
}

export default function LeadsPieQuery({ selectedField }: { selectedField?: string }) {
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { dateRange } = useLeadsCount();

  const fetchLeadsData = useCallback(async (orgID: string, grantKey: string, cfName: string, page?: string) => {
    try {
      const response = await fetch('/api/jtfetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            "$": { "grantKey": grantKey },
            ...queryCFLeads({ 
              orgID,
              startDate: dateRange.monthDates[0],
              endDate: dateRange.monthDates[dateRange.monthDates.length - 1],
              cfName2: cfName,
              page: page || ""
            })
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }, [dateRange]);

  const fetchAllPages = useCallback(async (orgID: string, grantKey: string, leadspiecfv: string, leadspiecfvName: string) => {
    let currentPage = "";
    let allResults: CustomFieldValue[] = [];
    let hasNextPage = true;

    while (hasNextPage) {
      const result = await fetchLeadsData(orgID, grantKey, leadspiecfv, currentPage);
      
      if (!result?.organization?.customFields?.nodes?.[0]) {
        break;
      }

      const customField = result.organization.customFields.nodes[0];
      const customFieldValues = customField.customFieldValues;
      
      if (customFieldValues?.nodes) {
        allResults = [...allResults, ...customFieldValues.nodes];
      }

      if (customFieldValues?.nextPage) {
        currentPage = customFieldValues.nextPage;
      } else {
        hasNextPage = false;
      }
    }

    // Process results for pie chart
    const valueCounts: { [key: string]: number } = {};
    
    allResults.forEach((result) => {
      const value = result.value;
      valueCounts[value] = (valueCounts[value] || 0) + 1;
    });

    // Convert to array format for the pie chart
    const processedData = Object.entries(valueCounts).map(([name, value]) => ({
      name,
      value
    }));

    return {
      organization: {
        customFields: {
          nodes: [{
            id: leadspiecfv,
            name: leadspiecfvName,
            customFieldValues: {
              nodes: allResults,
              processedData
            }
          }]
        }
      }
    };
  }, [fetchLeadsData]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (!userDoc.exists()) return;

        const org = userDoc.data().org;
        if (!org) return;

        const orgDoc = await getDoc(doc(db, 'orgs', org));
        const orgID = orgDoc.data()?.orgID;
        const grantKey = orgDoc.data()?.grantKey;
        const leadspiecfv = selectedField || orgDoc.data()?.leadspiecfv;
        const leadspiecfvName = orgDoc.data()?.leadspiecfvName;

        if (orgID && grantKey && leadspiecfv) {
          const allResults = await fetchAllPages(orgID, grantKey, leadspiecfv, leadspiecfvName);
          setQueryResult(allResults as QueryResult);
        }
      } catch (error) {
        console.error('Error in LeadsPieQuery:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange, selectedField, fetchAllPages]);

  return { queryResult, isLoading };
} 