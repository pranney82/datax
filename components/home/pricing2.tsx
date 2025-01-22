"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, BookText, ArrowRight, ChevronDown, ChevronUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AddOn {
  id: string
  icon: JSX.Element
  name: string
  price: number
  description: string
  priceSuffix: string
  additionalInfo: string
  buttonText: string
  buttonAction: () => void
  popular?: boolean
}

const addons: AddOn[] = [
  {
    id: "tech-brief",
    icon: <Users className="w-12 h-12 text-[#FFD400]" />,
    name: "Tech Brief",
    price: 0,
    description: "Get expert guidance on your automations and JOBTREAD.",
    priceSuffix: "free",
    additionalInfo:
      "Jump on a virtual call with our experts to get advice on your JOBTREAD setup, software integrations, and tech stack. We'll provide you with a summary of our call and recommendations.",
    buttonText: "Get Started",
    buttonAction: () => {},
  },
  {
    id: "zapier-assessment",
    icon: <Users className="w-12 h-12 text-[#FFD400]" />,
    name: "Zapier Assessment",
    price: 525,
    description: "Provide automation assessment and recommendations for new and improved processes.",
    priceSuffix: "one-time",
    additionalInfo:
      "Our Zapier experts will analyze your current processes and desired automations, identify inefficiencies, and provide a tailored zap recommendation report, along with a scope of work for us to build and maintain your zaps.",
    buttonText: "Get Started",
    buttonAction: () => {},
    popular: true,
  },
  {
    id: "cto-consulting",
    icon: <Users className="w-12 h-12 text-[#FFD400]" />,
    name: "CTO Consulting",
    price: 2500,
    description: "Holistic view of your JOBTREAD and integrated tech stack.",
    priceSuffix: "starting/month",
    additionalInfo:
      "Get expert guidance on your overall tech strategy, including software selection, integration, and scalability planning to support your business growth. Contract basis for 3, 6 and 12 months.",
    buttonText: "Get Started",
    buttonAction: () => {},
  },
  {
    id: "automation-courses",
    icon: <BookText className="w-12 h-12 text-[#FFD400]" />,
    name: "Automation Courses",
    price: 600,
    description: "Build automations along side an expert, well build, test and teach you how to build you own automations.",
    priceSuffix: "one-time, lifetime access",
    additionalInfo:
      "Work with an automation expert to learn how to build your very own automations. You&apos;ll also get lifetime acces to all automation video resources.",
    buttonText: "Enroll Today",
    buttonAction: () => {
      window.location.href = "/courses"
    },
  },
]

