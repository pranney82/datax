"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Zap, ArrowRight, Hammer, Paintbrush, Drill, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"

const footerLinks = [
  {
    title: "Solutions",
    links: [
      { name: "DATAx Software", href: "/datax" },
      { name: "CTO Consulting", href: "/cto" },
      { name: "Automation Courses", href: "/courses" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Roadmap", href: "/roadmap" },
      { name: "Contact", href: "/hello" },
      { name: "Video", href: "/video" },
    ],
  },
  {
    title: "Free Resources",
    links: [
      { name: "Library", href: "/sign-up" },
      { name: "Resources", href: "/sign-up" },
      { name: "Summary Dashboard", href: "/sign-up" },
    ],
  },
]

const FooterColumn = ({ title, links }: { title: string; links: { name: string; href: string }[] }) => {
  return (
    <div className="mb-8 lg:mb-0">
      <h3 className="text-xl font-bold text-[#FFD400] mb-4 group-hover:text-white transition-colors duration-300">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
            >
              <span>{link.name}</span>
              <ArrowRight className="w-4 h-4 ml-1 opacity-0 transition-all duration-300 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const Footer = () => {
  const [isHoveringTry, setIsHoveringTry] = useState(false)

  return (
    <footer className="relative text-white py-16 w-full overflow-hidden bg-black">
      {/* Simplified background with animated gradient and noise texture */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-black via-[rgba(0,0,0,0.7)] to-[#FFD400] opacity-80"
        animate={{
          background: [
            'linear-gradient(to bottom right, black, rgba(0,0,0,0.7) 50%, #FFD400)',
            'linear-gradient(to bottom right, black, rgba(0,0,0,0.65) 55%, #FFD400)',
            'linear-gradient(to bottom right, black, rgba(0,0,0,0.7) 50%, #FFD400)',
          ]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Floating construction-themed particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute text-[#FFD400]"
          animate={{
            x: ["0%", "100%"],
            y: ["0%", "100%"],
            rotate: [0, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          {i % 3 === 0 ? <Hammer size={12} /> : i % 3 === 1 ? <Paintbrush size={12} /> : <Drill size={12} />}
        </motion.div>
      ))}

      {/* Lucide dots */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute text-[#FFD400]"
          animate={{
            x: ["0%", "100%"],
            y: ["0%", "100%"],
            scale: [0.5, 1, 0.5],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          <Circle size={4} fill="#FFD400" />
        </motion.div>
      ))}

      {/* White Lucide dots */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`white-dot-${i}`}
          className="absolute text-white"
          animate={{
            x: ["0%", "100%"],
            y: ["0%", "100%"],
            scale: [0.5, 1, 0.5],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          <Circle size={4} fill="white" />
        </motion.div>
      ))}

      {/* Interactive floating tools with glow effect */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`hammer-${i}`}
          className="absolute text-[#FFD400]"
          animate={{
            x: ["0%", "100%"],
            y: ["0%", "100%"],
            rotate: [0, 360],
            opacity: [0, 1, 0],
          }}
          whileHover={{
            filter: "drop-shadow(0 0 8px rgba(255, 212, 0, 0.8))",
            scale: 1.2,
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `translateZ(${(i + 1) * 10}px)`,
          }}
        >
          <Hammer size={16} className="filter drop-shadow-lg transition-all duration-300" />
        </motion.div>
      ))}

      {/* Parallax paintbrushes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`paintbrush-${i}`}
          className="absolute text-[#FFD400]"
          animate={{
            x: ["0%", "100%"],
            y: ["0%", "100%"],
            rotate: [0, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `translateZ(${(i + 1) * 15}px)`,
          }}
        >
          <Paintbrush size={16} className="filter drop-shadow-lg" />
        </motion.div>
      ))}

      {/* Parallax drills */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`drill-${i}`}
          className="absolute text-[#FFD400]"
          animate={{
            x: ["0%", "100%"],
            y: ["0%", "100%"],
            rotate: [0, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `translateZ(${(i + 1) * 20}px)`,
          }}
        >
          <Drill size={16} className="filter drop-shadow-lg" />
        </motion.div>
      ))}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <Link href="/" className="inline-block">
              <Image
                src="/assets/logos/10.png"
                alt="logo"
                width={240}
                height={120}
                className="h-16 w-auto filter drop-shadow-[0_0_0.3rem_#ffffff70]"
              />
            </Link>
            <p className="text-xl text-gray-300 max-w-md font-medium leading-relaxed">
              Empower contractors with automation. <br />
            </p>
            <div className="flex flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="group w-auto flex items-center">
                <Button
                  className="w-auto sm:w-auto bg-[#FFD400] text-black font-bold py-6 px-6 sm:px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-black relative overflow-hidden group shadow-[0_0_15px_rgba(255,212,0,0.5)]"
                  onMouseEnter={() => setIsHoveringTry(true)}
                  onMouseLeave={() => setIsHoveringTry(false)}
                >
                  <Link href="/sign-up" className="flex items-center">
                    <span className="relative z-10 transition-colors duration-300">Sign Up</span>
                    <Zap
                      className={`ml-2 h-5 w-5 relative z-10 transition-all duration-300 ${isHoveringTry ? "rotate-[360deg] scale-125" : ""}`}
                    />
                  </Link>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#FFD400] to-white"
                    initial={{ x: "100%" }}
                    animate={isHoveringTry ? { x: "0%" } : { x: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </div>
            </div>
            <Link href="#" className="inline-block">
              <Image
                src="/assets/logos/jobtread-logo-rgb-ow.png"
                alt="JobTread Affiliate"
                width={180}
                height={90}
                className="opacity-100"
              />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8"
          >
            {footerLinks.map((column) => (
              <FooterColumn key={column.title} {...column} />
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400"
        >
          <p className="font-medium">© 2025 A ContractorCTO LLC Company. All rights reserved.</p>
          <ul className="flex flex-wrap justify-center gap-4">
            <li>
              <Link href="/terms" className="font-medium hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="font-medium hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer

