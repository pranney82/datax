import CTA11 from "@/components/home/cta";
import Roadmap from "@/components/home/roadmap";
import Footer from '@/components/home/footer';
import Navbar1 from '@/components/home/nav';

export default function RoadmapPage() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden">
      <Navbar1 />
      <Roadmap />
      <CTA11 />
      <Footer />
    </div>
  );
}
