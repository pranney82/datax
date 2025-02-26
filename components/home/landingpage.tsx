"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Zap,
  Users,
  Target,
  Clock,
  Rocket,
  TrendingUp,
  HardHat,
  BotIcon as Robot,
  Sparkle,
  Check,
} from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

// Hero Component
function Hero() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto text-center relative">
        <div className="relative z-10">
          <div className="mb-12 bg-[#fff] p-8 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl max-w-3xl mx-auto animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-extrabold text-[#000] mb-4">Our Mission</h2>
            <p className="text-2xl md:text-3xl text-[#000] font-bold mb-6">Empower contractors with automation.</p>
            <div className="flex justify-center items-center">
              <div className="flex space-x-6">
                <HardHat className="w-12 h-12 text-[#FFD400]" />
                <ArrowRight className="w-12 h-12 text-[#FFD400]" />
                <Robot className="w-12 h-12 text-[#FFD400]" />
              </div>
            </div>
          </div>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200 text-[#fff]">
            Elevate your business operations with automation.
          </p>
          <Button
            className="bg-[#FFD400] text-[#000] hover:bg-[#FFD400]/80 transition-all duration-300 text-lg py-6 px-8 rounded-full font-bold animate-fade-in-up animation-delay-400"
            onClick={() => document.getElementById("jotform-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            Get Started Now <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
// Features Component
function Features() {
  const features = [
    {
      icon: Users,
      title: "Built by JOBTREAD Users",
      description:
        "As JOBTREAD users ourselves, DATAx is built for maximum results enabling specialized integrations, automations and dashboards.",
      color: "#8B5CF6",
    },
    {
      icon: Zap,
      title: "Easy to Use",
      description: "Simply enter your JOBTREAD login, and we'll handle the rest—no coding required.",
      color: "#FBBF24",
    },
    {
      icon: Target,
      title: "Community Templates",
      description:
        "Library of free templates, including cost groups, schedules, and to-do lists, shared by other users. Contribute by uploading your own templates!",
      color: "#10B981",
    },
    {
      icon: Clock,
      title: "Real Time Data",
      description: "Your data syncs real time with every change that happens in JOBTREAD.",
      color: "#3B82F6",
    },
    {
      icon: Rocket,
      title: "Seamless JT Integration",
      description:
        "Leveraging JOBTREAD's API, DATAx activates automations and integrations within their JOBTREAD account.",
      color: "#EF4444",
    },
    {
      icon: TrendingUp,
      title: "Less Time Wrestling with Data",
      description:
        "Bid farewell to endless spreadsheets and complex Zapier setups. Focus on what truly matters - growing your business.",
      color: "#6366F1",
    },
  ]

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-[#fff]">
          Built by <span className="text-[#FFD400]">JOBTREAD</span> users, for{" "}
          <span className="text-[#FFD400]">JOBTREAD</span> users
        </h2>
        <p className="text-xl text-center mb-16 text-[#fff]">
          Simply connect your JOBTREAD account and get started—
          <span className="font-semibold text-[#FFD400]">no hassle, just results.</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="bg-[#fff] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center"
              >
                <div className="mb-4 rounded-full p-3" style={{ backgroundColor: `${feature.color}20` }}>
                  <IconComponent className="w-8 h-8" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#000]">{feature.title}</h3>
                <p className="text-[#000]/80">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// DataXInfo Component
function DataXInfo() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#fff]">
              Revolutionize Your Business with <span className="text-[#FFD400]">DATAx</span>
            </h2>
            <p className="text-xl mb-8 text-[#fff]/80">
            Our automation solutions optimize your business with specialized features, custom automations, and fractional CTO services—streamlining operations and maximizing efficiency. Simple, powerful, and built for you.
            </p>
            <ul className="space-y-4 mb-8 text-[#fff]">
              <li className="flex items-center">
                <ArrowRight className="text-[#FFD400] mr-2" />
                <span>Your JOBTREAD automation partner</span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="text-[#FFD400] mr-2" />
                <span>Out of the box and custom solutions</span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="text-[#FFD400] mr-2" />
                <span>Zapier build and implementation</span>
              </li>
            </ul>
            <Button
              className="bg-[#FFD400] text-[#000] hover:bg-[#FFD400]/80 transition-all duration-300 text-lg py-6 px-8 rounded-full font-bold"
              onClick={() => document.getElementById("jotform-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start Your DATAx Journey <ArrowRight className="ml-2" />
            </Button>
          </div>
          <div className="lg:w-1/2">
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-[#FFD400] rounded-2xl transform rotate-3 scale-105 z-0"></div>
              <motion.div
                className="relative w-full"
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
                  alt="DataX Dashboard Example"
                  width={600}
                  height={400}
                  className="rounded-2xl object-cover shadow-2xl relative z-10 transform transition-transform duration-300 hover:scale-105"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// JotFormSection Component
function JotFormSection() {
  const [showThankYou, setShowThankYou] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  return (
    <section id="jotform-section" className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-[#fff] rounded-3xl p-10 shadow-2xl border-2 border-[#FFD400]">
          <h2 className="text-4xl font-extrabold text-[#000] mb-8 text-center">Get Started with CTO Services</h2>
          {showThankYou ? (
            <div className="text-center py-8">
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
            </div>
          ) : (
            <form
              className="space-y-6"
              action="https://submit.jotform.com/submit/250174963512153"
              method="post"
              name="form_250174963512153"
              id="250174963512153"
              acceptCharset="utf-8"
              autoComplete="on"
              onSubmit={handleSubmit}
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
                    Business Name
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
                      Contact Number
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
                  <label htmlFor="input_15" className="block text-sm font-medium text-[#000] mb-1">
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
                  <label htmlFor="input_10" className="block text-sm font-medium text-[#000] mb-1">
                    Tell us about your data challenges
                  </label>
                  <textarea
                    id="input_10"
                    name="q10_additionalComments"
                    className="w-full px-4 py-3 border-2 border-[#000] rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-[#000]"
                    rows={3}
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
                      <span className="sm:hidden">Free Consultation</span>
                      <Sparkle className="ml-2 inline-block" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// Main LandingPage Component
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#000] text-[#fff] relative overflow-hidden">
      <div className="absolute inset-0 bg-[#000]">
        {[...Array(300)].map((_, i) => {
          const size = Math.random() * 3 + 1 // Random size between 1px and 4px
          return (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${Math.random() * 15}s`,
                opacity: Math.random() * 0.5 + 0.5,
                filter: `blur(${size * 0.15}px) brightness(${Math.random() * 150 + 200}%)`,
                boxShadow: `0 0 ${size * 4}px rgba(255, 255, 255, 0.${Math.floor(Math.random() * 7 + 3)})`,
                transform: `scale(${Math.random() * 0.8 + 0.7})`,
              }}
            />
          )
        })}
      </div>
      <div className="relative z-10">
        <Hero />
        <DataXInfo />
        <Features />
        <JotFormSection />
      </div>
    </main>
  )
}

  