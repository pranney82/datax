"use client"

import { useState, useEffect, useCallback } from "react"
import { Zap, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const Hero1 = () => {
  const [isHoveringTry, setIsHoveringTry] = useState(false)
  const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number }[]>([])

  const generateStars = useCallback(() => {
    const newStars = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
    }))
    setStars(newStars)
  }, [])

  useEffect(() => {
    generateStars()
    const starInterval = setInterval(generateStars, 10000)
    return () => clearInterval(starInterval)
  }, [generateStars])

  const videoData = {
    question: "How does it work?",
    answer:
      "Getting started is easy! Simply enter your JOBTREAD grant key, and you're all set. From there, you can explore your dashboard, enable custom integrations, and unlock a variety of powerful features!",
    videoId: "kZoFzQK1Scg",
  }

  return (
    <section className="relative py-20 w-full overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0">
        {stars.map((star, index) => (
          <motion.div
            key={index}
            className="absolute bg-white rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: star.opacity }}
            transition={{ duration: Math.random() * 4 + 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          />
        ))}
      </div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1a1a]/30 to-black/50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_40%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <motion.div
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="outline" className="text-[#FFD400] bg-[#FFD400]/10 backdrop-blur-sm border-[#fff]/20">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                New Release
              </motion.span>
              <Sparkles className="ml-2 h-4 w-4" />
            </Badge>
            <motion.div
              className="my-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold lg:text-5xl text-white leading-tight">
                Your
                <motion.span
                  className="block text-[#FFD400]"
                  animate={{
                    textShadow: ["0 0 5px #FFD400", "0 0 20px #FFD400", "0 0 5px #FFD400"],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  JOBTREAD
                </motion.span>
                automation partner
              </h2>
              <p className="text-2xl font-semibold text-white/80 italic">... no tech ability required</p>
            </motion.div>
            <motion.div
              className="flex w-full flex-col sm:flex-row justify-center gap-4 lg:justify-start mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="flex flex-col items-center">
                <a href="/#epic-solutions" className="group w-auto">
                  <Button
                    className="h-12 px-6 w-auto bg-gradient-to-r from-[#FFD400] to-[#FFA500] text-[#000000] transition-all duration-300 transform hover:scale-105 relative overflow-hidden group-hover:shadow-[0_0_20px_5px_rgba(255,212,0,0.3)] hover:from-[#FFE666] hover:to-[#FFB733] rounded-full text-lg font-bold"
                    onMouseEnter={() => setIsHoveringTry(true)}
                    onMouseLeave={() => setIsHoveringTry(false)}
                  >
                    <motion.span
                      className="relative z-10 transition-colors duration-300"
                      animate={isHoveringTry ? { y: [-1, 1, -1] } : {}}
                      transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      Explore Solutions
                    </motion.span>
                    <motion.div
                      animate={isHoveringTry ? { rotate: 360, scale: 1.25 } : { rotate: 0, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Zap
                        className={`ml-2 h-5 w-5 relative z-10 transition-all duration-300 ${isHoveringTry ? "text-white" : "text-black"}`}
                      />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 bg-white"
                      initial={{ opacity: 0 }}
                      animate={isHoveringTry ? { opacity: 0.2 } : { opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </a>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-[#FFD400] via-[#FFA500] to-transparent opacity-20 blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-conic from-[#FFD400] via-[#FFA500] to-[#FFD400] opacity-30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <div className="relative w-full pb-[56.25%] overflow-hidden rounded-lg">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-2xl"
                src={`https://www.youtube.com/embed/${videoData.videoId}?modestbranding=1&rel=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-[#0a0a0a] to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
    </section>
  )
}

export default Hero1

