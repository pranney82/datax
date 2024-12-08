import Pricing from "@/components/home/pricing";
import Footer from '@/components/home/footer';
import Navbar1 from '@/components/home/nav';
import Pricing2 from "@/components/home/pricing2";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      <Navbar1 />
      <Pricing />
      <Pricing2 />
      <Footer />
    </div>
  );
}
