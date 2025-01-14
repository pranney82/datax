'use client'

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, Zap, Target, Clock, Rocket, TrendingUp } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
interface Reason {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const reasons = [
  {
    title: 'Built by JOBTREAD Users',
    description:
      'As JOBTREAD users ourselves, DATAx is built for maximum results enabling specialized integrations, automations and dashboards.',
    icon: Users,
    color: '#8B5CF6',
  },
  {
    title: 'Easy to Use',
    description:
      'Simply enter your JOBTREAD login, and we\'ll handle the rest—no coding required.',
    icon: Zap,
    color: '#FBBF24',
  },
  {
    title: 'Prebuilt Templates',
    description:
      "Access a growing library of industry-leading dashboards, automations, and resources designed for your JOBTREAD.",
    icon: Target,
    color: '#10B981',
  },
  {
    title: 'Real Time Data',
    description:
      'Your data syncs real time with every change that happens in JOBTREAD.',
    icon: Clock,
    color: '#3B82F6',
  },
  {
    title: 'Seamless JT Integration',
    description:
      'Leveraging JOBTREAD’s API, DATAx activates automations and integrations within their JOBTREAD account.',
    icon: Rocket,
    color: '#EF4444',
  },
  {
    title: 'Less Time Wrestling with Data',
    description:
      'Bid farewell to endless spreadsheets and complex Zapier setups. Focus on what truly matters - growing your business.',
    icon: TrendingUp,
    color: '#6366F1',
  },
];

const FeatureCard = ({ reason, index }: { reason: Reason; index: number }) => {
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
              width={260}
              height={260}
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
              Simply connect your JOBTREAD account and get started—<span className="font-semibold" style={{ color: '#ffd400' }}>no hassle, just results.</span>
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

