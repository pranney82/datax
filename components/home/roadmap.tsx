'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Clock, Zap, Rocket, CheckCircle2, ChevronDown, ChevronUp, Mail } from 'lucide-react'

const roadmapData = [
  {
    status: "Completed",
    icon: CheckCircle2,
    color: "from-emerald-500 to-teal-500",
    features: [
      { 
        title: "Summary Dashboard",
        description: "Main dashboard showing key business metrics and active jobs map.",
        completionDate: "Q4 2024",
        status: "Completed",
      },
      { 
        title: "Leads Dashboard",
        description: "Simple analytics dashboard for key metrics.",
        completionDate: "Q4 2024",
        status: "Completed",
      },
      { 
        title: "Sales Dashboard",
        description: "Automated email notifications for important events.",
        completionDate: "Q4 2024",
        status: "Completed",
      },
      { 
        title: "Zillow Integration Feature",
        description: "Automated data sync with Zillow for property listings.",
        completionDate: "Q4 2024",
        status: "Completed",
      },
      { 
        title: "Google Street View Feature",
        description: "View property locations in Google Street View.",
        completionDate: "Q1 2025",
        status: "Completed",
      },
      { 
        title: "Library",
        description: "Cost Groups, Schedules, and To-Dos templates.",
        completionDate: "Q1 2025",
        status: "Completed",
      },
      { 
        title: "JOBTREAD API Scripts Library",
        description: "Pre-built scripts for common JOBTREAD API tasks.",
        completionDate: "Q1 2025",
        status: "Completed",
      },
      { 
        title: "Data Visualization",
        description: "Interactive charts and graphs for data representation.",
        completionDate: "Q4 2024",
        status: "Completed",
      },
      { 
        title: "Website Launced",
        description: "DATAx website launched with new features and updates.",
        completionDate: "Q1 2025",
        status: "Completed",
      },
      { 
        title: "Active Jobs Map",
        description: "Map view of active jobs for better visualization.",
        completionDate: "Q4 2024",
        status: "Completed",
      },
      { 
        title: "Mastered JOBTREAD API",
        description: "Mastered JOBTREAD API and built custom features.",
        completionDate: "Q4 2024",
        status: "Completed",
      },
    ]
  },
  {
    status: "In Progress",
    icon: Clock,
    color: "from-blue-500 to-indigo-500",
    features: [
      { 
        title: "Dark Mode",
        description: "Switch between light and dark themes for better user experience.",
        eta: "Q1 2025",
        status: "In Progress",
      },
      { 
        title: "Migration Tool",
        description: "Easily migrate data from other platforms to JOBTREAD.",
        eta: "Q1 2025",
        status: "In Progress",
      },
      { 
        title: "Jobs Dashboard",
        description: "Track job progress, status, and completion rates.",
        eta: "Q1 2025",
        status: "In Progress",
      },
      { 
        title: "TV Dashboard",
        description: "Display real-time data on large screens for team visibility.",
        eta: "Q1 2025",
        status: "In Progress",
      },
    ]
  },
  {
    status: "Coming Soon",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    features: [
      { 
        title: "Inventory",
        description: "Track and manage inventory levels and stock availability with JOBTREAD.",
        eta: "Q2 2024",
        status: "Coming Soon",
      },      { 
        title: "Google Calenar Sync",
        description: "Sync your JOBTREAD calendar with Google Calendar for easy scheduling.",
        eta: "Q2 2024",
        status: "Coming Soon",
      },
      { 
        title: "Custom Dashboards",
        description: "Create personalized dashboards tailored to your specific needs.",
        eta: "Q2 2025",
        status: "Coming Soon",
      },
      { 
        title: "Calendly Integration",
        description: "Seamlessly integrate Calendly for appointment scheduling.",
        eta: "Q2 2025",
        status: "Coming Soon",
      },
    ]
  },
  {
    status: "Future Plans",
    icon: Rocket,
    color: "from-purple-500 to-pink-500",
    features: [
      { 
        title: "Ramp Integration",
        description: "Integrate Ramp for expense management and tracking.",
        eta: "2025",
        status: "Future Plans",
      },
      { 
        title: "Dashcard Trends",
        description: "Track trends and patterns in your JOBTREAD data with Dashcards.",
        eta: "2025",
        status: "Future Plans",
      },
      { 
        title: "AI Forecasting",
        description: "Leverage AI to predict future trends and outcomes.",
        eta: "2025",
        status: "Future Plans",
      },
      { 
        title: "Benchmarking on Dashboard",
        description: "Compare your business performance against industry benchmarks.",
        eta: "2025",
        status: "Future Plans",
      },
      { 
        title: "Print Reports",
        description: "Generate JOBTREAD printable reports.",
        eta: "2025",
        status: "Future Plans",
      },
      { 
        title: "Third Party Processor",
        description: "Integrate with third-party payment processors for seamless transactions within JOBTREAD.",
        eta: "2025",
        status: "Future Plans",
      },
      { 
        title: "Job Routing",
        description: "Automate job routing and scheduling based on predefined criteria.",
        eta: "2025",
        status: "Future Plans",
      },
    ]
  }
]

