import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CTA11 = () => {
  return (
    <section className="py-8 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center rounded-lg bg-accent p-8 text-center md:rounded-xl lg:p-16">
          <h3 className="mb-3 max-w-3xl text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
            Ready to Win Your Data?
          </h3>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            <Link href="#">
              <Button className="bg-primary text-primary-foreground w-full sm:w-auto">
                Try For Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA11;
