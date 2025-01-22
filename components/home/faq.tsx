"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap } from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    id: "api-purpose",
    question: "What is JOBTREAD API?",
    answer:
      "JOBTREAD API is a powerful interface that allows developers like DATAx to seamlessly connect software systems. We leverage this API to create efficient data exchange and workflow automation for your JOBTREAD account, enhancing your overall experience and productivity.",
  },
  {
    id: "jobtread-features",
    question: "Won't JOBTREAD develop these features themselves?",
    answer:
      "While JOBTREAD focuses on building the ultimate construction management platform, we at DATAx complement their efforts by developing specialized features and dashboards. This collaboration allows you to benefit from both JOBTREAD's core strengths and our tailored solutions.",
  },
  {
    id: "datax-info",
    question: "What is DATAx?",
    answer:
      "DATAx is an innovative software company exclusively serving JOBTREAD users. We specialize in creating custom features and dashboards that seamlessly integrate with JOBTREAD, eliminating the need for you to build these solutions yourself. Our goal is to enhance your JOBTREAD experience with just a simple connection.",
  },
  {
    id: "datax-features",
    question: "What kind of features can DATAx build?",
    answer:
      "DATAx excels in developing specialized features that extend JOBTREAD's capabilities. We've successfully integrated services like Zillow, Google Street View, Calendly, and advanced inventory management. Our team is constantly innovating, so the possibilities are truly endless. If you can imagine it, we can likely build it!",
  },
  {
    id: "security",
    question: "How secure is the integration with JOBTREAD?",
    answer:
      "Security is our top priority. By utilizing the official JOBTREAD API, we ensure that your data remains safe and intact. Our integration is designed to access only the necessary information without altering your core JOBTREAD data. You can trust that your sensitive information is protected throughout our seamless integration process.",
  },
]

const EpicFAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<string | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null)

  const toggleQuestion = (id: string) => {
    setActiveIndex(activeIndex === id ? null : id)
  }

  return (
    <section className="py-24 w-full bg-gradient-to-br from-white to-gray-100">
      <div className="container mx-auto px-4">
        <motion.h1
          className="text-5xl md:text-6xl font-black text-center mb-6 text-black"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Unleash the Power of{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] to-yellow-500">
            JOBTREAD API
          </span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-center mb-16 text-gray-600 font-light"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Frequently Asked Questions
        </motion.p>

        <div className="space-y-8 mb-16 max-w-4xl mx-auto">
          {faqData.map((faq, index) => (
            <motion.div
              key={faq.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-500 ease-in-out"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <button
                className="w-full text-left py-6 px-8 focus:outline-none group relative overflow-hidden"
                onClick={() => toggleQuestion(faq.id)}
                onMouseEnter={() => setHoveredIndex(faq.id)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center bg-[#FFD400] transition-all duration-300">
                      <Zap className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-xl font-bold text-black group-hover:text-[#FFD400] transition-colors duration-300">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-[#FFD400] transition-all duration-300">
                    <motion.svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      animate={{ rotate: activeIndex === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <path
                        d="M19 9L12 16L5 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </div>
                </div>
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[#FFD400] to-yellow-300 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ease-in-out"
                  style={{
                    clipPath: hoveredIndex === faq.id ? "circle(150% at 100% 0)" : "circle(0% at 100% 0)",
                    transition: "clip-path 0.5s ease-in-out",
                  }}
                />
              </button>
              <AnimatePresence>
                {activeIndex === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-6 text-gray-600 relative">
                      <div className="relative z-10">{faq.answer}</div>
                      <div
                        className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FFD400] opacity-5"
                        style={{
                          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                          transition: "clip-path 0.5s ease-in-out",
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EpicFAQ

