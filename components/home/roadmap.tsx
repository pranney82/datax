'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Users, Puzzle, BarChart3, Lock, HeadsetIcon, Sparkles, ChevronRight, Clock, Zap, Rocket, CheckCircle2, ChevronDown, ChevronUp, Mail, Globe, Cloud, Shield, Cpu, Database, Smartphone, Wifi, Layers, Maximize2, Minimize2, Sliders, Repeat, Compass, Hexagon, Aperture, Key } from 'lucide-react'

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
        title: "Jobs Dashboard",
        description: "Export data in various formats for external analysis.",
        completionDate: "Q4 2024",
        status: "Completed",
      },
      { 
        title: "DATAx app live",
        description: "Customer facing DATAx app live and ready to use.",
        completionDate: "Q1 2025",
        status: "Completed",
      },
      { 
        title: "API Integration",
        description: "Connect with third-party services via API.",
        completionDate: "Q2 2022",
        status: "Completed",
      },
      { 
        title: "Mobile Responsive Design",
        description: "Optimize user interface for mobile devices.",
        completionDate: "Q1 2022",
        status: "Completed",
      },
      { 
        title: "Data Visualization",
        description: "Interactive charts and graphs for data representation.",
        completionDate: "Q4 2021",
        status: "Completed",
      },
      { 
        title: "Search Functionality",
        description: "Implement robust search capabilities across the platform.",
        completionDate: "Q3 2021",
        status: "Completed",
      },
      { 
        title: "User Onboarding",
        description: "Guided tour and onboarding process for new users.",
        completionDate: "Q2 2021",
        status: "Completed",
      },
      { 
        title: "Performance Optimization",
        description: "Improve overall system performance and load times.",
        completionDate: "Q1 2021",
        status: "Completed",
      },
      { 
        title: "Multi-language Support",
        description: "Localization for multiple languages and regions.",
        completionDate: "Q4 2020",
        status: "Completed",
      },
      { 
        title: "Data Backup and Recovery",
        description: "Implement automated backup and recovery systems.",
        completionDate: "Q3 2020",
        status: "Completed",
      },
      { 
        title: "Two-Factor Authentication",
        description: "Enhanced security with 2FA implementation.",
        completionDate: "Q2 2020",
        status: "Completed",
      },
      { 
        title: "Custom Branding Options",
        description: "Allow users to customize the interface with their branding.",
        completionDate: "Q1 2020",
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
        title: "AI-Powered Analytics",
        description: "Harness the power of AI to gain deeper insights from your data.",
        eta: "Q3 2023",
        status: "In Progress",
      },
      { 
        title: "Real-time Collaboration",
        description: "Work together seamlessly with your team in real-time.",
        eta: "Q4 2023",
        status: "In Progress",
      },
      { 
        title: "Advanced Search",
        description: "Powerful search capabilities across all data points.",
        eta: "Q3 2023",
        status: "In Progress",
      },
      { 
        title: "Custom Reporting",
        description: "Create and schedule custom reports tailored to your needs.",
        eta: "Q4 2023",
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
        title: "Advanced Integration Hub",
        description: "Connect with more third-party tools and services than ever before.",
        eta: "Q1 2024",
        status: "Coming Soon",
      },
      { 
        title: "Custom Dashboards",
        description: "Create personalized dashboards tailored to your specific needs.",
        eta: "Q2 2024",
        status: "Coming Soon",
      },
      { 
        title: "Mobile App",
        description: "Access your data on-the-go with our new mobile application.",
        eta: "Q2 2024",
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
        title: "Blockchain Integration",
        description: "Leverage blockchain technology for enhanced security and transparency.",
        eta: "2025",
        status: "Future Plans",
      },
      { 
        title: "VR Data Visualization",
        description: "Experience your data in immersive virtual reality environments.",
        eta: "2025",
        status: "Future Plans",
      },
      { 
        title: "AI-Driven Predictions",
        description: "Utilize advanced AI models to predict future trends and outcomes.",
        eta: "2025",
        status: "Future Plans",
      },
      { 
        title: "Global Data Sync",
        description: "Seamlessly synchronize data across multiple regions and data centers.",
        eta: "2026",
        status: "Future Plans",
      },
      { 
        title: "Quantum Computing Support",
        description: "Harness the power of quantum computing for complex calculations.",
        eta: "2026",
        status: "Future Plans",
      },
      { 
        title: "Edge Computing Integration",
        description: "Implement edge computing for faster data processing and reduced latency.",
        eta: "2026",
        status: "Future Plans",
      },
      { 
        title: "Augmented Reality Overlays",
        description: "Add AR capabilities to enhance real-world data visualization.",
        eta: "2027",
        status: "Future Plans",
      },
      { 
        title: "Natural Language Processing",
        description: "Implement advanced NLP for more intuitive user interactions.",
        eta: "2027",
        status: "Future Plans",
      },
      { 
        title: "Biometric Authentication",
        description: "Enhance security with multi-factor biometric authentication.",
        eta: "2027",
        status: "Future Plans",
      },
      { 
        title: "Predictive Maintenance",
        description: "Use AI to predict and prevent system failures before they occur.",
        eta: "2028",
        status: "Future Plans",
      },
      { 
        title: "Holographic Interfaces",
        description: "Develop holographic user interfaces for immersive data interaction.",
        eta: "2028",
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

function KanbanColumn({ section }: { section: any }) {
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
          {visibleFeatures.map((feature: any) => (
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
            Discover the exciting features we're working on and what's coming next!
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

