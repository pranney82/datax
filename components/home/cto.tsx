"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion"
import { HardHat, ArrowRight, BotIcon as Robot, Zap, Code, Brain, Sparkle, Check, Phone, Search, FileText, Settings, Layers, Clock, Award, BarChart } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const SparkleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const sparkles: { x: number; y: number; size: number; speed: number }[] = []

    for (let i = 0; i < 50; i++) {
      sparkles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.1,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#FFD400"

      sparkles.forEach((sparkle) => {
        ctx.beginPath()
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2)
        ctx.fill()

        sparkle.y -= sparkle.speed
        if (sparkle.y < 0) {
          sparkle.y = canvas.height
          sparkle.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ maskImage: "linear-gradient(to bottom, white 80%, transparent 100%)" }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

export default function CTOPage() {
  const [showThankYou, setShowThankYou] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref)

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const form = event.currentTarget
    const formData = new FormData(form)

    fetch(form.action, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          setShowThankYou(true)
        } else {
          console.error("Form submission failed")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  const services = [
    {
      title: "Zapier Implementation",
      icon: Zap,
      description:
        "Streamline your workflow with custom built zaps. Automate repetitive tasks and connect your favorite apps seamlessly.",
      link: "#zapier",
    },
    {
      title: "CTO Consulting",
      icon: Code,
      description:
        "For growing companies seeking CTO guidance on technology strategy. From infrastructure planning to system architecture, we've got you covered.",
      link: "#custom",
    },
    {
      title: "Technology Consulting",
      icon: Brain,
      description:
        "Make informed decisions about your tech stack. Our consulting services help you navigate the complex world of technology.",
      link: "#consulting",
    },
  ]

  const exampleProjects = [
    {
      title: "SMS from JOBTREAD",
      description: "Revolutionized online sales platform for a Fortune 500 retailer through advanced automation and optimization techniques.",
      icon: Zap,
      category: "Performance",
      metric: "85% faster",
      metricIcon: Zap,
      achievement: "$2.5M additional revenue",
      impact: "Increased conversion by 125%"
    },
    {
      title: "Sales Pipeline Automation",
      description:
        "Implemented end-to-end sales automation for a national B2B firm, transforming their entire lead-to-close process.",
      icon: Code,
      category: "Automation",
      metric: "10x efficiency",
      metricIcon: BarChart,
      achievement: "3,000+ hours saved annually",
      impact: "Doubled sales team productivity"
    },
    {
      title: "Automate Messages to Customer",
      description:
        "Developed an AI-powered forecasting system for a major manufacturer, enabling data-driven inventory management.",
      icon: Brain,
      category: "AI/ML",
      metric: "99% accuracy",
      metricIcon: Brain,
      achievement: "$5M inventory reduction",
      impact: "30% less stockouts"
    },
    {
      title: "Multgration",
      description:
        "Created a unified data ecosystem for a healthcare provider, connecting EMR, billing, and scheduling systems.",
      icon: Settings,
      category: "Integration",
      metric: "8 systems unified",
      metricIcon: Layers,
      achievement: "100% real-time sync",
      impact: "Zero data redundancy"
    },
    {
      title: "Multgration",
      description:
        "Created a unified data ecosystem for a healthcare provider, connecting EMR, billing, and scheduling systems.",
      icon: Settings,
      category: "Integration",
      metric: "8 systems unified",
      metricIcon: Layers,
      achievement: "100% real-time sync",
      impact: "Zero data redundancy"
    },
    {
      title: "Update Custom Fields by Role",
      description:
        "Created a unified data ecosystem for a healthcare provider, connecting EMR, billing, and scheduling systems.",
      icon: Settings,
      category: "Integration",
      metric: "8 systems unified",
      metricIcon: Layers,
      achievement: "100% real-time sync",
      impact: "Zero data redundancy"
    },
  ]

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="pt-24 w-full bg-[#000] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#000]/95 via-[#000]/50 to-black z-10"></div>
      <div className="absolute inset-0 bg-[url('/assets/images/grid.png')] opacity-10 z-0 animate-pulse mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFD400]/5 via-transparent to-[#FFD400]/5 animate-gradient-x mix-blend-color"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,212,0,0.1)_0%,_transparent_60%)] z-0 animate-pulse"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(255,212,0,0.03)_25%,_transparent_25%,_transparent_75%,_rgba(255,212,0,0.03)_75%)] bg-[length:100px_100px] z-0 opacity-30"></div>
      <SparkleBackground />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFD400]/5 via-transparent to-[#FFD400]/5 rounded-3xl opacity-20"></div>
          <motion.div
            className="lg:col-span-7 relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#FFF] mb-8 leading-tight tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] bg-clip-text text-transparent bg-gradient-to-br from-white via-[#FFD400] to-white animate-gradient-xy relative">
              CTO Services for{" "}
              <span className="text-[#FFD400] relative block mt-2">
                Modern Businesses
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              </span>
            </h1>
            <p className="text-xl text-[#FFF] mb-8">
              Empower your business with our comprehensive automation CTO services to leverage technology for growth.
            </p>
            <div className="bg-gradient-to-r from-[#FFD400] to-[#FFE03D] p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group mb-8 max-w-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent"></div>
              <div className="relative">
                <h3 className="text-xl font-bold text-[#000] mb-2">Our Mission</h3>
                <p className="text-lg text-[#000] font-semibold group-hover:text-gray-900 transition-colors duration-300">
                  Empower contractors with automation.
                </p>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-3">
                    <HardHat className="w-6 h-6 text-gray-900" />
                    <ArrowRight className="w-6 h-6 text-gray-900" />
                    <Robot className="w-6 h-6 text-gray-900" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-[#FFD400] rounded-2xl transform rotate-3 scale-105 z-0"></div>
              <motion.div
                className="relative w-full"
                style={{
                  transform: "translateY(calc(var(--scroll-offset, 0) * -0.1px))",
                }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/assets/images/about.png"
                  alt="DATAx Team"
                  width={600}
                  height={400}
                  className="rounded-2xl object-cover shadow-2xl relative z-10 transform transition-transform duration-300 hover:scale-105"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div className="grid md:grid-cols-3 gap-10 mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFD400]/5 to-transparent rounded-3xl -translate-y-10 opacity-20"></div>
          {services.map((service) => (
            <motion.div
              key={service.title}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-[#FFF] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group relative flex flex-col h-full"
              style={{
                background:
                  "linear-gradient(white, white) padding-box, linear-gradient(to right, #FFD400, #FFE03D, #FFD400) border-box",
                border: "1px solid transparent",
              }}
            >
              <div className="p-8 flex flex-col h-full">
                <div className="w-16 h-16 bg-[#FFD400] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                  {React.createElement(service.icon, { className: "w-8 h-8 text-[#000]" })}
                </div>
                <h3 className="text-2xl font-bold text-[#000] mb-4">{service.title}</h3>
                <p className="text-[#000] mb-6 flex-grow">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            onClick={() => {
              const form = document.getElementById("250174963512153");
              if (form) {
                form.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="px-12 py-6 bg-[#FFD400] text-[#000] font-extrabold rounded-full text-2xl transition-all duration-300 hover:bg-[#FFD400]/90 hover:text-[#000] hover:shadow-[0_0_30px_rgba(255,212,0,0.5)] transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#FFD400] focus:ring-opacity-50 shadow-lg relative group overflow-hidden"
          >
            Get Started Now
          </Button>
        </motion.div>

        <motion.div
          className="mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="text-4xl font-extrabold text-[#FFF] mb-8 text-center">
            Example Consulting Projects
            <div className="h-1 w-24 bg-[#FFD400] mx-auto mt-4 rounded-full"></div>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
          {exampleProjects.map((project, index) => (
              <motion.div
                key={project.title}
                variants={cardVariants}
                custom={index}
                className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group relative border border-[#FFD400]/30"
              >
                <div className="p-6 flex flex-col h-full relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFD400]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {React.createElement(project.icon, { className: "w-6 h-6 text-[#FFD400] mr-3" })}
                        <h3 className="text-xl font-bold text-[#FFF] group-hover:text-[#FFD400] transition-colors duration-300">{project.title}</h3>
                      </div>
                      <span className="text-xs font-medium text-[#FFD400]/80 bg-[#FFD400]/10 px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                    <p className="text-[#CCC] mb-6 flex-grow">{project.description}</p>
                    <div className="bg-gradient-to-r from-[#FFD400]/10 to-[#FFD400]/5 rounded-xl p-4 transform group-hover:scale-105 transition-transform duration-300">
                      <div className="flex items-center justify-center mb-3">
                        {React.createElement(project.metricIcon, { className: "w-6 h-6 text-[#FFD400] mr-2" })}
                        <span className="text-[#FFD400] font-bold text-3xl">{project.metric}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[#FFD400] text-sm font-medium text-center">{project.achievement}</div>
                        <div className="text-[#CCC] text-sm font-medium text-center">{project.impact}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#FFF] mb-8 md:mb-12 text-center">
            CTO Approach
            <div className="h-1 w-24 bg-[#FFD400] mx-auto mt-4 rounded-full"></div>
          </h2>
          <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl shadow-xl p-6 md:p-10 border border-[#FFD400]/30">
            <motion.div 
              className="bg-gradient-to-r from-[#FFD400] via-[#FFE03D] to-[#FFD400] text-[#000] p-6 md:p-8 rounded-2xl mb-10 md:mb-14 transform transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,212,0,0.4)] relative overflow-hidden animate-gradient-x backdrop-blur-sm animate-float"
              whileHover={{ boxShadow: "0 0 20px rgba(255, 212, 0, 0.6)" }}
            >
              <div className="absolute top-0 right-0 bg-black/10 p-3 rounded-bl-2xl">
                <Sparkle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-5">Automation Assessment</h3>
              <div className="flex items-center mb-4">
                <span className="text-3xl md:text-4xl font-bold">$800</span>
                <span className="ml-2 text-lg md:text-xl">assessment fee</span>
              </div>
              <p className="text-base md:text-xl">After discovery call, we conduct an Automation Assessment and provide a detailed report with pricing to build and implement your automations.</p>
            </motion.div>
            <p className="text-[#FFF] mb-8 md:mb-10 text-lg md:text-xl text-center">
              We build and implement automations tailored to your business—eliminating the hassle of DIY.
            </p>
            <div className="flex flex-col space-y-8 md:space-y-10 mb-10 md:mb-14 relative">
              <div className="absolute left-[2.25rem] top-[4.5rem] bottom-[4.5rem] w-0.5 bg-gradient-to-b from-[#FFD400]/10 via-[#FFD400]/30 to-[#FFD400]/10 animate-pulse"></div>
              {[
                { icon: Phone, title: "Discovery Call", description: "Understanding your automation needs and how we can potentially help." },
                { icon: Search, title: "Automation Assessment", description: "We conduct a comprehensive assessment of your current and desired automations, evaluating your existing setup, identifying bottlenecks, and providing a detailed recommendation report along with a pricing proposal. ($800 fee)" },
                { icon: FileText, title: "Scope of Work", description: "Based on the assessment, we develop a detailed scope of work along with pricing tailored to your specific needs." },
                { icon: Settings, title: "Build & Implement", description: "We provide itemized pricing, allowing you to choose the options that best fit your needs to maximize ROI." }
              ].map((step, index) => (
                <motion.div 
                  key={step.title}
                  className="flex flex-col md:flex-row items-start bg-gradient-to-br from-[#333] to-[#2A2A2A] rounded-2xl p-6 md:p-8 shadow-lg transform transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,212,0,0.15)] relative backdrop-blur-sm hover:bg-gradient-to-br hover:from-[#383838] hover:to-[#2A2A2A]"
                  whileHover={{ scale: 1.02, backgroundColor: "#383838" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-gradient-to-br from-[#FFD400] to-[#FFE03D] rounded-2xl p-4 mb-4 md:mb-0 md:mr-8 relative">
                    <div className="absolute inset-0 bg-black/5 rounded-2xl"></div>
                    <div className="relative">
                      {React.createElement(step.icon, { className: "w-8 h-8 md:w-10 md:h-10 text-[#000]" })}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <span className="text-[#FFD400] font-mono text-2xl md:text-3xl font-bold mr-3">{`0${index + 1}`}</span>
                      <h4 className="text-xl md:text-2xl font-bold text-[#FFD400]">{step.title}</h4>
                    </div>
                    <p className="text-[#CCC] text-base md:text-lg leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#FFF] mb-6 md:mb-8 text-center">Pricing Factors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-14">
              {[
                { icon: Layers, title: "Project Scope", description: "The complexity and scale of your automation needs significantly influence the cost." },
                { icon: Clock, title: "Time Investment", description: "From targeted consulting to ongoing, dedicated CTO support." },
                { icon: Award, title: "Expertise Level", description: "The specific skills and level of expertise required for your project." },
                { icon: BarChart, title: "Support Intensity", description: "The level and frequency of ongoing support needed." }
              ].map((factor, index) => (
                <motion.div 
                  key={factor.title}
                  className="bg-gradient-to-br from-[#333] to-[#2A2A2A] rounded-2xl p-6 md:p-8 shadow-lg transform transition-all duration-500 hover:shadow-[0_0_25px_rgba(255,212,0,0.2)] relative overflow-hidden group backdrop-blur-sm"
                  whileHover={{ scale: 1.03, backgroundColor: "#383838" }}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FFD400]/10 to-transparent transform rotate-45 translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center mb-4">
                      {React.createElement(factor.icon, { className: "w-8 h-8 md:w-10 md:h-10 text-[#FFD400] mr-4" })}
                      <h4 className="text-xl md:text-2xl font-bold text-[#FFD400]">{factor.title}</h4>
                    </div>
                    <p className="text-[#CCC] text-base md:text-lg leading-relaxed">{factor.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-[#333] to-[#2A2A2A] rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden backdrop-blur-sm group transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,212,0,0.15)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FFD400]/5 to-transparent transform rotate-45 translate-x-32 -translate-y-32"></div>
              <div className="relative">
                <h3 className="text-2xl md:text-3xl font-bold text-[#FFF] mb-6">Typical Project Range</h3>
                <div className="relative h-4 md:h-5 bg-gradient-to-r from-[#555]/50 to-[#444]/50 rounded-full overflow-hidden mb-3 md:mb-4 backdrop-blur-sm group-hover:from-[#666]/50 group-hover:to-[#555]/50 transition-all duration-300">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FFD400] to-[#FFE03D]"
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                  <div className="absolute top-0 left-[20%] h-full w-0.5 bg-white/20"></div>
                  <div className="absolute top-0 left-[40%] h-full w-0.5 bg-white/20"></div>
                  <div className="absolute top-0 left-[60%] h-full w-0.5 bg-white/20"></div>
                  <div className="absolute top-0 left-[80%] h-full w-0.5 bg-white/20"></div>
                </div>
                <div className="flex justify-between text-[#CCC] text-base md:text-lg font-medium">
                  <span>$2,000</span>
                  <span>$15,000</span>
                </div>
                <div className="mt-6 md:mt-8 p-4 md:p-5 bg-[#2A2A2A] rounded-xl border border-[#FFD400]/20">
                  <p className="text-[#FFF] text-base md:text-lg leading-relaxed">
                    We recommend a monthly maintenance plan to ensure your automations are always running smoothly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p className="text-xl text-[#FFF] mb-8">Ready to transform your business with expert technology guidance?</p>
        </motion.div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={formVariants}
          className="max-w-3xl mx-auto bg-gradient-to-br from-white to-[#FFF]/95 backdrop-blur-sm rounded-3xl p-10 shadow-[0_0_50px_rgba(255,212,0,0.15)] border-2 border-[#FFD400] mt-12 relative overflow-hidden group transition-all duration-500 hover:shadow-[0_0_60px_rgba(255,212,0,0.4)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:to-[#FFD400]/5 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 animate-float-slow"
        >
          <h2 className="text-4xl font-extrabold text-[#000] mb-8 text-center">Get Started with CTO Services</h2>
          <AnimatePresence mode="wait">
            {showThankYou ? (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-20 h-20 bg-[#FFD400] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-[#000]" />
                </div>
                <h3 className="text-2xl font-bold text-[#000] mb-4">Thank You for Choosing DATAx!</h3>
                <p className="text-xl text-[#000]/80 mb-6">
                  We&apos;ve received your request and we&apos;ll be in touch shortly.
                </p>
                <Button
                  onClick={() => setShowThankYou(false)}
                  className="px-8 py-4 bg-[#FFD400] text-[#000] font-bold rounded-full text-lg transition-all duration-300 hover:bg-[#000] hover:text-[#FFD400] hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:ring-opacity-50"
                >
                  Back to Form
                </Button>
              </motion.div>
            ) : (
              <motion.form
                className="space-y-6 relative"
                action="https://submit.jotform.com/submit/250174963512153"
                method="post"
                name="form_250174963512153"
                id="250174963512153"
                acceptCharset="utf-8"
                autoComplete="on"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="first_3" className="block text-sm font-medium text-[#000] mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_3"
                        name="q3_yourName[first]"
                        className="w-full px-4 py-3 border-2 border-[#000] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-[#000] hover:border-[#FFD400]/50 hover:shadow-[0_0_10px_rgba(255,212,0,0.1)]"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="last_3" className="block text-sm font-medium text-[#000] mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_3"
                        name="q3_yourName[last]"
                        className="w-full px-4 py-3 border-2 border-[#000] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-[#000]"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="input_17" className="block text-sm font-medium text-[#000] mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="input_17"
                      name="q17_businessName"
                      className="w-full px-4 py-3 border-2 border-[#000] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-[#000] hover:border-[#FFD400]/50 hover:shadow-[0_0_10px_rgba(255,212,0,0.1)]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="input_6_addr_line1" className="block text-sm font-medium text-[#000] mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="input_6_addr_line1"
                      name="q6_yourAddress[addr_line1]"
                      className="w-full px-4 py-3 border-2 border-[#000] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-[#000] mb-4"
                      placeholder="Street Address"
                      required
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        id="input_6_city"
                        name="q6_yourAddress[city]"
                        className="w-full px-4 py-3 border-2 border-[#000] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-[#000]"
                        placeholder="City"
                        required
                      />
                      <input
                        type="text"
                        id="input_6_state"
                        name="q6_yourAddress[state]"
                        className="w-full px-4 py-3 border-2 border-[#000] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-[#000]"
                        placeholder="State (e.g., TX)"
                        pattern="[A-Z]{2}"
                        title="Please enter a valid two-letter state abbreviation (e.g., TX for Texas)"
                        required
                      />
                      <input
                        type="text"
                        id="input_6_postal"
                        name="q6_yourAddress[postal]"
                        className="w-full px-4 py-3 border-2 border-[#000] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-[#000]"
                        placeholder="Postal Code (5 digits)"
                        pattern="[0-9]{5}"
                        title="Please enter a valid 5-digit postal code"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="input_5" className="block text-sm font-medium text-[#000] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="input_5"
                        name="q5_emailAddress"
                        className="w-full px-4 py-3 border-2 border-[#000] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-[#000]"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="input_4_full" className="block text-sm font-medium text-[#000] mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="input_4_full"
                        name="q4_contactNumber[full]"
                        className="w-full px-4 py-3 border-2 border-[#000] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-[#000]"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-[#000] mb-1">
                      Interested Services
                    </label>
                    <select
                      className="w-full px-4 py-3 border-2 border-[#000] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 appearance-none bg-white text-[#000]"
                      id="input_15"
                      name="q15_whatServices15"
                      required
                    >
                      <option value="">Please Select</option>
                      <option value="Zapier Help">Zapier Help</option>
                      <option value="CTO Consulting">CTO Consulting</option>
                      <option value="Something Else">Something Else</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#000] mb-1">
                      Tell us about your data challenges
                    </label>
                    <textarea
                      id="input_10"
                      name="q10_additionalComments"
                      className="w-full px-4 py-3 border-2 border-[#000] rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-[#000]"
                      rows={4}
                      placeholder="Tell us about your data challenges..."
                    ></textarea>
                  </div>
                <Button
                  type="submit"
                  className="w-full py-4 sm:py-5 px-6 sm:px-8 bg-gradient-to-r from-[#FFD400] to-[#FFE03D] text-[#000] font-bold rounded-full text-lg sm:text-xl transition-all duration-300 hover:from-[#000] hover:to-[#000] hover:text-[#FFD400] hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:ring-opacity-50 relative overflow-hidden group"
                  disabled={isSubmitting}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFD400]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin mr-2">
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                        </span>
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <span className="hidden sm:inline">Get Your Free DATAx Consultation</span>
                        <span className="sm:hidden">Submit</span>
                        <Sparkle className="ml-2 inline-block animate-pulse" />
                      </span>
                    )}
                  </div>
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

