'use client';

import { ArrowDownRight, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState } from 'react';

const Hero1 = () => {
  const [isHoveringTry, setIsHoveringTry] = useState(false);
  const [isHoveringFeatures, setIsHoveringFeatures] = useState(false);

  return (
    <section className="relative py-16 w-full overflow-hidden bg-[#000000]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_40%)] transition-opacity duration-300"></div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Badge variant="outline" className="text-[#FFD400] bg-[#FFD400]/10 backdrop-blur-sm animate-pulse border-[#fff]/20">
              New Release
              <ArrowDownRight className="ml-2 h-4 w-4" />
            </Badge>
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-[#FFD400] via-[#fff] to-[#FFA500] animate-gradient-x">
              Win Your DATA
            </h1>
            <p className="mb-8 max-w-xl text-[#fff] lg:text-xl">
              Done for you specialty features and dashboards
              <br /><br />
              ... no tech ability required
            </p>
            <div className="flex w-full flex-col sm:flex-row justify-center gap-4 lg:justify-start">
              <div className="flex flex-col items-center">
                <a href="/pricing" className="group w-auto">
                  <Button 
                    className="h-12 px-6 w-auto bg-gradient-to-r from-[#FFD400] to-[#FFA500] text-[#000000] transition-all duration-300 transform hover:scale-105 relative overflow-hidden group-hover:shadow-[0_0_20px_5px_rgba(255,212,0,0.3)] hover:from-[#FFE666] hover:to-[#FFB733] rounded-full"
                    onMouseEnter={() => setIsHoveringTry(true)}
                    onMouseLeave={() => setIsHoveringTry(false)}
                  >
                    <span className="relative z-10 transition-colors duration-300 text-base font-semibold">Try Free</span>
                    <Zap className={`ml-2 h-4 w-4 relative z-10 transition-all duration-300 ${isHoveringTry ? 'rotate-[360deg] scale-125 text-white' : 'text-black'}`} />
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </Button>
                </a>
                <span className="text-gray-400 text-xs mt-2 text-center w-full">No card required</span>
              </div>
              <a href="#epic-features" className="group w-auto">
                <Button 
                  variant="outline" 
                  className="h-12 px-6 w-auto bg-[#FFD400]/10 backdrop-blur-sm text-[#FFD400] border-[#FFD400]/20 hover:bg-[#FFD400]/20 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group-hover:shadow-[0_0_20px_5px_rgba(255,212,0,0.3)]"
                  onMouseEnter={() => setIsHoveringFeatures(true)}
                  onMouseLeave={() => setIsHoveringFeatures(false)}
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white text-base font-semibold">Features</span>
                  <ArrowDownRight className={`ml-2 h-4 w-4 transition-all duration-300 ${isHoveringFeatures ? 'rotate-[360deg] scale-125 text-white' : ''}`} />
                </Button>
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD400] via-[#FFF] to-[#FFD400] rounded-lg filter blur-[100px] opacity-35"></div>
            <div className="relative w-full overflow-hidden rounded-lg">
              <Image
                src="/assets/images/hero1-3.png"
                alt="Hero image"
                width={1200}
                height={800}
                className="relative z-10 w-full rounded-lg shadow-2xl transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#000000] to-transparent"></div>
    </section>
  );
};

export default Hero1;

