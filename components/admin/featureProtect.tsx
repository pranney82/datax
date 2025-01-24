'use client';

import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
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
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Check access whenever subscription status or tier changes
    const access = subscriptionStatus === 'active' && subscriptionTier === 'CORE';
    setHasAccess(access);
    console.log("[FeatureProtect] Access Check:", {
      access,
      subscriptionStatus,
      subscriptionTier,
      featureName,
      isLoading
    });
  }, [subscriptionStatus, subscriptionTier, featureName, isLoading]);

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
        console.log("fetchSubscriptionStatus try");
        // Fetch stripeCustomerId from users collection
        const stripeCustomerIdDoc = await getDocs(collection(db, 'users', uid));
        if (stripeCustomerIdDoc.empty) {
          console.error('No user document found');
          setSubscriptionStatus('free');
          setSubscriptionTier('free');
          setIsLoading(false);
          return;
        }
        
        const stripeCustomerId = stripeCustomerIdDoc.docs[0].data().stripeCustomerId;
        if (!stripeCustomerId) {
          console.error('No stripeCustomerId found');
          setSubscriptionStatus('free');
          setSubscriptionTier('free');
          setIsLoading(false);
          return;
        }
        
        const stripeDocRef = doc(db, 'stripedata', stripeCustomerId);
        const stripeDoc = await getDoc(stripeDocRef);

        if (stripeDoc.exists()) {
          const stripeData = stripeDoc.data();
          let status = 'free';
          let type = 'free';
          
          if (!stripeData.empty) {
            status = stripeData.subscriptionStatus || 'error';
            type = stripeData.tier || 'error';
          }
          
          setSubscriptionStatus(status);
          setSubscriptionTier(type);
        } else {
          console.error('No document found for the given stripeCustomerId');
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [uid, org, storeSubStatus, storeSubType]);

  if (hasAccess === false) {
    return (
      <div className="relative min-h-full">
        <div className="blur-sm pointer-events-none">
          {children}
        </div>

        <div className="fixed top-64 left-0 right-0 flex justify-center">
          <div className="text-center space-y-4 p-8 rounded-lg bg-background/95 shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold">Premium Feature</h2>
            <p className="text-muted-foreground">
              Sorry, but the JT Connect free trial period has ended.<br /><br />
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