import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import content from './hero7.json';

const Hero7 = () => {
  const { hero7 } = content;

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-6">
          <h1 className="text-3xl font-extrabold lg:text-6xl text-center">
            {hero7.title}
          </h1>
          <p className="text-balance text-muted-foreground lg:text-lg text-center">
            {hero7.description}
          </p>
        </div>
        <div className="py-8 flex flex-col items-center justify-center gap-2 w-full">
          <div className='grid grid-cols-1 gap-4 w-full md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>{hero7.beforeAfter.before.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {hero7.beforeAfter.before.points.map((point, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✕</span>
                    <p>{point}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className='bg-yellow-50'>
              <CardHeader>
                <CardTitle>{hero7.beforeAfter.after.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {hero7.beforeAfter.after.points.map((point, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✔</span>
                    <p>{point}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero7;
