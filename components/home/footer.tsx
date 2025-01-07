'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Hammer, Paintbrush, Drill } from 'lucide-react';
import { Button } from '@/components/ui/button';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Dashboard', href: '/#dashboard' },
      { name: 'Toolbox', href: '/#toolbox' },
      { name: 'Library', href: '/#library' },
      { name: 'Test Drive', href: '#' },
      { name: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Roadmap', href: '/roadmap' },
    ],
  },
  {
    title: 'Free Resources',
    links: [
      { name: 'Library', href: '#' },
      { name: 'Resources', href: '#' },
      { name: 'Summary Dashboard', href: '#' },
    ],
  },
];

const FooterColumn = ({ title, links }: { title: string; links: { name: string; href: string }[] }) => {
  return (
    <div className="mb-8 lg:mb-0">
      <h3 className="text-xl font-bold text-[#FFD400] mb-4 group-hover:text-white transition-colors duration-300">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
            >
              <span>{link.name}</span>
              <ArrowRight className="w-4 h-4 ml-1 opacity-0 transition-all duration-300 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer = () => {
  const [isHoveringTry, setIsHoveringTry] = useState(false);

  return (
    <footer className="relative text-white py-16 w-full overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[url('/assets/footer-bg.jpg')] bg-cover bg-center opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-[#FFD400] opacity-70"></div>
      
      {/* Animated particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1 h-1 bg-[#FFD400] rounded-full"
          animate={{
            x: ['0%', '100%'],
            y: ['0%', '100%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
      
      {/* Animated hammers and paintbrushes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`hammer-${i}`}
          className="absolute text-[#FFD400]"
          animate={{
            x: ['0%', '100%'],
            y: ['0%', '100%'],
            rotate: [0, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          <Hammer size={16} />
        </motion.div>
      ))}
      
      {/* Animated paintbrushes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`paintbrush-${i}`}
          className="absolute text-[#FFD400]"
          animate={{
            x: ['0%', '100%'],
            y: ['0%', '100%'],
            rotate: [0, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          <Paintbrush size={16} />
        </motion.div>
      ))}

      {/* Animated drills */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`drill-${i}`}
          className="absolute text-[#FFD400]"
          animate={{
            x: ['0%', '100%'],
            y: ['0%', '100%'],
            rotate: [0, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          <Drill size={16} />
        </motion.div>
      ))}
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <Link href="/" className="inline-block">
              <Image
                src="/assets/logos/7.png"
                alt="logo"
                width={240}
                height={120}
                className="h-16 w-auto filter drop-shadow-[0_0_0.3rem_#ffffff70]"
              />
            </Link>
            <p className="text-xl text-gray-300 max-w-md font-medium leading-relaxed">
              Data made easy. <br/>Unleash the power of <span className="font-normal">JOB</span>
              <strong>TREAD</strong>  .
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Button 
                className="w-full sm:w-auto bg-[#FFD400] text-black font-bold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-black relative overflow-hidden group shadow-[0_0_15px_rgba(255,212,0,0.5)]"
                onMouseEnter={() => setIsHoveringTry(true)}
                onMouseLeave={() => setIsHoveringTry(false)}
              >
                <span className="relative z-10 transition-colors duration-300">Try Free</span>
                <Zap className={`ml-2 h-5 w-5 relative z-10 transition-all duration-300 ${isHoveringTry ? 'rotate-[360deg] scale-125' : ''}`} />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-[#FFD400] to-white"
                  initial={{ x: '100%' }}
                  animate={isHoveringTry ? { x: '0%' } : { x: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
              <p className="text-sm text-gray-400 font-medium">No card required</p>
            </div>
            <Link href="#" className="inline-block">
              <Image
                src="/assets/logos/jobtread-logo-rgb-ow.png"
                alt="JobTread Affiliate"
                width={180}
                height={90}
                className="opacity-100"
              />
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8"
          >
            {footerLinks.map((column) => (
              <FooterColumn key={column.title} {...column} />
            ))}
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400"
        >
          <p className="font-medium">© 2025 A Contractor CTO Company. All rights reserved.</p>
          <ul className="flex flex-wrap justify-center gap-4">
            <li>
              <Link href="/terms" className="font-medium hover:text-white transition-colors duration-200">
                Terms and Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="font-medium hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

