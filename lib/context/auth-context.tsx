'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
  uid: string;
  name: string;
  email: string;
  org: string;
  subscriptionStatus: string;
  subscriptionType: string;
  avatar: string;
  admin: boolean;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async (uid: string) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        const data = userDoc.data();

        if (!data) return null;

        // Fetch stripe data in parallel
        const stripeData = data.stripeCustomerId ? 
          await getDoc(doc(db, 'stripedata', data.stripeCustomerId))
            .then(doc => doc.exists() ? doc.data() : null) : 
          null;

        setUserData({
          uid,
          email: data.email || '',
          name: data.name || '',
          avatar: data.avatar || '',
          org: data.org || '',
          subscriptionStatus: stripeData?.subscriptionStatus || 'free',
          subscriptionType: stripeData?.tier || 'free',
          admin: data.admin || false
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        fetchUserData(authUser.uid);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 