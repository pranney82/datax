'use client'

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, Zap, Target, Clock, Rocket, TrendingUp } from 'lucide-react';

const reasons = [
  {
    title: 'Built by JOBTREAD Users',
    description:
      'With our experience as remodelers and JOBTREAD users, DATAx streamlines your operations with better data management and automation.',
    icon: Users,
    color: '#8B5CF6',
  },
  {
    title: 'Easy to Use',
    description:
      'Simply enter your JOBTREAD login, and we\'ll handle the rest—no coding required. We\'ve managed the complexities so you can enjoy the benefits effortlessly.',
    icon: Zap,
    color: '#FBBF24',
  },
  {
    title: 'Prebuilt Templates',
    description:
      "Access a growing library of industry-leading dashboards, automations, and resources designed to supercharge your JOBTREAD experience.",
    icon: Target,
    color: '#10B981',
  },
  {
    title: 'Real Time Data',
    description:
      'Your data syncs real time with every change that happens in JOBTREAD, ensuring you always have the most up-to-date information at your fingertips.',
    icon: Clock,
    color: '#3B82F6',
  },
  {
    title: 'JOBTREAD Companion',
    description:
      'Experience the power of a purpose-built companion app, developed in collaboration with the JOBTREAD team to perfectly complement your existing workflow.',
    icon: Rocket,
    color: '#EF4444',
  },
  {
    title: 'Less Time Wrestling with Data',
    description:
      'Bid farewell to endless spreadsheets and complex Zapier setups. Reclaim your time and focus on what truly matters - growing your business.',
    icon: TrendingUp,
    color: '#6366F1',
  },
];

const FeatureCard = ({ reason, index }) => {
  const IconComponent = reason.icon;

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md border border-gray-200 h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-6 flex items-center justify-center">
          <div className="rounded-full p-3" style={{ backgroundColor: `${reason.color}20` }}>
            <IconComponent className="w-8 h-8" style={{ color: reason.color }} />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-4 text-center text-gray-800">{reason.title}</h3>
        <p className="text-gray-600 text-center flex-grow">{reason.description}</p>
      </div>
    </motion.div>
  );
};

const EpicFeatureSection = () => {
  return (
    <section className="py-20 w-full bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="mb-16 md:mb-24 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <Image
              src="/assets/logos/5.png"
              alt="DATAx Logo"
              width={300}
              height={300}
              className="mx-auto rounded-xl"
            />
          </motion.div>
          <div className="w-32 h-1 mx-auto bg-gray-300 mb-6"></div>  
          <motion.div 
            className="mt-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#000' }}>
              Built by <span style={{ color: '#ffd400' }}>JOBTREAD</span> users, for <span style={{ color: '#ffd400' }}>JOBTREAD</span> users
            </h2>
            <p className="text-xl" style={{ color: '#000' }}>
              Simply connect your JobTread account and get started—<span className="font-semibold" style={{ color: '#ffd400' }}>no hassle, just results.</span>
            </p>
          </motion.div>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <FeatureCard key={i} reason={reason} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EpicFeatureSection;

