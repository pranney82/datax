"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Users, Target, Clock, Rocket, TrendingUp, HardHat, BotIcon as Robot } from "lucide-react"
import Image from "next/image"

// Hero Component
function Hero() {
  return (
    <section className="py-16 px-4 bg-[#000] bg-[url('/assets/images/stars.png')] bg-repeat">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in-up text-[#fff]">
          Unleash JOBTREAD API with <span className="text-[#FFD400]">DATAx</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200 text-[#fff]">
          Transform your business operations with our cutting-edge automation solutions.
        </p>
        <Button
          className="bg-[#FFD400] text-[#000] hover:bg-[#FFD400]/80 transition-all duration-300 text-lg py-6 px-8 rounded-full font-bold animate-fade-in-up animation-delay-400"
          onClick={() => document.getElementById("jotform-section")?.scrollIntoView({ behavior: "smooth" })}
        >
          Get Started Now <ArrowRight className="ml-2" />
        </Button>
        <div className="mt-12 bg-[#ffd400] p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-[#000] mb-2">Our Mission</h3>
          <p className="text-xl text-[#000] font-semibold">Empower contractors with automation.</p>
          <div className="flex justify-center items-center mt-4">
            <div className="flex space-x-4">
              <HardHat className="w-8 h-8 text-[#000]" />
              <ArrowRight className="w-8 h-8 text-[#000]" />
              <Robot className="w-8 h-8 text-[#000]" />
            </div>
          </div>
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
      title: "Prebuilt Templates",
      description:
        "Access a growing library of industry-leading dashboards, automations, and resources designed for your JOBTREAD.",
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
    <section className="py-24 px-4 bg-[#000] bg-[url('/assets/images/stars.png')] bg-repeat">
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
    <section className="py-24 px-4 bg-[#000] bg-[url('/assets/images/stars.png')] bg-repeat">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#fff]">
              Revolutionize Your Business with <span className="text-[#FFD400]">DATAx</span>
            </h2>
            <p className="text-xl mb-8 text-[#fff]/80">
              DATAx leverages the JOBTREAD API to transform raw data into actionable insights. With specialized
              features, custom automations, and fractional CTO services, we provide tailored solutions to streamline
              operations and maximize efficiency. Simple, powerful, and built for your business.
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
                <span>CTO Consulting for more help</span>
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
            <Image
              src="/assets/images/about.png"
              alt="DataX Dashboard Example"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl"
            />
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
    <section id="jotform-section" className="py-16 bg-[#000] bg-[url('/assets/images/stars.png')] bg-repeat">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-[#fff] rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-[#000] mb-6 text-center">Get Started with DATAx</h2>
          {showThankYou ? (
            <div className="text-center py-6">
              <h3 className="text-2xl font-bold text-[#000] mb-4">Thank You for Choosing DATAx!</h3>
              <p className="text-xl text-[#000]/80 mb-6">
                We&apos;ve received your request and we&apos;ll be in touch shortly.
              </p>
              <Button
                onClick={() => setShowThankYou(false)}
                className="px-6 py-3 bg-[#000] text-[#fff] font-bold rounded-full transition-all duration-300 hover:bg-[#FFD400] hover:text-[#000] hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:ring-opacity-50"
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_3" className="block text-sm font-medium text-[#000] mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first_3"
                      name="q3_yourName[first]"
                      className="w-full px-4 py-2 border border-[#000]/20 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-gray-800"
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
                      className="w-full px-4 py-2 border border-[#000]/20 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-gray-800"
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
                    className="w-full px-4 py-2 border border-[#000]/20 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-gray-800"
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
                    className="w-full px-4 py-2 border border-[#000]/20 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-gray-800 mb-2"
                    placeholder="Street Address"
                    required
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      id="input_6_city"
                      name="q6_yourAddress[city]"
                      className="w-full px-4 py-2 border border-[#000]/20 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-gray-800"
                      placeholder="City"
                      required
                    />
                    <input
                      type="text"
                      id="input_6_state"
                      name="q6_yourAddress[state]"
                      className="w-full px-4 py-2 border border-[#000]/20 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-gray-800"
                      placeholder="State"
                      required
                    />
                    <input
                      type="text"
                      id="input_6_postal"
                      name="q6_yourAddress[postal]"
                      className="w-full px-4 py-2 border border-[#000]/20 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-gray-800"
                      placeholder="Postal Code"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="input_4_full" className="block text-sm font-medium text-[#000] mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    id="input_4_full"
                    name="q4_contactNumber[full]"
                    className="w-full px-4 py-2 border border-[#000]/20 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="input_5" className="block text-sm font-medium text-[#000] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="input_5"
                    name="q5_emailAddress"
                    className="w-full px-4 py-2 border border-[#000]/20 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="input_15" className="block text-sm font-medium text-[#000] mb-1">
                    Interested Services
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-[#000]/20 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 appearance-none bg-white text-gray-800"
                    id="input_15"
                    name="q15_whatServices15"
                    required
                  >
                    <option value="">Please Select</option>
                    <option value="Zapier Help">Zapier Help</option>
                    <option value="Formula Help">Formula Help</option>
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
                    className="w-full px-4 py-2 border border-[#000]/20 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 text-gray-800"
                    rows={3}
                    placeholder="Tell us about your data challenges..."
                  ></textarea>
                </div>
                <Button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#000] text-[#fff] font-bold rounded-full transition-all duration-300 hover:bg-[#FFD400] hover:text-[#000] hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:ring-opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Get Your Free DATAx Consultation"}
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
    <main className="min-h-screen bg-[#000] text-[#fff] bg-[url('/assets/images/stars.png')] bg-repeat">
      <Hero />
      <JotFormSection />
      <Features />
      <DataXInfo />
    </main>
  )
}

