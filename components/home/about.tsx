'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { Map, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

const EpicRoadmapButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const pathControls = useAnimation();

  useEffect(() => {
    if (isHovered) {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.5, repeat: Infinity }
      });
      pathControls.start({
        pathLength: [0, 1],
        transition: { duration: 1.5, ease: "easeInOut" }
      });
    } else {
      controls.stop();
      pathControls.stop();
      pathControls.start({ pathLength: 0 });
    }
  }, [isHovered, controls, pathControls]);

  return (
    <Link href="/roadmap" passHref>
      <motion.button
        className="group relative px-8 py-3 bg-[#ffd400] text-gray-800 font-bold rounded-md shadow-lg overflow-hidden"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div
          className="relative z-10 flex items-center justify-center space-x-2"
          animate={controls}
        >
          <Map className="w-5 h-5" />
          <span>Roadmap</span>
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
  );
};

const About = () => {
  return (
    <section className="py-16 w-full bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 relative z-10">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <h1 className="my-6 text-5xl font-bold lg:text-7xl text-[#ffd400] drop-shadow-md">
              About Us
            </h1>
            <p className="mb-8 max-w-xl text-gray-700 lg:text-xl leading-relaxed">
              At <strong>DATAx</strong>, we're contractors who are passionate about helping other contractors thrive through the power of technology.
              <br /><br />
              It all started with real-world problems. Peter built a dashboard to visualize his business stats using JobTread data, and when he shared it, others loved it so much he knew he had to make it available for more people. Meanwhile, Elliott created micro features to tackle cash flow projections and automate workflows in his own business. When his friends saw the impact, they wanted in too.
              <br /><br />
              Together, we've combined our expertise to simplify data and empower you, the business owner. Our mission is simple: to give you more time to work on your business—not in spreadsheets.
              <br /><br />
              Let's take your business to the next level, together.
            </p>
            <EpicRoadmapButton />
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/assets/images/founders.png"
              alt="DATAx Team"
              width={1200}
              height={800}
              className="max-h-auto w-full rounded-2xl object-cover border-8 border-[#ffd400] shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

