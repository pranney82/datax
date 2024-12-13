'use client';

import { ArrowDownRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const Hero1 = () => {
  return (
    <section className="py-8 w-full bg-zinc-950 text-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Badge variant="outline" className="text-slate-50">
              New Release
              <ArrowDownRight className="ml-2 size-4" />
            </Badge>
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              Win Your DATA
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              Insights and automation for serious contractors. 
              <br /><br />
              ... no technical ability required.
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <a href="#">
                <Button className="bg-primary w-full sm:w-auto">
                  Try for Free
                </Button>
              </a>
              <a href="#features">
                <Button variant="outline" className="bg-white w-full sm:w-auto text-black">
                  Features
                  <ArrowDownRight className="ml-2 size-4" />
                </Button>
              </a>
            </div>
          </div>
          <Image
            src="/assets/images/hero1-3.png"
            alt="placeholder hero"
            width={1200}
            height={800}
            className="max-h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero1;
