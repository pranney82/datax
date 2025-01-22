"use client"

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
}

const features: Feature[] = [
  {
    title: "DATAx",
    subtitle: "AUTOMATIONS DONE FOR YOU ",
    id: "datax",
    description: "Transform your JOBTREAD data into actionable insights with our powerful Software DATAx solution.",
    list: ["Real-time data analysis", "Custom dashboards", "Automated reporting"],
    image: "/assets/images/feature1.png",
    color: "#ffd400",
    icon: Code2,
    link: "/pricing",
    pattern: `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd400' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`,
  },
  {
    title: "CTO Consulting",
    subtitle: "EXPERT TECH GUIDANCE",
    id: "cto",
    description: "Get strategic technology advice and implementation support from our experienced CTO consultants.",
    list: ["Technology strategy", "Process optimization", "Custom solutions"],
    image: "/assets/images/feature2.png",
    color: "#ffd400",
    icon: Users,
    link: "/pricing/#cto-consulting",
    pattern: `data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd400' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E`,
  },
  {
    title: "Courses",
    subtitle: "AUTOMATION COURSES WITH AN EXPERT",
    id: "courses",
    description: "Enhance your skills and maximize your JOBTREAD experience with our comprehensive online course.",
    list: ["In-depth tutorials", "Best practices", "Hands-on exercises"],
    image: "/assets/images/feature3.png",
    color: "#ffd400",
    icon: BookText,
    link: "/courses",
    pattern: `data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffd400' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E`,
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
      <div className="p-8 flex flex-col h-full relative z-10">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="absolute -top-6 -right-6 bg-[#FFD400] p-4 rounded-full shadow-lg transform rotate-12">
              <IconComponent className="w-12 h-12 text-black" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-black mb-2 leading-tight">{feature.title}</h3>
          </div>
          <h4 className="text-sm font-bold text-gray-600 mb-4">{feature.subtitle}</h4>
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
          <p className="text-gray-700 mb-6 text-lg sm:text-xl">{feature.description}</p>
          <ul className="space-y-4 mb-6">
            {feature.list.map((item, i) => (
              <li
                key={i}
                className="flex items-center bg-gradient-to-r from-gray-100 to-white rounded-lg p-4 shadow-md border-l-4 border-[#FFD400]"
              >
                <div className="mr-4 flex-shrink-0 bg-[#FFD400] rounded-full p-2">
                  <Check className="text-white w-5 h-5" />
                </div>
                <span className="text-gray-800 text-base font-semibold">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center mt-auto pt-6">
          <Link href={feature.link} passHref>
            <Button className="w-full bg-black text-white hover:bg-[#FFD400] hover:text-black transition-all duration-300 py-3 px-6 rounded-full font-bold text-lg shadow-md hover:shadow-lg">
              Explore {feature.title}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
      <Badge className="absolute top-4 left-4 bg-[#FFD400] text-black px-3 py-1 rounded-full font-bold text-sm uppercase tracking-wide shadow-md">
        Solution
      </Badge>
    </motion.div>
  )
}

const EpicFeatures = () => {
  return (
    <section id="epic-features" className="py-24 w-full bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] to-yellow-500"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ffd400] to-[#fff]">DATAx</span>{" "}
            <span className="font-normal">your JOB</span>
            <strong>TREAD</strong>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white max-w-3xl mx-auto"
          >
            Unlock the full potential of your JOBTREAD data with our expert solutions and training.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EpicFeatures

