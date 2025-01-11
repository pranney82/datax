'use client';

import { useAuth } from '@/lib/context/auth-context';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface FeatureProtectProps {
  children: React.ReactNode;
  featureName: string; // Add this to show which feature is locked
}

export default function FeatureProtect({ children, featureName }: FeatureProtectProps) {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user?.uid) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        
        // Search stripedata collection for matching orgID
        const stripeQuery = query(
          collection(db, 'stripedata'),
          where('orgID', '==', userData?.org)
        );
      
        const stripeSnapshot = await getDocs(stripeQuery);
        let subscriptionStatus = 'free';
        let subscriptionType = 'free';
        
        if (!stripeSnapshot.empty) {
          const stripeData = stripeSnapshot.docs[0].data();
          subscriptionStatus = stripeData.subscriptionStatus || 'error';
          subscriptionType = stripeData.tier || 'error';
        }
        
        setSubscriptionStatus(subscriptionStatus);
        setSubscriptionTier(subscriptionType);
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [user]);

  if (isLoading || !user) {
    return children;
  }

  const hasAccess = subscriptionStatus === 'active' && subscriptionTier === 'CORE';

  if (!hasAccess) {
    return (
      <div className="relative min-h-full">
        {/* Blurred content */}
        <div className="blur-sm pointer-events-none">
          {children}
        </div>

        {/* Overlay with upgrade prompt */}
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