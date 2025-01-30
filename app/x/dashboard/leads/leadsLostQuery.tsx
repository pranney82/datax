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
            reason: string;
            count: number;
          }>;
        };
      }>;
    };
  };
}

export default function LeadsLostQuery({ selectedField }: { selectedField?: string }) {
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { dateRange } = useLeadsCount();

  const fetchLeadsData = useCallback(async (orgID: string, grantKey: string, cfName: string, page?: string) => {
    try {
      //console.log('Fetching page:', page || 'initial');
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

      const data = await response.json();
      //console.log('Page data:', data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }, [dateRange]);

  const fetchAllPages = useCallback(async (orgID: string, grantKey: string, leadslostcfv: string, leadslostcfvName: string) => {
    //console.log('Starting fetchAllPages with:', { orgID, leadslostcfv, leadslostcfvName });
    let currentPage = "";
    let allResults: CustomFieldValue[] = [];
    let hasNextPage = true;
    //let pageCount = 0;

    while (hasNextPage) {
      //pageCount++;
      //console.log(`Fetching page ${pageCount}, currentPage:`, currentPage);
      const result = await fetchLeadsData(orgID, grantKey, leadslostcfv, currentPage);
      
      const nodes = result?.organization?.customFields?.nodes?.[0]?.customFieldValues?.nodes;
      //console.log(`Page ${pageCount} results:`, nodes?.length || 0, 'items');
      
      if (!nodes) break;
      
      allResults = [...allResults, ...nodes];
      //console.log('Total results so far:', allResults.length);

      const nextPage = result?.organization?.customFields?.nodes?.[0]?.customFieldValues?.nextPage;
      if (nextPage) {
        currentPage = nextPage;
        //console.log('Next page token:', nextPage);
      } else {
        hasNextPage = false;
        //console.log('No more pages');
      }
    }

    // Count totals for each value
    const valueCounts: { [key: string]: number } = {};
    allResults.forEach((result) => {
      const value = result.value;
      valueCounts[value] = (valueCounts[value] || 0) + 1;
    });

    // Convert to array format for the chart and sort by count
    const processedData = Object.entries(valueCounts)
      .map(([reason, count]) => ({
        reason,
        count
      }))
      .sort((a, b) => b.count - a.count);
    
    //console.log('Final processed data:', processedData);

    return {
      organization: {
        customFields: {
          nodes: [{
            id: leadslostcfv,
            name: leadslostcfvName,
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
      //console.log('Starting data fetch with selectedField:', selectedField);
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
        //console.log('Org data:', {
        //  orgID: orgDoc.data()?.orgID,
        //  leadslostcfv: orgDoc.data()?.leadslostcfv,
        //  leadslostcfvName: orgDoc.data()?.leadslostcfvName
        //});

        const orgID = orgDoc.data()?.orgID;
        const grantKey = orgDoc.data()?.grantKey;
        const leadslostcfv = selectedField || orgDoc.data()?.leadslostcfv;
        const leadslostcfvName = orgDoc.data()?.leadslostcfvName;

        if (orgID && grantKey && leadslostcfv) {
          //console.log('Fetching with params:', { orgID, leadslostcfv, leadslostcfvName });
          const allResults = await fetchAllPages(orgID, grantKey, leadslostcfv, leadslostcfvName);
          //console.log('Setting query result:', allResults);
          setQueryResult(allResults as QueryResult);
        } else {
          console.log('Missing required params:', { orgID, grantKey, leadslostcfv });
        }
        
      } catch (error) {
        console.error('Error in LeadsLostQuery:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange, selectedField, fetchAllPages]);

  return { queryResult, isLoading };
}