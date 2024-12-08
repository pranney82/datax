import About from "@/components/home/about";
import Footer from '@/components/home/footer';
import Navbar1 from '@/components/home/nav';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      <Navbar1 />
      <About />
      <Footer />
    </div>
  );
}
