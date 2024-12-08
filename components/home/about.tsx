'use client';

import Image from 'next/image';

const About = () => {
  return (
    <section className="py-8 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              About Us
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              We&apos;re contractors passionate about helping other contractors
              through technology. DATAx is on a mission to make data simple.
              Through our partnership together we want to empower you as a
              business owner to spend more time on your business and less on
              spreadsheets.
            </p>
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

export default About;
