"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart3,
  BookOpen,
  Box,
  PlayCircle,
  Rocket,
  Coins,
  CheckCircle,
  ArrowLeftRight,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

const features = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: BarChart3,
    description: "Get a bird's-eye view of your business with real-time analytics and interactive charts.",
    videoId: "FiAXjvgV0Zc",
    thumbnail: "/assets/thumbnails/dashboard.png",
    details: [
      "Summary of active jobs and monthly revenue",
      "Lead sources and conversion rates",
      "Sales performance and goal tracking",
    ],
  },
  {
    id: "toolbox",
    title: "Toolbox",
    icon: Box,
    description: "Access a suite of powerful tools to streamline your workflow and boost productivity.",
    videoId: "uSIgiQ4v_mk",
    thumbnail: "/assets/thumbnails/toolbox.png",
    details: [
      "Zillow data integration for property insights",
      "Job cover photo generator using Google Street View",
      "Cash flow tracker for financial management",
    ],
  },
  {
    id: "library",
    title: "Library",
    icon: BookOpen,
    description: "A community resource with templats from other JOBTREAD users, free for all users.",
    videoId: "SxHCTr0IWSc",
    thumbnail: "/assets/thumbnails/library.png",
    details: [
      "Customizable cost group templates by project type",
      "Pre-built schedule templates for efficient planning",
      "API scripts for seamless integration with other tools",
    ],
  },
]

const sellingPoints = [
  {
    title: "Boost Efficiency",
    description: "Streamline your workflow and increase productivity with our dashboard, toolbox and library.",
    icon: Rocket,
  },
  {
    title: "Seamless Integration",
    description: "Efforless automation, easily connect using your JOBTREAD crendtials and you are ready to go!",
    icon: ArrowLeftRight,
  },
  {
    title: "Cost-Effective",
    description: "Maximize your ROI with our features already built for you starting at $29/m.",
    icon: Coins,
  },
]

const ParticleField = () => {
  const particleCount = 100
  const speed = 10

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {[...Array(particleCount)].map((_, i) => {
        const size = Math.random() > 0.8 ? 8 : Math.random() > 0.4 ? 6 : 4
        const color = Math.random() > 0.6 ? "#FFD400" : "#FFFFFF"
        const randomX = Math.random()
        const randomY = Math.random()
        const moveRange = Math.random() * 0.3 + 0.1 // 10-40% movement range

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            initial={{
              x: randomX * window.innerWidth,
              y: randomY * 1000,
              scale: Math.random() * 0.3 + 0.7, // Random initial scale between 0.7-1
            }}
            animate={{
              x: [
                randomX * window.innerWidth,
                (randomX + (Math.random() - 0.5) * moveRange) * window.innerWidth,
                randomX * window.innerWidth,
              ],
              y: [randomY * 1000, (randomY + (Math.random() - 0.5) * moveRange) * 1000, randomY * 1000],
              scale: [Math.random() * 0.3 + 0.7, Math.random() * 0.4 + 0.8, Math.random() * 0.3 + 0.7],
            }}
            transition={{
              duration: Math.random() * speed + speed,
              scale: {
                duration: Math.random() * 2 + 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
              x: {
                duration: Math.random() * speed + speed,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                repeatType: "reverse",
              },
              y: {
                duration: Math.random() * speed + speed,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                repeatType: "reverse",
              },
            }}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              opacity: 0.7,
            }}
          />
        )
      })}
    </div>
  )
}

