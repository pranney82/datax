'use client';

import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/context/auth-context';
import Link from 'next/link';

interface FeatureProtectProps {
  children: React.ReactNode;
  featureName: string;
}

export default function FeatureProtect({ children, featureName }: FeatureProtectProps) {
  const { userData } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(userData?.subscriptionStatus || null);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(userData?.subscriptionType || null);
  const [isLoading, setIsLoading] = useState(!userData?.subscriptionStatus);
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
    if (userData?.subscriptionStatus && userData?.subscriptionType) {
      setSubscriptionStatus(userData.subscriptionStatus);
      setSubscriptionTier(userData.subscriptionType);
      setIsLoading(false);
      return;
    }

    const fetchSubscriptionStatus = async () => {
      if (!userData?.uid || !userData?.org) return;

      try {
        console.log("fetchSubscriptionStatus try");
        // Fetch stripeCustomerId from users collection
        const stripeCustomerIdDoc = await getDocs(collection(db, 'users', userData.uid));
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
  }, [userData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <h2 className="text-lg font-semibold mb-2">Feature Not Available</h2>
        <p className="text-sm text-gray-600 mb-4">
          This feature requires an active CORE subscription.
        </p>
        <Button asChild>
          <Link href="/pricing">Upgrade Now</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
} 