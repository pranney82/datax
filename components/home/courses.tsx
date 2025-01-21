"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useAnimation } from "framer-motion"
import { Map, MapPin, ArrowRightIcon, HardHat, BotIcon as Robot } from "lucide-react"
import { useState, useEffect } from "react"

const EpicButton = ({ title, href }: { title: string; href: string }) => {
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()
  const pathControls = useAnimation()

  useEffect(() => {
    if (isHovered) {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.5, repeat: Number.POSITIVE_INFINITY },
      })
      pathControls.start({
        pathLength: [0, 1],
        transition: { duration: 1.5, ease: "easeInOut" },
      })
    } else {
      controls.stop()
      pathControls.stop()
      pathControls.start({ pathLength: 0 })
    }
  }, [isHovered, controls, pathControls])

  return (
    <Link href={href} passHref>
      <motion.button
        className="group relative px-8 py-3 bg-[#ffd400] text-gray-800 font-bold rounded-full shadow-lg overflow-hidden"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div className="relative z-10 flex items-center justify-center space-x-2" animate={controls}>
          <Map className="w-5 h-5" />
          <span>{title}</span>
        </motion.div>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M10,50 Q25,30 40,50 T70,50 T100,50"
            fill="none"
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={pathControls}
          />
          {[25, 50, 75].map((x, i) => (
            <motion.circle
              key={i}
              cx={x}
              cy="50"
              r="3"
              fill="white"
              initial={{ scale: 0 }}
              animate={isHovered ? { scale: [0, 1.5, 1] } : { scale: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
            />
          ))}
        </svg>
        <motion.div
          className="absolute right-2 bottom-2"
          initial={{ scale: 0, rotate: 0 }}
          animate={isHovered ? { scale: 1, rotate: 360 } : { scale: 0, rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MapPin className="w-6 h-6 text-white" />
        </motion.div>
      </motion.button>
    </Link>
  )
}

const About = () => {
  return (
    <section className="py-20 w-full bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
            Automation Courses
          </h1>
          <div className="bg-[#ffd400] p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl group">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-xl text-gray-800 font-semibold group-hover:text-gray-900 transition-colors duration-300">
                Empower contractors with automation.
              </p>
              <div className="flex justify-center items-center mt-4">
                <div className="flex space-x-4">
                  <HardHat className="w-8 h-8 text-gray-900" />
                  <ArrowRightIcon className="w-8 h-8 text-gray-900" />
                  <Robot className="w-8 h-8 text-gray-900" />
                </div>
              </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#ffd400] rounded-2xl transform rotate-3 scale-105 z-0"></div>
            <Image
              src="/assets/images/courses.png"
              alt="Automation Courses"
              width={600}
              height={400}
              className="rounded-2xl object-cover shadow-2xl relative z-10 transform transition-transform duration-300 hover:scale-105"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 border-b-2 border-[#ffd400] pb-2 inline-block">
                Course 1: Automation Kickstart
              </h2>
              
                <div className="flex items-center space-x-2 mb-8">
                    <span className="text-2xl font-bold">$600</span> 
                    <span className="text-lg text-gray-700">one time, lifetime access</span>
                </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                This is our beginner course where we will kickstart your automation journey! Start with the basics and work your way up to intermediate workflows
                with weekly classes, hands-on building, and a community to support you. 
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <p className="text-lg text-gray-700 leading-relaxed">
                In this 4-week hands-on course, you will learn:
                <ul className="list-none text-gray-700">
                  <li>🚀 How to automate JobTread and other parts of your business</li> 
                  <li>🚀 Step-by-step guidance to automate your workflows</li>
                  <li>🚀 Proven workflows that we use in our own businesses</li>
                  <li>🚀 Confidence to identify and build your own workflows</li>
                </ul>
              </p>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#ffd400] pb-2 inline-block">Class Outline</h3>
                <ul className="list-none text-gray-700">
                    <li>Week 1: WHAT and HOW to Automate</li>
                    <li>Week 2: 10 Zaps to Get You Started</li>
                    <li>Week 3: Filters and Loops</li>
                    <li>Week 4: Multi-Step and Paths</li>
                </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">              
              <p className="text-lg text-gray-700 leading-relaxed">
                What&apos;s Included:
                <ul className="list-none text-gray-700">
                  <li>✅ Live, instructor-led classes with Q&A</li> 
                  <li>✅ 1 hour instruction, 1 hour Q&A</li>
                  <li>✅ Lifetime access to recordings and future updates</li>
                  <li>✅ Weekly worksheets to push your skills</li>
                  <li>✅ Ready-to-use and actionable workflows</li>
                  <li>✅ Ongoing support in our community</li>
                </ul>
              </p>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#ffd400] pb-2 inline-block">
                    Next Class Starts: January 29th, 2025
                </h2>
            </div>
            

            <div className="mt-8">
              <EpicButton title="Register Now" href="#" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-48">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#ffd400] rounded-2xl transform rotate-3 scale-105 z-0"></div>
            <Image
              src="/assets/images/courses.png"
              alt="Automation Courses"
              width={600}
              height={400}
              className="rounded-2xl object-cover shadow-2xl relative z-10 transform transition-transform duration-300 hover:scale-105"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 border-b-2 border-[#ffd400] pb-2 inline-block">
                Course 2: Automation Mastery
              </h2>
              
                <div className="flex items-center space-x-2 mb-8">
                    <span className="text-2xl font-bold">$1000</span> 
                    <span className="text-lg text-gray-700">one time, lifetime access</span>
                </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                This is our intermediate course where we will take your automation skills to the next level! Continuing from the first course,
                we will dive deeper into advanced Zapier features, the JobTread API, and AI integration into your workflows. 
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <p className="text-lg text-gray-700 leading-relaxed">
                In this 4-week hands-on course, you will learn:
                <ul className="list-none text-gray-700">
                  <li>🚀 Advanced logic and data manipulation</li> 
                  <li>🚀 JobTread API for advanced tasks</li>
                  <li>🚀 AI Integration into your workflows</li>
                  <li>🚀 Proven workflows that we use in our own businesses</li>
                  <li>🚀 Confidence to build advanced workflows</li>
                </ul>
              </p>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#ffd400] pb-2 inline-block">Class Outline</h3>
                <ul className="list-none text-gray-700">
                    <li>Week 1: Conditional Logic, Variables, and Data Manipulation</li>
                    <li>Week 2: JobTread API part 1</li>
                    <li>Week 3: JobTread API part 2</li>
                    <li>Week 4: AI Integration into your Workflows</li>
                </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">              
              <p className="text-lg text-gray-700 leading-relaxed">
                What&apos;s Included:
                <ul className="list-none text-gray-700">
                  <li>✅ Live, instructor-led classes with Q&A</li> 
                  <li>✅ 1 hour instruction, 1 hour Q&A</li>
                  <li>✅ Lifetime access to recordings and future updates</li>
                  <li>✅ Weekly worksheets to push your skills</li>
                  <li>✅ Ready-to-use and actionable workflows</li>
                  <li>✅ Ongoing support in our community</li>
                </ul>
              </p>
            </div>

            <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#ffd400] pb-2 inline-block">
                    Next Class Starts: January 29th, 2025<br />
                    Following Class: April 8th,2025 
                </h2>
            </div>
            

            <div className="mt-8">
              <EpicButton title="Register Now" href="#" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    
  )
}

export default About

