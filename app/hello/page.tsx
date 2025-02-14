import Landing from "@/components/home/landingpage";
import Footer from '@/components/home/footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      <Landing />
      <Footer />
    </div>
  );
}
