import ModernDashboardCard from "@/components/dash-card";
import { CardDescription } from "@/components/ui/card";
import { createCF } from "./zquery";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/context/auth-context";
import { Button } from "@/components/ui/button";
import { useCustomFieldsStore } from './store'

export const Card4 = () => {
    const { user } = useAuth();
    const [userSettings, setUserSettings] = useState<{grantKey?: string, orgId?: string}>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const triggerRefresh = useCustomFieldsStore((state) => state.triggerRefresh)

    useEffect(() => {
      const fetchUserSettings = async () => {
        if (!user?.uid) return;

        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) return;

          const userData = userDoc.data();
          const orgId = userData.org;

          if (!orgId) return;

          const orgDocRef = doc(db, 'orgs', orgId);
          const orgDoc = await getDoc(orgDocRef);
          
          if (!orgDoc.exists()) return;

          const orgData = orgDoc.data();
          const settings = {
            grantKey: orgData.grantKey,
            orgId: orgData.orgID
          };
          setUserSettings(settings);
          
        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchUserSettings();
    }, [user]);

    const handleCreateField = async (cfName: string, cfType: string) => {
      if (!userSettings.orgId || !userSettings.grantKey) return;
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      
      try {
        const response = await fetch('/api/jtfetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: {
              "$": { "grantKey": userSettings.grantKey },
              ...createCF({ orgID: userSettings.orgId, cfName2: cfName, cfType: cfType })
            }
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();        
        // Check for successful creation - the condition might need adjustment based on the actual response
        if (data?.createCustomField?.createdCustomField?.id) {
          setSuccess(true);
          triggerRefresh();
        } else {
          throw new Error('Failed to create custom field');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create custom field');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <ModernDashboardCard 
        title="Create Custom Fields" 
        description=""
        loading={isLoading}
        content={
          <div className="w-full space-y-4">
            <CardDescription>Create custom fields in JobTread to store your Zillow data.</CardDescription>
            
            {error && (
              <div className="text-sm text-red-600 w-full">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-600 w-full">
                Custom field created successfully!
              </div>
            )}

            <Button 
              onClick={() => handleCreateField("Zestimate", "text")}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating...' : 'Create Custom Field: Zestimate'}
            </Button>
            <Button 
              onClick={() => handleCreateField("Zillow URL", "url")}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating...' : 'Create Custom Field: Zillow URL'}
            </Button>
          </div>
        }
      />  
    );
};