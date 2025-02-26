import Footer from '@/components/home/footer';
import Navbar1 from '@/components/home/nav';
import LandingPage from '@/components/home/landingpage';

export default function HelloPage() {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      <Navbar1 />
      <LandingPage />
      <Footer />
    </div>
  );
}
