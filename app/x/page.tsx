"use client";

import { useEffect, useState } from 'react';
import { Bell, LineChart, Users, Building, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbLink, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/lib/context/auth-context"
import { getFirestore, doc, getDoc } from "firebase/firestore"

// Add these interfaces for type safety
interface CompanyUpdate {
  id: string
  title: string
  content: string
  date: string
  author: {
    name: string
    avatar: string
    initials: string
  }
}

interface QuickStat {
  id: string
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
}

// Add this interface above the HomePage component
interface UserData {
  name?: string;
  // Add other potential user data fields here
}

export default function HomePage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;
      
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    };

    fetchUserData();
  }, [user]);

  const name = userData?.name || user?.displayName;
  console.log("userdata", userData);

  // Sample company updates
  const companyUpdates: CompanyUpdate[] = [
    {
      id: '1',
      title: 'New Estimating Software Release',
      content: "We've launched version 2.0 of our estimating software with improved accuracy and faster processing.",
      date: 'Today at 9:32 AM',
      author: {
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
        initials: 'SJ'
      }
    },
    {
      id: '2',
      title: 'Q1 Company Meeting',
      content: 'Mark your calendars for our Q1 all-hands meeting next Friday at 2 PM EST.',
      date: 'Yesterday at 4:15 PM',
      author: {
        name: 'Mike Peters',
        avatar: '/avatars/mike.jpg',
        initials: 'MP'
      }
    }
  ]

  // Sample quick stats
  const quickStats: QuickStat[] = [
    {
      id: '1',
      title: 'Active Projects',
      value: '24',
      change: '+2 from last month',
      trend: 'up'
    },
    {
      id: '2',
      title: 'Pending Invoices',
      value: '$75,750',
      change: '+15% vs last month',
      trend: 'up'
    },
    {
      id: '3',
      title: 'Team Members',
      value: '12',
      change: 'No change',
      trend: 'up'
    }
  ]

  return (
    <main className="flex flex-col flex-1 p-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/x">Home</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header> 
      {/* Welcome Section */}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
        <div className="flex justify-between items-center mb-6">
          <div>
          <h1 className="text-2xl font-bold">Welcome back, {name}</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your projects</p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {quickStats.map((stat) => (
          <Card key={stat.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <LineChart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Company Updates */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Company Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {companyUpdates.map((update) => (
                <div key={update.id} className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={update.author.avatar} />
                    <AvatarFallback>{update.author.initials}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-medium leading-none">{update.title}</h3>
                    <p className="text-sm text-muted-foreground">{update.content}</p>
                    <p className="text-xs text-muted-foreground">{update.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2">
                <Calendar className="w-6 h-6" />
                <span className="text-sm">Schedule Meeting</span>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2">
                <Users className="w-6 h-6" />
                <span className="text-sm">Team Directory</span>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2">
                <Building className="w-6 h-6" />
                <span className="text-sm">Project Overview</span>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2">
                <Clock className="w-6 h-6" />
                <span className="text-sm">Time Tracking</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </main>
  )
} 