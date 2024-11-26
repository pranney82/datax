import CTA11 from "@/components/home/cta";
import Faq1 from "@/components/home/faq";
import Feature74 from "@/components/home/feature74";
import Footer from "@/components/home/footer";
import Hero1 from "@/components/home/hero1";
import Hero7 from "@/components/home/hero7";
import Hero8 from "@/components/home/hero8";
import Logos3 from "@/components/home/logos3";
import Navbar1 from "@/components/home/nav";
import { HomeContentProvider } from '@/providers/HomeContentProvider';

export default function Home() {
  return (
    <HomeContentProvider>
      <Navbar1 />
      <Hero1 />
      <Logos3 />
      <Hero7 />
      <Hero8 />
      <Feature74 />
      <Faq1 />
      <CTA11 />
      <Footer />
    </HomeContentProvider>
  );
}