const YouTubeEmbed = ({ videoId, thumbnail }: { videoId: string; thumbnail?: string }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden">
      {!isPlaying ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Video thumbnail"
            className="w-full h-full object-cover rounded-lg"
          />
          <div
            className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center cursor-pointer rounded-lg"
            onClick={() => setIsPlaying(true)}
          >
            <PlayCircle className="w-16 h-16 text-white" />
          </div>
        </div>
      ) : (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          className="rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const [activeFeature, setActiveFeature] = useState("dashboard")
  return (
    <main className="flex flex-col min-h-screen bg-black text-white relative overflow-hidden">
      <div className="relative">
        <ParticleField />
        {/* Hero Section */}
        <motion.section className="relative min-h-[90vh] flex items-center justify-center">
          <div className="text-center z-10 px-4">
            {/* Update 1 */}
            {/* Features Section */}
            <motion.section id="features" className="relative py-12 w-full">
              <div className="container max-w-7xl mx-auto px-2 sm:px-4">
                <motion.h1
                  className="text-7xl font-extrabold mb-4 glitch relative pt-16"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-[#FFD400]">DATAx</span> Software
                </motion.h1>
                <motion.p
                  className="text-3xl mb-12"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Done for <span className="text-[#FFD400]">YOU</span> at $29/m
                </motion.p>

                <div className="flex justify-center mb-12 relative z-10">
                  <div className="flex flex-wrap justify-center items-center gap-3 border-b border-white/10 bg-white/5 backdrop-blur-sm px-2 sm:px-6 lg:px-8 py-3 sm:py-1.5 rounded-t-lg w-full">
                  {features.map((feature) => (
                    <motion.div
                      key={feature.id}
                      whileTap={{ scale: 0.98 }}
                      className="relative flex justify-center"
                    >
                      <Button
                        onClick={() => setActiveFeature(feature.id)}
                        className={`text-lg sm:text-lg lg:text-xl px-4 sm:px-5 lg:px-6 py-4 sm:py-4 lg:py-5 rounded-none transition-colors duration-200 flex items-center relative bg-transparent hover:bg-transparent w-auto ${
                          activeFeature === feature.id
                            ? "text-[#FFD400] bg-[#FFD400]/5 sm:bg-transparent after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#FFD400] after:scale-x-100 after:origin-bottom-left"
                            : "text-white/80 hover:text-[#FFD400] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#FFD400] after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                        }`}
                      >
                        <feature.icon className="w-6 h-6 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mr-2.5" />
                        {feature.title}
                        {feature.id === 'library' && (
                          <Badge 
                            className="ml-2 border-none font-bold bg-[#FFD400] text-black hover:bg-[#FFD400]"
                          >
                            FREE
                          </Badge>
                        )}
                      </Button>
                    </motion.div>
                  ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {features.map(
                    (feature) =>
                      feature.id === activeFeature && (
                        <motion.div
                          key={feature.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                          className="grid md:grid-cols-2 gap-8 items-center relative z-10 w-full"
                        >
                          <div className="text-left bg-black/30 backdrop-filter backdrop-blur-sm p-6 rounded-lg">
                            <h3 className="text-3xl font-bold mb-4 flex items-center">
                              <feature.icon className="w-8 h-8 mr-2 text-[#FFD400]" />
                              {feature.title}
                              {feature.id === 'library' && (
                                <Badge 
                                  className="ml-3 bg-[#FFD400] text-black border-none font-bold text-sm hover:bg-[#FFD400]"
                                >
                                  FREE FOREVER
                                </Badge>
                              )}
                            </h3>
                            <p className="text-xl mb-6">{feature.description}</p>
                            <ul className="space-y-2 mb-8">
                              {feature.details.map((detail, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle className="w-6 h-6 text-[#FFD400] mr-2 flex-shrink-0 mt-1" />
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="text-left">
                              <Button
                                className="bg-[#FFD400] text-black hover:bg-[#FFD400]/90 px-4 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-300 shadow-[0_0_10px_rgba(255,212,0,0.3)] hover:shadow-[0_0_15px_rgba(255,212,0,0.5)] hover:scale-[1.02] text-base sm:text-xl font-semibold flex items-center gap-2 w-full mx-auto"
                                onClick={() => router.push("/sign-up")}
                              >
                                <span className="hidden sm:inline">Get Started with DATAx Software</span>
                                <span className="sm:hidden">Get Started</span>
                                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                              </Button>
                            </div>
                          </div>
                          <div className="relative aspect-video rounded-lg overflow-hidden">
                            <YouTubeEmbed videoId={feature.videoId} thumbnail={feature.thumbnail} />
                          </div>
                        </motion.div>
                      ),
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          </div>
        </motion.section>
      </div>

      {/* Selling Points Section */}
      <motion.section
        className="relative py-16 bg-gradient-to-br from-black via-black to-[#FFD400]/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <ParticleField />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#FFD400]">Why Choose DATAx?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {sellingPoints.map((point, index) => (
              <motion.div
                key={index}
                className="bg-black/50 backdrop-blur-sm border border-[#FFD400] rounded-lg p-6 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 212, 0, 0.3)" }}
              >
                <point.icon className="w-16 h-16 text-[#FFD400] mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-white">{point.title}</h3>
                <p className="text-white/80">{point.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  )
}

