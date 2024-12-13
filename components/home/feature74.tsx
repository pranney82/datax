import Image from 'next/image';
import { Button } from '../ui/button';

const Feature74 = () => {
  const features = [
    {
      title: "Dashboard",
      subtitle: "VISUALIZE YOUR JOBTREAD DATA",
      id: "dashboard",
      description: "Track your leads, sales, and job performance in one place",
      list: [
        "Pre-built metrics, visuals",
        "Set Goals",
        "Know Your Numbers"
      ],
      image: "/assets/images/feature1.png",
      icon: "/assets/images/icon1.png"
    },
    {
      title: 'Toolbox',
      subtitle: "CUSTOM SOLUTIONS FOR YOUR BUSINESS",
      id: 'toolbox',
      description: "Supercharge your JobTread with custom built automations and integrations",
      list: [
        'Automations',
        'Custom Integrations',
        'AI Workflows and Tools',
      ],
      image: "/assets/images/feature2.png",
      icon: "/assets/images/icon2.png"
    },
    {
      title: 'Library',
      subtitle: "MAXIMIZE YOUR JOBTREAD EXPERIENCE",
      id: 'library',
      description: "Your centralized hub for templates, API Scripts, Articles & Video Resources",
      list: [
        'JobTread Templates',
        'API Scripts',
        'Article & Video Resources',
      ],
      image: "/assets/images/feature3.png",
      icon: "/assets/images/icon3.png"
    }
  ];

  return (
    <section className="py-8 w-full">
      <div id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-0 md:grid-cols-6 lg:gap-0">
          {features.map((feature, index) => {
            
            const ContentSection = (
              <div
                id={feature.id}
                className="flex flex-col grid-cols-3 justify-center px-6 py-8 md:px-8 md:py-12 lg:px-16 lg:py-16"
              >
                <h4 className="text-muted-foreground text-sm">{feature.subtitle}</h4>
                <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                  {feature.title}
                </h1>
                <p className="text-muted-foreground lg:text-lg col-span-2 max-w-[66%]">
                  {feature.description}
                </p>
                <ul className="list-disc pl-4 space-y-2 text-muted-foreground lg:text-lg mt-4">
                  {feature.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                
                <div className="flex justify-left items-center gap-4 mt-4">
                <Image
                  src={feature.icon}
                    alt={`Feature ${index + 1}`}
                    width={150}
                    height={150}
                    className="relative w-20 h-20"
                  />
                  <Button className="bg-primary text-primary-foreground w-full sm:w-auto">
                    Test Drive
                  </Button>
                </div>
              </div>
            );

            const ImageSection = (
              <div className="relative md:col-span-3 grid grid-cols-3">
                
                <div className="col-span-3 md:bg-zinc-950 relative h-full">
                  <Image
                    src={feature.image}
                    alt={`Feature ${index + 1}`}
                    width={1200}
                    height={675}
                    className="relative z-10 transform md:translate-y-8 md:-translate-x-[15%] w-full h-full object-cover object-center"
                  />
                </div>
                
              </div>
            );

            return (
              <div
                key={index}
                className={`flex ${
                  'flex-col'
                } text-clip md:col-span-6 md:grid md:grid-cols-6 md:gap-0 lg:gap-0`}
              >
                <div className="md:col-span-3">
                  {ContentSection}
                </div>
                <div className="md:col-span-3">
                  {ImageSection}
                </div>
              </div>
            );
          })}
          {/* Roadmap */}
          <div className="md:col-span-6 flex flex-col justify-center items-center px-6 py-8 md:px-8 md:py-12 lg:px-16 lg:py-16 bg-accent">
                <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center">
                  Roadmap
                </h1>
                <p className="text-muted-foreground lg:text-lg col-span-2 max-w-[66%] text-center">
                  Our mission is to build user-driven<br />integrations and automations in partnership<br/>with JobTread.
                </p>
                <Image
                  src="/assets/images/icon4.png"
                  alt="Roadmap"
                  width={250}
                  height={250}
                  className="relative w-25 h-25"
                />
                  <Button className="bg-primary text-primary-foreground w-full sm:w-auto">
                    View Roadmap
                  </Button>
              </div>
        </div>
      </div>
    </section>
  );
};

export default Feature74;
