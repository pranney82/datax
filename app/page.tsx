import CTA11 from "@/components/home/cta";
import Faq1 from "@/components/home/faq";
import Feature74 from "@/components/home/feature74";
import Footer from "@/components/home/footer";
import Hero1 from "@/components/home/hero1";
import Hero7 from "@/components/home/hero7";
import Hero8 from "@/components/home/hero8";
import Logos3 from "@/components/home/logos3";
import Navbar from "@/components/home/nav";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="w-full">
        <Navbar />
        <Hero1 />
        <Logos3 />  
        <Hero7 />
        <Hero8 />
        <Feature74 />
        <Faq1 />
        <CTA11 />
        <Footer />
      </div>
    </main>
  );
}