const AddOns = () => {
  const [expandedAddon, setExpandedAddon] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleExpand = (addonId: string) => {
    setExpandedAddon((prev) => (prev === addonId ? null : addonId))
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setShowThankYou(false)
  }

  const resetForm = () => {
    setShowThankYou(false)
    closeModal()
    ;(document.getElementById("250174963512153") as HTMLFormElement)?.reset()
  }

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
    <section className="py-24 w-full bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] to-yellow-500">
            Enhance Your Experience
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Supercharge your business with our premium add-ons and expert services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {addons.map((addon, index) => (
            <motion.div
              key={addon.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-gradient-to-br from-white to-gray-100 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 h-full ${
                addon.popular ? "border-4 border-[#FFD400]" : ""
              } hover:shadow-[0_20px_50px_rgba(255,212,0,0.3)] relative`}
            >
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#FFD400] to-transparent opacity-20"></div>
              <div className="p-8 flex flex-col h-full relative z-10">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="mr-4">{addon.icon}</div>
                    <h3
                      className="text-3xl sm:text-4xl font-extrabold text-black mb-2 leading-tight"
                      id={addon.id === "zapier-assessment" ? "cto-consulting" : undefined}
                    >
                      {addon.name}
                    </h3>
                  </div>
                  <div className="mb-6">
                    <span className="text-5xl sm:text-6xl font-black text-black">${addon.price}</span>
                    <span className="text-xl text-gray-600 ml-2"> {addon.priceSuffix}</span>
                  </div>
                  <p className="text-gray-700 mb-6 text-lg sm:text-xl">{addon.description}</p>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: expandedAddon === addon.id ? 1 : 0,
                      height: expandedAddon === addon.id ? "auto" : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-600 bg-gray-100 p-4 rounded-lg text-sm sm:text-base mt-4">
                      {addon.additionalInfo}
                    </p>
                  </motion.div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between mt-auto pt-6 gap-4">
                  <Button
                    className="w-full sm:w-auto bg-black text-white hover:bg-[#FFD400] hover:text-black transition-all duration-300 py-3 px-6 rounded-full font-bold text-lg shadow-md hover:shadow-lg"
                    onClick={addon.id === "automation-courses" ? addon.buttonAction : openModal}
                  >
                    {addon.buttonText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    className={`w-full sm:w-auto transition-all duration-300 p-2 rounded-full ${
                      expandedAddon === addon.id
                        ? "bg-[#FFD400] text-black hover:bg-[#FFD400]/80"
                        : "bg-gray-200 text-gray-600 hover:bg-[#FFD400] hover:text-black"
                    }`}
                    onClick={() => toggleExpand(addon.id)}
                  >
                    {expandedAddon === addon.id ? (
                      <ChevronUp className="h-6 w-6" />
                    ) : (
                      <ChevronDown className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              </div>
              {addon.popular && (
                <Badge className="absolute top-4 right-4 bg-[#FFD400] text-black px-3 py-1 rounded-full font-bold text-sm uppercase tracking-wide shadow-md">
                  Popular
                </Badge>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-gradient-to-br from-white to-gray-100 rounded-3xl p-8 w-full max-w-md mx-auto my-8 relative border-4 border-[#FFD400] shadow-2xl"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-black hover:text-[#FFD400] transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
              {showThankYou ? (
                <div className="text-center py-6">
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-800 mb-4">
                    Thank You!
                  </h2>
                  <p className="text-xl text-gray-600 mb-6">
                    We&apos;ve received your request and will get back to you shortly.
                  </p>
                  <Button
                    onClick={resetForm}
                    className="px-6 py-3 bg-black text-white font-bold rounded-full transition-all duration-300 hover:bg-[#FFD400] hover:text-black hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:ring-opacity-50"
                  >
                    Close
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
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-800 mb-4">
                    Get Started
                  </h2>
                  <p className="text-xl text-gray-600 mb-6">Let us know how we can help you get started!</p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="first_3" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="first_3"
                          name="q3_yourName[first]"
                          className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="last_3" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="last_3"
                          name="q3_yourName[last]"
                          className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="input_17" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name
                      </label>
                      <input
                        type="text"
                        id="input_17"
                        name="q17_businessName"
                        className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="input_6_addr_line1" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        id="input_6_addr_line1"
                        name="q6_yourAddress[addr_line1]"
                        className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 mb-2"
                        placeholder="Street Address"
                        required
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          id="input_6_city"
                          name="q6_yourAddress[city]"
                          className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300"
                          placeholder="City"
                          required
                        />
                        <input
                          type="text"
                          id="input_6_state"
                          name="q6_yourAddress[state]"
                          className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300"
                          placeholder="State"
                          required
                        />
                        <input
                          type="text"
                          id="input_6_postal"
                          name="q6_yourAddress[postal]"
                          className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300"
                          placeholder="Postal"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="input_4_full" className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          id="input_4_full"
                          name="q4_contactNumber[full]"
                          className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="input_5" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="input_5"
                          name="q5_emailAddress"
                          className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="input_15" className="block text-sm font-medium text-gray-700 mb-1">
                        Interested Services
                      </label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300 appearance-none bg-white"
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
                      <label htmlFor="input_10" className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Comments
                      </label>
                      <textarea
                        id="input_10"
                        name="q10_additionalComments"
                        className="w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] transition-all duration-300"
                        rows={3}
                      ></textarea>
                    </div>
                    <Button
                      type="submit"
                      className="w-full py-3 px-4 bg-black text-white font-bold rounded-full transition-all duration-300 hover:bg-[#FFD400] hover:text-black hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:ring-opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default AddOns

