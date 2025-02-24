import Footer from '@/components/home/footer';
import Navbar1 from '@/components/home/nav';
import CTA from '@/components/home/cta';
import Video from '@/components/home/video-gallery';
import Solutions from '@/components/home/feature74';

export default function HelloPage() {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      <Navbar1 />
      <Video />
      <Solutions />
      <CTA />
      <Footer />
    </div>
  );
}
