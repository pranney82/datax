'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'

const faqData = {
  title: "Unleash the Power of JobTread",
  subtitle: "Frequently Asked Questions",
  questions: [
    {
      question: "Won't JobTread develop these features themselves?",
      answer: "JobTread is laser-focused on building the ultimate construction management platform. Some of our epic features are beyond their current scope, so we've crafted them here to supercharge your workflow!",
      icon: <Lightbulb className="w-6 h-6 text-blue-500" />
    },
    {
      question: "How is this different from what JobTread offers?",
      answer: "We're the turbo boost to JobTread's engine! Our custom integrations and solutions are more specialized and advanced than the standard JobTread offerings. These supercharged features are built on top of JobTread, allowing you to leverage your existing data with unprecedented power and flexibility!",
      icon: <Lightbulb className="w-6 h-6 text-blue-500" />
    },
    {
      question: "Can I still use my JobTread data with your enhanced features?",
      answer: "Our enhanced features are designed to seamlessly integrate with your JobTread data. Think of it as giving your data superpowers - all the familiarity of JobTread, but with turbo-charged capabilities!",
      icon: <Lightbulb className="w-6 h-6 text-blue-500" />
    },
    {
      question: "What kind of support do you offer?",
      answer: "We provide comprehensive support for all our enhanced features. Our team of experts is always ready to assist you with any questions or issues you might encounter while using our integrations.",
      icon: <Lightbulb className="w-6 h-6 text-blue-500" />
    },
    {
      question: "Can I customize the enhanced features?",
      answer: "Our enhanced features are designed with flexibility in mind. We offer various customization options to tailor the functionality to your specific needs and workflow.",
      icon: <Lightbulb className="w-6 h-6 text-blue-500" />
    },
    {
      question: "Is training available for your enhanced features?",
      answer: "Yes, we offer comprehensive training sessions to help you and your team get the most out of our enhanced features. These sessions are designed to ensure you can leverage the full power of our integrations from day one.",
      icon: <Lightbulb className="w-6 h-6 text-blue-500" />
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
          <strong>TREAD</strong>
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
                    {faq.icon}
                    <h3 className="text-xl font-semibold">{faq.question}</h3>
                  </div>
                  {activeIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-600" />
                  )}
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

