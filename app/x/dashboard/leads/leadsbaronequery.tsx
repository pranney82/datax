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
          processedData?: ProcessedData[];
        };
      }>;
    };
  };
}

interface MonthlyData {
  [key: string]: {
    [source: string]: number;
  };
}

interface ProcessedData {
  month: string;
  [key: string]: string | number;
}

export default function LeadsBarOneQuery({ selectedField }: { selectedField?: string }) {
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
        const errorText = await response.text();
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }, [dateRange]);

  const fetchAllPages = useCallback(async (orgID: string, grantKey: string, leadsbarcfv: string, leadsbarcfvName: string) => {
    let currentPage = "";
    let allResults: CustomFieldValue[] = [];
    let hasNextPage = true;

    while (hasNextPage) {
      const result = await fetchLeadsData(orgID, grantKey, leadsbarcfv, currentPage);
      
      if (!result?.organization?.customFields?.nodes?.[0]) {
        break;
      }

      const customField = result.organization.customFields.nodes[0];
      const customFieldValues = customField.customFieldValues;
      
      // Add current page's results to accumulated results
      if (customFieldValues?.nodes) {
        const newResults = customFieldValues.nodes;
        allResults = [...allResults, ...newResults];
      }

      // Check if there's a next page
      if (customFieldValues?.nextPage) {
        currentPage = customFieldValues.nextPage;
      } else {
        hasNextPage = false;
      }
    }

    // After collecting all results, process them into monthly data
    const monthlyData: MonthlyData = {};
    
    // Process all results into monthly buckets
    allResults.forEach((result) => {
      const date = new Date(result.createdAt);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      const value = result.value;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {};
      }

      if (!monthlyData[monthKey][value]) {
        monthlyData[monthKey][value] = 0;
      }

      monthlyData[monthKey][value]++;
    });

    // Convert to array format for the chart
    const processedData = Object.entries(monthlyData).map(([month, sources]) => ({
      month,
      ...sources
    }));

    // Return both raw and processed data
    const finalResult = {
      organization: {
        customFields: {
          nodes: [{
            id: leadsbarcfv,
            name: leadsbarcfvName,
            customFieldValues: {
              nodes: allResults,
              processedData: processedData
            }
          }]
        }
      }
    };

    return finalResult;
  }, [fetchLeadsData]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log('No current user in query');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (!userDoc.exists()) {
          console.log('No user doc in query');
          return;
        }

        const org = userDoc.data().org;
        if (!org) {
          console.log('No org in query');
          return;
        }

        const orgDoc = await getDoc(doc(db, 'orgs', org));
        const orgID = orgDoc.data()?.orgID;
        const grantKey = orgDoc.data()?.grantKey;
        const leadsbarcfv = selectedField || orgDoc.data()?.leadsbarcfv;
        const leadsbarcfvName = orgDoc.data()?.leadsbarcfvName;
        if (orgID && grantKey && leadsbarcfv) {
          const allResults = await fetchAllPages(orgID, grantKey, leadsbarcfv, leadsbarcfvName);
          setQueryResult(allResults as unknown as QueryResult);
        }
      } catch (error) {
        console.error('Error in LeadsBarOneQuery:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange, selectedField, fetchAllPages]);

  return { queryResult, isLoading };
}