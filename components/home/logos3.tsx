'use client';

import React, { useState, useEffect } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { Heart, Hammer, Paintbrush, Drill } from 'lucide-react';
import Image from 'next/image';

const logos = [
  {
    id: "logo-1",
    description: "Built with Love",
    image: "/assets/lovedlogos/4.png"
  },
  {
    id: "logo-2",
    description: "Figma",
    image: "/assets/lovedlogos/4.png"
  },
  {
    id: "logo-3",
    description: "Next.js",
    image: "/assets/lovedlogos/4.png"
  },
  {
    id: "logo-4",
    description: "React",
    image: "/assets/lovedlogos/4.png"
  },
  {
    id: "logo-5",
    description: "shadcn/ui",
    image: "/assets/lovedlogos/4.png"
  },
  {
    id: "logo-6",
    description: "Supabase",
    image: "/assets/lovedlogos/4.png"
  },
  {
    id: "logo-7",
    description: "Tailwind CSS",
    image: "/assets/lovedlogos/4.png"
  },
  {
    id: "logo-8",
    description: "Vercel",
    image: "/assets/lovedlogos/4.png"
  }
];

const toolIcons = [Hammer, Paintbrush, Drill];

const EpicLogoShowcase = () => {
  const [stars, setStars] = useState<{ x: number; y: number; size: number; isIcon: boolean; iconIndex: number }[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 100 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        isIcon: Math.random() > 0.95, // 5% chance of being an icon (reduced from 10%)
        iconIndex: Math.floor(Math.random() * toolIcons.length),
      }));
      setStars(newStars);
    };

    generateStars();
    const interval = setInterval(generateStars, 10000);
    return () => clearInterval(interval);
  }, []);

  const titleProps = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: config.molasses,
  });

  return (
    <section className="relative py-28 overflow-hidden bg-black">
      {stars.map((star, index) => (
        star.isIcon ? (
          <div
            key={index}
            className="absolute text-white opacity-30"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              animation: `twinkle ${Math.random() * 4 + 2}s infinite`,
            }}
          >
            {React.createElement(toolIcons[star.iconIndex], { size: 12 })}
          </div>
        ) : (
          <div
            key={index}
            className="absolute bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 4 + 2}s infinite`,
            }}
          />
        )
      ))}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <animated.h1 style={titleProps} className="my-16 text-center text-4xl font-bold text-white lg:text-6xl">
          <Heart className="inline-block w-12 h-12 text-ffd400 fill-ffd400 mr-2" />
          by these companies
        </animated.h1>
        <div className="relative overflow-hidden mb-4">
          <div className="flex space-x-8 animate-scroll">
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex flex-col items-center justify-center p-8 bg-gray-900 bg-opacity-80 rounded-lg backdrop-filter backdrop-blur-lg transition-all duration-300 flex-shrink-0 shadow-lg shadow-ffd400/20"
              >
                <div className="relative w-24 h-24">
                  <Image
                    src={logo.image}
                    alt={logo.description}
                    layout="fill"
                    objectFit="contain"
                    className="filter brightness-0 invert"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .text-ffd400 {
          color: #ffd400;
        }
        .fill-ffd400 {
          fill: #ffd400;
        }
      `}</style>
    </section>
  );
};

export default EpicLogoShowcase;

