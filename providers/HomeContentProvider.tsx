'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface NavItem {
  href: string;
  label: string;
  items?: Array<{
    description: string;
    href: string;
    icon: string;
    title: string;
  }>;
}

interface HomeContent {
  hero1?: {
    badge?: string;
    title: string;
    description: string;
    buttons?: {
      primary: { text: string; href: string };
      secondary: { text: string; href: string };
    };
    image: {
      src: string;
      alt: string;
    };
  };
  logos3?: {
    title: string;
    logos: Array<{
      id: string;
      description: string;
      image: string;
    }>;
  };
  nav?: {
    auth: {
      login: { label: string; href: string; variant: string };
      signup: { label: string; href: string; variant: string };
    };
    logo: { src: string; alt: string; text: string };
    mainNav: NavItem[];
  };
  hero7?: any;
  hero8?: any;
  feature74?: any;
  faq1?: any;
  cta11?: any;
  footer?: any;
  // ... other section types
}

const HomeContext = createContext<HomeContent | null>(null);

export const HomeContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<HomeContent | null>(null);

  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        const sections = ['hero1', 'logos3', 'nav'];
        const data: HomeContent = {};
        
        await Promise.all(
          sections.map(async (section) => {
            const docRef = doc(db, 'content', 'home', 'sections', section);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              data[section as keyof HomeContent] = docSnap.data()[section] || docSnap.data();
            }
          })
        );
        
        console.log('Final data:', data);
        setContent(data);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchAllContent();
  }, []);

  console.log('Current content state:', content); // Debug log

  return (
    <HomeContext.Provider value={content}>
      {content ? children : <div>Loading...</div>}
    </HomeContext.Provider>
  );
};

export const useHomeContent = () => {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error('useHomeContent must be used within a HomeContentProvider');
  }
  return context;
}; 