"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useAnimation } from "framer-motion"
import { Map, MapPin, ArrowRightIcon } from "lucide-react"
import { useState, useEffect } from "react"

const EpicRoadmapButton = () => {
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
    <Link href="/roadmap" passHref>
      <motion.button
        className="group relative px-8 py-3 bg-[#ffd400] text-gray-800 font-bold rounded-full shadow-lg overflow-hidden"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div className="relative z-10 flex items-center justify-center space-x-2" animate={controls}>
          <Map className="w-5 h-5" />
          <span>Explore Our Roadmap</span>
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
            About <span className="text-[#ffd400]">DATAx</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering contractors with cutting-edge automation and technology solutions.
          </p>
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
              src="/assets/images/about.png"
              alt="DATAx Team"
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
                Our Story
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We&apos;re <span className="font-semibold">contractors</span> (and also nerds) who are passionate about
                helping contractors thrive through the power of technology.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <p className="text-lg text-gray-700 leading-relaxed">
                It started with creating <span className="font-semibold">automations and integrations</span> for our own
                construction companies, solving real-world challenges and transforming how we worked in JOBTREAD.
              </p>
            </div>

            <div className="bg-[#ffd400] p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl group">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-xl text-gray-800 font-semibold group-hover:text-gray-900 transition-colors duration-300">
                Empower contractors with automation.
              </p>
              <ArrowRightIcon className="w-6 h-6 mt-4 text-gray-900 group-hover:translate-x-2 transition-transform duration-300" />
            </div>

            <div className="mt-8">
              <EpicRoadmapButton />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About

