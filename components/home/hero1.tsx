'use client';

import { ArrowDownRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const Hero1 = () => {
  return (
    <section className="py-8 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Badge variant="outline">
              New Release
              <ArrowDownRight className="ml-2 size-4" />
            </Badge>
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              It&apos;s Time to <br /> Win Your Data
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              JobTread companion app for serious contractors. Insights and
              automation for your JobTread data, no technical ability required.
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <a href="#">
                <Button className="bg-primary text-primary-foreground w-full sm:w-auto">
                  Try for Free
                </Button>
              </a>
              <a href="#features">
                <Button variant="outline" className="w-full sm:w-auto">
                  Features
                  <ArrowDownRight className="ml-2 size-4" />
                </Button>
              </a>
            </div>
          </div>
          <Image
            src="/assets/images/hero1.png"
            alt="placeholder hero"
            width={1200}
            height={800}
            className="max-h-auto w-full rounded-md object-cover border-4 border-gray-200"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero1;
