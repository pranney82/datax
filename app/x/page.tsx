"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import { PlusCircle, ExternalLink, Map, BarChart3, Zap, BookOpen, Settings2, Rocket, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/lib/context/auth-context"
import { getFirestore, doc, getDoc, addDoc, collection } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { InspirationQuote } from "@/components/ui/InspirationQuote"
import Link from 'next/link'

interface CompanyUpdate {
  id: string
  title: string
  content: string
  date: string
  author: {
    name: string
    avatar: string
  }
}

interface UserData {
  name?: string;
  // Add other potential user data fields here
}

export default function HomePage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [featureRequest, setFeatureRequest] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);
  const [orgID, setOrgID] = useState('');
  const [grantKey, setGrantKey] = useState('');
  const [featureTitle, setFeatureTitle] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;
      
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }
      const orgId = userDoc.data()?.org;
      const orgDoc = await getDoc(doc(db, 'orgs', orgId));
      if (orgDoc.exists()) {
        setOrgID(orgDoc.data()?.orgID);
        setGrantKey(orgDoc.data()?.grantKey);
      }
    };

    fetchUserData();
  }, [user]);

  const companyUpdates: CompanyUpdate[] = [
    {
      id: '1',
      title: 'Dashboards, Toolbox, and Library',
      content: "Company dashboards, toolbox, and library are now available to all users. We're excited to see how you use them.",
      date: 'Jan 7 2025',
      author: {
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg'
      }
    },
    {
      id: '2',
      title: 'DATAx is live!',
      content: "DATAx is live! Available to all JOBTREAD users starting today!",
      date: 'Jan 7 2025',
      author: {
        name: 'Mike Peters',
        avatar: '/avatars/mike.jpg'
      }
    }
  ]

  const handleFeatureRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.email || !featureTitle.trim() || !featureRequest.trim()) {
      console.error('Missing required fields');
      return;
    }

    try {
      const db = getFirestore();
      await addDoc(collection(db, 'featureRequests'), {
        email: user.email,
        title: featureTitle,
        description: featureRequest,
        createdAt: new Date(),
        status: 'new'
      });

      setFeatureTitle('');
      setFeatureRequest('');
      
      setShowSuccess(true);
      setConfirmationMessage('Feature request submitted successfully!');
      
      setTimeout(() => {
        setShowSuccess(false);
        setConfirmationMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error submitting feature request:', error);
    }
  };

  const orgLookUp = async () => {
    if (!grantKey) {
      console.error('Missing grantKey')
      return null
    }

    setIsLoadingOrgs(true)
    try {
      const response = await fetch('/api/jtfetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            "$": { "grantKey": grantKey },
              "organization": {
                "$": {
                  "id": orgID
                },
                "id": {},
                "name": {}
              }
          }
        })
      })
    

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const org = data?.organization?.name
      
      setCompanyName(org)

      return data
    } catch (error) {
      console.error('Error fetching query:', error)
      return null
    } finally {
      setIsLoadingOrgs(false)
    }
  }

  useEffect(() => {
    orgLookUp();
  }, [orgID, grantKey]);

  const greeting = userData?.name || user?.displayName ? `Welcome, ${userData?.name || user?.displayName}!` : 'Welcome to your dashboard!';

  return (
    <main className="flex flex-col flex-1 p-0 bg-[#f8f9fa] text-[#333]">
      <header className="flex h-16 shrink-0 items-center gap-2 shadow">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 hover:bg-[#fff] rounded-full transition-colors duration-200" />
        </div>
      </header>
      
      {showSuccess && (
        <div className="fixed top-4 right-4 flex items-center gap-2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 animate-fade-in-down">
          <CheckCircle2 className="w-5 h-5" />
          <span>Feature request submitted successfully!</span>
        </div>
      )}
      
      <div className="flex flex-1 flex-col gap-4 p-6 pt-4 animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#333]">{isLoadingOrgs ? 'Loading...' : companyName}</h1>
            <p className="text-lg text-[#555]">{greeting}</p>
          </div>
        </div>

        <div className="mb-6">
          <InspirationQuote />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-1 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="bg-[#f0f0f0] text-[#333] rounded-t-lg">
              <CardTitle className="text-xl">DATAx Updates</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                {companyUpdates.map((update) => (
                  <div key={update.id} className="flex gap-4 items-start hover:bg-[#f0f0f0] p-2 rounded-lg transition-colors duration-200">
                    <Avatar className="border-2 border-[#e0e0e0]">
                      <AvatarImage src={update.author.avatar} alt={`Avatar of ${update.author.name}`} />
                      <AvatarFallback className="bg-[#ffd400] text-[#333]">
                        <Rocket className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-medium leading-none text-lg text-[#333]">{update.title}</h3>
                      <p className="text-sm text-[#555]">{update.content}</p>
                      <p className="text-xs text-[#777]">{update.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="bg-[#f0f0f0] text-[#333] rounded-t-lg">
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: BarChart3, label: 'Dashboard', href: '/x/dashboard' },
                  { icon: Zap, label: 'Toolbox', href: '/x/toolbox' },
                  { icon: BookOpen, label: 'Library', href: '/x/library/templates' },
                  { icon: Settings2, label: 'Settings', href: '/x/settings' }
                ].map((action, index) => (
                  <Link key={index} href={action.href} className="p-4 border-2 border-[#e0e0e0] rounded-lg hover:bg-[#ffd400] hover:text-[#333] flex flex-col items-center gap-2 transition-all duration-200 group">
                    <action.icon className="w-8 h-8 text-[#ffd400] group-hover:text-[#333] group-hover:scale-110 transition-all duration-200" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="bg-[#f0f0f0] text-[#333] rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl">
                <PlusCircle className="w-6 h-6 text-[#ffd400]" />
                Feature Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleFeatureRequestSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="featureTitle" className="block text-sm font-medium text-gray-700">Feature name</label>
                  <input
                    id="featureTitle"
                    type="text"
                    placeholder="Feature name"
                    value={featureTitle}
                    onChange={(e) => setFeatureTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border-2 border-[#e0e0e0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd400] focus:border-[#ffd400] transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="featureDescription" className="block text-sm font-medium text-gray-700">Feature description</label>
                  <textarea
                    id="featureDescription"
                    placeholder="Describe the feature you'd like to see..."
                    value={featureRequest}
                    onChange={(e) => setFeatureRequest(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-white border-2 border-[#e0e0e0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd400] focus:border-[#ffd400] transition-all duration-200 resize-none"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Link 
                    href="/roadmap" 
                    className="text-sm text-[#555] hover:text-[#ffd400] flex items-center gap-1 transition-colors duration-200"
                  >
                    <Map className="w-4 h-4" />
                    View our roadmap <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Button 
                    type="submit" 
                    className="bg-[#ffd400] text-[#333] hover:bg-[#ffd400]/80 transition-colors duration-200"
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
              {confirmationMessage && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                  {confirmationMessage}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

