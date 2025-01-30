"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Box,
  ChevronDown,
  Code,
  Cpu,
  Rocket,
  Workflow,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Styles
const globalStyles = `
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  .shimmer {
    animation: shimmer 2s infinite linear;
    background: linear-gradient(to right, #222 0%, #333 20%, #222 40%, #222 100%);
    background-size: 1000px 100%;
  }

  .bg-grid-pattern {
    background-image: 
      linear-gradient(to right, rgba(255, 212, 0, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 212, 0, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  @keyframes twinkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes shooting-star {
    0% {
      transform: translateX(0) translateY(0) rotate(45deg);
      opacity: 1;
    }
    100% {
      transform: translateX(1000px) translateY(1000px) rotate(45deg);
      opacity: 0;
    }
  }

  .animate-twinkle {
    animation: twinkle 4s infinite;
  }

  .shooting-star {
    position: absolute;
    width: 100px;
    height: 1px;
    background: linear-gradient(90deg, #FFD400, transparent);
    animation: shooting-star 6s linear infinite;
  }

  .shooting-star::before {
    content: '';
    position: absolute;
    top: calc(50% - 1px);
    right: 0;
    width: 15px;
    height: 2px;
    background: linear-gradient(90deg, #FFD400, transparent);
    transform: translateX(50%) rotateZ(45deg);
  }

  .gradient-text {
    background: linear-gradient(45deg, #FFD400, #FFF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @keyframes shine {
    0% {
      background-position: 200% center;
    }
    100% {
      background-position: -200% center;
    }
  }

  .animate-shine {
    animation: shine 3s linear infinite;
    background-size: 200% auto;
  }
  .animate-pulse {
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.1);
    }
  }

  .animate-text {
    animation: animate-text 2s ease-in-out infinite;
  }
  @keyframes animate-text {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`

// Components
const Sparkles = () => (
  <>
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `twinkle ${Math.random() * 4 + 2}s infinite, pulse 2s ease-in-out infinite`,
        }}
      />
    ))}
  </>
)

const FeatureItem = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <motion.div
    className="flex items-center space-x-4 py-3 px-4 bg-white bg-opacity-80 rounded-lg shadow-lg transition-all duration-300 hover:bg-opacity-100 hover:shadow-xl border border-white hover:border-yellow-500"
    whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
    transition={{ duration: 0.2 }}
  >
    <div className="bg-yellow-400 p-2 rounded-full transition-all duration-300 group-hover:bg-yellow-500 border border-white shadow-md">
      <Icon className="w-5 h-5 text-black" />
    </div>
    <span className="text-sm font-semibold text-gray-800">{text}</span>
  </motion.div>
)

