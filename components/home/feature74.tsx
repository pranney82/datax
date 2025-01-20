"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { BarChart3, Box, BookOpen, Cog, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Feature {
  title: string
  subtitle: string
  id: string
  description: string
  list: string[]
  image: string
  color: string
  icon: LucideIcon
  link: string
}

const features: Feature[] = [
  {
    title: "Dashboard",
    subtitle: "VISUALIZE YOUR JOBTREAD DATA",
    id: "dashboard",
    description:
      "Unlock your business's full potential with our powerful Dashboard—offering a bird's-eye view, key metrics tracking, and data-driven insights.",
    list: ["Your JOBTREAD data", "Real-time data", "Set goals"],
    image: "/assets/images/feature1.png",
    color: "#ffd400",
    icon: BarChart3,
    link: "/pricing",
  },
  {
    title: "Toolbox",
    subtitle: "SPECIALTY FEATURES FOR YOUR JOBTREAD",
    id: "toolbox",
    description:
      "Supercharge your workflow with our cutting-edge Toolbox—designed for JOBTREAD users, delivering specialty, code-free solutions to boost productivity.",
    list: ["Pre-built specialty features", "Automations & Integrations", "Code free, just turn on"],
    image: "/assets/images/feature2.png",
    color: "#ffd400",
    icon: Box,
    link: "/pricing",
  },
  {
    title: "Automation",
    subtitle: "STREAMLINE YOUR WORKFLOW",
    id: "automation",
    description:
      "Revolutionize your business processes with our Automation feature—integrating Zapier, custom formulas, and expert CTO consulting for unparalleled efficiency.",
    list: ["Zapier integrations", "Custom formulas", "CTO consulting"],
    image: "/assets/images/feature4.png",
    color: "#ffd400",
    icon: Cog,
    link: "/pricing",
  },
  {
    title: "Library",
    subtitle: "MAXIMIZE YOUR JOBTREAD EXPERIENCE",
    id: "library",
    description:
      "Access a wealth of resources in our comprehensive Library—featuring ready-to-use templates and expert guides to help your team excel effortlessly.",
    list: ["Extensive template collection", "Pre-built templates", "Cost Groups, Schedules, Todos"],
    image: "/assets/images/feature3.png",
    color: "#ffd400",
    icon: BookOpen,
    link: "/pricing",
  },
]

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const IconComponent = feature.icon

  return (
    <motion.div
      id={feature.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`bg-gradient-to-br from-black via-black to-[#111] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#ffd400] flex flex-col lg:flex-row ${index % 2 === 0 ? "" : "lg:flex-row-reverse"}`}
    >
      <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-extrabold mb-2 text-[#ffd400] leading-tight">{feature.title}</h2>
          <h3 className="text-sm font-bold text-white mb-4">{feature.subtitle}</h3>
          <p className="text-gray-300 mb-8">{feature.description}</p>
          <ul className="space-y-5">
            {feature.list.map((item, i) => (
              <li key={i} className="flex items-center bg-gradient-to-r from-[#222] to-[#333] rounded-lg p-4 shadow-lg">
                <div className="mr-4 flex-shrink-0 bg-[#ffd400] rounded-full p-2">
                  <IconComponent className="text-black w-5 h-5" />
                </div>
                <span className="text-white text-base font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden lg:block mt-6">
          <Link href={feature.link} passHref>
            <Button className="w-full bg-gradient-to-r from-[#FFD400] to-[#FFA500] text-black font-bold py-3 rounded-full transition-all duration-300 transform hover:scale-105 relative overflow-hidden group">
              <span className="relative z-10 transition-colors duration-300">Explore {feature.title}</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Button>
          </Link>
        </div>
      </div>
      <div className="lg:w-1/2 relative p-4 lg:p-8 flex items-center justify-center">
        <div className="relative w-full aspect-[4/3] max-w-lg mx-auto">
          <Image
            src={feature.image || "/placeholder.svg"}
            alt={`${feature.title} preview`}
            layout="fill"
            objectFit="cover"
            quality={100}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
      <div className="p-6 lg:hidden">
        <Link href={feature.link} passHref>
          <Button className="w-full bg-gradient-to-r from-[#FFD400] to-[#FFA500] text-black font-bold py-3 rounded-full transition-all duration-300 transform hover:scale-105 relative overflow-hidden group">
            <span className="relative z-10 transition-colors duration-300">Explore {feature.title}</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}

const EpicFeatures = () => {
  return (
    <section
      id="epic-features"
      className="py-16 md:py-24 bg-gradient-to-b from-black to-[#111] text-white overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-center mb-4 md:mb-6 leading-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ffd400] to-[#fff]">DATAx</span>{" "}
          <span className="font-normal">your JOB</span>
          <strong>TREAD</strong>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-center mb-12 md:mb-16 text-gray-300 max-w-3xl mx-auto"
        >
          Spend less time managing data and creating automations—and more time growing your business.
        </motion.p>

        <div className="space-y-8 lg:space-y-16">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EpicFeatures

