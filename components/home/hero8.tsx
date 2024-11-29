import React from 'react';
import content from './hero8.json';

const Hero8 = () => {
  const { hero8 } = content;
  
  return (
    <section className="py-8 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-6">
          <h1 className="text-3xl font-extrabold lg:text-6xl text-center">
            {hero8.title}
          </h1>
          <p className="text-balance text-muted-foreground lg:text-lg text-center">
            {hero8.description}
          </p>
        </div>
        <div className="py-8 flex flex-col items-center justify-center gap-2 w-full">
            <div className='grid grid-cols-1 gap-4 w-full'>
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square" />
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero8;
