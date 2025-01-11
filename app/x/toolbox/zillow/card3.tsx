import ModernDashboardCard from "@/components/dash-card";
import { CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { searchLocCF } from "./zquery";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/context/auth-context";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCustomFieldsStore } from './store'

interface CustomField {
  id: string;
  name: string;
  type: string;
  targetType: string;
}

export const Card3 = () => {
    const { user } = useAuth();
    const [fields, setFields] = useState<CustomField[]>([]);
    const [selectedZestimateField, setSelectedZestimateField] = useState<string>("");
    const [selectedUrlField, setSelectedUrlField] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const refreshTrigger = useCustomFieldsStore((state) => state.refreshTrigger)

    const handleSave = async () => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        if (!user?.uid) throw new Error('User not authenticated');
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) throw new Error('User document not found');
        
        const orgId = userDoc.data().org;
        if (!orgId) throw new Error('Organization not found');

        await updateDoc(doc(db, 'orgs', orgId), {
          zestimateField: selectedZestimateField,
          zillowUrlField: selectedUrlField
        });

        setSuccess(true);
      } catch (error) {
        console.error('Error saving fields:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch custom fields using searchLocCF
    const fetchCustomFields = async (orgID: string, grantKey: string) => {
      try {
        const response = await fetch('/api/jtfetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: {
              "$": { "grantKey": grantKey },
              ...searchLocCF({ orgID })
            }
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data?.organization?.customFields?.nodes || [];
      } catch (error) {
        console.error('Error fetching custom fields:', error);
        return [];
      }
    };

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
          
          // Set the previously saved field selections
          setSelectedZestimateField(orgData.zestimateField || "");
          setSelectedUrlField(orgData.zillowUrlField || "");

          // Fetch custom fields once we have the settings
          if (settings.orgId && settings.grantKey) {
            const customFields = await fetchCustomFields(settings.orgId, settings.grantKey);
            const locationFields = customFields.filter((field: CustomField) => 
              field.targetType === "location"
            );
            setFields(locationFields);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchUserSettings();
    }, [user, refreshTrigger]);

    return (
      <ModernDashboardCard 
        title="Custom Field Assignment" 
        description=""
        loading={isLoading}
        content={
          <div className="w-full space-y-4">
            <CardDescription>Map custom fields from JobTread Locations to your Zillow data.</CardDescription>
            
            <div className="space-y-2 w-full">
              <Label>Assign a custom field for Zestimate</Label>
              <Select
                value={selectedZestimateField}
                onValueChange={setSelectedZestimateField}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a custom field" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name} ({field.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 w-full">
              <Label>Assign a custom field for Zillow URL</Label>
              <Select
                value={selectedUrlField}
                onValueChange={setSelectedUrlField}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a custom field" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name} ({field.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="text-sm text-red-600 w-full">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-600 w-full">
                Custom fields mapped successfully!
              </div>
            )}

            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Saving...' : 'Save Field Mapping'}
            </Button>
          </div>
        }
      />  
    );
};