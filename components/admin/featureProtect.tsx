'use client';

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/lib/stores/user-store';

interface FeatureProtectProps {
  children: React.ReactNode;
  featureName: string;
}

export default function FeatureProtect({ children, featureName }: FeatureProtectProps) {
  const { uid, org, subscriptionStatus: storeSubStatus, subscriptionType: storeSubType } = useUserStore();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(storeSubStatus || null);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(storeSubType || null);
  const [isLoading, setIsLoading] = useState(!storeSubStatus);

  useEffect(() => {
    // If we already have subscription data in the store, don't fetch again
    if (storeSubStatus && storeSubType) {
      setSubscriptionStatus(storeSubStatus);
      setSubscriptionTier(storeSubType);
      setIsLoading(false);
      return;
    }

    const fetchSubscriptionStatus = async () => {
      if (!uid || !org) return;

      try {
        // Search stripedata collection for matching orgID
        const stripeQuery = query(
          collection(db, 'stripedata'),
          where('orgID', '==', org)
        );
      
        const stripeSnapshot = await getDocs(stripeQuery);
        let status = 'free';
        let type = 'free';
        
        if (!stripeSnapshot.empty) {
          const stripeData = stripeSnapshot.docs[0].data();
          status = stripeData.subscriptionStatus || 'error';
          type = stripeData.tier || 'error';
        }
        
        setSubscriptionStatus(status);
        setSubscriptionTier(type);
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [uid, org, storeSubStatus, storeSubType]);

  if (isLoading || !uid) {
    return children;
  }

  const hasAccess = subscriptionStatus === 'active' && subscriptionTier === 'CORE';

  if (!hasAccess) {
    return (
      <div className="relative min-h-full">
        <div className="blur-sm pointer-events-none">
          {children}
        </div>

        <div className="fixed top-64 left-0 right-0 flex justify-center">
          <div className="text-center space-y-4 p-8 rounded-lg bg-background/95 shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold">Premium Feature</h2>
            <p className="text-muted-foreground">
              {featureName} requires an active CORE subscription
            </p>
            <Button 
              onClick={() => window.location.href = process.env.NEXT_PUBLIC_APP_URL + '/pricing'}
              className="bg-primary text-primary-foreground"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 