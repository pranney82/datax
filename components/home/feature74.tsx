import Image from 'next/image';
import { Button } from '../ui/button';

const Feature74 = () => {
  const features = [
    {
      title: "Dashboard",
      id: "dashboard",
      description: [
        "Pre Built",
        "Set Goals",
        "Know Your Numbers"
      ],
      image: "https://www.shadcnblocks.com/images/block/placeholder-1.svg"
    },
    {
      title: 'Toolbox',
      id: 'toolbox',
      description: [
        'Automations',
        'Custom Integrations',
        'AI Workflows and Tools',
      ],
      image: "https://www.shadcnblocks.com/images/block/placeholder-1.svg"
    },
    {
      title: 'Library',
      id: 'library',
      description: [
        'Cost Group Templates',
        'Schedule, Task, ToDo Templates',
        'API Scripts',
        'Article & Video Resources',
      ],
      image: "https://www.shadcnblocks.com/images/block/placeholder-1.svg"
    },
    {
      title: 'Development Roadmap',
      id: 'roadmap',
      description: [
        'Live Board',
        "Forecasting",
        "Benchmarking"
      ],
      image: "https://www.shadcnblocks.com/images/block/placeholder-1.svg"
    }
  ];

  return (
    <section className="py-8 w-full">
      <div id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {features.map((feature, index) => {
            const isEven = index % 2 === 1;
            
            const ContentSection = (
              <div
                id={feature.id}
                className="flex flex-col justify-center px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12"
              >
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                  {feature.title}
                </h2>
                <ul className="list-disc pl-4 space-y-2 text-muted-foreground lg:text-lg">
                  {feature.description.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <div className="flex justify-left mt-4">
                  <Button className="bg-primary text-primary-foreground w-full sm:w-auto">
                    Test Drive
                  </Button>
                </div>
              </div>
            );

            const ImageSection = (
              <div className="md:min-h-96 lg:min-h-[28rem] xl:min-h-[32rem]">
                <Image
                  src={feature.image}
                  alt={`Feature ${index + 1}`}
                  width={1200}
                  height={675}
                  className="aspect-[16/9] size-full object-cover object-center"
                />
              </div>
            );

            return (
              <div
                key={index}
                className={`flex ${
                  isEven ? 'flex-col-reverse' : 'flex-col'
                } text-clip rounded-xl border border-border md:col-span-2 md:grid md:grid-cols-2 md:gap-6 lg:gap-8`}
              >
                {isEven ? ContentSection : ImageSection}
                {isEven ? ImageSection : ContentSection}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Feature74;
