"use client"

import Link from "next/link"
import { motion, useAnimation } from "framer-motion"
import { ArrowRightIcon, HardHat, BotIcon as Robot, Zap } from "lucide-react"
import { useState, useEffect } from "react"

const EpicButton = ({
  title,
  href,
  variant = "light",
}: { title: string; href: string; variant?: "light" | "dark" }) => {
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    if (isHovered) {
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.5, repeat: Number.POSITIVE_INFINITY },
      })
    } else {
      controls.stop()
    }
  }, [isHovered, controls])

  const bgColor = variant === "light" ? "bg-[#000]" : "bg-[#ffd400]"
  const textColor = variant === "light" ? "text-[#fff]" : "text-[#000]"
  const hoverBgColor = variant === "light" ? "bg-[#ffd400]" : "bg-[#fff]"

  return (
    <Link href={href} passHref>
      <motion.button
        className={`group relative px-8 py-3 ${bgColor} ${textColor} font-bold rounded-full shadow-lg overflow-hidden`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div className="relative z-10 flex items-center justify-center space-x-2" animate={controls}>
          <Zap className="w-5 h-5" />
          <span>{title}</span>
        </motion.div>
        <motion.div
          className={`absolute inset-0 ${hoverBgColor}`}
          initial={{ x: "-100%" }}
          animate={isHovered ? { x: 0 } : { x: "-100%" }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          initial={{ scale: 0, rotate: 0 }}
          animate={isHovered ? { scale: [0, 1.5, 1], rotate: [0, 45, 0] } : { scale: 0, rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${variant === "light" ? "bg-[#000]" : "bg-[#ffd400]"}`}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={
                isHovered
                  ? {
                      scale: [0, 1, 0],
                      x: [0, (i - 2) * 30],
                      y: [0, (Math.random() - 0.5) * 30],
                    }
                  : { scale: 0, x: 0, y: 0 }
              }
              transition={{ duration: 0.5, delay: i * 0.1 }}
            />
          ))}
        </motion.div>
      </motion.button>
    </Link>
  )
}

const CoursesSuccess = () => {
  return (
    <section className="py-20 w-full bg-gradient-to-br from-[#fff] via-[#ffd400] to-[#000] overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/assets/images/pattern.png')] opacity-10 mix-blend-overlay"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-[#000] mb-4 relative">
            <span className="relative z-10">Automation Courses</span>
            <motion.span
              className="absolute -inset-1 bg-[#ffd400] -skew-y-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ zIndex: 0 }}
            />
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

        <div className="grid md:grid-cols-2 gap-16 items-center bg-white rounded-xl p-8 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#ffd400] rounded-2xl transform rotate-3 scale-105 z-0"></div>
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <div className="video-container-courses">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/-N1rk-aY4tU"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl font-bold text-[#000] mb-4 relative inline-block">
                <span className="relative z-10">Course 1: Automation Kickstart</span>
                <motion.span
                  className="absolute -inset-1 bg-[#ffd400] skew-x-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ zIndex: 0 }}
                />
              </h2>

              <motion.div
                className="flex items-center space-x-2 mb-8"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <span className="text-3xl font-bold text-[#000]">Payment Successful!!</span>
              </motion.div>
              <p className="text-lg text-gray-700 leading-relaxed">
              🚀 I&apos;m so excited to have you and can&apos;t wait to see you in the course! <br />
                <br />
                🚀 The first worksheet is down below, be sure to complete that before the first class.<br />
                <br />
                🚀 The classes are recorded and will be available next day, so if you miss a session you can catch up!<br />
                <br />
                🚀 You&apos;ll get an email with the link to the first class as we get closer to the start date!
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#000] mb-4 border-b-2 border-[#ffd400] pb-2 inline-block">
                Next Steps
              </h3>
              <ul className="list-none text-gray-700 space-y-2">
                {[
                  "Get a paid Zapier account",
                  "Connect Zapier and JobTread",
                  "Review the first worksheet!"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="p-2 rounded-md transition-colors duration-300"
                    whileHover={{
                      backgroundColor: "#ffd400",
                      color: "#000",
                      scale: 1.05,
                    }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#ffd400] pb-2 inline-block">
                Next Class Starts: February 5th, 2025
              </h2>
            </div>

            <div className="mt-8">
              <EpicButton title="Get First Worksheet" href="https://drive.google.com/file/d/1ORfs7rVFPThUpm2SGQFvBM_vtHFPFJj8/view?usp=sharing" variant="light" />
            </div>
          </motion.div>
        </div>
      </div>

      
    </section>
  )
}

export default CoursesSuccess

