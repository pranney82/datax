import Footer from '@/components/home/footer';
import Navbar1 from '@/components/home/nav';
import Datax from "@/components/home/datax";
import CTA from '@/components/home/cta';
import Logos3 from '@/components/home/logos3';
import Pricing from '@/components/home/pricing';

export default function DATAxPage() {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      <Navbar1 />
      <Datax />
      <Pricing />
      <Logos3 />
      <CTA />
      <Footer />
    </div>
  );
}
