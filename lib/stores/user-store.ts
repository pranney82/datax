import { create } from 'zustand'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface UserState {
  uid: string;
  name: string;
  email: string;
  org: string;
  subscriptionStatus: string;
  subscriptionType: string;
  avatar: string;
  admin: boolean;
  isLoading: boolean;
  setUser: (userData: Partial<UserState>) => void;
  fetchUser: (uid: string) => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  uid: '',
  name: '',
  email: '',
  org: '',
  subscriptionStatus: '',
  subscriptionType: '',
  avatar: '',
  admin: false,
  isLoading: true,
  setUser: (userData) => set((state) => ({ ...state, ...userData })),
  fetchUser: async (uid: string) => {
    try {
      const userDocRef = doc(db, 'users', uid)
      const userDoc = await getDoc(userDocRef)
      const userData = userDoc.data()

      if (!userData) {
        console.error('No user data found');
        set({ isLoading: false });
        return;
      }

      const stripeCustomerId = userData?.stripeCustomerId;
      let subscriptionStatus = 'free';
      let subscriptionType = 'free';

      if (stripeCustomerId) {
        const stripeDocRef = doc(db, 'stripedata', stripeCustomerId);
        const stripeDoc = await getDoc(stripeDocRef);

        if (stripeDoc.exists()) {
          const stripeData = stripeDoc.data();
          if (!stripeData.empty) {
            subscriptionStatus = stripeData.subscriptionStatus || 'free';
            subscriptionType = stripeData.tier || 'free';
          }
        }
      }

      set({
        uid,
        email: userData.email || '',
        name: userData.name || '',
        avatar: userData.avatar || '',
        org: userData.org || '',
        subscriptionStatus,
        subscriptionType,
        admin: userData.admin || false,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching user:', error)
      set({ isLoading: false })
    }
  },
  clearUser: () => set({ 
    uid: '', 
    name: '', 
    email: '', 
    org: '',
    subscriptionStatus: '',
    subscriptionType: '',
    avatar: '', 
    admin: false, 
    isLoading: false 
  })
})) 