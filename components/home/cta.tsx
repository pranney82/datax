'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import Link from 'next/link'

export default function ColorfulEnhancedCTA() {
  const [isHoveringTry, setIsHoveringTry] = useState(false)

  return (
    <section className="py-16 w-full bg-[#FFD400]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex flex-col items-center rounded-2xl bg-[#FFF] p-8 text-center shadow-2xl md:p-12 lg:p-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2 
            className="mb-6 max-w-3xl text-3xl font-bold tracking-tight text-[#000] md:text-4xl lg:text-5xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Ready to <span className="text-[#FFD400] drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Win Your Data</span>?
          </motion.h2>
          <motion.p 
            className="mb-8 max-w-2xl text-[#000]/80 md:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Join a growing community of data-driven JOBTREAD companies and start making smarter decisions today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link href="/pricing">
              <button 
                className="w-full sm:w-auto min-w-[200px] bg-[#000] text-[#FFF] font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-[#FFD400] hover:text-[#000] relative overflow-hidden group shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                onMouseEnter={() => setIsHoveringTry(true)}
                onMouseLeave={() => setIsHoveringTry(false)}
              >
                <span className="relative z-10 transition-colors duration-300">Try Free</span>
                <Zap className={`ml-2 h-5 w-5 inline-block relative z-10 transition-all duration-300 ${isHoveringTry ? 'rotate-[360deg] scale-125' : ''}`} />
                <motion.div 
                  className="absolute inset-0 bg-[#FFD400]"
                  initial={{ x: '100%' }}
                  animate={isHoveringTry ? { x: '0%' } : { x: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </button>
            </Link>
          </motion.div>
          <motion.p 
            className="mt-4 text-sm text-[#000]/60"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            No card required
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

