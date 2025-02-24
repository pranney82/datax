"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion"
import { HardHat, ArrowRight, BotIcon as Robot, Zap, Code, Brain, Sparkle, Check, Phone, Search, FileText, Settings, Layers, Clock, Award, BarChart } from "lucide-react"
import Link from "next/link"
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
      title: "Zapier Integration",
      icon: Zap,
      description:
        "Streamline your workflow with custom Zapier integrations. Automate repetitive tasks and connect your favorite apps seamlessly.",
      link: "#zapier",
    },
    {
      title: "Custom CTO Work",
      icon: Code,
      description:
        "Get expert guidance on your technology strategy. From infrastructure planning to system architecture, we've got you covered.",
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
      title: "E-commerce Platform Optimization",
      description: "Improved load times by 40% and increased conversion rates by 25% for a major online retailer.",
      icon: Zap,
      metric: "40% faster",
    },
    {
      title: "Custom CRM Integration",
      description:
        "Developed a tailored CRM solution that increased sales team efficiency by 30% for a B2B software company.",
      icon: Code,
      metric: "30% more efficient",
    },
    {
      title: "AI-Powered Analytics Dashboard",
      description:
        "Implemented machine learning algorithms to provide predictive insights, resulting in a 20% increase in customer retention.",
      icon: Brain,
      metric: "20% better retention",
    },
    {
      title: "AI-Powered Analytics Dashboard",
      description:
        "Implemented machine learning algorithms to provide predictive insights, resulting in a 20% increase in customer retention.",
      icon: Brain,
      metric: "20% better retention",
    },    {
      title: "AI-Powered Analytics Dashboard",
      description:
        "Implemented machine learning algorithms to provide predictive insights, resulting in a 20% increase in customer retention.",
      icon: Brain,
      metric: "20% better retention",
    },    {
      title: "AI-Powered Analytics Dashboard",
      description:
        "Implemented machine learning algorithms to provide predictive insights, resulting in a 20% increase in customer retention.",
      icon: Brain,
      metric: "20% better retention",
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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-10"></div>
      <SparkleBackground />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          <motion.div
            className="lg:col-span-7 relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#FFF] mb-8 leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
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
              Empower your business with our comprehensive CTO services. From automation to strategic consulting, we
              help you leverage technology for growth.
            </p>
            <div className="bg-[#FFD400] p-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-[#FFE03D] group mb-8 max-w-xl">
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

        <motion.div className="grid md:grid-cols-3 gap-10 mt-20">
          {services.map((service, index) => (
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
                <div className="mt-auto">
                  <Link
                    href={service.link}
                    className="inline-flex items-center text-[#000] font-semibold hover:text-[#FFD400] transition-colors duration-300"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
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
            className="px-12 py-6 bg-[#FFD400] text-[#000] font-extrabold rounded-full text-2xl transition-all duration-300 hover:bg-[#000] hover:text-[#FFD400] hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#FFD400] focus:ring-opacity-50 shadow-lg"
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
          <h2 className="text-4xl font-extrabold text-[#FFF] mb-8 text-center">Example Consulting Projects</h2>
          <div className="grid md:grid-cols-3 gap-10 mt-4">
            {exampleProjects.map((project, index) => (
              <motion.div
                key={project.title}
                variants={cardVariants}
                custom={index}
                className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group relative border border-[#FFD400]/30"
              >
                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-xl font-bold text-[#FFF] mb-4">{project.title}</h3>
                  <p className="text-[#CCC] mb-6 flex-grow">{project.description}</p>
                  <div className="bg-[#FFD400]/10 rounded-xl p-4 text-center">
                    <span className="text-[#FFD400] font-bold text-2xl">{project.metric}</span>
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
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#FFF] mb-8 md:mb-12 text-center">CTO Approach</h2>
          <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl shadow-xl p-4 md:p-8 border border-[#FFD400]/30">
            <motion.div 
              className="bg-[#FFD400] text-[#000] p-4 md:p-6 rounded-xl mb-8 md:mb-12 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              whileHover={{ boxShadow: "0 0 15px rgba(255, 212, 0, 0.5)" }}
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Automation Assessment: $800 fee</h3>
              <p className="text-base md:text-xl">After a discovery call, we conduct an Automation Assessment and provide a detailed report with pricing to build and implement your automations.</p>
            </motion.div>
            <p className="text-[#FFF] mb-6 md:mb-8 text-lg md:text-xl">
              We build and implement automations tailored to your business—eliminating the hassle of DIY.
            </p>
            <div className="flex flex-col space-y-6 md:space-y-8 mb-8 md:mb-12">
              {[
                { icon: Phone, title: "Discovery Call", description: "Understanding your automation needs and how we can potentially help." },
                { icon: Search, title: "Automation Assessment", description: "We conduct a comprehensive assessment of your current and desired automations, evaluating your existing setup, identifying bottlenecks, and providing a detailed recommendation report along with a pricing proposal. ($800 fee)" },
                { icon: FileText, title: "Scope of Work", description: "Based on the assessment, we develop a detailed scope of work along with pricing tailored to your specific needs." },
                { icon: Settings, title: "Build & Implement", description: "We provide itemized pricing, allowing you to choose the options that best fit your needs to maximize ROI." }
              ].map((step, index) => (
                <motion.div 
                  key={step.title}
                  className="flex flex-col md:flex-row items-start bg-[#333] rounded-xl p-4 md:p-6 shadow-md transform transition-all duration-300 hover:shadow-xl"
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="bg-[#FFD400] rounded-full p-2 md:p-3 mb-4 md:mb-0 md:mr-6">
                    {React.createElement(step.icon, { className: "w-6 h-6 md:w-8 md:h-8 text-[#000]" })}
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold text-[#FFD400] mb-2">{`${index + 1}. ${step.title}`}</h4>
                    <p className="text-[#CCC] text-base md:text-lg">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#FFF] mb-4 md:mb-6">Pricing Factors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
              {[
                { icon: Layers, title: "Project Scope", description: "The complexity and scale of your automation needs significantly influence the cost." },
                { icon: Clock, title: "Time Investment", description: "From targeted consulting to ongoing, dedicated CTO support." },
                { icon: Award, title: "Expertise Level", description: "The specific skills and level of expertise required for your project." },
                { icon: BarChart, title: "Support Intensity", description: "The level and frequency of ongoing support needed." }
              ].map((factor) => (
                <motion.div 
                  key={factor.title}
                  className="bg-[#333] rounded-xl p-4 md:p-6 shadow-md transform transition-all duration-300 hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center mb-2 md:mb-4">
                    {React.createElement(factor.icon, { className: "w-6 h-6 md:w-8 md:h-8 text-[#FFD400] mr-3" })}
                    <h4 className="text-lg md:text-xl font-bold text-[#FFD400]">{factor.title}</h4>
                  </div>
                  <p className="text-[#CCC] text-sm md:text-base">{factor.description}</p>
                </motion.div>
              ))}
            </div>
            <div className="bg-[#333] rounded-xl p-4 md:p-6 shadow-md">
              <h3 className="text-xl md:text-2xl font-bold text-[#FFF] mb-4">Typical Project Range</h3>
              <div className="relative h-3 md:h-4 bg-[#555] rounded-full overflow-hidden mb-2 md:mb-4">
                <div className="absolute top-0 left-0 h-full bg-[#FFD400]" style={{ width: '60%' }}></div>
              </div>
              <div className="flex justify-between text-[#CCC] text-sm md:text-base">
                <span>$2,000</span>
                <span>$15,000</span>
              </div>
              <p className="text-[#FFF] mt-2 md:mt-4 text-base md:text-lg">
                We recommend a monthly maintenance fee to ensure your automations are always running smoothly.
              </p>
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
          className="max-w-3xl mx-auto bg-[#FFF] rounded-3xl p-10 shadow-2xl border-2 border-[#FFD400] mt-12"
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
                className="space-y-6"
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
                        className="w-full px-4 py-3 border-2 border-[#000] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-[#000]"
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
                      className="w-full px-4 py-3 border-2 border-[#000] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-[#000]"
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
                    className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-[#FFD400] text-[#000] font-bold rounded-full text-base sm:text-lg transition-all duration-300 hover:bg-[#000] hover:text-[#FFD400] hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:ring-opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <span className="hidden sm:inline">Get Your Free DATAx Consultation</span>
                        <span className="sm:hidden">Submit</span>
                        <Sparkle className="ml-2 inline-block" />
                      </>
                    )}
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