function FeatureCard({ feature, color }: { 
  feature: { 
    title: string; 
    description: string; 
    eta?: string;
    completionDate?: string;
    status: string;
  }, 
  color: string
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group cursor-pointer"
    >
      <div className={`relative p-6 sm:p-8 bg-gradient-to-br ${color} rounded-lg shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl transform group-hover:-translate-y-1`}>
        <div className="absolute inset-0 bg-white opacity-90 group-hover:opacity-80 transition-opacity duration-300" />
        <div className="relative z-10">
          <h3 className="text-xl sm:text-lg font-bold mb-3 sm:mb-2 text-gray-800">
            {feature.title}
          </h3>
          <p className="text-base sm:text-sm text-gray-600 mb-4">{feature.description}</p>
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-700">
              {feature.status === "Completed" ? `Completed: ${feature.completionDate}` : `ETA: ${feature.eta}`}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function KanbanColumn({ section }: { section: string }) {
  const [expanded, setExpanded] = useState(false)
  const visibleFeatures = expanded ? section.features : section.features.slice(0, 3)

  return (
    <div className={`flex-1 w-full sm:min-w-[250px] sm:max-w-[300px] bg-gradient-to-br ${section.color} rounded-lg p-4 sm:p-6 flex flex-col shadow-md`}>
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-2 rounded-full bg-white bg-opacity-20">
          <section.icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">{section.status}</h2>
      </div>
      <AnimatePresence>
        <motion.div
          className={`space-y-4 flex-grow overflow-hidden ${expanded ? 'overflow-y-auto' : ''}`}
          style={{
            height: expanded ? 'auto' : '480px', 
            maxHeight: expanded ? '750px' : '480px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#ffffff40 transparent'
          }}
        >
          {visibleFeatures.map((feature: string) => (
            <FeatureCard key={feature.title} feature={feature} color={section.color} />
          ))}
        </motion.div>
      </AnimatePresence>
      <motion.button
        onClick={() => setExpanded(!expanded)}
        className="text-sm font-medium mt-4 w-full py-2 rounded-md transition-all duration-300 relative overflow-hidden group bg-white bg-opacity-20 text-white hover:bg-opacity-30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span className="relative z-10 flex items-center justify-center">
          {expanded ? (
            <>
              <span>See Less</span>
              <ChevronUp className="inline-block w-4 h-4 ml-1 group-hover:translate-y-[-2px] transition-transform" />
            </>
          ) : (
            <>
              <span>See More</span>
              <ChevronDown className="inline-block w-4 h-4 ml-1 group-hover:translate-y-[2px] transition-transform" />
            </>
          )}
        </motion.span>
      </motion.button>
      <style jsx global>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.4);
          border-radius: 20px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.6);
        }
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.4) transparent;
        }
      `}</style>
    </div>
  )
}

export default function RoadmapPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [email, setEmail] = useState('')

  const filteredRoadmapData = roadmapData.map(section => ({
    ...section,
    features: section.features.filter(feature =>
      feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Submitted email:', email)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FFD400] via-[#000000] to-[#FFFFFF]">
            Product Roadmap
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover the exciting features we&apos;re working on and what&apos;s coming next!
          </p>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search roadmap..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white border-2 border-black focus:outline-none focus:border-[#FFD400] transition-all duration-300 hover:border-[#FFD400]"
            />
            <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FFD400]" />
          </div>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredRoadmapData.map((section) => (
              <KanbanColumn key={section.status} section={section} />
            ))}
          </AnimatePresence>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Stay Tuned for More!</h2>
          <p className="text-gray-600 mb-8">Subscribe to receive updates on our latest features and improvements.</p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="relative flex items-center">
              <div className="relative flex-grow">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-l-md bg-white border-2 border-r-0 border-black focus:outline-none focus:border-[#FFD400] transition-all duration-300"
                  required
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black" />
              </div>
              <motion.button 
                type="submit"
                className="px-8 py-3 bg-[#FFD400] text-black font-bold rounded-r-md transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="absolute inset-0 bg-black"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span 
                  className="relative z-10 flex items-center justify-center"
                  initial={{ color: "#000000" }}
                  whileHover={{ color: "#FFFFFF" }}
                  transition={{ duration: 0.3 }}
                >
                  Subscribe
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </motion.svg>
                </motion.span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

