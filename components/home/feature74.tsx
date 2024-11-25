import content from '@/components/home/feature74.json';

const Feature74 = () => {
  const { feature74 } = content;

  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {feature74.features.map((feature, index) => {
            const isEven = index % 2 === 1;
            
            const ContentSection = (
              <div className="flex flex-col justify-center px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
                <h3 className="mb-3 text-lg font-semibold md:mb-4 md:text-2xl lg:mb-6">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground lg:text-lg">
                  {feature.description}
                </p>
              </div>
            );

            const ImageSection = (
              <div className="md:min-h-96 lg:min-h-[28rem] xl:min-h-[32rem]">
                <img
                  src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
                  alt={`Feature ${index + 1}`}
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
