'use client'

import React from 'react';
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
      'With our experience as remodelers and JOBTREAD users, DATAx streamlines your operations with better data management and automation.',
    icon: Users,
    color: '#8B5CF6',
  },
  {
    title: 'Easy to Use',
    description:
      'Simply enter your JOBTREAD login, and we’ll handle the rest—no coding required. We’ve managed the complexities so you can enjoy the benefits effortlessly.',
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
<h2 className="mb-6 text-4xl font-bold lg:text-5xl text-gray-900">
  What is{" "}
  <span
    className="bg-clip-text text-transparent"
    style={{
      backgroundImage: "linear-gradient(to right, #000, #FFD400)",
    }}
  >
    DATAx
  </span>
  ?
</h2>
          <div className="w-32 h-1 mx-auto bg-gray-300"></div>  
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          A custom built application made specifically for JOBTREAD users. <br></br><br></br>We build custom features, dashboards, just add your JOBTREAD login and go.
          </p>
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

