'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Zap, BarChart3, Wrench, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    title: "Dashboard",
    subtitle: "VISUALIZE YOUR JOBTREAD DATA",
    id: "dashboard",
    description: "Unlock your business's full potential with our powerful Dashboard—offering a bird's-eye view, key metrics tracking, and data-driven insights.",
    list: [
      "Your JOBTREAD data",
      "Real-time data",
      "Set goals",
    ],
    image: "/assets/images/feature1.png",
    color: "#ffd400",
    icon: BarChart3
  },
  {
    title: 'Toolbox',
    subtitle: "CUSTOM FEATURES FOR YOUR JOBTREAD",
    id: 'toolbox',
    description: "Supercharge your workflow with our cutting-edge Toolbox—designed for JOBTREAD users, delivering custom, code-free solutions to boost productivity.",
    list: [
      'Pre-built custom features',
      'Automations & Integrations',
      'Code free, just turn on'
    ],
    image: "/assets/images/feature2.png",
    color: "#ffd400",
    icon: Wrench
  },
  {
    title: 'Library',
    subtitle: "MAXIMIZE YOUR JOBTREAD EXPERIENCE",
    id: 'library',
    description: "Access a wealth of resources in our comprehensive Library—featuring ready-to-use templates and expert guides to help your team excel effortlessly.",
    list: [
      'Extensive template collection',
      'Pre-built templates',
      'Cost Groups, Schedules, Todos'
    ],
    image: "/assets/images/feature3.png",
    color: "#ffd400",
    icon: BookOpen
  }
];

const FeatureCard = ({ feature }) => {
  const IconComponent = feature.icon;
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="bg-gradient-to-br from-black via-black to-[#111] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#ffd400] h-full flex flex-col">
      <div className="relative z-10">
        <div className="p-6 pb-3">
          <h2 className="text-4xl font-extrabold mb-2 text-[#ffd400] leading-tight">
            {feature.title}
          </h2>
          <h3 className="text-sm font-bold text-white">{feature.subtitle}</h3>
        </div>
        <div className="relative w-full overflow-hidden" style={{ paddingBottom: '85%' }}>
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#FFEB80] to-black filter blur-[50px] opacity-40"></div>
          </div>
          <div className="absolute inset-0 z-10 p-8">
            <div className="relative w-full h-full">
              <Image
                src={feature.image}
                alt={`${feature.title} preview`}
                layout="fill"
                objectFit="contain"
                className="relative z-10 w-full rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="p-6 pt-3 flex-grow flex flex-col justify-between">
          <div>
            <p className="text-gray-300 mb-6 text-lg">{feature.description}</p>
            <ul className="space-y-4">
              {feature.list.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center bg-gradient-to-r from-[#222] to-[#333] rounded-lg p-3 shadow-lg"
                >
                  <div className="mr-4 flex-shrink-0 bg-[#ffd400] rounded-full p-2">
                    <IconComponent className="text-black w-6 h-6" />
                  </div>
                  <span className="text-white text-sm font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button
            className="mt-6 w-full bg-gradient-to-r from-[#FFD400] to-[#FFA500] text-black font-bold py-3 rounded-full transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <span className="relative z-10 transition-colors duration-300">
              Explore {feature.title}
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </Button>
        </div>
      </div>
    </div>
  );
};

const EpicFeatures = () => {
  const [isHoveringTry, setIsHoveringTry] = useState(false);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-black to-[#111] text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-center mb-4 md:mb-6 leading-tight">  
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ffd400] to-[#fff]">  
          DATAx  
          </span>{' '}
        <span className="font-normal">your JOB</span>
        <strong>TREAD</strong>  
          </h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-center mb-12 md:mb-16 text-gray-300 max-w-3xl mx-auto"
        >
          Spend less time managing data and creating automations—and more time growing your business.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EpicFeatures;

