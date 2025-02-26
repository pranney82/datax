"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Code2, Users, BookText, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Feature {
  title: string
  subtitle: string
  id: string
  description: string
  list: string[]
  image: string
  color: string
  icon: React.ElementType
  link: string
  pattern: string
  videoId: string
}

const features: Feature[] = [
  {
    title: "DATAx Software",
    subtitle: "AUTOMATIONS DONE FOR YOU",
    id: "datax",
    description: "Access dashboards, specialized features and template library.",
    list: ["Dashboards", "Toolbox", "Template Library"],
    image: "/assets/images/feature1.png",
    color: "#ffd400",
    icon: Code2,
    link: "/datax",
    pattern: `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd400' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`,
    videoId: "VIDEO_ID_1",
  },
  {
    title: "CTO Consulting",
    subtitle: "EXPERT AUTOMATION ADVICE",
    id: "cto",
    description: "Get tech advice and automation support from our experienced team.",
    list: ["CTO strategy", "Zapier help", "Custom automations"],
    image: "/assets/images/feature2.png",
    color: "#ffd400",
    icon: Users,
    link: "/cto",
    pattern: `data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd400' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E`,
    videoId: "VIDEO_ID_2",
  },
  {
    title: "Courses",
    subtitle: "AUTOMATION COURSES WITH AN EXPERT",
    id: "courses",
    description: "Enhance your automation skills lead our automation experts.",
    list: ["Automation courses", "Video library", "Build your own automations"],
    image: "/assets/images/feature3.png",
    color: "#ffd400",
    icon: BookText,
    link: "/courses",
    pattern: `data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffd400' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E`,
    videoId: "VIDEO_ID_3",
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
      className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 h-full border-4 border-[#FFD400] hover:shadow-[0_20px_50px_rgba(255,212,0,0.3)] relative"
      style={{
        background: `url("${feature.pattern}"), linear-gradient(to bottom right, white, #f3f3f3)`,
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#FFD400] to-transparent opacity-20"></div>
      <div className="p-4 sm:p-8 flex flex-col h-full relative z-10">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="absolute -top-6 -right-6 bg-[#FFD400] p-4 rounded-full shadow-lg transform rotate-12">
              <IconComponent className="w-8 h-8 sm:w-12 sm:h-12 text-black" />
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black mb-2 leading-tight">
              {feature.title}
            </h3>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-gray-600 mb-4">{feature.subtitle}</h4>
          <div className="relative w-full aspect-[16/10] mb-6">
            <Image
              src={feature.image || "/placeholder.svg"}
              alt={`${feature.title} preview`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: "cover",
              }}
              className="rounded-lg"
            />
          </div>
          <p className="text-gray-700 mb-6 text-base sm:text-lg md:text-xl">{feature.description}</p>
          <ul className="space-y-4 mb-6">
            {feature.list.map((item, i) => (
              <li
                key={i}
                className="flex items-center bg-gradient-to-r from-gray-100 to-white rounded-lg p-3 sm:p-4 shadow-md border-l-4 border-[#FFD400]"
              >
                <div className="mr-3 sm:mr-4 flex-shrink-0 bg-[#FFD400] rounded-full p-1 sm:p-2">
                  <Check className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-gray-800 text-sm sm:text-base font-semibold">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center mt-auto pt-4 sm:pt-6">
          <Link href={feature.link} passHref>
            <Button className="w-full bg-black text-white hover:bg-[#FFD400] hover:text-black transition-all duration-300 py-2 sm:py-3 px-4 sm:px-6 rounded-full font-bold text-base sm:text-lg shadow-md hover:shadow-lg">
              Explore {feature.title}
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </div>
      <Badge className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-[#FFD400] text-black px-2 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wide shadow-md">
        Solution
      </Badge>
    </motion.div>
  )
}

const EpicFeatures = () => {
  const [activeTab, setActiveTab] = useState("datax")

  return (
    <section id="epic-solutions" className="py-12 sm:py-24 w-full bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">3 Different Solutions for You</h2>
          <p className="text-lg sm:text-xl text-gray-300">Choose the perfect fit for your automation needs</p>
        </div>
        <div className="text-center mb-12 sm:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] to-yellow-500"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ffd400] to-[#fff]">DATAx</span>{" "}
            <span className="font-normal">your JOB</span>
            <strong>TREAD</strong>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-white max-w-3xl mx-auto"
          >
            Unlock the full potential of your JOBTREAD data with our three powerful solutions.
          </motion.p>
        </div>

        <div className="mb-12 sm:mb-16">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {" "}
            {/* Update 1: Changed flex-col to flex-wrap */}
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 break-words ${
                  activeTab === feature.id
                    ? "bg-[#FFD400] text-black"
                    : "bg-white bg-opacity-10 text-white hover:bg-opacity-20"
                }`} // Update 2: Added break-words
              >
                {feature.title}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-video w-full max-w-lg mx-auto md:max-w-none">
              <iframe
                src={`https://www.youtube.com/embed/${features.find((f) => f.id === activeTab)?.videoId || "dQw4w9WgXcQ"}`}
                title={`${features.find((f) => f.id === activeTab)?.title} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg"
              ></iframe>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                {features.find((f) => f.id === activeTab)?.title}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6">
                {features.find((f) => f.id === activeTab)?.description}
              </p>
              <ul className="space-y-4 mb-8">
                {features
                  .find((f) => f.id === activeTab)
                  ?.list.map((item, i) => (
                    <li key={i} className="flex items-center text-white">
                      <Check className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-[#FFD400]" />
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
              </ul>
              <Link href={features.find((f) => f.id === activeTab)?.link || "#"} passHref>
                <Button className="w-full sm:w-auto bg-[#FFD400] text-black hover:bg-white hover:text-black transition-all duration-300 py-2 sm:py-3 px-4 sm:px-6 rounded-full font-bold text-base sm:text-lg shadow-md hover:shadow-lg">
                  Explore {features.find((f) => f.id === activeTab)?.title}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* New: Add a visual comparison of the three solutions */}
        <div className="mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Compare Our Solutions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-3 text-white">Feature</th>
                  {features.map((feature) => (
                    <th key={feature.id} className="p-3 text-[#FFD400]">
                      {feature.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-700">
                  <td className="p-3 text-white">Main Focus</td>
                  <td className="p-3 text-gray-300">Software Tools</td>
                  <td className="p-3 text-gray-300">Expert Advice</td>
                  <td className="p-3 text-gray-300">Skill Development</td>
                </tr>
                <tr className="bg-gray-800">
                  <td className="p-3 text-white">Best For</td>
                  <td className="p-3 text-gray-300">DIY Automation</td>
                  <td className="p-3 text-gray-300">Strategic Guidance</td>
                  <td className="p-3 text-gray-300">Learning & Growth</td>
                </tr>
                <tr className="bg-gray-700">
                  <td className="p-3 text-white">Key Benefit</td>
                  <td className="p-3 text-gray-300">Efficiency</td>
                  <td className="p-3 text-gray-300">Expertise</td>
                  <td className="p-3 text-gray-300">Knowledge</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* New: Add a visual workflow diagram */}
        <div className="mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
            How Our Solutions Work Together
          </h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-white">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <Code2 className="mx-auto mb-2 text-[#FFD400]" />
              <p>DATAx Software</p>
            </div>
            <ArrowRight className="text-[#FFD400] transform rotate-90 md:rotate-0" />
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <Users className="mx-auto mb-2 text-[#FFD400]" />
              <p>CTO Consulting</p>
            </div>
            <ArrowRight className="text-[#FFD400] transform rotate-90 md:rotate-0" />
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <BookText className="mx-auto mb-2 text-[#FFD400]" />
              <p>Courses</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EpicFeatures

