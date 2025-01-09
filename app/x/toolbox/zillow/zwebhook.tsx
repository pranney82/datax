'use client'

import { Button } from "@/components/ui/button"
import { createWebhook } from "./zquery"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface CreateWebhookButtonProps {
  isConnected: boolean
  orgId: string | null
  grantKey: string | null
}

export function CreateWebhookButton({ isConnected, orgId, grantKey }: CreateWebhookButtonProps) {
  const handleCreateWebhook = async () => {
    if (!orgId || !grantKey) {
      console.error('Missing orgId or grantKey')
      return
    }

    try {
      // First get the org data to get the field IDs
      const orgsRef = collection(db, 'orgs');
      const q = query(orgsRef, where('orgID', '==', orgId));
      const querySnapshot = await getDocs(q);
      const orgDoc = querySnapshot.docs[0];
      const { zestimateField, zillowUrlField } = orgDoc.data();

      const response = await fetch('/api/jtfetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            "$": { "grantKey": grantKey },
            ...createWebhook({ 
              orgID: orgId, 
              url: "https://winyourdata.com/api/zillow",
              zestimateField,
              zillowUrlField
            })
          }
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to create webhook')
      }

      window.location.reload()
    } catch (error) {
      console.error('Error creating webhook:', error)
    }
  }

  if (!orgId || !grantKey) return null

  return (
    <Button
      onClick={handleCreateWebhook}
      disabled={isConnected}
      variant={isConnected ? "secondary" : "default"}
      className="w-full"
    >
      {isConnected ? 'Connected!' : 'Connect to JobTread'}
    </Button>
  )
}
