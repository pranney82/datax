import { Button } from '@/components/ui/button';
import content from '@/components/home/cta.json';
import Link from 'next/link';

const CTA11 = () => {
  const { cta } = content;

  return (
    <section className="py-8 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center rounded-lg bg-accent p-8 text-center md:rounded-xl lg:p-16">
          <h3 className="mb-3 max-w-3xl text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
            {cta.title}
          </h3>
          <p className="mb-8 max-w-3xl text-muted-foreground lg:text-lg">
            {cta.description}
          </p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            <Link href={cta.buttons.secondary.href}>
              <Button variant="outline" className="w-full sm:w-auto">
                {cta.buttons.secondary.text}
              </Button>
            </Link>
            <Link href={cta.buttons.primary.href}>
              <Button className="w-full sm:w-auto">
                {cta.buttons.primary.text}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA11;
