import React, { useEffect, useState, useCallback } from 'react';
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { queryCFFields } from '@/app/x/dashboard/leads/query';

interface CustomField {
  _type: string;
  id: string;
  name: string;
  type: string;
  targetType: string;
}

interface CFDropdownProps {
  value?: string;
  onChange?: (value: string, name?: string) => void;
  className?: string;
  targetType?: string;
  onFieldsLoad?: (fields: Array<{ id: string, name: string }>) => void;
}

export default function CFDropdown({ value, onChange, className = '', targetType, onFieldsLoad }: CFDropdownProps) {
  const [fields, setFields] = useState<CustomField[]>([]);

  const fetchCFFields = async (orgID: string, grantKey: string, page?: string) => {
    try {
      const response = await fetch('/api/jtfetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            "$": { "grantKey": grantKey },
            ...queryCFFields({ orgID, page: page || "" })
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
  };

  const fetchAllCustomFields = useCallback(async (orgID: string, grantKey: string) => {
    let currentPage = "";
    let allFields: CustomField[] = [];
    let hasNextPage = true;

    while (hasNextPage) {
      const result = await fetchCFFields(orgID, grantKey, currentPage);
      const nodes = result?.organization?.customFields?.nodes;
      
      if (!nodes) break;
      
      allFields = [...allFields, ...nodes];

      const nextPage = result?.organization?.customFields?.nextPage;
      if (nextPage) {
        currentPage = nextPage;
      } else {
        hasNextPage = false;
      }
    }
    console.log('All fields:', allFields);
    return allFields;
  }, []);

  useEffect(() => {
    const fetchCustomFields = async () => {
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
        
        if (orgID && grantKey) {
          const allFields = await fetchAllCustomFields(orgID, grantKey);
          setFields(allFields);
          if (onFieldsLoad) {
            onFieldsLoad(allFields);
          }
        }
      } catch (error) {
        console.error('Error fetching custom fields:', error);
      }
    };

    fetchCustomFields();
  }, [targetType, onFieldsLoad, fetchAllCustomFields]);

  return (
    <div className={`relative inline-block w-full ${className}`}>
      <select
        value={value}
        onChange={(e) => {
          const selectedField = fields.find(field => field.id === e.target.value);
          onChange?.(e.target.value, selectedField?.name);
        }}
        className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="" disabled>
          Select a custom field
        </option>
        {fields.map((field) => (
          <option key={field.id} value={field.id}>
            {field.name} ({field.targetType})
          </option>
        ))}
      </select>
    </div>
  );
}
