import Footer from '@/components/home/footer';
import Navbar1 from '@/components/home/nav';
import CTO from "@/components/home/cto";
import CTA from '@/components/home/cta';
import Logos3 from '@/components/home/logos3';

export default function CTOPage() {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      <Navbar1 />
      <CTO />
      <Logos3 />
      <CTA />
      <Footer />
    </div>
  );
}
