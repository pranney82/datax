'use client';

import { ArrowDownRight } from 'lucide-react';
import { useHomeContent } from '@/providers/HomeContentProvider';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Hero1 = () => {
  const content = useHomeContent();
  
  if (!content?.hero1) return null;

  const { hero1 } = content;

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Badge variant="outline">
              {hero1.badge || "New Features"}
              <ArrowDownRight className="ml-2 size-4" />
            </Badge>
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              {hero1.title}
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              {hero1.description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <a href={hero1.buttons?.primary.href || "#"}>
                <Button className="w-full sm:w-auto">
                  {hero1.buttons?.primary.text || "Get Started"}
                </Button>
              </a>
              <a href={hero1.buttons?.secondary.href || "#"}>
                <Button variant="outline" className="w-full sm:w-auto">
                  {hero1.buttons?.secondary.text || "Learn More"}
                  <ArrowDownRight className="ml-2 size-4" />
                </Button>
              </a>
            </div>
          </div>
          <img
            src={hero1?.image?.src}
            alt={hero1?.image?.alt}
            className="max-h-96 w-full rounded-md object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero1;
