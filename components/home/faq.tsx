'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'

const faqData = {
  title: "Unleash the Power of JOBTREAD API",
  subtitle: "Frequently Asked Questions",
  questions: [
    {
      question: "What is JOBTREAD API",
      answer: "API is simply a computer language that allows developers (like DATAx) to connect software to each other. So we use the JOBTREAD API to create seamless data exchange and workflow automation for your JOBTREAD account.",
      icon: <Lightbulb className="w-6 h-6 text-[#FFD400]" />
    },
    {
      question: "Won't JOBTREAD develop these features themselves?",
      answer: "JOBTREAD is laser-focused on building the ultimate construction management platform. We are here to supplement that with specialized features and dashboards.",
      icon: <Lightbulb className="w-6 h-6 text-[#FFD400]" />
    },
    {
      question: "What is DATAx?",
      answer: "A software company only for JOBTREAD users that builds specialized features and dashboards so you don't have to. Just connect and go!",
      icon: <Lightbulb className="w-6 h-6 text-[#FFD400]" />
    },
    {
      question: "What kind of features can DATAx build?",
      answer: "Our foucs is to build specialized features for JOBTREAD users that are outside of JOBTREAD's scope. Zillow, Google Street, Calendly, Inventory are just a few examples. We're constantly developing new features, the possibilities are endless!",
      icon: <Lightbulb className="w-6 h-6 text-[#FFD400]" />
    },
    {
      question: "How secure is the integration with JOBTREAD?",
      answer: "Since we are using the JOBTREAD API you can rest assured your data is safe and will NOT be changed by connecting to DATAx.",
      icon: <Lightbulb className="w-6 h-6 text-[#FFD400]" />
    }
  ]
}

const EpicFAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section className="pt-16 pb-20 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 text-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold text-center mb-6 text-gray-800"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Unleash the Power of <span className="font-normal">JOB</span>
          <strong>TREAD</strong> API
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-center mb-12 text-gray-600"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {faqData.subtitle}
        </motion.p>
        <div className="space-y-6 mb-8">
          {faqData.questions.map((faq, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                className="w-full text-left py-5 px-6 focus:outline-none"
                onClick={() => toggleQuestion(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-6 h-6">
                      {faq.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{faq.question}</h3>
                  </div>
                  <div className="flex-shrink-0 w-6 h-6">
                    {activeIndex === index ? (
                      <ChevronUp className="w-full h-full text-gray-600" />
                    ) : (
                      <ChevronDown className="w-full h-full text-gray-600" />
                    )}
                  </div>
                </div>
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-gray-600">
                      {faq.answer}
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

