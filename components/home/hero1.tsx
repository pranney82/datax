'use client';

import { Zap, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const Hero1 = () => {
  const [isHoveringTry, setIsHoveringTry] = useState(false);
  const [stars, setStars] = useState<{ x: number; y: number; size: number }[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
      }));
      setStars(newStars);
    };

    generateStars();
    const starInterval = setInterval(generateStars, 10000);

    return () => clearInterval(starInterval);
  }, []);

  const videoData = {
    question: "How does it work?",
    answer: "Getting started is easy! Simply enter your JOBTREAD grant key, and you're all set. From there, you can explore your dashboard, enable custom integrations, and unlock a variety of powerful features!",
    videoUrl: "https://www.youtube.com/embed/FiAXjvgV0Zc",
    thumbnailUrl: "/assets/thumbnails/2.png"
  };

  return (
    <section className="relative py-20 w-full overflow-hidden bg-[#0a0a0a]">
      {stars.map((star, index) => (
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
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1a1a]/30 to-black/50 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_40%)] transition-opacity duration-300"></div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Badge variant="outline" className="text-[#FFD400] bg-[#FFD400]/10 backdrop-blur-sm animate-pulse border-[#fff]/20">
              New Release
              <Sparkles className="ml-2 h-4 w-4" />
            </Badge>
            <div className="my-6 space-y-4">
              <h2 className="text-4xl font-bold lg:text-5xl text-white leading-tight">
                Done for you
                <span className="block text-[#FFD400]">specialty features</span>
                and dashboards
              </h2>
              <p className="text-2xl font-semibold text-white/80 italic">
                ... no tech ability required
              </p>
            </div>
            <div className="flex w-full flex-col sm:flex-row justify-center gap-4 lg:justify-start mt-8">
              <div className="flex flex-col items-center">
                <a href="/#epic-features" className="group w-auto">
                  <Button 
                    className="h-14 px-8 w-auto bg-gradient-to-r from-[#FFD400] to-[#FFA500] text-[#000000] transition-all duration-300 transform hover:scale-105 relative overflow-hidden group-hover:shadow-[0_0_20px_5px_rgba(255,212,0,0.3)] hover:from-[#FFE666] hover:to-[#FFB733] rounded-full text-lg font-bold"
                    onMouseEnter={() => setIsHoveringTry(true)}
                    onMouseLeave={() => setIsHoveringTry(false)}
                  >
                    <span className="relative z-10 transition-colors duration-300">Explore Features</span>
                    <Zap className={`ml-2 h-5 w-5 relative z-10 transition-all duration-300 ${isHoveringTry ? 'rotate-[360deg] scale-125 text-white' : 'text-black'}`} />
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </Button>
                </a>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-radial from-[#FFD400] via-[#FFA500] to-transparent opacity-20 blur-3xl transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-conic from-[#FFD400] via-[#FFA500] to-[#FFD400] opacity-30 animate-spin-slow"></div>
            <div className="relative w-full pb-[56.25%] overflow-hidden rounded-lg">
              <iframe
                src={videoData.videoUrl}
                title={videoData.question}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-2xl transition-duration-300"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-[#0a0a0a] to-transparent pointer-events-none"></div>
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero1;

