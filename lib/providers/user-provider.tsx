'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useUserStore } from '@/lib/stores/user-store';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        await fetchUser(authUser.uid);
      } else {
        useUserStore.getState().clearUser();
      }
    });

    return () => unsubscribe();
  }, [fetchUser]);

  return <>{children}</>;
} 