"use client";

import React, { useEffect, useState } from 'react';
import { PlusCircle, ExternalLink, Map, BarChart3, Box, BookOpen, Settings2, Rocket, CheckCircle2, Play, HeartHandshake, LifeBuoy } from 'lucide-react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/context/auth-context"
import { getFirestore, doc, getDoc, addDoc, collection } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { InspirationQuote } from "@/components/ui/InspirationQuote"
import Link from 'next/link'
import { AuthDialog } from "@/components/home/signup1"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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

interface FAQItem {
  question: string;
  answer: string;
  videoUrl?: string;
  thumbnailUrl: string;
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
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [confirmationMessage2, setConfirmationMessage2] = useState<string>('');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [supportTitle, setSupportTitle] = useState('');
  const [supportDescription, setSupportDescription] = useState('');

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

  const faqItems: FAQItem[] = [
    {
      question: "What is DATAx?",
      answer: "Designed specicically for JOBTREAD users, we wanted to bridge the tech gap to bring dashboards, charts, along with specialty features, integrations, and automations to all JOBTREAD users.",
      videoUrl: "https://www.youtube.com/embed/54J9jKafVMc",
      thumbnailUrl: "/assets/thumbnails/1.png"
    },    
    {
      question: "How does it work?",
      answer: "Getting started is easy! Simply enter your JOBTREAD grant key, and you're all set. From there, you can explore your dashboard, enable custom integrations, and unlock a variety of powerful features!",
      videoUrl: "https://www.youtube.com/embed/FiAXjvgV0Zc",
      thumbnailUrl: "/assets/thumbnails/2.png"
    },
    {
      question: "Will DATAx mess up my JOBTREAD data?",
      answer: "No, your JOBTREAD data is completely safe and secure from any changes. JOBTREAD's API gives companies like ours access to view your data without altering it in any way.",
      videoUrl: "https://www.youtube.com/embed/yKPzpIU3sys",
      thumbnailUrl: "/assets/thumbnails/3.png"
    },
    {
      question: "Won't JOBTREAD develop these features?",
      answer: "JOBTREAD is laser-focused on building the ultimate construction management platform. We are here to supplement that with specialized features and dashboards.",
      videoUrl: "https://www.youtube.com/embed/Qcm4wsAnfwY",
      thumbnailUrl: "/assets/thumbnails/4.png"
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

      // Send Discord notification
      await fetch('/api/discord-notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'feature-request',
          data: {
            title: featureTitle,
            description: featureRequest,
            email: user.email,
            status: 'new'
          }
        })
      });

      setFeatureTitle('');
      setFeatureRequest('');
      
      setConfirmationMessage('Feature request submitted successfully!');
      
      setTimeout(() => {
        setConfirmationMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error submitting feature request:', error);
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.email || !supportTitle.trim() || !supportDescription.trim()) {
      console.error('Missing required fields');
      return;
    }

    try {
      const db = getFirestore();
      await addDoc(collection(db, 'supportRequests'), {
        email: user.email,
        title: supportTitle,
        description: supportDescription,
        createdAt: new Date(),
        status: 'new'
      });

      // Send Discord notification
      await fetch('/api/discord-notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'support-request',
          data: {
            title: supportTitle,
            description: supportDescription,
            email: user.email,
            status: 'new'
          }
        })
      });

      setSupportTitle('');
      setSupportDescription('');
      
      setConfirmationMessage2('Support request submitted successfully!');
      
      setTimeout(() => {
        setConfirmationMessage2('');
      }, 3000);
    } catch (error) {
      console.error('Error submitting support request:', error);
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

  const toggleVideo = (videoUrl: string) => {
    setPlayingVideo(prevUrl => prevUrl === videoUrl ? null : videoUrl);
  };

  const handleAccordionChange = (value: string | undefined) => {
    if (value === openItem) {
      setOpenItem(null);
      setPlayingVideo(null);
    } else {
      setOpenItem(value || null);
      setPlayingVideo(null);
    }
  };

  return (
    <main className="flex-grow container mx-auto py-8 relative">
      {!user && (
        <AuthDialog 
          isOpen={true}
          onClose={() => {}}
          defaultView="login"
          redirectPath="/x"
        />
      )}

      <div className={!user ? 'filter blur-sm pointer-events-none' : ''}>
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

          <Card className="md:col-span-2 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="bg-[#f0f0f0] text-[#333] rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl">
                <HeartHandshake className="w-6 h-6 text-[#ffd400]" />
                What is DATAx?
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Accordion type="single" collapsible className="w-full" value={openItem || undefined} onValueChange={handleAccordionChange}>
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-medium text-[#333]">{item.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4 text-base text-[#555]">{item.answer}</p>
                      {item.videoUrl && (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                          {playingVideo === item.videoUrl ? (
                            <iframe
                              key={playingVideo}
                              src={`${item.videoUrl}?autoplay=1`}
                              title={`Video for ${item.question}`}
                              className="w-full h-full"
                              allowFullScreen
                              allow="autoplay"
                            ></iframe>
                          ) : (
                            <div className="relative w-full h-full">
                              <Image
                                src={item.thumbnailUrl}
                                alt={`Thumbnail for ${item.question}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleVideo(item.videoUrl!);
                                  }}
                                  className="bg-white/80 text-[#ffd400] rounded-full p-4 hover:bg-white hover:text-[#ffd400] transition-all duration-200 shadow-lg"
                                  aria-label={`Play video about ${item.question}`}
                                >
                                  <Play className="w-8 h-8" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="bg-[#f0f0f0] text-[#333] rounded-t-lg">
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: BarChart3, label: 'Dashboard', href: '/x/dashboard' },
                    { icon: Box, label: 'Toolbox', href: '/x/toolbox' },
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

            <Card id="feature-request" className="md:col-span-2 shadow-md hover:shadow-lg transition-shadow duration-200">
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
                  <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    {confirmationMessage}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card id="support-request" className="md:col-span-2 shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="bg-[#f0f0f0] text-[#333] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <LifeBuoy className="w-6 h-6 text-[#ffd400]" />
                  Support Request
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="supportTitle" className="block text-sm font-medium text-gray-700">Issue Title</label>
                    <input
                      id="supportTitle"
                      type="text"
                      placeholder="Brief description of the issue"
                      value={supportTitle}
                      onChange={(e) => setSupportTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-[#e0e0e0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd400] focus:border-[#ffd400] transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="supportDescription" className="block text-sm font-medium text-gray-700">Issue Description</label>
                    <textarea
                      id="supportDescription"
                      placeholder="Please provide details about your issue..."
                      value={supportDescription}
                      onChange={(e) => setSupportDescription(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-white border-2 border-[#e0e0e0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd400] focus:border-[#ffd400] transition-all duration-200 resize-none"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-[#ffd400] text-[#333] hover:bg-[#ffd400]/80 transition-colors duration-200"
                    >
                      Submit Support Request
                    </Button>
                  </div>
                </form>
                {confirmationMessage2 && (
                  <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    {confirmationMessage2}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

