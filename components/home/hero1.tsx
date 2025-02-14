"use client"

import { useState, useEffect, useCallback } from "react"
import { Zap, Sparkles, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

const Hero = () => {
  const [isHoveringTry, setIsHoveringTry] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isHoveringVideo, setIsHoveringVideo] = useState(false)
  const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number }[]>([])

  const generateStars = useCallback(() => {
    const newStars = Array.from({ length: 150 }, () => ({
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
    videoId: "kZoFzQK1Scg",
  }

  return (
    <>
      <section className="relative py-24 w-full overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-black">
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
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge
                variant="outline"
                className="text-[#FFD400] bg-[#FFD400]/10 backdrop-blur-sm border-[#fff]/20 px-4 py-2"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  New Release
                </motion.span>
                <Sparkles className="ml-2 h-5 w-5" />
              </Badge>
              <motion.div
                className="my-8 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <h2 className="text-5xl font-bold lg:text-6xl text-white leading-tight">
                  Your
                  <span className="block text-[#FFD400] mt-2">JOBTREAD</span>
                  automation partner
                </h2>
              </motion.div>
              <motion.div
                className="flex w-full flex-col sm:flex-row justify-center gap-6 lg:justify-start mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <div className="flex flex-col items-center">
                  <a href="/#epic-solutions" className="group w-auto">
                    <Button
                      className="h-14 px-8 w-auto bg-gradient-to-r from-[#FFD400] to-[#FFA500] text-[#000000] transition-all duration-300 transform hover:scale-105 relative overflow-hidden group-hover:shadow-[0_0_30px_5px_rgba(255,212,0,0.4)] hover:from-[#FFE666] hover:to-[#FFB733] rounded-full text-xl font-bold"
                      onMouseEnter={() => setIsHoveringTry(true)}
                      onMouseLeave={() => setIsHoveringTry(false)}
                    >
                      <motion.span
                        className="relative z-10 transition-colors duration-300"
                        animate={isHoveringTry ? { y: [-2, 2, -2] } : {}}
                        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        Explore Solutions
                      </motion.span>
                      <motion.div
                        animate={isHoveringTry ? { rotate: 360, scale: 1.25 } : { rotate: 0, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Zap
                          className={`ml-3 h-6 w-6 relative z-10 transition-all duration-300 ${isHoveringTry ? "text-white" : "text-black"}`}
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
                className="relative w-full pb-[56.25%] overflow-hidden rounded-2xl shadow-lg"
                onMouseEnter={() => setIsHoveringVideo(true)}
                onMouseLeave={() => setIsHoveringVideo(false)}
                animate={{
                  scale: isHoveringVideo ? 1.02 : 1,
                  boxShadow: isHoveringVideo
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
                    : "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 border border-[#FFD400]/20 rounded-2xl"
                  animate={{
                    opacity: isHoveringVideo ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <AnimatePresence>
                  {!isVideoPlaying && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    >
                      <Button
                        onClick={() => setIsVideoPlaying(true)}
                        className="bg-white/10 hover:bg-white/20 text-white rounded-full p-4"
                      >
                        <Play className="h-12 w-12" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-2xl"
                  src={`https://www.youtube.com/embed/${videoData.videoId}?modestbranding=1&rel=0&autoplay=${isVideoPlaying ? 1 : 0}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero

