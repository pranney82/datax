"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Code2, Users, BookText, ArrowRight, Check, ChevronDown, PlayCircle } from "lucide-react"
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
  thumbnailUrl: string
}

const features: Feature[] = [
  {
    title: "DATAx Software",
    subtitle: "AUTOMATIONS DONE FOR YOU",
    id: "datax",
    description: "Access dashboards, specialized features and template library all for $29/m.",
    list: ["Dashboards", "Toolbox", "Template Library"],
    image: "/assets/images/feature1.png",
    color: "#ffd400",
    icon: Code2,
    link: "/datax",
    pattern: `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd400' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`,
    videoId: "FiAXjvgV0Zc",
    thumbnailUrl: "/assets/thumbnails/dataxwhat.png",
  },
  {
    title: "CTO Consulting",
    subtitle: "EXPERT AUTOMATION ADVICE",
    id: "cto",
    description: "Get custom automation consulting specifically for your needs from our experienced team.",
    list: ["CTO strategy", "Zapier builds", "Custom automations"],
    image: "/assets/images/feature2.png",
    color: "#ffd400",
    icon: Users,
    link: "/cto",
    pattern: `data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd400' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E`,
    videoId: "VIDEO_ID_2",
    thumbnailUrl: "/assets/thumbnails/cto.png",
  },
  {
    title: "Automation Courses",
    subtitle: "AUTOMATION COURSES WITH AN EXPERT",
    id: "courses",
    description: "Learn from our automation experts how to build and manage your own automations.",
    list: ["Automation courses", "Video library", "Build your own automations"],
    image: "/assets/images/feature3.png",
    color: "#ffd400",
    icon: BookText,
    link: "/courses",
    pattern: `data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffd400' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E`,
    videoId: "-N1rk-aY4tU",
    thumbnailUrl: "/assets/thumbnails/course1.png",
  }
]

const EpicFeatures = () => {
  const [activeTab, setActiveTab] = useState("datax")
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <section id="epic-solutions" className="py-12 sm:py-24 w-full bg-black">
      <div className="container mx-auto px-4">
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
            Three automation solutions to maximize your efficiency
          </motion.p>
        </div>

        <div className="mb-12 sm:mb-16">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => {
                  setActiveTab(feature.id)
                  setIsVideoPlaying(false)
                }}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 break-words ${
                  activeTab === feature.id
                    ? "bg-[#FFD400] text-black"
                    : "bg-white bg-opacity-10 text-white hover:bg-[#FFD400] hover:text-black"
                }`}
              >
                {feature.title}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-video w-full max-w-lg mx-auto md:max-w-none">
              <img
                src={features.find((f) => f.id === activeTab)?.thumbnailUrl}
                alt={`${features.find((f) => f.id === activeTab)?.title} thumbnail`}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
              <iframe
                style={{ opacity: isVideoPlaying ? 1 : 0 }}
                src={`https://www.youtube.com/embed/${features.find((f) => f.id === activeTab)?.videoId || "dQw4w9WgXcQ"}${isVideoPlaying ? '?autoplay=1' : ''}`}
                title={`${features.find((f) => f.id === activeTab)?.title} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg transition-opacity duration-300"
              ></iframe>
              {!isVideoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors z-10 rounded-lg cursor-pointer" onClick={() => setIsVideoPlaying(true)}>
                  <PlayCircle className="w-16 h-16 text-white opacity-90" />
                </div>
              )}
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
                      <span className="text-sm sm:text-base flex items-center gap-2">
                        {item}
                        {item === "Template Library" && (
                          <Badge variant="secondary" className="bg-[#FFD400] text-black text-xs">
                            FREE FOREVER
                          </Badge>
                        )}
                      </span>
                    </li>
                  ))}
              </ul>
              <Link href={features.find((f) => f.id === activeTab)?.link || "#"} passHref>
                <Button className="w-full sm:w-auto bg-[#FFD400] text-black hover:bg-white hover:text-black transition-all duration-300 py-3 sm:py-4 px-6 sm:px-8 rounded-full font-bold text-lg sm:text-xl shadow-md hover:shadow-lg min-w-[200px]">
                  Explore {features.find((f) => f.id === activeTab)?.title}
                  <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced comparison table */}
        <div className="mb-16">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">Compare Our Solutions</h3>
          <div className="overflow-hidden rounded-lg shadow-lg bg-black border border-[#ffd400]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-[#ffd400]">
                  <tr>
                    <th className="p-4 text-left text-black font-bold">Feature</th>
                    {features.map((feature) => (
                      <th key={feature.id} className="p-4 text-left text-black font-bold hidden md:table-cell">
                        {feature.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Main Benefit", values: ["Done For You", "Built For You", "Learn with Expert"] },
                    { label: "Best For", values: ["All JT Users", "Custom Needs", "Learning & Growth"] },
                    { label: "Key Value", values: ["Sign up and Go!", "Custom to Your Needs", "Knowledge"] },
                    { label: "Cost", values: ["$", "$$$", "$$"] },
                  ].map((row, rowIndex) => (
                    <React.Fragment key={row.label}>
                      <tr
                        className={`${rowIndex % 2 === 0 ? "bg-black" : "bg-[#111]"} md:hover:bg-[#222] transition-colors duration-300`}
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            setExpandedRows((prev) => (prev.includes(row.label) ? [] : [row.label]))
                          }
                        }}
                      >
                        <td className="p-4 text-[#ffd400] font-semibold border-t border-[#333] flex items-center justify-between">
                          {row.label}
                          <ChevronDown
                            className={`h-5 w-5 transition-transform duration-300 md:hidden ${
                              expandedRows.includes(row.label) ? "transform rotate-180" : ""
                            }`}
                          />
                        </td>
                        {row.values.map((value, colIndex) => (
                          <td key={colIndex} className="p-4 text-white border-t border-[#333] hidden md:table-cell">
                            {value}
                          </td>
                        ))}
                      </tr>
                      <AnimatePresence initial={false}>
                        {expandedRows.includes(row.label) && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                              opacity: { duration: 0.2 },
                            }}
                            className={rowIndex % 2 === 0 ? "bg-black" : "bg-[#111]"}
                          >
                            <td colSpan={4} className="p-4 md:hidden">
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="grid gap-4"
                              >
                                {row.values.map((value, colIndex) => (
                                  <div key={colIndex} className="flex flex-col">
                                    <span className="font-semibold text-[#ffd400]">{features[colIndex].title}</span>
                                    <span className="text-white">{value}</span>
                                  </div>
                                ))}
                              </motion.div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EpicFeatures