const KeyFeatureCard = ({
  icon,
  title,
  description,
}: { icon: React.ReactNode; title: string; description: string }) => (
  <motion.div
    className="bg-gradient-to-br from-white via-yellow-50 to-gray-100 rounded-lg p-6 shadow-lg transition-all duration-300 overflow-hidden relative"
    whileTap={{ scale: 0.95 }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-[#FFD400]/20 via-[#FFD400]/10 to-transparent opacity-80"></div>
    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
    <motion.div
      className="flex items-center mb-4 relative z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mr-4 text-yellow-600 bg-yellow-100 p-3 rounded-full border-2 shadow-lg animate-pulse">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 border-b-2 inline-block pb-1">{title}</h3>
    </motion.div>
    <motion.p
      className="text-gray-600 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {description}
    </motion.p>
    <motion.div
      className="mt-4 h-1 bg-gradient-to-r from-black to-transparent"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    />
  </motion.div>
)

const features = [
  {
    id: "dashboard",
    title: "Dashboard",
    description:
      "Transform your data into interactive charts and graphs for clear insights. Make informed decisions faster and smarter.",
    icon: BarChart3,
    features: [
      { icon: BarChart3, text: "Summary - Active jobs map, Monthly revenue" },
      { icon: BarChart3, text: "Leads - Sources, Conversion rates, Stage" },
      { icon: BarChart3, text: "Sales - Total Revenue, By lead source, Set goals" },
    ],
    ctaText: "Unlock Dashboard",
  },
  {
    id: "toolbox",
    title: "Toolbox",
    description:
      "Leverage a suite of specialized tools for automation and optimization. Streamline workflows, save time, and boost productivity.",
    icon: Box,
    features: [
      { icon: Box, text: "Zillow Data - Zestimate, SF, Date sold, etc" },
      { icon: Box, text: "Job Cover Photo - Use the google street view" },
      { icon: Box, text: "Cash Flow - Track with cash in and out" },
    ],
    ctaText: "Unlock Toolbox",
  },
  {
    id: "library",
    title: "Library",
    description:
      "Access a comprehensive library of templates and resources. Get pre-built solutions and expert guidance from our extensive documentation.",
    icon: BookOpen,
    features: [
      { icon: BookOpen, text: "Cost Groups - By project" },
      { icon: BookOpen, text: "Schedules - Pre-built templates" },
      { icon: BookOpen, text: "API Scripts - Utilize in your own zaps" },
    ],
    ctaText: "Unlock Library",
  },
]

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  features,
  ctaText,
}: {
  title: string
  description: string
  icon: React.ElementType
  features: { icon: React.ElementType; text: string }[]
  ctaText: string
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="relative group p-[1px] bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300"
    >
      <Card className="bg-gradient-to-br from-white to-gray-100 bg-gradient-to-b from-[#FFD400] via-[#FFD400]/50 to-transparent opacity-95 text-gray-800 border-none overflow-hidden relative transition-all duration-300 shadow-2xl backdrop-blur-md rounded-lg border border-yellow-200/30">
        <CardContent className="relative z-10 p-6 sm:p-8 md:p-10">
          <div className="absolute inset-0 bg-white bg-opacity-60 z-0"></div>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 z-0"></div>
          <div className="space-y-8 relative z-10">
            <motion.div
              className="flex flex-col items-start space-y-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-400 rounded-lg shadow-md">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-clip-text text-gray-900 bg-gradient-to-r from-yellow-600 to-yellow-800">
                  {title}
                </h2>
              </div>
              <p className="text-xl text-gray-700 w-full leading-relaxed">{description}</p>
            </motion.div>
            <motion.div
              className="flex flex-col md:flex-row gap-8 md:gap-12 items-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              layout
            >
              <motion.div
                className="w-full md:w-1/2 relative overflow-hidden rounded-lg shadow-lg order-1"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{ aspectRatio: "16/9" }}
              >
                <iframe
                  src="https://www.youtube.com/embed/FiAXjvgV0Zc"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </motion.div>
              <motion.div
                className="w-full md:w-1/2 space-y-8 order-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.div
                  className="bg-white rounded-xl p-6 shadow-xl relative overflow-hidden border-2 border-yellow-200"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                >
                  <motion.div
                    className="flex items-center justify-between mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
                  >
                    <h3 className="text-2xl font-extrabold text-gray-800">Key Features</h3>
                    <Zap className="w-6 h-6 text-yellow-500" />
                  </motion.div>
                  <motion.div
                    className="grid grid-cols-1 gap-4"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                        },
                      },
                    }}
                    initial="hidden"
                    animate="show"
                  >
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          show: { opacity: 1, y: 0 },
                        }}
                      >
                        <FeatureItem {...feature} />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </CardContent>
        <CardFooter className="relative z-10 p-6 sm:p-8 md:p-10">
          <motion.div className="w-full" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href={`/pricing/#xpricing`} passHref>
              <Button
                className="w-full bg-[#ffd400] text-black transition-all duration-300 text-xl py-7 font-bold rounded-full hover:bg-black hover:text-[#ffd400] focus:outline-none focus:ring-2 focus:ring-[#ffd400] focus:ring-opacity-50 relative overflow-hidden transform hover:scale-105 active:scale-95"
                variant="secondary"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {ctaText}
                  <ArrowRight className="ml-2 h-6 w-6 transition-transform duration-300 ease-in-out group-hover:translate-x-2" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default function Home() {
  const [activeFeature, setActiveFeature] = useState("dashboard")

  return (
    <main className="flex flex-col min-h-screen bg-black text-white">
      <style jsx global>
        {globalStyles}
      </style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/stars.png')] bg-repeat animate-twinkle"></div>
          <div className="absolute inset-0 opacity-30 mix-blend-screen">
            <div className="absolute inset-0 bg-gradient-radial from-[#FFD400]/30 via-transparent to-transparent"></div>
            <div
              className="absolute inset-0 bg-gradient-radial from-[#FFD400]/20 via-transparent to-transparent"
              style={{ transform: "translate(25%, 25%)" }}
            ></div>
          </div>
          <div className="absolute inset-0">
            <div className="shooting-star"></div>
            <div className="shooting-star" style={{ animationDelay: "2s" }}></div>
            <div className="shooting-star" style={{ animationDelay: "4s" }}></div>
          </div>
          <Sparkles />
        </div>
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 py-20">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] via-yellow-500 to-yellow-600 animate-text relative text-shadow"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Unleash Automations
          </motion.h1>
          <motion.p
            className="text-3xl mb-8 text-white font-light leading-relaxed"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Powerful <span className="font-semibold text-[#FFD400]">automations</span>, done-for-
            <span className="font-semibold text-[#FFD400]">you!</span>
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              className="bg-[#ffd400] text-[#000] hover:bg-[#FFD400] hover:text-[#000] text-lg px-12 py-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
              onClick={() => {
                const featuresSection = document.getElementById("features-section")
                if (featuresSection) {
                  featuresSection.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              Get Started
              <Rocket className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            whileHover={{ scale: 1.1 }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          >
            <ChevronDown className="w-10 h-10 text-[#FFD400]" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features-section"
        className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden border-t border-yellow-500/20"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-500/10 animate-gradient" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                  DATAx
                </span>{" "}
                your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                  JOBTREAD
                </span>
              </motion.span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Unlock automations for your JOBTREAD with our done-for-you solution.
            </p>
          </motion.div>

          <nav className="flex justify-center mb-12 sticky top-4 z-40 px-4 sm:px-0" aria-label="Feature navigation">
            <div className="relative flex w-full max-w-3xl justify-between bg-white/10 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-white/20">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={cn(
                    "group relative px-4 sm:px-6 py-3.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 overflow-hidden flex-1",
                    activeFeature === feature.id
                      ? "text-gray-900 font-bold bg-yellow-400 shadow-md"
                      : "text-gray-300 hover:text-yellow-400 hover:bg-white/20",
                  )}
                  aria-selected={activeFeature === feature.id}
                  role="tab"
                >
                  <feature.icon
                    className={cn(
                      "w-6 h-6 transition-all duration-300",
                      activeFeature === feature.id
                        ? "text-gray-800 drop-shadow-[0_0_3px_rgba(0,0,0,0.3)]"
                        : "text-gray-300 group-hover:text-yellow-400",
                    )}
                  />
                  <span>{feature.title}</span>
                </button>
              ))}
            </div>
          </nav>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-12"
            >
              <FeatureCard {...features.find((f) => f.id === activeFeature)!} />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-500/5 animate-gradient"></div>
        <div className="px-4 max-w-7xl mx-auto relative z-10">
          <motion.h2
            className="text-5xl font-bold mb-16 text-center gradient-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Unleash the Power of <span className="text-[#FFD400]">DATAx</span>
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            animate="show"
          >
            <KeyFeatureCard
              icon={<Code className="w-12 h-12" />}
              title="Code-Free"
              description="Just turn it on and go—we’ve done the heavy lifting for you! Effortlessly automate your workflows without writing a single line of code."
            />
            <KeyFeatureCard
              icon={<Cpu className="w-12 h-12" />}
              title="Headless"
              description="Leverage JOBTREAD’s API without frontend limits. Custom solutions, automate workflows, and scale without constraints."
            />
            <KeyFeatureCard
              icon={<Workflow className="w-12 h-12" />}
              title="Seamless Integration"
              description="Easily connect your tools and systems with the JOBTREAD API for a unified workflow and streamlined processes—effortless automation!"
            />
          </motion.div>
        </div>
      </section>
    </main>
  )
}

